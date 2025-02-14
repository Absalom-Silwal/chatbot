//import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [question,setQuestion] = useState('');
  const [answer,setAnswer]=useState([]);
  const userQuestion = question?<div class="user-message"><p>{question}</p></div>:'';
  const botAnswer = answer.length?<div class="chatbot-message"><p>{answer[0].answer}</p></div>:'Sorry! Couldnot find the answer';
  function onChangeQuestion(e){
    setAnswer([]);
    setQuestion(e.target.value);
  }

  function callApi(e){
    e.preventDefault();
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
      setAnswer(data.faqs);
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
            <div class="chat-header">
                <h2>FAQ Chatbot</h2>
                <p>Ask me anything!</p>
            </div>

            <div class="chat-box" id="chat-box">
                {userQuestion}
                {userQuestion?botAnswer:''} 
            </div>

            <div class="input-container">
            <textarea type="text" id="user-input" onChange={onChangeQuestion} placeholder="Type your question..." ></textarea>
                <button>Send</button>
            </div>
        </div>

    </form>
   
    </div>
  );
}



export default App;
