# Use Node.js official image as the base
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Generate Prisma client and build Next.js app
RUN npm run build

# Expose port 9002 since `next dev` runs with -p 9002, we assume prod same port
EXPOSE 9002

# Start the app in production mode
CMD ["npm", "start"]
