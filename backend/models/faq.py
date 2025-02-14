from . import db
class Faq(db.Model):
    __tablename__ = 'faqs'

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, unique=True, nullable=False) 
    answer = db.Column(db.Text, unique=True, nullable=False) 
    is_bot_answer = db.Column(db.Boolean,default=0)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime,default=db.func.current_timestamp())