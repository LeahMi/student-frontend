# Student Management System - Frontend

This is the frontend application for the Student Management System, built with **Angular 21**. It provides an interactive interface for managing students and courses, specifically designed to work with the Spring Boot Backend.

---

## 🐳 Docker Deployment (Recommended)

In 2026, the project is fully containerized. This is the preferred method for running the application in a production-like environment.

### 1. Build the Docker Image

docker build -t student-frontend .

---

### 2. Run the Container

docker run -p 4200:80 student-frontend

The application will be accessible at:  
http://localhost:4200

---

##  Local Development (Without Docker)

### 1. Prerequisites

- Node.js (Latest LTS version)  
- Angular CLI v21.1.0  

---

### 2. Installation

Install the necessary dependencies using npm:

npm install

---

### 3. Running the Development Server

ng serve

Navigate to http://localhost:4200/.  
The app will automatically reload if you change any source files.

---

## 🔌 Backend Integration & CORS

The frontend communicates with the backend API running on:  
http://localhost:8080

- API Base URL: http://localhost:8080/api  
- CORS Support: The backend is configured to allow requests from http://localhost:4200  
- Troubleshooting:  
  If you receive a 403 Forbidden error, ensure the backend is running and its CORS policy is correctly set for your local dev port.

---

## 🛠 Project Structure & Commands

### Code Scaffolding

Generate new components or services:

ng generate component component-name

---

### Building for Production

ng build

The build artifacts will be stored in the dist/ directory, optimized for performance.

---

### Testing

- Unit Tests: ng test (Powered by Vitest)  
- E2E Tests: ng e2e  

---

## 📚 Tech Stack

- Framework: Angular 21  
- Language: TypeScript  
- Styling: CSS/SCSS (Tailwind / Bootstrap ready)  
- Testing: Vitest  
- Deployment: Docker & Nginx  
