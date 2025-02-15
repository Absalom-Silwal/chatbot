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

client = OpenAI(
    api_key= os.getenv('OPEN_API_KEY')
) 

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
    

@app.route('/ask',methods=['POST'])
def ask():
    try:
        data = request.get_json()
        question = data.get('question')
        clean_str = question.replace(' ','').lower()
        print(clean_str)
        faq_dict = {}
        faq = db.session.execute(
                    text("SELECT *,(TO_CHAR(current_timestamp,'YYYY-MM-DD')::date - TO_CHAR(updated_at,'YYYY-MM-DD')::date) AS days_diff FROM faqs WHERE lower(replace(question,' ','')) LIKE :question LIMIT 1"),
                    {'question': f'%{clean_str}%'}
                ).fetchone()
        if (faq and not faq.is_bot_answer) :
            faq_dict = {
                "answer": faq[2]
            }
            return jsonify(faq_dict)
        elif (faq and faq.is_bot_answer and faq.days_diff < 30):
            faq_dict = {
                "answer": faq[2]
            }
            return jsonify(faq_dict)
        else:
            # response = client.chat.completions.create(
            #     model="gpt-4o-mini",
            #     messages=[{"role": "user", "content": question}],
            # )
            # answer = response.choices[0].message.content
            # if faq and faq.is_bot_answer and faq.days_diff >= 30:
            #     faq.answer = answer
            #     faq.is_bot_answer = 1
            #     faq.updated_at = db.func.current_timestamp()
            #     db.session.commit()
            # else:
            #     new_faq = Faq(question=question,answer=answer,is_bot_answer=1)
            #     db.session.add(new_faq)
            #     db.session.commit()
            # faq_dict={
            #     "answer":answer
            # }
            return jsonify(faq_dict)      
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
