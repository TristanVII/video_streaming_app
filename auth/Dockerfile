# Base Image
FROM node:21-alpine

# Work directory
WORKDIR /app 

# Copy package files
COPY package.json package-lock.json ./ 

# Install dependencies
RUN npm install 

# Copy source code
COPY . .

# Expose port (adjust if needed)
EXPOSE 3000 

# Start instructions
CMD ["npm", "start"]