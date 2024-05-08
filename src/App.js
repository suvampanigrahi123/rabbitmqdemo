import logo from './logo.svg';
import './App.css';
import Stomp from 'stompjs';
import { useEffect, useState } from 'react';
function App() {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to WebSocket endpoint
    const socket = new WebSocket('ws://54.79.168.200:15674/ws');
    const stomp = Stomp.over(socket);

    // Connect to STOMP
    stomp.connect({}, () => {
      console.log('Connected to WebSocket');
      setStompClient(stomp);
      
      // Subscribe to topic
      stomp.subscribe('/queue/suvam', (message) => {
        console.log("Message---------------", message);
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage?.orderId]);
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
      stompClient.send('/queue/satya', {}, JSON.stringify({ orderId: 'Hello Satya!' }));
    }
  };
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
