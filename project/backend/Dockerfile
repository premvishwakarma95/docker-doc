# This is a base image to build node app
FROM node:20-alpine

# Setting up working directory
WORKDIR /app

# Copy .json files
COPY package*.json ./

# Running npm install
RUN npm install --omit=dev

# Copy code
COPY . .

# Set env
ENV NODE_ENV=production

#Expose Port
EXPOSE 5000

# Running Server
CMD ["node", "server.js"]
