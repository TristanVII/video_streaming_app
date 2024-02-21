package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// Not good, to redo
var s3Client *s3.Client
var presignClient *s3.PresignClient

const (
	REGION = "us-west-2"
	BUCKET = "s3gotest"
)

func urlHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	var requestBody struct {
		S3Key string `json:"s3_key"`
	}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		return
	}

	url, err := getPresignURL(requestBody.S3Key)

	if err != nil {
		http.Error(w, "Failed to get URL", http.StatusUnprocessableEntity)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(url))

}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// 1. Retrieve the MP4 file
	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, r.Body); err != nil {
		fmt.Println("Error reading file:", err)
		http.Error(w, "Error reading file", http.StatusInternalServerError)
		return
	}
	fmt.Println(buf)

	// 2. Determine filename (if provided by client)
	filename := r.Header.Get("File-Name") // Check for filename hints
	if filename == "" {
		http.Error(w, "No File Name", http.StatusUnprocessableEntity)
		return
	}

	// 3. Upload to S3
	if err := uploadToS3(buf, filename); err != nil {
		fmt.Println("Error uploading to S3:", err)
		http.Error(w, "Error uploading to S3", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("succesfully saved to S3"))
}

func uploadToS3(data *bytes.Buffer, filename string) error {
	output, err := s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String("s3gotest"),
		Key:    aws.String(filename),
		Body:   data,
	})
	fmt.Println(output)
	return err
}

func getPresignURL(key string) (string, error) {
	presignedUrl, err := presignClient.PresignGetObject(context.Background(),
		&s3.GetObjectInput{
			Bucket: aws.String(BUCKET),
			Key:    aws.String(key),
		},
		s3.WithPresignExpires(time.Minute*15))
	if err != nil {
		fmt.Println("Error")
	}
	return presignedUrl.URL, err
}

func main() {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(REGION))
	if err != nil {
		fmt.Println("Error reading loading default config")
	}

	s3Client = s3.NewFromConfig(cfg)
	presignClient = s3.NewPresignClient(s3Client)
	http.HandleFunc("/upload", uploadHandler)
	http.HandleFunc("/url", urlHandler)
	http.ListenAndServe(":8070", nil)

}
