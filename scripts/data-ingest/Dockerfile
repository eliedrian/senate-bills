FROM python:3.9

RUN pip install psycopg2 && mkdir /app

WORKDIR /app

COPY ingest_dump.py .

ENTRYPOINT ["/app/ingest_dump.py"]
