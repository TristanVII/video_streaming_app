from sqlalchemy import create_engine
from models import Base


def get():
    pass


USER, PASSWORD, HOST, PORT, DB = get()

engine = create_engine(
    f'mysql+pymysql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB}', echo=True)


def create_database():
    Base.metadata.create_all(engine)


def drop_table(table):
    table.__table__.drop(engine)
