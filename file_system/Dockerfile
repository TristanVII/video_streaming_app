# Base Image
FROM golang:1.21-alpine

# Work directory
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download


COPY *.go ./
# Build the application
RUN go build -o /goApp

# Expose port 
EXPOSE 8070

# Start instructions 
CMD ["/goApp"]