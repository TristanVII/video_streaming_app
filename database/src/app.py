
from fastapi import FastAPI
from sqlalchemy.orm import Session
from create_db import create_database, engine
from crud import get_all_videos, save_video
from models import Video
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
create_database()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/upload")
def upload_to_database(item: Video):
    with Session(engine) as session:
        save_video(session, item)
    return "success"


@app.get("/videos")
def get_all():
    with Session(engine) as session:
        videos = get_all_videos(session)
    return videos


# TODO
@app.get("/get/{id}")
def get_id(id):
    return {"id": id}


if __name__ == '__main__':
    print("hello")
