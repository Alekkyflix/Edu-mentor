import boto3
from typing import Dict, Any, Optional
import json
import os
from botocore.exceptions import ClientError

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
        try:
            self.client = boto3.client(
                service_name='bedrock-runtime',
                region_name=os.getenv('AWS_REGION', 'us-east-1')
            )
            print("[StrandsSDK] Successfully initialized Bedrock Runtime client.")
        except Exception as e:
            print(f"[StrandsSDK] FAILED to initialize Bedrock client: {e}")
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

    def invoke_agent(self, agent_name: str, input_text: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Invokes an agent using Bedrock's `converse` API.
        """
        if agent_name not in self.agents:
            raise ValueError(f"Agent {agent_name} not found.")
            
        agent = self.agents[agent_name]
        
        # Prepare Message
        messages = [{
            "role": "user",
            "content": [{"text": input_text}]
        }]

        try:
            response = self.client.converse(
                modelId=agent["modelId"],
                messages=messages,
                system=agent["system"],
                inferenceConfig=agent["inferenceConfig"]
            )
            
            # Extract Text Content
            output_message = response['output']['message']
            content_text = output_message['content'][0]['text']
            
            # Telemetry (Token Usage)
            usage = response.get('usage', {})
            print(f"[{agent_name}] Usage: {usage}")
            
            return content_text

        except ClientError as e:
            print(f"[StrandsSDK] AWS Error invoking {agent_name}: {e}")
            raise
        except Exception as e:
            print(f"[StrandsSDK] Unexpected error: {e}")
            raise
