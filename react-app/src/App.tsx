import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    setMessage('Hello from React!');

    // Fetch data from the Bun backend
    fetch('/api/react-data')
      .then(response => response.json())
      .then(data => setBackendMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React App</h1>
        <p>{message}</p>
        <p>Message from Backend: {backendMessage}</p>
      </header>
    </div>
  );
}

export default App;
