FROM node:12 AS builder

# Install chrome to run tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

# Install Java jre, required for sonar
RUN apt-get install -y openjdk-8-jre && \
    apt-get clean;

WORKDIR /app
COPY . .

RUN npm i
RUN npm run test-coverage && npm run sonar && npm run build_int

FROM nginx:alpine

WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/dist/precon-plus .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
