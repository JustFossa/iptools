# Use Node.js alpine as the base image
FROM node:22.14-alpine3.20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Create a .env file if it doesn't exist
RUN touch .env

# Command to run the app
CMD ["npm", "start"]