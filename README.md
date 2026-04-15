## Here all teh docker images exist.
https://hub.docker.com/  

## Docker commands.
- docker --version
- docker compose -f filename up -d
- docker compose -f docker-compose.yml down
- docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
- docker compose down -v 


---

## 1. What is Docker?
Docker is a tool that lets you package your app + dependencies + environment into a container.  
👉 Think like:
- Your Node.js app
- MongoDB
- Environment variables
- ➡️ All packed into one “box” = container

## 2. Why Docker is Important?
As a MERN/Node dev, Docker helps you:  
- Run MongoDB without installing locally
- Run node without installing locally
- Avoid “works on my machine” bugs
- Easily deploy apps
- Manage multiple services (API + DB + Redis)

## 3. Key Concepts
### 🧱 Image  
- Blueprint/template
- Like a class in OOP
👉 Example: `node:18`, `mongo`

### 📦 Container
- Running instance of an image
- Like an object of a class

### 🐳 Docker Engine
- The system that runs containers

👉 Image = Blueprint  
👉 Container = Running App from that Blueprint  

## 4. Commands.
### Command to pull image from docker hub.
- docker pull node:18
- docker pull mongo

