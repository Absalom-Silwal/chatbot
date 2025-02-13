import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from models import db,Faq

load_dotenv()

app = Flask(__name__)

#loading app config from config file
#app.config.from_object(Config)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')

db.init_app(app)

# Create all tables in the database 
with app.app_context():
    db.create_all()

@app.route('/ask')
def index():
    #faq = Faq(question="How are you?",answer="I am good")
    #db.session.add(faq)
    #db.session.commit()
    faqs = Faq.query.all()
    faq_list = [{'id':faq.id,'question':faq.question,'answer':faq.answer} for faq in faqs]
    return {'faqs':faq_list}


if __name__ == '__main__':
    app.run(debug=True)
