from fastapi import APIRouter

router = APIRouter()

@router.get("/chat")
async def chat():
    return {"message": "Hello World"}