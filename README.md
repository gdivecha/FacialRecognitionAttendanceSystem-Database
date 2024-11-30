# FacialRecognitionAttendanceSystem - Database

This is the **database service** for the Facial Recognition Attendance System. It handles data storage and retrieval using MongoDB.

## Prerequisites

- Node.js (version 18 or higher)
- Docker and Docker Compose
- MongoDB (if running locally without Docker)

## Environment Variables

Create a `.env` file with the following variables:

PORT=5001
MONGO_URI=mongodb://mongodb:27017/AITend

## Run Locally

1. Install dependencies:
   npm install

2. Start the database service:
   npm start

3. The service will run at http://localhost:5001.

Ensure MongoDB is running locally or specify the correct MONGO_URI in `.env`.

## Docker Instructions

### Build and Run with Docker

1. Build the Docker image:
   docker build -t database .

2. Run the container:
   docker run -p 5001:5001 --env-file .env database

### Using Docker Compose

Ensure the following `docker-compose.yml` file exists in the root directory:

version: '3.9'

services:
  database:
    build:
      context: ./FacialRecognitionAttendanceSystem-Database
    container_name: database
    ports:
      - "5001:5001"
    depends_on:
      - mongodb
    environment:
      - PORT=5001
      - MONGO_URI=mongodb://mongodb:27017/AITend
    restart: always

Run the following command:

docker-compose up --build