import logo from './logo.svg';
import './App.css';
import Stomp from 'stompjs';
import { useEffect, useState } from 'react';
function App() {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to WebSocket endpoint
    const socket = new WebSocket('ws://127.0.0.1:15674/ws');
    const stomp = Stomp.over(socket);

    // Connect to STOMP
    stomp.connect({}, () => {
      console.log('Connected to WebSocket');
      setStompClient(stomp);
      
      // Subscribe to topic
      stomp.subscribe('/topic/messages', (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage?.message]);
      });
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);
  const sendMessage = () => {
    if (stompClient) {
      stompClient.send('/queue/my_queue', {}, JSON.stringify({ message: 'Hello RabbitMQ!' }));
    }
  };
  console.log('MEsagggggggggggggg',messages);
  return (
    <div className="App">
     <div>
      <h1>Messages:</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <button onClick={sendMessage}>Send Message</button>
    </div>
    </div>
  );
}

export default App;
