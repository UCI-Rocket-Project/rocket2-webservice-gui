# Use an official Node runtime as a base image
FROM node:22.1.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json .

# Install app dependencies
RUN npm install -force

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your app will run
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
