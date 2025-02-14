import os
import json
from flask import Flask, request, jsonify,Response
from dotenv import load_dotenv
from models import db,Faq
from flask_cors import CORS
from sqlalchemy import text
from openai import OpenAI

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')

client = OpenAI() 

db.init_app(app)
def seeder():
    with open('seeder.json', 'r') as file:
        seeders = json.load(file)
        for faq in seeders['seeders']:
            question = faq.get('question')
            db_check = db.session.execute(text("SELECT * FROM faqs WHERE question ILIKE :question LIMIT 1"), {'question': f'%{question}%'}).fetchone()
            if not db_check:
                answer = faq.get('answer')
                new_faq = Faq(question=question, answer=answer)
                db.session.add(new_faq)
        db.session.commit()

# Create all tables in the database 
with app.app_context():
    db.create_all()
    seeder()
    

@app.route('/ask',methods=['GET'])
def ask():
    try:
        #data = request.get_json()
        #question = data.get('question')
        question = "test?"
        faq_dict = {}
        faq = db.session.execute(text("SELECT * FROM faqs WHERE question ILIKE :question LIMIT 1"), {'question': f'%{question}%'}).fetchone()
        if faq:
            faq_dict = {
                "answer": faq[2]
            }
            #connect to openai
            return jsonify(faq_dict)

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": "hey"}],
            stream=True,
        )
        print(response)
        return jsonify(faq_dict)
        #faq = Faq(question="How are you?",answer="I am good")
        #db.session.add(faq)
        #db.session.commit()
        #if not faqs:
         #   faqs = Faq.query.all()
        #faq_list = [{'id':faq.id,'question':faq.question,'answer':faq.answer} for faq in faqs]
        #return {'faqs':faq_list}
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
