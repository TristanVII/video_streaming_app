# Stage 1: Build the Angular application
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY ./upload-front-end ./

# Install dependencies
RUN npm install


# Build the Angular app for production
RUN npm run build

# Stage 2: Serve the built Angular app using Nginx
FROM nginx:alpine

COPY --from=build /app/dist/upload-front-end /usr/share/nginx/html

EXPOSE 4200

# Command to start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
