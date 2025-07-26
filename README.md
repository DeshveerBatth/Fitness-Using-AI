# Fitness-Using-AI

A modern, AI-powered fitness tracking platform built with a microservices architecture using Spring Boot, integrated with advanced user authentication, RabbitMQ event messaging, scalable data storage, and a React-based web frontend.


---

## 🚀 Features

- **User Registration & Login:** Secure authentication via Keycloak (OIDC), supporting both sign up and sign in.
- **Activity Tracking:** Log activities with full details (activity name, duration, calories burned).
- **AI-Powered Suggestions:** Get personalized workout and nutrition suggestions using Gemini AI APIs.
- **Microservices Architecture:** 6 Spring Boot microservices, each handling a separate business domain for modularity and scalability.
- **Real-time Messaging:** Services communicate asynchronously using RabbitMQ.
- **Data Persistence:** Data stored across MongoDB and PostgreSQL databases, managed via Docker.
- **Robust API Gateway:** All backend endpoints are accessed securely through a centralized Spring Cloud Gateway.
- **Modern Frontend:** Responsive, intuitive React web interface, built with npm modules.
- **Fully Containerized:** All components are dockerized for easy deployment with Docker Compose.

---

## 🖥️ How It Works

1. **Sign Up / Sign In**  
   - New users register or log in through Keycloak on the frontend.
2. **Add Activity**  
   - After authentication, users can add activities (e.g., "Jogging", 30min, 250 calories).
3. **AI Suggestions**  
   - The AI service uses Gemini AI to provide fitness and nutrition recommendations.
   - Suggestions are displayed to the user and saved for future reference.
4. **Persist & View**  
   - All user data, activities, and AI suggestions are stored securely in MongoDB and PostgreSQL, accessible across devices.
5. **Gateway & Security**  
   - All API requests are routed through the API Gateway for security and access control via Keycloak.

---

## 🏗️ Tech Stack

| Layer          | Technology                       |
|----------------|----------------------------------|
| Frontend       | React, npm, Axios, CSS Modules   |
| API Gateway    | Spring Cloud Gateway             |
| Authentication | Keycloak (OIDC), Spring Security |
| Microservices  | Spring Boot (Java)               |
| Messaging      | RabbitMQ                         |
| Databases      | MongoDB, PostgreSQL              |
| AI Integration | Gemini AI API                    |
| DevOps         | Docker, Docker Compose           |

---

## 🐳 Quick Start (Local/Remote)

### Prerequisites

- Docker & Docker Compose
- Node.js and npm
- (For remote setup: access to a cloud VM, e.g., Ubuntu)

### 1. Clone & Configure

git clone https://github.com/DeshveerBatth/Fitness-Using-AI.git

cd Fitness-Using-AI


### 2. Environment Variables

- Copy `.env.example` to `.env` in each microservice (examples provided).
- Update variables: database URIs, RabbitMQ credentials, Gemini API keys, etc.

### 3. Build Frontend

cd frontend

npm install

npm run build

cd ..


### 4. Launch All Services

docker-compose up --build -d


### 5. Access the App

- Go to `http://<server-ip>:8080` (replace with your actual server IP).

---

## ✨ Screenshots

<!-- Add Google Drive or image links here -->
<!-- Example: [View Screenshots](https://drive.google.com/your-screenshot-folder) -->

---

## 📚 Project Structure

Fitness-Using-AI/

├── user-service/

├── activity-service/

├── ai-service/

├── gateway-service/

├── config-server/

├── eureka-server/

├── frontend/

├── docker-compose.yml

└── README.md


---

## 📝 API Usage

> All endpoints require valid authentication via Keycloak.

- **Register a User**  
  `POST http://localhost:8080/api/users/register`  
  _Body: user details JSON_

- **Get User by ID**  
  `GET http://localhost:8080/api/users/{userId}`

- **Validate User**  
  `GET http://localhost:8081/api/users/{userId}/validate`

- **Register Activity**  
  `POST http://localhost:8082/api/activities`  
  `POST http://localhost:8080/api/activities`  

- **Get Activity by Activity ID**  
  `GET http://localhost:8080/api/activities/{activityId}`

- **Get AI Recommendations for User**  
  `GET http://localhost:8080/api/recommendations/user/{userId}`

- **Get Gemini AI Response for Activity**  
  `GET http://localhost:8083/api/recommendations/activity/{activityId}`

- (_Many more API endpoints are available; see code for details._)

---

## 👤 Author

**Deshveer Singh**

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue to discuss big changes or new features before submitting code.

---

## ⚖️ License

[MIT](LICENSE) — Free to use, modify, and build on!

---

> _Empowering everyone to get healthier, using modular open-source tech + AI!
