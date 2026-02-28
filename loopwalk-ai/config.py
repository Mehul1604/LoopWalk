import os
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "gpt-4o"   # or whatever you choose

llm = ChatOpenAI(
    model=MODEL_NAME
)

# test llm working
response = llm.invoke("Hello, world!")
print(response.content)