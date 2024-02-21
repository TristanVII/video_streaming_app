from sqlalchemy import Integer, String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from pydantic import BaseModel


class Base(DeclarativeBase):
    pass


class Videos(Base):
    __tablename__ = "videos"
    id: Mapped[Integer] = mapped_column(Integer, primary_key=True)
    name: Mapped[String] = mapped_column(String(50), nullable=False)
    s3_key: Mapped[String] = mapped_column(String(50), nullable=False)
    user: Mapped[String] = mapped_column(String(50), nullable=False)


class Video(BaseModel):
    name: str
    s3_key: str
    user: str
