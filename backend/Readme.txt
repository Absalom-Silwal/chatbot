# Smart Chatbot Using OpenAI's API for Answering FAQs

## Overview
This project is a smart chatbot designed to provide automated responses to frequently asked questions (FAQs). 

## Tech Stack
- Backend: Flask (Python)
- Frontend: React.js
- Database: PostgreSQL
- API: OpenAI's GPT API


## Installation and Setup
### Prerequisites
- Python 3.x
- Node.js & npm
- PostgreSQL database
- OpenAI API key

### Backend Setup (Flask)
1. Navigate to the backend directory:

   cd chatbot/backend

2. Create and activate a virtual environment:
 
   python -m venv venv
   venv\Scripts\activate

3. Install dependencies:

   pip install -r requirements.txt
 
4. Set up environment variables:

   OPENAI_API_KEY="your_openai_api_key"
   SQLALCHEMY_DATABASE_URI = ="postgresql://user:password@localhost:5432/chatbot"
   SQLALCHEMY_TRACK_MODIFICATIONS = False

 
5. Run the Flask server:

   python app.py


### Frontend Setup (React.js)
1. Navigate to the frontend directory:
   
   cd ../frontend
 
2. Install dependencies:

   npm install
 
3. Start the React development server:

   npm start
 


