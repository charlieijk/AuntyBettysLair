from flask import Flask, render_template, request, session, redirect, url_for, flash, g
from forms import RegisterForm, LoginForm
from database import get_db
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from werkzeug.exceptions import BadRequest
import os
import logging

app = Flask(__name__)
app.config["SECRET_KEY"] = "this-is-my-secret-key"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.errorhandler(400)
def handle_bad_request(e):
    # Don't log SSL handshake errors (they appear as garbled text)
    error_str = str(e)
    if not any(ord(c) > 127 for c in error_str[:50]):  # Skip non-ASCII errors
        logger.warning(f"Bad request from {request.remote_addr}: {e}")
    return "Bad Request", 400

@app.errorhandler(500)
def handle_internal_error(e):
    logger.error(f"Internal server error: {e}")
    return "Internal Server Error", 500

def login_required(view): 
    @wraps(view)
    def wrapped_view(*args, **kwargs): 
        if g.user is None: 
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view

@app.route('/')
def index():
    print(os.getcwd())
    return render_template('index.html')


@app.route('/characters')
def characters():
    return render_template('characters.html')

@app.route('/auntybettyslair')
def auntybettyslair():
    character = session['characterName']
    return render_template('auntybettyslair.html', character=character)

@app.route('/howtoplay')
def howtoplay(): 
    return render_template('howtoplay.html')

@app.route('/update_session', methods=['POST'])
def update_session():
    session['characterName'] = request.form.get('character', 'default_value')
    print(session['characterName'])
    return 'Session updated'

@app.route("/register", methods=["GET", "POST"])
def register():
    register_form = RegisterForm()
    if register_form.validate_on_submit():
        db = get_db()
        username = register_form.username.data
        password = generate_password_hash(register_form.password.data)
        try:
            db.execute("""INSERT INTO users (username, password) VALUES (?, ?)""", (username, password))
            db.commit()
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login')) 
        except db.IntegrityError:
            flash('Username is already taken.', 'error')
    return render_template("register.html", register_form=register_form)

@app.route("/login", methods=["GET", "POST"])
def login():
    login_form = LoginForm()
    if login_form.validate_on_submit():
        db = get_db()
        username = login_form.username.data
        password = login_form.password.data
        user = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        if user is None:
            login_form.username.errors.append("No such username!")
        elif not check_password_hash(user["password"], password):
            login_form.password.errors.append("Incorrect password")
        else:
            session.clear()
            session['username'] = username
            return redirect(url_for('home'))

    return render_template("login.html", login_form=login_form)


@app.route('/home')
def home(): 
    return render_template('home.html')

@app.route("/store_score", methods=["POST"])
def store_score(): 
    session['score'] = request.form.get('score', 'default_value')
    session['countdown'] = request.form.get('countdown', 'default_value')

    db = get_db()
    username = session['username']
    score = session['score']
    countdown = session['countdown']
    db.execute("INSERT INTO scores (username, score, countdown) VALUES (?, ?, ?)", (username, score, countdown))
    db.commit()
    db.close()
    return "score"

@app.route("/leaderboard", methods=["GET"])
def leaderboard(): 
    db = get_db()
    results = db.execute("SELECT * FROM scores").fetchall()
    for row in results:
        username, score, countdown = row
        print(username, score, countdown)
    db.close()

    return render_template("leaderboard.html", results=results)


@app.route('/signout')
def signout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    # Option 1: Run with HTTP (default) - using port 5001 to avoid conflicts
    app.run(debug=True, host='127.0.0.1', port=5001)
    
    # Option 2: Run with HTTPS (uncomment the line below and comment the line above)
    # app.run(debug=True, host='127.0.0.1', port=5001, ssl_context='adhoc')

