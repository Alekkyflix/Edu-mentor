# EduMentor AI: 30-Day Technical Roadmap

**Mission**: Deploy a production-ready hierarchical multi-agent tutoring system powered by Amazon Nova models on AWS Bedrock.

**Team Focus**: AWS Strands SDK Integration, Productive Struggle Pedagogy, Nairobi Cultural Context

---

## Overview

This roadmap outlines a 4-week sprint to transition from the current boilerplate to a fully operational EduMentor AI system. Each week builds upon the previous, culminating in a culturally-grounded, pedagogically-sound AI tutor ready for student testing.

---

## Week 1: AWS Environment & Strands SDK Foundation
**Sprint Goal**: Establish production AWS infrastructure and replace mock SDK with real Bedrock integration.

### Days 1-2: AWS Account & Bedrock Setup
- [ ] **AWS Account Configuration**
  - Create/configure AWS account with Bedrock access
  - Request model access for:
    - `us.amazon.nova-lite-v1:0` (Orchestrator)
    - `us.amazon.nova-2-sonic-v1:0` (Conversationalist)
    - `us.amazon.nova-2-act-v1:0` (Instigator)
  - Set up IAM roles with least-privilege policies for Bedrock access
  - Configure AWS credentials locally (`~/.aws/credentials`)

- [ ] **Cost Management**
  - Set up billing alerts (e.g., $50, $100 thresholds)
  - Estimate token costs for development phase (~1000 test interactions)
  - Document model pricing: Nova Lite vs Sonic vs Act

### Days 3-4: Real AWS Strands SDK Integration
- [ ] **Replace Mock SDK**
  - Install official `aws-strands-sdk` package
  - Update [`strands_sdk.py`](file:///home/flix/Desktop/Edumentor%20AI/backend/app/core/strands_sdk.py) to use actual Bedrock client
  - Implement proper error handling for:
    - `ThrottlingException` (rate limits)
    - `ModelTimeoutException` (inference delays)
    - `ValidationException` (malformed prompts)
  - Add retry logic with exponential backoff

- [ ] **Testing Real Model Calls**
  - Create test script for each agent (Orchestrator, Sonic, Instigator)
  - Verify model IDs are correct and accessible
  - Log sample responses to validate prompt engineering

### Days 5-7: Infrastructure Hardening
- [ ] **Environment Configuration**
  - Create `.env` file structure for API keys and configs
  - Set up separate dev/staging/prod environments
  - Use AWS Secrets Manager for production credentials

- [ ] **Logging & Monitoring**
  - Integrate AWS CloudWatch for Bedrock API logs
  - Add structured logging (JSON format) for debugging
  - Create dashboard for tracking:
    - API call latency
    - Token usage per session
    - Error rates by agent

- [ ] **Local Testing**
  - Run end-to-end test: User input → Orchestrator → Sonic/Instigator → Response
  - Validate telemetry data in `/chat` endpoint response
  - Document any model-specific quirks (e.g., Sonic voice parameters)

---

## Week 2: Agent Integration & Micro-Sabotage Scripting
**Sprint Goal**: Wire up the Orchestrator ↔ Sonic ↔ Instigator handoff logic and implement cognitive friction techniques.

### Days 8-9: Orchestrator Routing Logic
- [ ] **Enhanced Decision Logic**
  - Refine struggle score thresholds in [`orchestrator.py`](file:///home/flix/Desktop/Edumentor%20AI/backend/app/agents/orchestrator.py)
  - Test routing with 20+ sample student inputs (greeting, questions, validation requests)
  - Add A/B testing framework: Track which agent is invoked per interaction

- [ ] **Context Enrichment**
  - Pass full conversation history to sub-agents
  - Include student metadata (grade level, topic, session duration)
  - Implement session memory (last 5 interactions)

### Days 10-12: Instigator Micro-Sabotage Refinement
- [ ] **Productive Struggle Techniques**
  - Test all micro-sabotage methods in [`instigator.py`](file:///home/flix/Desktop/Edumentor%20AI/backend/app/agents/instigator.py):
    - Constraint introduction ("Now solve without a calculator")
    - Scale change ("What if this was 1000 times larger?")
    - Reverse engineering ("Start from the answer")
    - Edge case challenges
  - Create topic-specific sabotage scripts (e.g., Math vs. Science)

- [ ] **Rule of Three Validation**
  - Test that Instigator asks ≥3 questions before hints
  - Add override mechanism for frustrated students (frustration > 0.8)
  - Log question sequences for pedagogy analysis

### Days 13-14: Sonic Conversationalist Polish
- [ ] **Voice-First Optimization**
  - Reduce response length to <2 sentences (avg. 15-20 words)
  - Test with text-to-speech simulation (AWS Polly with Kenyan accent if available)
  - Ensure responses read naturally when spoken aloud

- [ ] **Cultural Context Injection**
  - Expand Nairobi examples in [`logic.yaml`](file:///home/flix/Desktop/Edumentor%20AI/backend/configs/logic.yaml)
  - Add seasonal references (e.g., "Like waiting for the long rains")
  - Test with Kenyan beta testers for authenticity

---

## Week 3: Struggle Logic Connectivity & State Management
**Sprint Goal**: Perfect the feedback loop between Orchestrator and Instigator based on real-time struggle assessment.

### Days 15-17: Dynamic Struggle Score Algorithm
- [ ] **State Manager Enhancement**
  - Update [`state_manager.py`](file:///home/flix/Desktop/Edumentor%20AI/backend/app/core/state_manager.py):
    - Track time spent per problem (indicator of struggle)
    - Count repeated similar inputs (sign of confusion)
    - Measure sentiment (frustrated vs. confident tone)
  - Implement decay function (struggle score decreases with successful progress)

- [ ] **Orchestrator ↔ Instigator Loop**
  - When struggle score < 3: Orchestrator → Instigator (add friction)
  - When struggle score > 7: Orchestrator → Sonic (provide support)
  - Test with simulated student journeys (easy → challenging → stuck)

### Days 18-20: Conversation History & Persistence
- [ ] **Session Storage**
  - Implement session persistence (SQLite or PostgreSQL)
  - Store:
    - Full conversation history
    - Struggle score timeline
    - Topics covered
    - Agent invocation patterns
  - Add API endpoint: `GET /session/{student_id}/history`

- [ ] **Recovery & Continuity**
  - "Welcome back" logic that references previous session
  - Resume struggle scoring from last session
  - Example: "Last time we tackled fractions. Ready to continue?"

### Day 21: Integration Testing
- [ ] **End-to-End Scenarios**
  - Test 5 complete learning journeys:
    1. Student breezes through → Instigator adds friction
    2. Student gets stuck → Sonic provides support
    3. Student seeks validation → Instigator tests conviction
    4. Student makes progress → Struggle score adjusts
    5. Student returns next day → Session resumes smoothly
  - Document edge cases and failure modes

---

## Week 4: Cultural Sensitivity Audit & System Testing
**Sprint Goal**: Ensure cultural authenticity, fix bugs, and prepare for pilot deployment.

### Days 22-24: Cultural Sensitivity Review
- [ ] **Linguistic Audit**
  - Review all Sheng/Swahili usage with native speakers
  - Ensure phrases are current (slang evolves quickly)
  - Avoid stereotypes or overly clichéd references

- [ ] **Contextual Relevance**
  - Verify examples (M-Pesa, matatus) are universally understood in Nairobi
  - Add diverse neighborhood references (not just affluent areas)
  - Test with students from different socioeconomic backgrounds

- [ ] **Tone Calibration**
  - Ensure "Imani" (Sonic) feels like a supportive peer, not condescending
  - Ensure "The Professor" (Instigator) is challenging but not discouraging
  - Conduct A/B tests: Original prompts vs. refined prompts

### Days 25-27: Load Testing & Performance Optimization
- [ ] **Bedrock API Performance**
  - Simulate 50 concurrent users hitting `/chat` endpoint
  - Measure:
    - Average response time (target: <2 seconds)
    - P95 latency (target: <3 seconds)
    - Error rate (target: <1%)
  - Optimize prompt length to reduce token costs

- [ ] **Caching Strategy**
  - Cache common Instigator questions (reduce API calls)
  - Cache student context (avoid re-fetching from DB every time)
  - Implement Redis for session state if needed

### Days 28-29: Bug Bash & Documentation
- [ ] **Bug Fixing**
  - Fix known issues:
    - Import path errors in embeddings
    - State serialization edge cases
    - Timeout handling gaps
  - Conduct cross-file linting and type checking

- [ ] **Developer Documentation**
  - Write setup guide for new developers
  - Document model selection rationale (why Nova Lite for Orchestrator?)
  - Create troubleshooting guide for common Bedrock errors

### Day 30: Pilot Readiness Review
- [ ] **Final Checklist**
  - [ ] All three agents functional with real Bedrock models
  - [ ] Orchestrator routing tested with 100+ sample inputs
  - [ ] Struggle score algorithm validated
  - [ ] Cultural context verified by Nairobi locals
  - [ ] API latency meets SLA (<2s avg)
  - [ ] Error handling graceful (no crashes)
  - [ ] Session persistence working
  - [ ] Logs and monitoring dashboard live

- [ ] **Pilot Plan**
  - Recruit 10 students from Nairobi for 1-week pilot
  - Collect feedback on:
    - Cultural authenticity
    - Pedagogical effectiveness (did they learn?)
    - Engagement (did they enjoy it?)
  - Iterate based on feedback

---

## Success Metrics

By Day 30, we should demonstrate:

1. **Technical Metrics**
   - ✅ 99% uptime during pilot
   - ✅ <2 second avg response time
   - ✅ <$0.10 per student session (token costs)

2. **Pedagogical Metrics**
   - ✅ Productive struggle: 60%+ of interactions involve Instigator challenges
   - ✅ Student self-reports: "I had to think harder" (positive indicator)
   - ✅ Rule of Three enforced: <5% of hints given before 3 questions

3. **Cultural Metrics**
   - ✅ Student feedback: "Imani sounds like my classmates"
   - ✅ Zero inappropriate or offensive cultural references
   - ✅ 80%+ students recognize local examples (matatus, M-Pesa, etc.)

---

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| **Bedrock model access delayed** | Use mock SDK for dev; parallelize front-end work |
| **Token costs exceed budget** | Implement aggressive caching; use Nova Lite where possible |
| **Cultural context feels inauthentic** | Engage Kenyan educators as advisors from Week 1 |
| **Students find Instigator frustrating** | Add "hint override" button; tune struggle score thresholds |
| **API latency too high** | Pre-generate common responses; optimize prompts |

---

## Post-Launch (Days 31-60)

After the initial 30-day sprint:

- **Week 5-6**: Analyze pilot data, iterate on prompts
- **Week 7-8**: Scale to 100 students, monitor infrastructure
- **Week 9+**: Explore multimodal features (voice input via AWS Transcribe)

---

## Key Deliverables Summary

| Week | Deliverable | Owner | Status |
|------|-------------|-------|--------|
| 1 | AWS Bedrock production setup | Backend Lead | 🔵 Not Started |
| 1 | Real Strands SDK integration | Backend Lead | 🔵 Not Started |
| 2 | Instigator micro-sabotage scripts | AI/Pedagogy Lead | 🔵 Not Started |
| 2 | Sonic voice optimization | AI/Pedagogy Lead | 🔵 Not Started |
| 3 | Struggle score algorithm refinement | Backend + Pedagogy Lead | 🔵 Not Started |
| 3 | Session persistence | Backend Lead | 🔵 Not Started |
| 4 | Cultural sensitivity audit | Cultural Advisor + Team | 🔵 Not Started |
| 4 | Load testing & pilot launch | Full Team | 🔵 Not Started |

---

**Last Updated**: 2026-02-10  
**Next Review**: End of Week 1 (Day 7)
