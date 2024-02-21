# Base Image
FROM python:3.9

# Work directory
WORKDIR /app/src 

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

# Copy source code
COPY ./src .

# Expose port 
EXPOSE 8000


# Start instructions (adjust if needed)
CMD ["uvicorn", "app:app","--host", "0.0.0.0", "--port", "8000"] 