
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    keyName: str


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/save")
def upload_to_database(item: Item):
    print(item)
    return {}
