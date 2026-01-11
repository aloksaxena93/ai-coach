# AI Coach Backend

A FastAPI backend that provides Socratic tutoring responses using OpenAI's GPT models.

## Setup

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. Run the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

The API will be available at `http://localhost:8000`.

## API Endpoints

### POST /api/chat

Send a chat message to the AI tutor.

**Request Body:**
```json
{
  "messages": [
    {"role": "user", "content": "Where should I start?"}
  ],
  "problem": {
    "title": "Two Sum",
    "description": "Given an array of integers...",
    "examples": [
      {"input": "nums = [2,7,11,15], target = 9", "output": "[0, 1]"}
    ]
  },
  "code": "def two_sum(nums, target):\n    pass"
}
```

**Response:**
```json
{
  "response": "Great question! Let's think about this together..."
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

