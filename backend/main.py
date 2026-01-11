from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AI Coach API",
    description="Socratic tutoring API for coding problems",
    version="1.0.0"
)

# Configure CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Pydantic models for request/response
class Example(BaseModel):
    input: str
    output: str

class Problem(BaseModel):
    title: str
    description: str
    difficulty: Optional[str] = None
    category: Optional[str] = None
    examples: List[Example] = []

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    problem: Problem
    code: str

class ChatResponse(BaseModel):
    response: str

class GenerateProblemRequest(BaseModel):
    difficulty: Optional[str] = None
    category: Optional[str] = None

class GenerateProblemResponse(BaseModel):
    title: str
    description: str
    difficulty: str
    category: str
    estimatedTime: str
    examples: List[Example]
    starterCode: str

# System prompt for Socratic tutoring
SYSTEM_PROMPT_TEMPLATE = """You are a Socratic engineering tutor helping a student solve coding problems. Your role is to:

1. NEVER give direct answers or complete solutions
2. Guide the student through thoughtful questions
3. Help them discover the solution themselves
4. Ask probing questions about their approach
5. Point out potential issues through questioning, not telling
6. Encourage critical thinking about time and space complexity
7. Be encouraging, supportive, and patient
8. Keep responses concise (2-3 sentences typically)
9. Always end with a guiding question to keep the student thinking

Current Problem:
Title: {title}
Description: {description}
{examples_text}

The student's current code:
```python
{code}
```

Remember: You are a Socratic tutor. Ask questions that lead the student to discover the answer themselves. Do not provide code solutions."""


def build_system_prompt(problem: Problem, code: str) -> str:
    """Build the system prompt with problem context."""
    examples_text = ""
    if problem.examples:
        examples_text = "Examples:\n"
        for i, ex in enumerate(problem.examples, 1):
            examples_text += f"  Example {i}: Input: {ex.input} → Output: {ex.output}\n"
    
    return SYSTEM_PROMPT_TEMPLATE.format(
        title=problem.title,
        description=problem.description,
        examples_text=examples_text,
        code=code
    )


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a chat message and return an AI tutor response.
    """
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
        )
    
    try:
        # Build the system prompt with problem context
        system_prompt = build_system_prompt(request.problem, request.code)
        
        # Prepare messages for OpenAI
        openai_messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        # Add conversation history
        for msg in request.messages:
            openai_messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Call OpenAI API
        model = os.getenv("OPENAI_MODEL", "gpt-4o")
        completion = client.chat.completions.create(
            model=model,
            messages=openai_messages,
            max_tokens=500,
            temperature=0.7,
        )
        
        # Extract and return the response
        assistant_message = completion.choices[0].message.content
        
        return ChatResponse(response=assistant_message)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with OpenAI: {str(e)}"
        )


@app.post("/api/generate-problem", response_model=GenerateProblemResponse)
async def generate_problem(request: GenerateProblemRequest):
    """
    Generate a new coding problem using AI.
    """
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
        )
    
    try:
        difficulty = request.difficulty or "Easy"
        category = request.category or "any category (Arrays, Strings, Hash Tables, Two Pointers, etc.)"
        
        prompt = f"""Generate a coding interview problem with the following specifications:
- Difficulty: {difficulty}
- Category: {category}

Respond with a JSON object containing:
{{
  "title": "Problem Title",
  "description": "A clear problem description explaining what needs to be solved. Include constraints.",
  "difficulty": "{difficulty}",
  "category": "The specific category",
  "estimatedTime": "Estimated time to solve (e.g., '15 min', '30 min')",
  "examples": [
    {{"input": "Example input", "output": "Expected output"}}
  ],
  "starterCode": "Python starter code with function signature and test case"
}}

Make sure the problem is:
1. Clear and well-defined
2. Has at least one example with input/output
3. Appropriate for the difficulty level
4. The starter code includes a function definition and a simple test case

Return ONLY the JSON object, no other text."""

        model = os.getenv("OPENAI_MODEL", "gpt-4o")
        completion = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.8,
            response_format={"type": "json_object"}
        )
        
        import json
        response_text = completion.choices[0].message.content
        problem_data = json.loads(response_text)
        
        return GenerateProblemResponse(
            title=problem_data.get("title", "Generated Problem"),
            description=problem_data.get("description", ""),
            difficulty=problem_data.get("difficulty", difficulty),
            category=problem_data.get("category", "General"),
            estimatedTime=problem_data.get("estimatedTime", "15 min"),
            examples=[Example(**ex) for ex in problem_data.get("examples", [])],
            starterCode=problem_data.get("starterCode", "# Your solution here\n")
        )
    
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing AI response: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating problem: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

