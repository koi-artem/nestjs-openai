# Use the official Node.js image as the base image
FROM node:20

ARG POSTGRES_HOST
ARG POSTGRES_PORT
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DATABASE

# Set the working directory inside the container
WORKDIR /usr/src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Run database migrations
RUN npm run migration:run

# Expose the application port
EXPOSE 3000
EXPOSE 3001

# Command to run the application
CMD ["node", "dist/main"]
