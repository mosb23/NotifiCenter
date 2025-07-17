# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the full app
COPY . .

EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
