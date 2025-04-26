# Use node alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# ---- Install frontend ----
# Copy frontend package.json and package-lock.json
COPY client/package*.json ./client/

# Install frontend dependencies
RUN cd client && npm install

# Copy all frontend code
COPY client ./client

# Set API endpoint at build time
ARG VITE_API_ENDPOINT=/api
ENV VITE_API_ENDPOINT=${VITE_API_ENDPOINT}

# Build the frontend
RUN cd client && npm run build

# ---- Install backend ----
# Copy backend package.json and package-lock.json
COPY server/package*.json ./server/

# Install backend dependencies
RUN cd server && npm install

# Copy all backend code
COPY server ./server

# Move frontend build inside backend
RUN mv ./client/build ./server/build

# Set working directory to backend
WORKDIR /app/server

# Expose the port (Cloud Run will pick up PORT automatically)
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
