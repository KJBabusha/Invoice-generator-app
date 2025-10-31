# InvoiceGen (MERN)

A minimal MERN stack invoice generator.

## Features
- Create, view, and manage invoices
- User authentication
- JSON REST API with MongoDB backend
- React frontend

## Prerequisites
- Node.js (16+)
- MongoDB (local or Atlas)

## Quick start
1. Clone the repo
    ```bash
    git clone <repo-url>
    cd InvoiceGen
    ```
2. Install dependencies
    ```bash
    # server
    cd server
    npm install

    # client
    cd ../client
    npm install
    ```
3. Configure environment (server/.env)
    ```
    MONGO_URI=<your-mongo-uri>
    PORT=5000
    JWT_SECRET=<secret>
    ```
4. Run
    ```bash
    # start server
    cd server
    npm run dev

    # start client (separate terminal)
    cd ../client
    npm start
    ```

## Notes
- Keep env secrets out of source control.
- Add tests and CI as needed.

## License
MIT