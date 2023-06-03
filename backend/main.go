package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/rs/cors"
)

type Message struct {
	ID      string `json:"id"`
	Content string `json:"content"`
}

var messages = []Message{}

func getMessagesHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(messages)
}

func postMessageHandler(w http.ResponseWriter, r *http.Request) {
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}

	var newMessage Message
	json.Unmarshal(bodyBytes, &newMessage)
	newMessage.ID = uuid.New().String()
	messages = append(messages, newMessage)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newMessage)
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/messages", getMessagesHandler)
	mux.HandleFunc("/messages/new", postMessageHandler)

	handler := cors.Default().Handler(mux)

	http.ListenAndServe(":8080", handler)
}
