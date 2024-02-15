from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class JobListing(Base):
    __tablename__ = "job_listing"

    def to_dict(self):

        data = self.__dict__
        keys = [
            "job_listing_id",
            "sector",
            "title",
            "salary",
            "location",
            "date",
            "trace_id"]

        return {k: v for k, v in data.items() if k in keys}
