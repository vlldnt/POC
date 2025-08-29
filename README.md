# POC - Personal Project

## Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/vlldnt/POC.git
   cd POC
   ```

2. **Install dependencies**
    ├── bcrypt@6.0.0                # Password hashing
    ├── body-parser@2.2.0           # Parses incoming request bodies
    ├── express@5.1.0               # Web framework for Node.js
    ├── jsonwebtoken@9.0.2          # JWT authentication
    ├── nodemon@3.1.10              # Auto-reload for development
    ├── sequelize@6.37.7            # SQL ORM for models and relations
    ├── sqlite3@5.1.7               # SQLite database driver
    ├── swagger-jsdoc@6.2.8         # Swagger documentation generator
    └── swagger-ui-express@5.0.1    # Swagger documentation
   ```sh
   npm install
   ```
3. **Run the server**
   ```sh
   npm start
   ```
   or for development with auto-reload:
   ```sh
   npm run dev
   ```

## Features

- **User authentication:** (register, login, JWT verification)
- **User profile management:** (view, update, delete)
- **Guide management:** (start a guide, view guides)
- **Pokémon capture tracking:** (add, view, delete caught Pokémon)
- **Swagger API documentation:** at `/api-docs`

## Main API Routes

### Auth

- `POST /api/auth/register`: Register a new user

- `POST /api/auth/login`: Login and receive a JWT token

- `GET /api/auth/verify`: Verify JWT token

### User

- `GET /api/user/`: Get current authenticated user profile

- `PATCH /api/user/`: Update current user profile

- `DELETE /api/user/`: Delete current user account

- `GET /api/user/all`: Get all users (admin only)

- `GET /api/user/{id}`: Get user by ID

### Guides

- `POST /api/userGuides`: Start a new guide for the authenticated user

- `GET /api/userGuides`: Get all user guides

### Caught Pokémon

- `POST /api/caught`: Add a caught Pokémon to the current guide  
  **Body:**  
  ```json
  {
    "guide_id": "GUIDE_UUID",
    "pokemon_id": "001"
  }
  ```

- `DELETE /api/caught/{pokemon_id}`: Delete a caught Pokémon from the current guide

## Documentation

- Interactive API docs available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

Feel free to contribute
