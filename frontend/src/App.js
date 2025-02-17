import './App.css';
import { useEffect, useRef, useState } from "react";

function App() {
  const [question,setQuestion] = useState('');
  const [serverResponse,setServerResponse] = useState(false);
  let [message,setMessage] = useState('');
  const chatRef = useRef(null);//create a reference of chatBox

  useEffect(() => {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [message,question]); // Runs every time messages and question update
  message += serverResponse?'':(question?`<div class="chat-message user-message">${question}</div>`:'');
  function onChangeQuestion(e){
    setQuestion(e.target.value);
  }

  function onFocusQuestion(e){
    e.preventDefault();
    setServerResponse(false);
  }

  function callApi(e){
    e.preventDefault();
    fetch(`http://127.0.0.1:5000/ask`,{
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({'question':question}), 
    }).then(function(response){
      if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
    }).then((answer)=>{
      setServerResponse(true);
      const newMessage = `${message}<div class="chat-message bot-message" style="align-self: flex-end;">${answer.answer}</div>`;
      setMessage(newMessage);
      setQuestion('');
      document.getElementById('user-input').innerHTML='';
      let chatBox = document.getElementById("chatBox");
      chatBox.scrollTop = chatBox.scrollHeight;
    }).catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      const newMessage = `${message}<div class="chat-message bot-message" style="align-self: flex-end;">Sorry! Couldnot Proceed with the request</div>`;
      setMessage(newMessage);
      setQuestion('');
    });
  }
  return (
    <div>
    <form onSubmit={callApi}>
          <div class="chat-container">
              <div class="chat-header">FAQ chat bot!</div>
              <div ref={chatRef} class="chat-box" id="chatBox" dangerouslySetInnerHTML={{ __html: message }}>
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
