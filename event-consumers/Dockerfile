FROM python:3.14

WORKDIR /app

COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

COPY ./src ./src

CMD ["watchfiles", "--filter", "python", "python -m src.main"]