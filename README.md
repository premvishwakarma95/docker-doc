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
<img width="1112" height="531" alt="image" src="https://github.com/user-attachments/assets/4f9741fd-1bed-43a3-8da2-caaf423594cc" />

## 5. How to create Dockerfile.
Check below this is a docker file for client i mean for reactjs.
```bash
FROM node:22

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
```


## 6. Commands.
### Command to pull image from docker hub.
- `docker build . ` - Command to create a Docker image from your project. Run this command in current directory where Dockerfile exists.
- `docker build -t client-app .` - command to give images name `-t` stands for tag name now image name would be client-app.
- `docker image ls` - command to list images. You can get your image id and info about the image.
- `docker images -a` - command to list images if image name is not given because `docker image ls` will not show list so use thhis one.
- `docker rmi <image_name_or_id>` - command to delete docker image.
- `docker run <image_id>` - This command creates and starts a container from an image. But this will not be accessible in browser because it's running in it's environment or standalone system. so we use another command to expose all the environments Check below command.
- `docker run -p 3000:3000 <image_id>` - command to create and start container for all system i mean we can access in any sytem by this command.
- `docker run --name my-client -p 5173:5173 client-app` - command to create and start container with name.
- `docker run -d --name my-client -p 5173:5173 client-app` - Command to run container in background. detached mode.
- `docker run -d --rm --name my-client -p 5173:5173 client-app` - command to run and automatically delete container when we stop the container so we use --rm.
- `docker ps` - command to list containers. You can see container id and name.
- `docker stop <container_name>` - command to stop container.
- `docker run -it <image_name_or_id>` - command to run container in a interactive way. -it stand for interactive terminal.
- `docker logs <container_name>` - command to see logs of any container.
- Full flow when we do changes or update on code or dependency to rebuild and restart the image and container.
```bash
  # after code change
docker build -t client-app .

# remove old container
docker rm -f client-container

# run new container
docker run -d --name client-container -p 5173:5173 client-app
```

---

# 🚀 Steps to Push Docker Image to Docker Hub

---

## 1. Go to your project folder

```bash
cd docker-mern-app/client
```

(or go to `server` if pushing backend)

---

## 2. Build Docker Image

```bash
docker build -t client-app .
```

---

## 3. Login to Docker Hub

```bash
docker login
```

Enter your:

* Username
* Password

---

## 4. Create Repository on Docker Hub

* Open https://hub.docker.com
* Click **Create Repository**
* Give name: `client-app`

---

## 5. Tag the Image

```bash
docker tag client-app <your-username>/client-app:latest
```

### Example:

```bash
docker tag client-app premvishwakarma/client-app:latest
```

---

## 6. Push Image to Docker Hub

```bash
docker push <your-username>/client-app:latest
```

### Example:

```bash
docker push premvishwakarma/client-app:latest
```

---

## 7. Verify on Docker Hub

* Go to your repository
* Check if image is uploaded

---

## 8. Pull Image Anywhere

```bash
docker pull <your-username>/client-app:latest
```

---

## 🔁 Full Flow (Quick)

```bash
docker build -t client-app .
docker login
docker tag client-app <your-username>/client-app:latest
docker push <your-username>/client-app:latest
```

---

# Docker Volume.
To store data in a Docker volume, you use the -v (or --volume) flag while running a container.  
📦 1. Create and use a volume (basic)  
```bash
docker run -v my-volume:/data nginx
```

2. Full commmand.  
```bash
docker run -d \
  --name server-container \
  -p 5000:5000 \
  -v server-data:/server/data \
  server-app

// Command in one line.
docker run -d --name server-container -p 5000:5000 -v server-data:/server/data server-app

// 💾 -v server-data:/server/data
// 👉 Volume mapping (VERY IMPORTANT)
// volume_name : container_path
// server-data → Docker volume (persistent storage)
// /server/data → folder inside container
```

3. command to see volume list
```bash
docker volume ls
```

---

# What is a Bind Mount?
It won't create volume just make container file to local file realtime changes.
```bash
your-local-folder  ↔  container-folder
```
- Changes on your system → instantly visible in container
- Changes in container → reflect on your system
```bash
docker run -v <local-path>:<container-path> <image>
```
- Example
```bash
docker run -d -p 5173:5173 -v ./client:/app client-app
```
Meaning
- ./client → your local project folder
- /app → inside container

---

# How to take pull of an image from docker registry.
run command to take pull
```bash
docker pull mysql
docker run mysql
