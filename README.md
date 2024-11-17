# Postman Setup for AITend Database API

## Overview
This README provides step-by-step instructions for setting up Postman to test the AITend API, including configuring requests, setting environment variables, and setting up an authorization token.

---

## Prerequisites
- Ensure the AITend server is running. Start the server using:
  `npm start`
  or
  `node server.js`
- Default port: 5001.
  - Install Postman from here.

---

## Step 1: Import the Postman Collection
1. Open Postman.
2. Click on Import in the top-left corner.
3. Select the JSON file for the Postman collection (if provided) or manually add the endpoints based on the API structure:
    - POST /api/courses/createCourse
    - GET /api/courses/getCourseFromCourseCode
    - GET /api/courses/getCoursesFromProfEmail
    - DELETE /api/courses/deleteCourse

---

## Step 2: Set Up Environment Variables
1. Create a New Environment:
    - Go to the gear icon in the top-right corner and click Manage Environments.
    - Click Add to create a new environment.
    - Name the environment AITend-Database.
2. Add Variables:
    - Add the following variables to the environment:

3. Save the environment.

---

## Step 3: Configure Authorization Token
1. Go to the Authorization tab in any request.
2. Set the type to Bearer Token.
3. In the token field, use the variable {{authToken}}.
4. Ensure the variable authToken is set in the environment (as described in Step 2).

---

## Step 4: Add Requests
- Base URL: Use the environment variable {{baseUrl}} for all requests. For example:
  - {{baseUrl}}/api/courses/createCourse
  - {{baseUrl}}/api/courses/getCourseFromCourseCode
  - {{baseUrl}}/api/courses/getCoursesFromProfEmail
  - {{baseUrl}}/api/courses/deleteCourse

---

## Step 5: Test the API
1. Select the AITend-Database environment in Postman.
2. Send requests to each endpoint using the instructions above.
3. Check the Headers, Params, and Body tabs to ensure all fields are set correctly.

---

## Troubleshooting
1. 404 Not Found:
  - Ensure the correct route is being called.
  - Verify the baseUrl and endpoint path.
2. Empty Responses:
  - Ensure the database contains the data you’re querying.
  - Use the createCourse API to add data.
3. 500 Server Error:
  - Check the server logs for detailed error messages.

---