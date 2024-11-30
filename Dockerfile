# Use the Node.js 18 base image
FROM node:18.20.4

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the port your server will run on
EXPOSE 5001

# Initialize the database and start the server
CMD ["sh", "-c", "node initializeDB/initMongo.js && node server.js"]