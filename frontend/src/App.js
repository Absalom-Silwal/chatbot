//import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [question,setQuestion] = useState('');
  const [answer,setAnswer]=useState([]);
  const [serverResponse,setServerResponse] = useState(false);
  let [message,setMessage] = useState('');
  //const userQuestion = question?<div class="user-message"><p>{question}</p></div>:'';
  //const botAnswer = serverResponse?(answer?<div class="chatbot-message"><p>{answer.answer}</p></div>:'Sorry! Couldnot find the answer'):"";
  message += serverResponse?'':(question?`<div class="chat-message user-message">${question}</div>`:'');
    //setMessage(messageEle);
  function onChangeQuestion(e){
    //setAnswer([]);
    setQuestion(e.target.value);
    //serverResponse?setMessage(`${message}<div class="user-message"><p>${question}</p></div>`):setMessage(`<div class="user-message"><p>${question}</p></div>`);
    //console.log(messages);
  }

  function onFocusQuestion(e){
    e.preventDefault();
    setServerResponse(false);
  }

  function callApi(e){
    e.preventDefault();
    //setMessage(`${message}<div class="user-message"><p>${question}</p></div>`)
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
    }).then((answer)=>{
      setServerResponse(true);
      //setAnswer(data);
      const newMessage = `${message}<div class="chat-message bot-message" style="align-self: flex-end;">${answer.answer}</div>`;
      setMessage(newMessage);
      setQuestion('');
      document.getElementById('user-input').innerHTML='';
    }).catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      //alert("Failed to fetch response from the server. Please try again later.");
      const newMessage = `${message}<div class="chat-message bot-message" style="align-self: flex-end;">Sorry! Couldnot Proceed with the request</div>`;
      setMessage(newMessage);
    });
  }
  return (
    <div>
    <form onSubmit={callApi}>
          <div class="chat-container">
              <div class="chat-header">FAQ chat bot!</div>
              <div class="chat-box" id="chatBox" dangerouslySetInnerHTML={{ __html: message }}>
              </div>
              <div class="chat-input">
                  <input type="text" id="user-input" value={question} onFocus={onFocusQuestion} onChange={onChangeQuestion} placeholder="Hello.. I'm listening! Go on.."></input>
                  <button >▶</button>
              </div>
          </div>

    </form>
   
    </div>
  );
}



export default App;
