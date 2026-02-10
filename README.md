# EduMentor AI 🎓

> A hierarchical multi-agent tutoring system powered by Amazon Nova models, designed for students in Nairobi.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![AWS](https://img.shields.io/badge/AWS-Bedrock-orange.svg)

---

## 🌟 Overview

EduMentor AI implements **Productive Struggle** pedagogy through three specialized AI agents:

- **🧠 Orchestrator** (Nova Lite): Routes requests based on student struggle score
- **💬 Sonic "Imani"** (Nova 2 Sonic): Supportive peer mentor with Nairobi cultural context
- **🎯 Instigator "The Professor"** (Nova 2 Act): Introduces cognitive friction through Socratic questioning

### Key Features

✅ **Rule of Three**: Never gives answers—asks 3+ guiding questions first  
✅ **Micro-Sabotage**: Introduces desirable difficulties to deepen learning  
✅ **Cultural Context**: Uses Sheng/Swahili and local examples (M-Pesa, matatus)  
✅ **Adaptive Routing**: Switches between support and challenge based on student state  
✅ **Voice-First**: Designed for concise, conversational responses  

---

## 🏗️ Architecture

```
┌─────────────┐
│   Student   │
│   Input     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│     Orchestrator Agent          │
│   (Nova Lite - Routing)         │
│                                 │
│  Analyzes: Struggle Score,      │
│  Frustration, Context           │
└────┬──────────────────┬─────────┘
     │                  │
     ▼                  ▼
┌─────────────┐   ┌──────────────┐
│   Sonic     │   │  Instigator  │
│  (Support)  │   │ (Challenge)  │
│             │   │              │
│ Nova Sonic  │   │  Nova Act    │
└─────────────┘   └──────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- AWS Account with Bedrock access
- Access to Amazon Nova models:
  - `us.amazon.nova-lite-v1:0`
  - `us.amazon.nova-2-sonic-v1:0`
  - `us.amazon.nova-2-act-v1:0`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/edumentor-ai.git
   cd edumentor-ai
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS credentials and configuration
   ```

5. **Set up AWS credentials**
   ```bash
   aws configure
   # Enter your AWS Access Key ID, Secret Key, and Region
   ```

### Running Locally

**Development mode (mock SDK):**
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

**Production mode (real AWS Bedrock):**
```bash
# After following AWS Integration Guide (docs/AWS_INTEGRATION.md)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Test the API:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Help me understand fractions",
    "student_id": "student_001"
  }'
```

---

## 📁 Project Structure

```
edumentor-ai/
├── backend/
│   ├── app/
│   │   ├── agents/          # AI agent implementations
│   │   │   ├── orchestrator.py    # Routing logic
│   │   │   ├── conversationalist.py  # Sonic (support)
│   │   │   └── instigator.py      # Cognitive friction
│   │   ├── core/
│   │   │   ├── models.py          # Nova model registry
│   │   │   ├── strands_sdk.py     # AWS Bedrock client
│   │   │   ├── manager.py         # Main orchestrator
│   │   │   └── state_manager.py   # Student state tracking
│   │   └── main.py          # FastAPI application
│   └── configs/
│       ├── logic.yaml       # Rule of Three, Nairobi context
│       └── orchestrator_prompts.yaml
├── docs/
│   ├── 30_DAY_ROADMAP.md    # Development sprint plan
│   ├── AWS_INTEGRATION.md   # Bedrock setup guide
│   └── DEPLOYMENT.md        # Infrastructure & DevOps
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🎯 API Endpoints

### `GET /`
Health check endpoint
```json
{
  "status": "active",
  "system": "EduMentor AI"
}
```

### `POST /chat`
Main interaction endpoint

**Request:**
```json
{
  "message": "Is my answer correct?",
  "student_id": "student_001"
}
```

**Response:**
```json
{
  "response": "Are you sure? Explain why that must be true.",
  "telemetry": {
    "student_id": "student_001",
    "current_topic": "fractions",
    "struggle_score": 4,
    "frustration_level": 0.3,
    "session_history": [...]
  }
}
```

---

## 🧪 Testing

```bash
# Run all tests
pytest tests/

# Run with coverage
pytest --cov=backend/app tests/

# Test specific agent
pytest tests/test_instigator.py -v
```

---

## 📚 Documentation

- **[30-Day Roadmap](docs/30_DAY_ROADMAP.md)** - Weekly sprint plan for production deployment
- **[AWS Integration Guide](docs/AWS_INTEGRATION.md)** - Setting up Bedrock and replacing mock SDK
- **[Deployment Strategy](docs/DEPLOYMENT.md)** - Infrastructure, Docker, CI/CD

---

## 🌍 Cultural Context

EduMentor AI is designed specifically for Nairobi students:

- **Language**: English with Sheng/Swahili phrases ("Sasa!", "Poa", "Twende kazi")
- **Examples**: Local context (M-Pesa transactions, matatu routes, local foods)
- **Tone**: Peer mentor, not teacher—encouraging and relatable

---

## 🔧 Configuration

Key environment variables (see [.env.example](.env.example)):

| Variable | Description | Default |
|----------|-------------|---------|
| `AWS_REGION` | AWS region for Bedrock | `us-east-1` |
| `ORCHESTRATOR_MODEL` | Nova Lite model ID | `us.amazon.nova-lite-v1:0` |
| `BEDROCK_MAX_TOKENS` | Max response length | `512` |
| `DATABASE_URL` | Database connection | `sqlite:///dev.db` |
| `LOG_LEVEL` | Logging verbosity | `INFO` |

---

## 🚦 Roadmap

### ✅ Phase 1: Boilerplate (Complete)
- Agent architecture
- Mock SDK implementation
- Cultural context integration

### 🔄 Phase 2: AWS Integration (Week 1-2)
- Replace mock SDK with Bedrock
- Production error handling
- CloudWatch monitoring

### 📅 Phase 3: Pilot Testing (Week 3-4)
- Beta test with 10 students
- Cultural sensitivity audit
- Performance optimization

### 🎯 Phase 4: Production (Post 30-day)
- Scale to 100+ students
- Voice synthesis (AWS Polly)
- Advanced analytics

See [30_DAY_ROADMAP.md](docs/30_DAY_ROADMAP.md) for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Pedagogy**: Based on "Productive Struggle" research (Kapur, 2016)
- **Cultural Context**: Developed with input from Nairobi educators
- **AWS**: Powered by Amazon Nova models via AWS Bedrock

---

## 📞 Contact

- **Team**: EduMentor AI Development Team
- **Email**: support@edumentor.ke
- **Documentation**: [docs/](docs/)

---

**Built with ❤️ for students in Nairobi**
