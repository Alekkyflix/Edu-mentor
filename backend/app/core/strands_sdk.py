import boto3
from typing import Dict, Any, Optional, List
import json
import os
import base64
from botocore.exceptions import ClientError, BotoCoreError
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

class StrandsClient:
    """
    Production implementation of AWS Strands SDK connecting to Amazon Bedrock.
    Targeting Nova models (Lite, Micro, Pro) via the Converse API.
    """
    def __init__(self, project_root: str):
        self.project_root = project_root
        self.agents: Dict[str, Any] = {}
        
        # Initialize Bedrock Runtime Client
        # AWS Credentials should be loaded from Environment Variables (Standard Boto3 behavior)
        # Fast-fail if AWS credentials are fundamentally missing
        if not os.getenv('AWS_ACCESS_KEY_ID'):
            print("\n[StrandsSDK] ❌ CRITICAL: AWS_ACCESS_KEY_ID is missing from environment variables.")
            print("[StrandsSDK] The application will likely fail to connect to Bedrock unless using an IAM profile.\n")

        try:
            self.client = boto3.client(
                service_name='bedrock-runtime',
                region_name=os.getenv('AWS_REGION', 'us-east-1')
            )
            print("[StrandsSDK] ✅ Successfully initialized Bedrock Runtime client.")
        except Exception as e:
            print(f"[StrandsSDK] ❌ FAILED to initialize Bedrock client: {e}")
            raise

    def register_agent(self, name: str, model_id: str, prompt_file: Optional[str] = None, prompt_content: Optional[str] = None, role: str = "general"):
        """
        Registers an agent config.
        """
        system_prompt = ""
        if prompt_content:
            system_prompt = prompt_content
        elif prompt_file:
            try:
                with open(prompt_file, 'r') as f:
                    system_prompt = f.read()
            except FileNotFoundError:
                print(f"[StrandsSDK] Warning: Prompt file {prompt_file} not found.")
        
        self.agents[name] = {
            "modelId": model_id,
            "system": [{"text": system_prompt}] if system_prompt else [],
            "role": role,
            "inferenceConfig": {
                "temperature": 0.7,
                "topP": 0.9,
                "maxTokens": 1000
            }
        }
        print(f"[StrandsSDK] Registered Agent: {name} ({model_id})")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((ClientError, BotoCoreError, TimeoutError)),
        reraise=True
    )
    def invoke_agent(self, agent_name: str, input_text: str, context: Optional[Dict[str, Any]] = None, history: Optional[List[Dict[str, str]]] = None, image_base64: Optional[str] = None) -> str:
        """
        Invokes an agent using Bedrock's `converse` API.
        Includes exponential backoff (retries up to 3 times) for network resilience.
        """
        if agent_name not in self.agents:
            raise ValueError(f"Agent '{agent_name}' not registered. Available: {list(self.agents.keys())}")

        agent = self.agents[agent_name]

        # Optionally enrich the message with state context
        enriched_input = input_text
        if context:
            ctx_note = (
                f"[Student context — struggle_score: {context.get('struggle', 0)}, "
                f"frustration: {context.get('frustration', 0.0):.2f}, "
                f"topic: {context.get('topic', 'general')}]\n\n"
            )
            enriched_input = ctx_note + input_text

        # Build message history
        messages = []
        if history:
            for turn in history:
                messages.append({
                    "role": turn["role"],
                    "content": [{"text": turn["content"]}]
                })
        
        # Add the current message
        user_content: List[Dict[str, Any]] = [{"text": enriched_input}]
        
        if image_base64:
            try:
                # Expecting data string like "data:image/jpeg;base64,...""
                if image_base64.startswith('data:image'):
                    header, b64_data = image_base64.split(',', 1)
                    image_format = header.split(';')[0].split('/')[1]
                    if image_format == 'jpg': 
                        image_format = 'jpeg'
                        
                    image_bytes = base64.b64decode(b64_data)
                    user_content.append({
                        "image": {
                            "format": image_format,
                            "source": {"bytes": image_bytes}
                        }
                    })
                else:
                    # Fallback if raw base64 without data URI
                    image_bytes = base64.b64decode(image_base64)
                    user_content.append({
                        "image": {
                            "format": "jpeg",
                            "source": {"bytes": image_bytes}
                        }
                    })
            except Exception as e:
                print(f"[StrandsSDK] Failed to parse image base64: {e}")

        messages.append({
            "role": "user",
            "content": user_content,
        })

        # Build API call kwargs — only include `system` if non-empty
        converse_kwargs: Dict[str, Any] = {
            "modelId": agent["modelId"],
            "messages": messages,
            "inferenceConfig": agent["inferenceConfig"],
        }
        if agent.get("system"):  # Only pass system if list is non-empty
            converse_kwargs["system"] = agent["system"]

        try:
            response = self.client.converse(**converse_kwargs)

            # Extract text content
            output_message = response["output"]["message"]
            content_text = output_message["content"][0]["text"]

            # Log token usage
            usage = response.get("usage", {})
            print(f"[{agent_name}] Tokens → input: {usage.get('inputTokens', '?')}, output: {usage.get('outputTokens', '?')}")

            return content_text

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_msg  = e.response["Error"]["Message"]
            print(f"[StrandsSDK] AWS ClientError ({error_code}) invoking {agent_name}: {error_msg}")
            raise
        except Exception as e:
            print(f"[StrandsSDK] Unexpected error invoking {agent_name}: {e}")
            raise
