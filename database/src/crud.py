from sqlalchemy.orm import Session
from models import Videos, Video


def get_all_videos(db: Session):
    return db.query(Videos).all()


def save_video(db: Session, video: Video):
    video = Videos(
        name=video.name,
        s3_key=video.s3_key,
        user=video.user
    )
    db.add(video)
    db.commit()
