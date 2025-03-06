# Possible Errors

This is an guide to the possible errors that may happen in your app.

## Relevant HTTP Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 405 Method Not Allowed
- 418 I'm a teapot
- 422 Unprocessable Entity
- 500 Internal Server Error

---

## Unavailable Routes

### GET `/not-a-route`

- Invalid (e.g. `/api-get-users`) -- 404 Endpoint Not Found

---

## Available Routes

### GET `/api/articles`

- Bad queries: -- 400 Bad Request
  - `skill_level` that is not in the database
  - `preferences` that are not in the database
  - `p` added but `limit` not or vice versa

### GET `/api/users/:userId`

- Well formed `userId` that doesn't exist in the database (e.g. `/999999`) -- 404 Not Found

### POST `/api/users/:userId`

- Empty body -- 400 Bad Request

### PATCH `/api/users/:userId`

- Well formed `userId` that doesn't exist in the database (e.g. `/999999`) -- 404 Not Found
- Empty body -- 400 Bad Request

### DELETE `/api/users/:userId`

- Well formed `:userId` that doesn't exist in the database (e.g. `/999999`) -- 404 Not Found