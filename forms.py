from flask_wtf import FlaskForm 
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import InputRequired, DataRequired

class RegisterForm(FlaskForm): 
    username = StringField("Username: ", validators=[InputRequired()])
    password = PasswordField("Password: ", validators=[InputRequired()])
    confirm_password = PasswordField("Confirm Password:", validators=[InputRequired()])
    submit = SubmitField("Submit")

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')
