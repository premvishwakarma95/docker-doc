# Use official Node.js 20 image with Alpine Linux (lightweight)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app


# Copy package.json and package-lock.json (if available)
# This helps leverage Docker cache for dependencies.  
COPY package*.json ./

# Install project dependencies
RUN npm install


# Copy all remaining project files into the container
COPY . .

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000

# Expose port 3000 so it can be accessed outside the container
EXPOSE 3000

# Default command to run the app
CMD ["npm", "start"]
