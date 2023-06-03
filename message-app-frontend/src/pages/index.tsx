import { useState, useEffect } from "react";
import axios from "axios";
import { ChangeEvent, FormEvent } from "react";

type Message = {
  id?: string;
  content: string;
};

const Home = () => {
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get("http://localhost:8080/messages");
      setCurrentMessages(response.data);
    };

    fetchMessages();
  }, []);

  const handleNewMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const handleNewMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message: Message = { content: newMessage };
    try {
      const response = await axios.post<Message>(
        "http://localhost:8080/messages/new",
        message,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setNewMessage("");
      setCurrentMessages([...currentMessages, response.data]); // Use the currentMessages state here
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App p-6">
      <form onSubmit={handleNewMessage} className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          New message:
          <input
            type="text"
            value={newMessage}
            onChange={handleNewMessageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Send
        </button>
      </form>
      <ul>
        {currentMessages.map((message, index) => (
          <li key={index} className="mb-2 bg-gray-200 rounded p-2">
            {message.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
