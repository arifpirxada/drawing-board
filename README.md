# Drawing Board

A real-time web drawing application that lets users create, edit, and share drawings seamlessly. Built with React for a responsive and interactive frontend, and FastAPI for a fast, scalable backend API. Supports features like multiple drawing tools, live updates, and saving your work.


## Run application using Docker

### 1. Create env files

#### I. Root Directory

- First Generate a JWT Secret Key

**Note** **.env** is for development and **.env.prod** is for production

Create two env files

  - .env
    ```
    # Client
    VITE_API_URL=http://localhost:8000/api
    VITE_SERVER_URL=http://localhost:8000

    # Server
    DB_USER=postgres
    DB_PASSWORD=postgres
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=drawingboard

    JWT_SECRET_KEY="your_generated_secret_here"
    JWT_ALGORITHM="HS256"

    CLIENT_URL=http://localhost:5173
    ```
  - .env.prod
    ```
    Same variables as above .env just change just fill production values
    ```

#### II. Client
Go to client directory and create two env files: .env
  - .env 
    ```
    VITE_API_URL=http://localhost:8000/api
    VITE_SERVER_URL=http://localhost:8000
    ```

#### III. Server
Now in server directory create .env file   
Modify the **JWT_SECRET_KEY** and **JWT_ALGORITHM** and other variables as you want
  - .env
    ```
    DB_USER=postgres
    DB_PASSWORD=postgres
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=drawingboard

    JWT_SECRET_KEY="[your_generated_secret_here]"
    JWT_ALGORITHM="HS256"

    CLIENT_URL=http://localhost:5173
    ```

### 2. Build and Run the application using **Docker compose**

#### Development

Run
```bash
docker compose build
```

```
docker compose up -d
```

Now access client:
```
http://localhost:5173/
```

and server:
```
http://localhost:3000/
```

##### Production

```bash
docker compose -f docker-compose.prod.yml build
```

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up
```

Client:
```
http://localhost:80/
```

Server:
```
http://localhost:8000/
```
