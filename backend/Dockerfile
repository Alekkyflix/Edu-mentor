# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 8000

# Set the working directory in the container
WORKDIR /app

# Install system dependencies (needed for packages like psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
# Note: we copy requirements.txt from the root to the backend folder first if needed,
# or we assume we are building from the project root context.
# Best practice: Copy requirements.txt directly into backend/ during dev or build.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend application code
# We expect the 'backend' folder to be the context or we copy from 'backend'
COPY backend/app/ /app/app/
COPY backend/configs/ /app/configs/

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
# We use uvicorn to serve the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
