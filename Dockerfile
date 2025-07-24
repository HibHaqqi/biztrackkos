# Use the official Node.js 20 image.
FROM node:20-slim

# Install openssl
RUN apt-get update && apt-get install -y openssl

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and package-lock.json to the working directory.
COPY package*.json ./

# Copy the prisma schema
COPY prisma ./prisma

# Install dependencies.
RUN npm install

# Copy the rest of the application code to the working directory.
COPY . .

# Build the Next.js application.
RUN npm run build

# Expose the port the app runs on.
EXPOSE 9002

# Define the command to start the app.
CMD ["npm", "start"]