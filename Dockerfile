FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN npm ci --prefix frontend
RUN npm ci --omit=dev --prefix backend

COPY frontend ./frontend
COPY backend ./backend

RUN npm run build --prefix frontend

FROM node:20-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

# Install OpenJDK 21, Python 3, bash, and build utilities in Alpine Linux
RUN apk add --no-cache openjdk21-jdk python3 bash build-base

# Configure JAVA_HOME and ensure JDK binaries are in PATH
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Verify JDK and Python are active in execution environment
RUN java -version && javac -version && python3 --version

COPY --from=build /app/backend ./backend
COPY --from=build /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "server.js"]
