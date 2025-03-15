# 📘 Project Setup Guide

This guide will help you **set up** and **run** the project using **Docker & PostgreSQL**.

## 🚀 Prerequisites
Before running the project, ensure you have installed:

- **[Docker](https://www.docker.com/get-started)**
- **[Node.js](https://nodejs.org/en/download)**
- **[pgAdmin (Web-based Database Management for PostgreSQL)](https://www.pgadmin.org/download/)** _(optional but recommended)_

----------------------------------------------------------------------------------------------------

## 📌 Step 1: Clone the Repository (can skip if already have the project)

git clone <your-repository-url>
cd <your-project-folder>
-----------------------------------------------------------------------------------------

## 📌 Step 2: Install Dependencies

Inside the project folder,open terminal and  run:
npm i

----------------------------------------------------------------------------------------------------

## 📌 Step 3: Start Docker Containers

To start **PostgreSQL in Docker**,open terminal and run:
docker-compose up -d

✅ This will start PostgreSQL in the background.

To **stop** the Docker container, run:(In case if you want to stop the docker service)
docker-compose down
---------------------------------------------------------------------------------------------------------

## 📌 Step 4: Setup pgAdmin

1️⃣ **Open pgAdmin in your browser**:  
👉 Go to **[http://localhost:5050](http://localhost:5050)**  

2️⃣ **Log in with**:

   ```
   Email: admin@admin.com
   Password: admin
   ```

3️⃣ **Connect pgAdmin to PostgreSQL**:

- Right Click on **"Servers -> Register -> Server..."**  

- In General give name **Docker Postgres**,

- Now Go to the **Connection tab** and fill with the below fields:

  - **Host name/address:** `postgres`
  - **Port:** `5432`
   - **Maintenance database:** `question_db`
  - **Username:** `postgres`
  - **Password:** `admin`

----------------------------------------------------------------------------------------

## 📌 Step 5: Start the NestJS Server

Now, start the **NestJS backend** go to project -> terminal and run:

npm run start:dev

✅ **The server will start running on:**  
👉 **[http://localhost:8001](http://localhost:8001)** _(or your configured port)_

-----------------------------------------------------------------------------------------------

## 📌 Step 6: Create and Run Database Migrations

Once PostgreSQL is running, **run the command in the terminal**:

1️⃣ **Generate migrations**:
   npm run migration:generate

2️⃣ **Run migrations**:
   npm run migration:run

✅ **This will create the necessary database tables.**

--------------------------------------------------------------------------------------------------

## 📌 Step 7: Test APIs in Swagger

Open your browser and go to:
👉 **[http://localhost:8001/api](http://localhost:8001/api)**  

📌 This will open the **Swagger API documentation** where you can test all available endpoints.

---------------------------------------------------------------------------------------------------

## 🎯 Summary of Commands

| **Command** | **Description** |
|------------|---------------|
| `npm install` | Install dependencies |
| `docker-compose up -d` | Start PostgreSQL in Docker |
| `docker-compose down` | Stop Docker containers |
| `npm run start:dev` | Start the NestJS server |
| `npm run migration:generate` | Generate migrations |
| `npm run migration:run` | Apply migrations to the database |

----------------------------------------------------------------------------------------------

## NOTE: When exiting/closing the project do close the docker service

Run " docker-compose down " in the terminal

## ✅ You're all set! 
