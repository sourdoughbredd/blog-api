# Blog API

A comprehensive REST API for managing a blog, including user authentication, post creation, and comment handling.

## Description

This is a blog API that allows users to create, read, update, and delete blog posts and comments. It includes user authentication and authorization features to ensure secure access to the blog functionalities. It also uses CORS policies to limit access to certain client URLs.

## Table of Contents

- [Description](#description)
- [Preview](#preview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [License](#license)
- [Contact Information](#contact-information)

## Preview

You can test out the the API with the [Client page](https://blog-client-bb.netlify.app) or the [CMS page](https://blog-cms-bb.netlify.app).

## Features

- User authentication and authorization with PassportJS and JWTs w/ refresh tokens
- Create, read, update, and delete endpoints for blog posts, users, and comments
- Limit access to certain client URLs with CORS policies

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/sourdoughbredd/blog-api.git
   ```
2. Navigate to the project directory:
   ```sh
   cd blog-api
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a .env file in the base directory to be able to run this locally. It should have the following environment variables.

   ```sh
   NODE_ENV="development or production"
   DEV_FRONTEND_URL="frontend url in development mode, e.g. http://localhost:5173"
   BLOG_CLIENT_URL="client (frontend) url in production mode, e.g. example-blog-client-url.com"
   BLOG_CMS_URL="CMS (frontend) url in production mode, e.g. example-blog-cms-url.com"
   MONGODB_URI="the connection string for your mongoDB database"
   JWT_SECRET="your secret used for signing JWT access tokens"
   JWT_REFRESH_SECRET="your secret used for signing JWT refresh tokens"
   ```

   The three frontend URL variables are used in the CORS policy to allow those URL's to make requests. The `DEV_FRONTEND_URL` will work when `NODE_ENV="development"`. The other two URLs will work otherwise. You can use these variables to allow whichever URL's you want. If you need more customization, just edit the `cors.js` config file in the config directory.

## Usage

To start the server, run:

```sh
npm start
```

The server will be running on `http://localhost:3000`.

## Usage

To use this API, you need to handle user authentication using JSON Web Tokens (JWT). Below are the steps to authenticate and use the endpoints.

### Authentication

1. **Sign Up**: Register a new user to obtain credentials. See enxt section for usage.

2. **Log In**: Log in with your credentials to receive JWT access/refresh tokens. Save these tokens somewhere they can be easily accessed!

   ```sh
   POST /users/login
   ```

   **Request Body**:

   ```json
   {
     "username": "your_username",
     "password": "your_password"
   }
   ```

   **Response**:

   ```json
   {
     "accessToken": "your_jwt_access_token",
     "refreshToken": "your_jwt_refresh_token"
   }
   ```

3. **Using the Token**: Include the JWT access token in the `Authorization` header for endpoints that require authentication.

   ```sh
   Authorization: Bearer "your_jwt_access_token"
   ```

4. **Refreshing an Expired Access Token**: Include the JWT refresh token in the request body. If it is valid, unexpired, and verified in the database, a new JWT **access** token will be generated.

   ```sh
   `POST /users/token`
   ```

   **Request Body**:

   ```json
   {
     "refreshToken": "your_jwt_refresh_token"
   }
   ```

   **Response**:

   ```json
   {
     "accessToken": "your_new_jwt_access_token"
   }
   ```

### Endpoints and Usage

#### Users

- `GET /users`

  - **Description**: Get all users. Author privileges required.
  - **Authorization**: Bearer token (Author).

- `POST /users/signup`

  - **Description**: Register a new user.
  - **Authorization**: None.
  - **Request Body**:
    ```json
    {
      "username": "new_user",
      "password": "new_password",
      "email": "new_email"
    }
    ```

- `POST /users/login`

  - **Description**: Log in a user.
  - **Authorization**: None.
  - **Request Body**:
    ```json
    {
      "username": "existing_user",
      "password": "existing_password"
    }
    ```
  - **Response**:
    ```json
    {
      "tokens": {
        "accessToken": "your_jwt_access_token",
        "refreshToken": "your_jwt_refresh_token"
      }
    }
    ```

- `POST /users/logout`

  - **Description**: Log out a user. This immediately expires the refresh token.
  - **Authorization**: Bearer token.

- `POST /users/token`

  - **Description**: Refresh access token.
  - **Authorization**: Bearer token.
  - **Request Body**:
    ```json
    {
      "refreshToken": "your_jwt_refresh_token"
    }
    ```
  - **Response**:
    ```json
    {
      "accessToken": "your_new_jwt_access_token"
    }
    ```

- `GET /users/:userId`

  - **Description**: Get a single user by ID. Author privileges required.
  - **Authorization**: Bearer token (Author)

- `PUT /users/:userId`

  - **Description**: Update a user by ID. Only referenced user can access this endpoint.
  - **Authorization**: Bearer token (referenced user).
  - **Request Body**: (note that all body fields are optional)
    ```json
    {
      "username": "updated_username",
      "password": "updated_password",
      "email": "updated_email"
    }
    ```

- `DELETE /users/:userId`
  - **Description**: Delete a user by ID. Author or referenced user only.
  - **Authorization**: Bearer token (Author or Referenced User).

#### Posts

- `GET /posts`

  - **Description**: Get all posts. (If Author, also returns unpublished posts)
  - **Authorization**: None required for published posts. Bearer token required for Author to access unpublished posts.

- `POST /posts`

  - **Description**: Create a new post. Author only.
  - **Authorization**: Bearer token (Author).
  - **Request Body**:
    ```json
    {
      "title": "Post Title",
      "text": "Post content...",
      "isPublished": false
    }
    ```
  - **Response**:
    ```json
    {
      "posts": ["array_of_post_objects"]
    }
    ```

- `GET /posts/:postId`

  - **Description**: Get a single post by ID.
  - **Authorization**: None.
  - **Response**:
    ```json
    {
      "post": {"post_object"}
    }
    ```

- `PUT /posts/:postId`

  - **Description**: Update a post by ID. Author's only.
  - **Authorization**: Bearer token (Author).
  - **Request Body**: (note that all fields are optional)
    ```json
    {
      "title": "Updated Title",
      "text": "Updated content...",
      "isPublished": true
    }
    ```

- `DELETE /posts/:postId`
  - **Description**: Delete a post by ID. Author only.
  - **Authorization**: Bearer token (Author).

#### Comments

- `GET /posts/:postId/comments`

  - **Description**: Get all comments for a post.
  - **Authorization**: None.
  - **Response**:
    ```json
    {
      "comments": ["array_of_comment_objects"]
    }
    ```

- `POST /posts/:postId/comments`

  - **Description**: Add a comment to a post.
  - **Authorization**: Bearer token.
  - **Request Body**:
    ```json
    {
      "text": "Comment content..."
    }
    ```

- `GET /posts/:postId/comments/:commentId`

  - **Description**: Get a single comment by ID.
  - **Authorization**: None.
  - **Response**:
    ```json
    {
      "comment": {"comment_object"}
    }
    ```

- `PUT /posts/:postId/comments/:commentId`

  - **Description**: Update a comment by ID. Comment Author only.
  - **Authorization**: Bearer token (Comment Author).
  - **Request Body**:
    ```json
    {
      "text": "Updated comment content..."
    }
    ```

- `DELETE /posts/:postId/comments/:commentId`
  - **Description**: Delete a comment by ID. Comment Author only.
  - **Authorization**: Bearer token (Comment Author).

## Error Handling

- In the case of a server error, a loosely standardized response is sent back to the user for quick and easy identification of errors. The response will include the fields:

```json
{
  "error": {
    "code": 401,
    "message": "A message decribing the error"
  }
}
```

along with other fields to clarify the error or give the user useful information to debug.

## Tech Stack

- NodeJS + Express (backend design)
- MongoDB + Mongoose (database operations)
- Passport.js with JWT (user authentication)
- Jest (testing)

## License

This project is licensed under the MIT License.

## Contact Information

For any questions or suggestions, please contact Brett Bussell at [bwbussell24@gmail.com](mailto:bwbussell24@gmail.com).
