# http-crud-api

-installing

1. git clone https://github.com/xul7/http-crud-api
2. npm ci

-running

1. npm run start:dev - Development mode
2. npm run start:prod - Production mode
3. npm run start:multi - Multi mode - horizontal scaling for application
4. npm run test - tests
5. npm run test:coverage - tests + coverage

-using the application

1. endpoint `api/users`:
   - **GET** `api/users` is used to get all persons
     - Server answer with `status code` **200** and all users records
   - **GET** `api/users/${userId}`
     - Server answer with `status code` **200** and and record with `id === userId` if it exists
     - Server answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
     - Server answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
   - **POST** `api/users` is used to create record about new user and store it in database
     - Server answer with `status code` **201** and newly created record
     - Server answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
   - **PUT** `api/users/{userId}` is used to update existing user
     - Server answer with` status code` **200** and updated record
     - Server answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
     - Server answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
   - **DELETE** `api/users/${userId}` is used to delete existing user from database
     - Server answer with `status code` **204** if the record is found and deleted
     - Server answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
     - Server answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
2. Users are stored as `objects` that have following properties:
   - `id` — unique identifier (`string`, `uuid`) generated on server side
   - `username` — user's name (`string`, **required**)
   - `age` — user's age (`number`, **required**)
   - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)
