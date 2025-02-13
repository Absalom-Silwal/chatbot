//import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Button from './Button';

function App() {
  const [question,setQuestion] = useState('');
  function onChangeQuestion(e){
    setQuestion(e.target.value);
  }

  function callApi(e){
    e.preventDefault();
    console.log(question);
    fetch(`http://127.0.0.1:5000/ask`, {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // Content type is JSON
      },
      body: JSON.stringify({'question':question}), // Send the data as JSON
    }).then(function(response){
      if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
    }).then((data)=>{
      console.log(data);
    })
  }
  return (
    <div>
      <header>
        <h1>Smart FAQ Chatbot</h1>
        <p>Ask me anything!</p>
      </header>
    <form onSubmit={callApi}>
      <div class="chat-container">
          <div class="messages" id="messages">
              
          </div>

          <div class="input-area">
              <textarea type="text" id="user-input" onChange={onChangeQuestion} placeholder="Type your question..." ></textarea>
              <button id="send-btn">Send</button>
          </div>
      </div>
    </form>
   
    </div>
  );
}



export default App;
