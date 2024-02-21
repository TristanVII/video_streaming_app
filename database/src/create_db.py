from sqlalchemy import create_engine
from models import Base
from sqlalchemy.orm import sessionmaker
import os

USER = 'root'
PASSWORD = 'password'
HOST = 'localhost'
PORT = '3307'
DB = 'videodb'

USER = os.environ.get("USER")
PASSWORD = os.environ.get("PASSWORD")
HOST = os.environ.get("HOST")
PORT = os.environ.get("PORT")
DB = os.environ.get("DB")

engine = create_engine(
    f'mysql+pymysql://{USER}:{PASSWORD}@{HOST}/{DB}', echo=True)


def create_database():
    Base.metadata.create_all(engine)


def drop_table(table):
    table.__table__.drop(engine)
