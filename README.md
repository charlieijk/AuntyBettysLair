# Aunty Betty's Lair

A Flask-based web game where players navigate through Aunty Betty's mysterious lair as different characters. Players can compete on a leaderboard by achieving high scores in a countdown-based challenge.

## Features

- **Character Selection**: Choose from multiple characters to play the game
- **User Authentication**: Register and login system with secure password hashing
- **Score Tracking**: Stores player scores with countdown times
- **Leaderboard**: View high scores from all players
- **Interactive Gameplay**: Navigate through Aunty Betty's lair with your chosen character

## Tech Stack

- **Backend**: Flask (Python)
- **Database**: SQLite
- **Forms**: Flask-WTF with WTForms
- **Authentication**: Werkzeug security for password hashing
- **Frontend**: HTML templates with Jinja2

## Installation

1. Clone the repository:
```bash
git clone https://github.com/charlieijk/AuntyBettysLair.git
cd AuntyBettysLair
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install flask flask-wtf wtforms werkzeug
```

4. Initialize the database:
```bash
python database.py
```

## Usage

1. Run the application:
```bash
python run.py
```

Or directly:
```bash
flask run
```

2. Open your browser and navigate to:
```
http://127.0.0.1:5001
```

3. Register a new account, select a character, and start playing!

## Project Structure

```
AuntyBettysLair/
├── app.py              # Main Flask application
├── database.py         # Database connection handler
├── forms.py            # WTForms for registration and login
├── schema.sql          # Database schema
├── run.py              # Application entry point
├── app.db              # SQLite database
├── static/             # Static files (CSS, JS, images)
├── templates/          # HTML templates
│   ├── index.html
│   ├── characters.html
│   ├── auntybettyslair.html
│   ├── howtoplay.html
│   ├── home.html
│   ├── register.html
│   ├── login.html
│   └── leaderboard.html
└── .flaskenv           # Flask environment variables
```

## Routes

- `/` - Home page
- `/characters` - Character selection
- `/auntybettyslair` - Main game area
- `/howtoplay` - Game instructions
- `/register` - User registration
- `/login` - User login
- `/home` - User home page (after login)
- `/leaderboard` - View high scores
- `/signout` - Logout

## Database Schema

### Users Table
- `id` (INTEGER, Primary Key)
- `username` (TEXT, Unique, Not Null)
- `password` (TEXT, Not Null)

### Scores Table
- `username` (VARCHAR(50), Not Null)
- `score` (INT, Not Null)
- `countdown` (FLOAT, Not Null)

## Security Note

The application currently uses a hardcoded secret key. For production deployment, please:
1. Set a secure random secret key
2. Use environment variables for sensitive configuration
3. Enable HTTPS
4. Review and update security settings

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

This project is available for educational purposes.

## Author

Charlie - [GitHub Profile](https://github.com/charlieijk)
