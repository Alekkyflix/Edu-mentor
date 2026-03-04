#!/usr/bin/env python3
"""
Quick sanity check — tests that Bedrock connectivity and all three Nova models work.
Run from the project root:
    python3 scripts/test_bedrock.py
"""
import os
import sys

# Load .env
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

import boto3
from botocore.exceptions import ClientError

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

MODELS = {
    "Nova Lite  (Orchestrator)":   "us.amazon.nova-lite-v1:0",
    "Nova Pro   (Conversationalist)": "us.amazon.nova-pro-v1:0",
    "Nova Micro (Instigator)":     "us.amazon.nova-micro-v1:0",
}

TEST_MESSAGE = "What is 1/2 + 1/3? Give a very brief answer."

def test_model(client, name: str, model_id: str):
    print(f"\n── Testing {name} ({model_id}) ──")
    try:
        response = client.converse(
            modelId=model_id,
            messages=[{"role": "user", "content": [{"text": TEST_MESSAGE}]}],
            inferenceConfig={"maxTokens": 200, "temperature": 0.5},
        )
        text = response["output"]["message"]["content"][0]["text"]
        usage = response.get("usage", {})
        print(f"   ✅ Response: {text[:120]}...")
        print(f"   Tokens → in: {usage.get('inputTokens')}, out: {usage.get('outputTokens')}")
        return True
    except ClientError as e:
        code = e.response["Error"]["Code"]
        msg  = e.response["Error"]["Message"]
        print(f"   ❌ ClientError ({code}): {msg}")
        if code == "AccessDeniedException":
            print(f"   → Enable model access at: https://us-east-1.console.aws.amazon.com/bedrock/home#/modelaccess")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False

def main():
    print("=" * 55)
    print("  EduMentor AI — Bedrock Connectivity Test")
    print("=" * 55)
    print(f"  Region: {AWS_REGION}")
    print(f"  Access Key: {os.getenv('AWS_ACCESS_KEY_ID', 'NOT SET')[:8]}****")
    print("=" * 55)

    try:
        client = boto3.client("bedrock-runtime", region_name=AWS_REGION)
        print("\n✅ Bedrock Runtime client created")
    except Exception as e:
        print(f"\n❌ Failed to create Bedrock client: {e}")
        sys.exit(1)

    results = {}
    for name, model_id in MODELS.items():
        results[name] = test_model(client, name, model_id)

    print("\n" + "=" * 55)
    print("  Summary")
    print("=" * 55)
    all_ok = True
    for name, ok in results.items():
        status = "✅" if ok else "❌"
        print(f"  {status} {name}")
        if not ok:
            all_ok = False

    if all_ok:
        print("\n🎉 All models working! Backend is ready to start.")
    else:
        print("\n⚠️  Some models failed. Check model access in the AWS Console.")
        print("   URL: https://us-east-1.console.aws.amazon.com/bedrock/home#/modelaccess")
    print("=" * 55)

if __name__ == "__main__":
    main()
