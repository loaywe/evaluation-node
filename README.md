# Evaluation Node

An employee evaluation application with a React frontend and a Node.js/Express backend backed by MongoDB.

## Project structure

- `backend/` - Express API, MongoDB models, authentication, evaluation routes, and uploaded files.
- `my-app/` - React frontend built with Create React App, Redux Toolkit, Bootstrap, and Axios.

## Requirements

- Node.js 18 or newer
- npm
- MongoDB, either locally or through MongoDB Atlas

## Configuration

Create or update `backend/.env` with the following values:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=3700
```

Keep secrets out of source control. Use a local environment file for development.

## Installation

Install dependencies for both applications:

```bash
cd backend
npm install

cd ../my-app
npm install
```

## Running the project

Start the backend in one terminal:

```bash
cd backend
node server.js
```

The API is available at `http://localhost:3700`.

Start the React frontend in another terminal:

```bash
cd my-app
npm start
```

The frontend opens at `http://localhost:3000`.

## Main API areas

- `GET /` - backend health message
- `/users` - user registration, login, and user operations
- `/evaluation` - evaluation-related operations
- `GET /uploads/<file>` - access uploaded files

## Production build

Create a production build of the frontend with:

```bash
cd my-app
npm run build
```

## Testing

The frontend test command is:

```bash
cd my-app
npm test
```

The backend currently does not define automated tests.