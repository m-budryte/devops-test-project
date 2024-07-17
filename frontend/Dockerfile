# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json /app
RUN npm install

# Copy the rest of the application code
COPY . /app

# Build the app
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app using serve
CMD ["serve", "-s", "build"]
