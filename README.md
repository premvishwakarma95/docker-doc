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
- Example we want share our app with test then we shared without docker container mern app with tester then he tried to run it so he isntalled node, mongo etc. but still not working becauase of version compatibility so here docker comes to solve this issue we don't need to install all that things like node, mongo etc. just need to install docker and boom. this is why we use docker.
- Another example if we have two application and one want node version 16 and and second 14 so how we manage here we need two machines or Virtual machine (VM) like EC2 so here docker solved that problem. just pull the image according to that version and use it. 

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
- It is stand alone machine.
- Running instance of an image
- Like an object of a class

### 🐳 Docker Engine
- The system that runs containers

👉 Image = Blueprint  
👉 Container = Running App from that Blueprint  

## 4. Main components of docker.
- Docker file
- Docker image
- Docker container
- Docker registry
- <img width="1112" height="531" alt="image" src="https://github.com/user-attachments/assets/4f9741fd-1bed-43a3-8da2-caaf423594cc" />

## 5. How to create Dockerfile.
Please check i have added `client` folder where i have created file after this we create image that we create container of that.


## 6. Commands.
### Command to pull image from docker hub.
- `docker build . ` - Command to create a Docker image from your project. Run this command in current directory where Dockerfile exists.
- `docker image ls` - command to list images. You can get your image id and info about the image.
- `docker run <image_id>` - This command creates and starts a container from an image.
- `docker ps` - command to list containers. You can see container id and name.
- `docker stop <container_name>` - command to stop container.

- docker pull node:18
- docker pull mongo

