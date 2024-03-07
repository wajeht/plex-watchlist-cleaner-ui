FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY requirements.txt ./

RUN apt-get update && \
    apt-get install -y curl python3-venv python3-dev && \
    python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

HEALTHCHECK CMD curl -f http://localhost:8080/healthz || exit 1

CMD node ./src/index.js
