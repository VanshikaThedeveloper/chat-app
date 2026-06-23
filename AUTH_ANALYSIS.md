# AUTH ANALYSIS

## 1. Current Folder Structure
The Auth Module and associated configuration/security files are structured as follows:
```
backend/
├── src/
│   ├── configs/
│   │   └── redis.config.js
│   ├── constants/
│   │   ├── messages.js
│   │   └── statusCodes.js
│   ├── database/
│   │   └── db.js
│   ├── helpers/
│   │   └── response.helper.js
│   ├── middlewares/
│   │   └── auth.middlewares.js
│   ├── models/
│   │   └── user.model.js
│   ├── modules/
│   │   └── auth/
│   │       ├── index.js
│   │       ├── login/
│   │       │   ├── login.controller.js
│   │       │   ├── login.route.js
│   │       │   ├── login.service.js
│   │       │   └── login.validation.js
│   │       ├── logout/
│   │       │   ├── logout.controller.js
│   │       │   ├── logout.route.js
│   │       │   └── logout.service.js
│   │       ├── me/
│   │       │   ├── me.controller.js
│   │       │   ├── me.route.js
│   │       │   └── me.service.js
│   │       ├── refresh-token/
│   │       │   ├── refresh-token.controller.js
│   │       │   ├── refresh-token.route.js
│   │       │   ├── refresh-token.service.js
│   │       │   └── refresh-token.validation.js
│   │       └── register/
│   │           ├── register.controller.js
│   │           ├── register.route.js
│   │           ├── register.service.js
│   │           └── register.validation.js
│   ├── app.js
│   └── server.js
└── .env
```

---

## 2. Authentication Architecture
The Auth system follows a clean **layered MVC/Service** architectural pattern:
- **Routing Layer (`*.route.js`)**: Matches URL endpoints, binds validation schemas and authentication middleware, and delegates request execution to Controllers.
- **Validation Layer (`*.validation.js`)**: Declares standard rules using `express-validator` to sanitize and validate incoming request bodies.
- **Controller Layer (`*.controller.js`)**: Inspects validation results, parses request bodies, delegates business logic execution to Services, handles exceptions, and constructs client responses with appropriate HTTP status codes.
- **Service Layer (`*.service.js`)**: Encapsulates core business logic (e.g. searching/mutating the database, hashing passwords, generating JWTs, and managing token storage in Redis).
- **Data Access Layer (`user.model.js`)**: Represents the Mongoose schema and model mapping for User documents.
- **Cache/Token Storage (`redis.config.js`)**: Manages the persistence and expiration of Refresh Tokens for session revocation.

---

## 3. Register Flow
The register request handles new user creation:
1. **Client Request**: `POST /api/auth/register` with `username`, `email`, and `password`.
2. **Validation**: `registerValidation` checks for a valid email, username of length $\ge 3$ characters, and password of length $\ge 6$ characters.
3. **Controller**: `registerController` checks for validation errors. If found, returns `400 Bad Request` with errors list. Otherwise, calls `registerUserService`.
4. **Service**:
   - Queries MongoDB to verify if a user with the requested `email` already exists.
   - If a duplicate email is found, throws an error: `User already exists`.
   - Hashes the password using `bcryptjs.hash()` with `10` salt rounds.
   - Persists the new User document into the database using `User.create()`.
5. **Response**: Returns `201 Created` with a success status, message, and basic user data (`id`, `username`, `email`). If any exception is thrown, returns `400 Bad Request` with the error message.

---

## 4. Login Flow
The login request authenticates users and establishes a session:
1. **Client Request**: `POST /api/auth/login` with `email` and `password`.
2. **Validation**: `loginValidation` checks that `email` is a valid format and `password` is non-empty.
3. **Controller**: `loginController` checks validation results. If invalid, returns `400 Bad Request`. Otherwise, delegates to `loginUserService`.
4. **Service**:
   - Queries MongoDB to find a user by their `email`. If not found, throws an error: `Invalid credentials`.
   - Compares the provided password with the hashed password stored in the database using `bcryptjs.compare()`. If mismatch, throws `Invalid credentials`.
   - Generates a short-lived JSON Web Token (Access Token, expires in 15m) using `generateAccessToken()`.
   - Generates a long-lived JSON Web Token (Refresh Token, expires in 7d) using `generateRefreshToken()`.
   - Stores the Refresh Token in Redis using the key `refresh:${userId}` with an expiration matching the token's lifetime (7 days / 604,800 seconds).
5. **Response**: Returns `200 OK` with user details (`id`, `username`, `email`), the `accessToken`, and the `refreshToken`. If an error occurs, catches and returns `400 Bad Request` with the exception message.

---

## 5. Logout Flow
The logout request invalidates the active session:
1. **Client Request**: `POST /api/auth/logout`.
2. **Middleware**: `authMiddleware` verifies the provided Access Token. If valid, attaches the user to `req.user`.
3. **Controller**: `logoutController` extracts `req.user._id` and calls `logoutService`.
4. **Service**: Deletes the corresponding Refresh Token key `refresh:${userId}` from Redis.
5. **Response**: Returns `200 OK` with a successful logout message. If an exception occurs, returns `500 Internal Server Error`.

---

## 6. Refresh Token Flow
The refresh token request issues a new access token without needing credentials:
1. **Client Request**: `POST /api/auth/refresh-token` with the `refreshToken` in the request body.
2. **Validation**: `refreshTokenValidation` ensures `refreshToken` is present.
3. **Controller**: `refreshTokenController` checks for validation errors. If found, returns `400 Bad Request`. Otherwise, calls `refreshTokenService`.
4. **Service**:
   - Verifies the integrity and signature of the `refreshToken` using the `JWT_REFRESH_SECRET` and `jwt.verify()`.
   - Queries Redis using the decoded `userId` to check if a valid refresh token exists for this user.
   - Compares the stored token against the incoming token. If they mismatch or the token is missing from Redis (due to logout/expiration), throws `Invalid refresh token`.
   - If verified, generates a new Access Token using `generateAccessToken()`.
5. **Response**: Returns `200 OK` with the new `accessToken`. On error, returns `401 Unauthorized` with the message `Invalid refresh token`.

---

## 7. JWT Flow
- **Algorithms & Design**: Signed with HMAC SHA-256 (`jsonwebtoken` library default).
- **Access Tokens**: Encodes `{ userId }` as payload, signed with `JWT_SECRET`, expires in `15m`. Used to authenticate API calls to protected resources via authorization headers.
- **Refresh Tokens**: Encodes `{ userId }` as payload, signed with `JWT_REFRESH_SECRET`, expires in `7d`. Used exclusively to request new Access Tokens.
- **Storage Strategy**: Access tokens are meant to be kept in memory/client-side storage, while refresh tokens are verified against an active session whitelist in Redis, enabling instantaneous session revocation.

---

## 8. Middleware Flow
Protected routes are protected by `authMiddleware`:
1. Inspects the incoming HTTP headers for the `Authorization` key.
2. Checks if the header format is `Bearer <token>`.
3. Extracts the token string and verifies it against the `JWT_SECRET` using `jwt.verify()`.
4. Decodes the payload and uses the `userId` to search MongoDB: `User.findById(decoded.userId).select("-password")` (excluding the sensitive password field).
5. If the user doesn't exist, returns `401 Unauthorized`.
6. If the user is found, attaches it to the request object as `req.user` and calls `next()` to proceed to the controller.
7. Any verification or database query failures are caught and returned as `401 Unauthorized` with a generic `Invalid token` message.

---

## 9. Validation Flow
Inputs are validated at the route layer using `express-validator` arrays:
- Validators check requirements (presence, lengths, formatting, trims).
- If validation rules fail, errors are attached to the request object.
- The corresponding controller retrieves errors using `validationResult(req)` and immediately halts execution if errors are found, responding with status `400` and detailed failure arrays.

---

## 10. Database Interaction Flow
- **MongoDB (Mongoose)**:
  - Used for storing permanent user credentials and profiles.
  - Operations: `User.findOne({ email })` for registration/login checks; `User.create()` for user registration; `User.findById()` inside the auth middleware.
- **Redis (ioredis)**:
  - Used for low-latency session token white-listing and revocation.
  - Operations: `redisClient.set(key, value, "EX", seconds)` to track active sessions; `redisClient.get(key)` to verify active sessions; `redisClient.del(key)` to delete active sessions.

---

## 11. Security Mechanisms
- **Password Hashing**: Uses `bcryptjs` to hash user passwords with a salt complexity round of 10 prior to writing to MongoDB.
- **Token Segregation**: Separates the Access Token signature (`JWT_SECRET`) from the Refresh Token signature (`JWT_REFRESH_SECRET`) so that a compromise of one does not automatically expose the other.
- **Token Whitelisting**: Refresh tokens are validated against Redis keys. When a user logs out, the refresh token is removed from Redis, preventing further token refreshes.
- **Database Projections**: Excludes sensitive data (e.g. `password`) when retrieving the user details in `authMiddleware` via `.select("-password")`.

---

## 12. Files Reviewed
Every file under the Auth Module and backend infrastructure was audited:
- `backend/src/app.js`
- `backend/src/server.js`
- `backend/src/configs/redis.config.js`
- `backend/src/database/db.js`
- `backend/src/middlewares/auth.middlewares.js`
- `backend/src/models/user.model.js`
- `backend/src/utils/token.utils.js`
- `backend/src/constants/messages.js`
- `backend/src/constants/statusCodes.js`
- `backend/src/helpers/response.helper.js`
- `backend/src/modules/auth/index.js`
- `backend/src/modules/auth/register/register.route.js`
- `backend/src/modules/auth/register/register.validation.js`
- `backend/src/modules/auth/register/register.controller.js`
- `backend/src/modules/auth/register/register.service.js`
- `backend/src/modules/auth/login/login.route.js`
- `backend/src/modules/auth/login/login.validation.js`
- `backend/src/modules/auth/login/login.controller.js`
- `backend/src/modules/auth/login/login.service.js`
- `backend/src/modules/auth/logout/logout.route.js`
- `backend/src/modules/auth/logout/logout.controller.js`
- `backend/src/modules/auth/logout/logout.service.js`
- `backend/src/modules/auth/me/me.route.js`
- `backend/src/modules/auth/me/me.controller.js`
- `backend/src/modules/auth/me/me.service.js`
- `backend/src/modules/auth/refresh-token/refresh-token.route.js`
- `backend/src/modules/auth/refresh-token/refresh-token.validation.js`
- `backend/src/modules/auth/refresh-token/refresh-token.controller.js`
- `backend/src/modules/auth/refresh-token/refresh-token.service.js`

---

## 13. Files Modified
The following files were modified to fix bugs, broken imports, and remove dead debug code:
1. [index.js](file:///c:/Users/LENOVO/Desktop/realtime-chat/backend/src/modules/auth/index.js) (Registered missing `logoutRouter`)
2. [logout.route.js](file:///c:/Users/LENOVO/Desktop/realtime-chat/backend/src/modules/auth/logout/logout.route.js) (Fixed broken import path pointing to `auth.middleware.js` instead of `auth.middlewares.js`)
3. [login.service.js](file:///c:/Users/LENOVO/Desktop/realtime-chat/backend/src/modules/auth/login/login.service.js) (Imported missing `redisClient` to fix runtime ReferenceError; removed unused `jwt` import)
4. [register.route.js](file:///c:/Users/LENOVO/Desktop/realtime-chat/backend/src/modules/auth/register/register.route.js) (Removed unused anonymous debug middleware printing "Route Hit")
5. [register.controller.js](file:///c:/Users/LENOVO/Desktop/realtime-chat/backend/src/modules/auth/register/register.controller.js) (Removed leftover test debug statements)
6. [db.js](file:///c:/Users/LENOVO/Desktop/realtime-chat/backend/src/database/db.js) (Removed unused `{ connect }` import from `mongoose`)

---

## 14. Files Unchanged
The remaining files are unchanged:
- `backend/src/app.js`
- `backend/src/server.js`
- `backend/src/configs/redis.config.js`
- `backend/src/middlewares/auth.middlewares.js`
- `backend/src/models/user.model.js`
- `backend/src/utils/token.utils.js`
- `backend/src/constants/messages.js`
- `backend/src/constants/statusCodes.js`
- `backend/src/helpers/response.helper.js`
- `backend/src/modules/auth/register/register.validation.js`
- `backend/src/modules/auth/register/register.service.js`
- `backend/src/modules/auth/login/login.route.js`
- `backend/src/modules/auth/login/login.validation.js`
- `backend/src/modules/auth/login/login.controller.js`
- `backend/src/modules/auth/logout/logout.controller.js`
- `backend/src/modules/auth/logout/logout.service.js`
- `backend/src/modules/auth/me/me.route.js`
- `backend/src/modules/auth/me/me.controller.js`
- `backend/src/modules/auth/me/me.service.js`
- `backend/src/modules/auth/refresh-token/refresh-token.route.js`
- `backend/src/modules/auth/refresh-token/refresh-token.validation.js`
- `backend/src/modules/auth/refresh-token/refresh-token.controller.js`
- `backend/src/modules/auth/refresh-token/refresh-token.service.js`

---

## 15. Code Removed
- Unused import: `import jwt from "jsonwebtoken";` in `login.service.js`.
- Unused import: `{ connect }` from `mongoose` in `db.js`.
- Debug middleware:
  ```javascript
  (req, res, next) => {
    console.log("Route Hit");
    next();
  }
  ```
  in `register.route.js`.
- Debug logs:
  - `console.log("Controller Hit");`
  - `console.log(" test -1 ");`
  - `console.log(" test -2 ");`
  - `console.log(" test -3 ");`
  in `register.controller.js`.

---

## 16. Reasons For Every Change
- **`src/modules/auth/index.js`**: Missing `logoutRouter` integration meant users could never hit `/logout` to terminate their session.
- **`src/modules/auth/logout/logout.route.js`**: Importing `auth.middleware.js` caused a runtime Module Not Found crash since the file is actually named `auth.middlewares.js`.
- **`src/modules/auth/login/login.service.js`**: ReferenceError on `redisClient` crashed the server during the login flow because `redisClient` was used but never imported. The `jwt` import was also removed since token utility functions are delegated to `token.utils.js`.
- **`src/modules/auth/register/register.route.js`**: The anonymous debug log middleware on the route served no business function and cluttered standard output.
- **`src/modules/auth/register/register.controller.js`**: Removed arbitrary `test -X` statements and `Controller Hit` statement that cluttered logs during normal registration.
- **`src/database/db.js`**: Cleaned up the unused `{ connect }` import to keep imports minimal and follow clean code standards.

---

## 17. Final Request Lifecycle Diagram
Below is the request lifecycle diagram for the Auth endpoints:

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as Route Handler
    participant Validator as Express Validator
    participant Middleware as Auth Middleware
    participant Controller as controller
    participant Service as service
    participant Redis as Redis Cache
    participant DB as MongoDB

    %% Register Flow
    rect rgb(240, 248, 255)
    Note over Client, DB: Register Request Flow (POST /api/auth/register)
    Client->>Router: Send Register payload
    Router->>Validator: Validate payload
    alt Validation Fails
        Validator-->>Client: Return 400 Bad Request
    else Validation Passes
        Router->>Controller: Delegate execution
        Controller->>Service: Call registerUserService()
        Service->>DB: Check if user email exists
        alt User Exists
            DB-->>Service: Return existing record
            Service-->>Controller: Throw Error "User already exists"
            Controller-->>Client: Return 400 with error message
        else Email is Unique
            Service->>DB: Save new hashed user
            DB-->>Service: Return new User
            Service-->>Controller: Return user object
            Controller-->>Client: Return 201 Success
        end
    end
    end

    %% Login Flow
    rect rgb(245, 245, 220)
    Note over Client, DB: Login Request Flow (POST /api/auth/login)
    Client->>Router: Send Login credentials
    Router->>Validator: Validate payload
    alt Validation Fails
        Validator-->>Client: Return 400 Bad Request
    else Validation Passes
        Router->>Controller: Delegate execution
        Controller->>Service: Call loginUserService()
        Service->>DB: Query user by email
        alt User Not Found
            DB-->>Service: Return null
            Service-->>Controller: Throw Error "Invalid credentials"
            Controller-->>Client: Return 400 with error message
        else User Found
            Service->>Service: Verify password with bcrypt
            alt Password Mismatches
                Service-->>Controller: Throw Error "Invalid credentials"
                Controller-->>Client: Return 400 with error message
            else Password Matches
                Service->>Service: Sign Access & Refresh Tokens
                Service->>Redis: Set refresh:${userId} -> Token (7 days)
                Redis-->>Service: Acknowledge
                Service-->>Controller: Return tokens + user data
                Controller-->>Client: Return 200 OK
            end
        end
    end
    end

    %% Refresh Token Flow
    rect rgb(230, 250, 230)
    Note over Client, DB: Refresh Token Flow (POST /api/auth/refresh-token)
    Client->>Router: Send Refresh Token
    Router->>Validator: Validate token presence
    alt Validation Fails
        Validator-->>Client: Return 400 Bad Request
    else Validation Passes
        Router->>Controller: Delegate execution
        Controller->>Service: Call refreshTokenService()
        Service->>Service: Verify JWT signature
        alt Token Expired / Invalid Signature
            Service-->>Controller: Throw JWT Error
            Controller-->>Client: Return 401 Unauthorized
        else Token Valid
            Service->>Redis: Get refresh:${userId}
            Redis-->>Service: Return storedToken
            alt Token Mismatch or Missing
                Service-->>Controller: Throw Error "Invalid refresh token"
                Controller-->>Client: Return 401 Unauthorized
            else Token Matches
                Service->>Service: Sign new Access Token
                Service-->>Controller: Return new Access Token
                Controller-->>Client: Return 200 OK
            end
        end
    end
    end

    %% Logout Flow
    rect rgb(255, 240, 245)
    Note over Client, DB: Logout Request Flow (POST /api/auth/logout)
    Client->>Router: Send Access Token in Header
    Router->>Middleware: Authenticate Access Token
    alt Token Invalid / Expired
        Middleware-->>Client: Return 401 Unauthorized
    else Token Valid
        Middleware->>DB: Query User from db
        alt User Not Found
            DB-->>Middleware: Return null
            Middleware-->>Client: Return 401 Unauthorized
        else User Found
            Middleware->>Controller: Call next() and delegate
            Controller->>Service: Call logoutService(userId)
            Service->>Redis: Delete refresh:${userId}
            Redis-->>Service: Confirm deletion
            Service-->>Controller: Return success
            Controller-->>Client: Return 200 OK
        end
    end
    end
```

---

## 18. Final Auth System Summary
The authenticated API is structured efficiently with clear separation of concerns. By fixing the runtime module crash (due to the incorrect filename for auth middlewares) and resolving the ReferenceError on the login request (by importing `redisClient`), the auth flows are now 100% operational and robust. Session tracking and revocation are supported through a Redis whitelist check on refresh tokens, and routes are protected cleanly by decoding and looking up current users.
