# AWS Bedrock Integration Guide

## Overview

This document provides step-by-step instructions for transitioning from the mock `StrandsClient` to the production AWS Bedrock integration using Amazon Nova models.

---

## Prerequisites

1. **AWS Account** with Bedrock access enabled
2. **Model Access Granted** for:
   - `us.amazon.nova-lite-v1:0` (Orchestrator)
   - `us.amazon.nova-2-sonic-v1:0` (Conversationalist)  
   - `us.amazon.nova-2-act-v1:0` (Instigator)
3. **IAM Role** with `bedrock:InvokeModel` permissions
4. **AWS CLI** configured with credentials

---

## Step 1: Request Model Access

Navigate to the [AWS Bedrock Console](https://console.aws.amazon.com/bedrock) and request access to the Nova models:

```bash
# Check current model access
aws bedrock list-foundation-models --region us-east-1 \
  --query 'modelSummaries[?contains(modelId, `nova`)]'
```

> **Note**: Model access approval can take 1-3 business days depending on your account tier.

---

## Step 2: Install AWS Bedrock SDK

Replace the mock implementation:

```bash
# Install official AWS SDK for Python
pip install boto3 aws-strands-sdk

# Update requirements.txt
echo "boto3>=1.28.0" >> requirements.txt
echo "aws-strands-sdk>=0.1.0" >> requirements.txt
```

---

## Step 3: Update `strands_sdk.py`

Replace the mock client with the real AWS Bedrock client:

```python
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
import json
import time
from typing import Dict, Any, Optional

class StrandsClient:
    """
    Production AWS Bedrock client for EduMentor AI.
    Handles Nova model invocations with proper error handling and retries.
    """
    
    def __init__(self, project_root: str, region: str = "us-east-1"):
        """
        Initialize Bedrock client.
        
        Args:
            project_root: Path to project root (for config files)
            region: AWS region (default: us-east-1)
        """
        self.project_root = project_root
        self.region = region
        
        # Configure client with retries and timeout
        config = Config(
            region_name=region,
            retries={'max_attempts': 3, 'mode': 'adaptive'},
            read_timeout=30,
            connect_timeout=10
        )
        
        self.bedrock_runtime = boto3.client(
            'bedrock-runtime',
            config=config
        )
        
        self.agents: Dict[str, Any] = {}
        
    def register_agent(
        self, 
        name: str, 
        model_id: str, 
        prompt_file: Optional[str] = None,
        prompt_content: Optional[str] = None,
        role: str = "general"
    ):
        """
        Register an agent with system prompt.
        
        Args:
            name: Agent identifier (e.g., "orchestrator")
            model_id: Bedrock model ID (e.g., "us.amazon.nova-lite-v1:0")
            prompt_file: Path to prompt file (optional)
            prompt_content: Direct prompt string (optional)
            role: Agent role for routing logic
        """
        system_prompt = ""
        
        if prompt_content:
            system_prompt = prompt_content
        elif prompt_file:
            with open(prompt_file, 'r') as f:
                system_prompt = f.read()
        else:
            raise ValueError("Either prompt_file or prompt_content required")
        
        self.agents[name] = {
            "model": model_id,
            "prompt": system_prompt,
            "role": role,
            "history": []
        }
        
        print(f"[StrandsSDK] Registered {name} with model {model_id}")
    
    def invoke_agent(
        self, 
        agent_name: str, 
        input_text: str, 
        context: Optional[Dict[str, Any]] = None,
        max_tokens: int = 512,
        temperature: float = 0.7
    ) -> str:
        """
        Invoke an agent using AWS Bedrock.
        
        Args:
            agent_name: Registered agent name
            input_text: User input text
            context: Additional context (struggle score, history, etc.)
            max_tokens: Maximum response tokens
            temperature: Model temperature (0.0-1.0)
            
        Returns:
            Model response text
            
        Raises:
            TimeoutError: If Bedrock times out
            ValueError: If agent not found
            ClientError: For AWS API errors
        """
        if agent_name not in self.agents:
            raise ValueError(f"Agent {agent_name} not registered")
        
        agent = self.agents[agent_name]
        model_id = agent["model"]
        system_prompt = agent["prompt"]
        
        # Construct Bedrock request
        messages = [
            {
                "role": "user",
                "content": input_text
            }
        ]
        
        # Add context if provided
        if context:
            context_str = f"\n\nContext: {json.dumps(context)}"
            messages[0]["content"] += context_str
        
        request_body = {
            "messages": messages,
            "system": system_prompt,
            "inferenceConfig": {
                "maxTokens": max_tokens,
                "temperature": temperature,
                "topP": 0.9
            }
        }
        
        try:
            print(f"[Bedrock] Invoking {model_id} for agent {agent_name}")
            
            start_time = time.time()
            
            response = self.bedrock_runtime.invoke_model(
                modelId=model_id,
                body=json.dumps(request_body),
                contentType="application/json",
                accept="application/json"
            )
            
            latency = time.time() - start_time
            print(f"[Bedrock] Response received in {latency:.2f}s")
            
            # Parse response
            response_body = json.loads(response['body'].read())
            output_text = response_body.get('content', [{}])[0].get('text', '')
            
            # Store in history
            agent["history"].append({
                "input": input_text,
                "output": output_text,
                "timestamp": time.time()
            })
            
            return output_text
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            
            if error_code == 'ThrottlingException':
                print(f"[Bedrock] Rate limit hit, retrying...")
                time.sleep(2)
                return self.invoke_agent(agent_name, input_text, context, max_tokens, temperature)
            
            elif error_code == 'ModelTimeoutException':
                print(f"[Bedrock] Model timeout for {agent_name}")
                raise TimeoutError(f"Bedrock timeout for model {model_id}")
            
            elif error_code == 'ValidationException':
                print(f"[Bedrock] Invalid request: {e}")
                raise ValueError(f"Invalid request to {model_id}: {e}")
            
            else:
                print(f"[Bedrock] Unexpected error: {e}")
                raise
        
        except Exception as e:
            print(f"[Bedrock] Error invoking {agent_name}: {e}")
            raise
```

---

## Step 4: Environment Configuration

Create `.env` file in project root:

```bash
# .env
AWS_REGION=us-east-1
AWS_PROFILE=default  # or your named profile

# Optional: Explicit credentials (use AWS Secrets Manager in prod)
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret

# Model Configuration
ORCHESTRATOR_MODEL=us.amazon.nova-lite-v1:0
SONIC_MODEL=us.amazon.nova-2-sonic-v1:0
INSTIGATOR_MODEL=us.amazon.nova-2-act-v1:0

# Performance Tuning
BEDROCK_MAX_TOKENS=512
BEDROCK_TEMPERATURE=0.7
BEDROCK_TIMEOUT_SECONDS=30
```

Load in `models.py`:

```python
import os
from dotenv import load_dotenv

load_dotenv()

class NovaModels(Enum):
    ORCHESTRATOR = os.getenv("ORCHESTRATOR_MODEL", "us.amazon.nova-lite-v1:0")
    CONVERSATIONALIST = os.getenv("SONIC_MODEL", "us.amazon.nova-2-sonic-v1:0")
    INSTIGATOR = os.getenv("INSTIGATOR_MODEL", "us.amazon.nova-2-act-v1:0")
```

---

## Step 5: Testing the Integration

Create a test script:

```python
# test_bedrock_integration.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.app.core.models import ModelRegistry
from backend.app.core.strands_sdk import StrandsClient

def test_agent_invocation():
    """Test each Nova model with a simple prompt."""
    
    project_root = os.path.dirname(os.path.abspath(__file__))
    client = StrandsClient(project_root)
    
    # Register Orchestrator
    client.register_agent(
        name="orchestrator_test",
        model_id="us.amazon.nova-lite-v1:0",
        prompt_content="You are a routing agent. Respond with 'sonic' or 'instigator'.",
        role="router"
    )
    
    # Test invocation
    response = client.invoke_agent(
        "orchestrator_test",
        "Hello, I need help with math"
    )
    
    print(f"Orchestrator Response: {response}")
    assert response in ["sonic", "instigator"], "Invalid routing response"
    
    print("✅ Bedrock integration test passed!")

if __name__ == "__main__":
    test_agent_invocation()
```

Run the test:

```bash
python test_bedrock_integration.py
```

---

## Step 6: Error Handling Best Practices

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `AccessDeniedException` | IAM permissions missing | Add `bedrock:InvokeModel` to IAM role |
| `ThrottlingException` | Rate limit exceeded | Implement exponential backoff (already in code) |
| `ModelTimeoutException` | Model took too long | Increase timeout or reduce prompt complexity |
| `ValidationException` | Malformed request | Check prompt format and token limits |
| `ResourceNotFoundException` | Model not available in region | Verify region and model access |

### Retry Logic Example

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def invoke_with_retry(client, agent_name, input_text):
    return client.invoke_agent(agent_name, input_text)
```

---

## Step 7: Monitoring and Logging

### CloudWatch Integration

```python
import logging
from watchtower import CloudWatchLogHandler

# Configure CloudWatch logging
logger = logging.getLogger('edumentor')
logger.addHandler(CloudWatchLogHandler(log_group='/edumentor/bedrock'))

# Log all invocations
logger.info(f"Invoked {agent_name} with context {context}")
```

### Cost Tracking

Track token usage per session:

```python
def log_token_usage(model_id, input_tokens, output_tokens):
    """Log token usage for cost analysis."""
    
    # Nova pricing (example, verify current rates)
    rates = {
        "us.amazon.nova-lite-v1:0": {"input": 0.0002, "output": 0.0006},
        "us.amazon.nova-2-sonic-v1:0": {"input": 0.0005, "output": 0.0015},
        "us.amazon.nova-2-act-v1:0": {"input": 0.0008, "output": 0.0024}
    }
    
    rate = rates.get(model_id, {"input": 0, "output": 0})
    cost = (input_tokens * rate["input"] + output_tokens * rate["output"]) / 1000
    
    print(f"[Cost] {model_id}: ${cost:.4f}")
    return cost
```

---

## Step 8: Production Deployment Checklist

- [ ] AWS credentials secured (use AWS Secrets Manager)
- [ ] IAM policies follow least-privilege principle
- [ ] Error handling implemented for all Bedrock exceptions
- [ ] Retry logic with exponential backoff in place
- [ ] CloudWatch logging configured
- [ ] Token usage tracking enabled
- [ ] Load testing completed (50+ concurrent users)
- [ ] Billing alerts configured ($50, $100, $200 thresholds)
- [ ] Fallback responses defined for model failures
- [ ] Regional failover strategy documented

---

## Troubleshooting

### Model Not Responding

```bash
# Check model availability
aws bedrock get-foundation-model --model-identifier us.amazon.nova-lite-v1:0

# Test direct invocation
aws bedrock-runtime invoke-model \
  --model-id us.amazon.nova-lite-v1:0 \
  --body '{"messages":[{"role":"user","content":"Hello"}],"inferenceConfig":{"maxTokens":100}}' \
  --cli-binary-format raw-in-base64-out \
  response.json
```

### High Latency

- Check AWS region (use closest to Nairobi: `eu-west-1` or `me-south-1`)
- Reduce `max_tokens` (512 → 256)
- Optimize prompt length (remove unnecessary context)
- Use caching for repeated queries

---

## Next Steps

1. Review the [30-Day Roadmap](./30_DAY_ROADMAP.md) for integration timeline
2. Set up AWS account (Week 1, Days 1-2)
3. Replace mock SDK with production code (Week 1, Days 3-4)
4. Run integration tests (Week 1, Day 7)

---

**Last Updated**: 2026-02-10  
**Maintained By**: EduMentor AI Team
