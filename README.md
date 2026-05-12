# SkillExchange

A full-stack peer-to-peer skill exchange platform where users can teach skills, learn from others, book live sessions, exchange virtual credits, rate sessions, and raise disputes.

---

# Features

- JWT Authentication & Authorization
- Skill Marketplace
- Session Booking System
- Credit Transfer System
- Reviews & Ratings
- Dispute Management
- Responsive User Interface
- REST API Architecture

---

# Tech Stack

## Frontend
- React.js
- JavaScript
- CSS

## Backend
- Spring Boot
- Java
- Spring Security
- JWT Authentication

## Database
- PostgreSQL

## Build Tool
- Maven Wrapper (mvnw)

## Tools
- Git & GitHub
- Postman
- VS Code

---

# Project Structure

```text
frontend/
 ├── src/
 │   ├── api/
 │   ├── components/
 │   ├── pages/
 │   └── styles/

backend/
 ├── controller/
 ├── dto/
 ├── entity/
 ├── repository/
 ├── service/
 └── security/
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Itspavannk/SkillExchange.git
```

---

# Backend Setup

## Run Backend Using Maven Wrapper

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux / Mac

```bash
./mvnw spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

# PostgreSQL Configuration

Update your `application.properties` file:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/skillexchange
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

# Main Functionalities

## Authentication
- User Registration
- User Login
- JWT Security
- Protected APIs

## Skills
- Add Skills
- Browse Skills
- Filter Skills
- View Skill Details

## Booking System
- Book Sessions
- Confirm Sessions
- Cancel Sessions
- Complete Sessions

## Credits System
- Earn Credits
- Transfer Credits
- Spend Credits on Sessions

## Reviews & Disputes
- Add Reviews
- Rate Sessions
- Raise Disputes
- Admin Resolution

---

# Future Enhancements

- Real-time Chat
- Video Call Integration
- Notifications
- Recommendation System
- Admin Dashboard Analytics
- Dark Mode

---

# Author

## Pavan Naik

GitHub:
https://github.com/Itspavannk

---

# License

This project is created for educational and portfolio purposes.
