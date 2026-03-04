#!/bin/bash
# EduMentor AI Backend Startup Script
# Run from anywhere — always uses project root as working directory.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "================================================="
echo "  EduMentor AI — Backend Server"
echo "  Project root: $PROJECT_ROOT"
echo "================================================="

cd "$PROJECT_ROOT"

# Activate virtual environment if present
if [ -d "$PROJECT_ROOT/backend/.venv" ]; then
    source "$PROJECT_ROOT/backend/.venv/bin/activate"
    echo "✅ Virtual environment activated"
elif [ -d "$PROJECT_ROOT/.venv" ]; then
    source "$PROJECT_ROOT/.venv/bin/activate"
    echo "✅ Virtual environment activated"
else
    echo "⚠️  No .venv found — using system Python"
fi

# Start uvicorn from project root so backend.app.* imports resolve
python3 -m uvicorn backend.app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --reload \
    --log-level info \
    2>&1 | tee /tmp/edumentor_backend.log
