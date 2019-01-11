# Spaced Latency (server)

Learn the latency numbers that every programmer should know using spaced repetition.

For more information, checkout the [main repository](https://github.com/thinkful-ei25/spaced-repetition-arun-thomas).

## Installation
### Requirements
 - MongoDB
 - Node.js

### Instructions
 1. Clone the repository and run
 ```bash
 $ npm install
 ```

 2. Update `config.js` with the URL for your MongoDB instance, and your JWT secret.

 3. To seed your database with questions, use the `seed` script in `package.json`:
 ```bash
 $ npm run seed
 ```

 4. Launch the server
 ```bash
 npm start
 ```
