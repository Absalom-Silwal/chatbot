import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from models import db,Faq
from flask_cors import CORS
from sqlalchemy import text


load_dotenv()

app = Flask(__name__)
CORS(app)
#loading app config from config file
#app.config.from_object(Config)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')

db.init_app(app)

# Create all tables in the database 
with app.app_context():
    db.create_all()
@app.route('/ask',methods=['POST'])
def ask():
    try:
        data = request.get_json()
        question = data.get('question')
        faqs = db.session.execute(text("SELECT * FROM faqs WHERE question ILIKE :question LIMIT 1"), {'question': f'%{question}%'})
      
        #faq = Faq(question="How are you?",answer="I am good")
        #db.session.add(faq)
        #db.session.commit()
        #if not faqs:
         #   faqs = Faq.query.all()
        faq_list = [{'id':faq.id,'question':faq.question,'answer':faq.answer} for faq in faqs]
        return {'faqs':faq_list}
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
