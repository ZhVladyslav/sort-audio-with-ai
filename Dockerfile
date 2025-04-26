FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py ./

CMD ["python", "main.py"]

# FROM node:20-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY test.js ./

# CMD ["node", "test.js"]