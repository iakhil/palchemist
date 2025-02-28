from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db
import os
import datetime
import logging
from logging.handlers import RotatingFileHandler
import json

# Configure logging
if not os.path.exists('logs'):
    os.mkdir('logs')
file_handler = RotatingFileHandler('logs/palchemist.log', maxBytes=10240, backupCount=10)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))
file_handler.setLevel(logging.INFO)

# Create app
app = Flask(__name__)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)
app.logger.info('Palchemist backend starting')

# Configure CORS based on environment
if os.environ.get('FLASK_ENV') == 'production':
    # In production, only allow specific origins
    allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'https://palchemist.example.com').split(',')
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}})
    app.logger.info(f'CORS configured for production with origins: {allowed_origins}')
else:
    # In development, allow all origins
    CORS(app)
    app.logger.info('CORS configured for development (all origins allowed)')

# Initialize Firebase Admin
try:
    # Get service account path from environment or use default
    service_account_path = os.environ.get(
        'FIREBASE_SERVICE_ACCOUNT',
        os.path.join(os.path.dirname(__file__), 'service_acc.json')
    )
    
    # Get database URL from environment or use default
    database_url = os.environ.get(
        'FIREBASE_DATABASE_URL', 
        'https://palchemist-f50d0-default-rtdb.firebaseio.com'
    )
    
    app.logger.info(f'Initializing Firebase with service account: {service_account_path}')
    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(cred, {
        'databaseURL': database_url
    })
    app.logger.info('Firebase initialized successfully')
except Exception as e:
    app.logger.error(f'Failed to initialize Firebase: {e}')
    # Continue without crashing, but API calls will fail

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.datetime.now().isoformat()
    })

@app.route('/api/scores', methods=['POST'])
def add_score():
    try:
        data = request.json
        
        if not data or 'username' not in data or 'score' not in data:
            return jsonify({'error': 'Missing username or score'}), 400
        
        username = data['username']
        score = data['score']
        
        # Validate data
        if not isinstance(score, int) or score < 0:
            return jsonify({'error': 'Invalid score'}), 400
        
        if not username or len(username) > 20:
            return jsonify({'error': 'Invalid username'}), 400
        
        # Sanitize username
        username = username.strip()
        
        # Get current timestamp
        timestamp = datetime.datetime.now().isoformat()
        
        # Save to Firebase
        ref = db.reference('leaderboard')
        ref.push({
            'username': username,
            'score': score,
            'timestamp': timestamp
        })
        
        app.logger.info(f'Score added: {username} - {score}')
        return jsonify({'success': True, 'message': 'Score added successfully'}), 201
    except Exception as e:
        app.logger.error(f'Error adding score: {e}')
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        # Get optional limit parameter (default to 10)
        limit = request.args.get('limit', default=10, type=int)
        if limit > 100:  # Cap at 100
            limit = 100
        
        # Get scores from Firebase
        ref = db.reference('leaderboard')
        scores = ref.get()
        
        # Convert to list and find highest score per user
        user_best_scores = {}
        if scores:
            for key, value in scores.items():
                username = value['username']
                score = value['score']
                timestamp = value['timestamp']
                
                # If user not in dict or new score is higher, update
                if username not in user_best_scores or score > user_best_scores[username]['score']:
                    user_best_scores[username] = {
                        'username': username,
                        'score': score,
                        'date': timestamp
                    }
        
        # Convert dict to list and sort by score
        leaderboard = list(user_best_scores.values())
        leaderboard.sort(key=lambda x: x['score'], reverse=True)
        
        # Limit to requested number
        leaderboard = leaderboard[:limit]
        
        # Add ranks
        for idx, entry in enumerate(leaderboard):
            entry['rank'] = idx + 1
        
        app.logger.info(f'Leaderboard retrieved with {len(leaderboard)} entries')
        return jsonify({'leaderboard': leaderboard})
    except Exception as e:
        app.logger.error(f'Error retrieving leaderboard: {e}')
        return jsonify({'leaderboard': [], 'error': 'Database error'}), 500

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f'Server Error: {error}')
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # In production, this should be run with gunicorn
    # For development, use the built-in Flask server
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug) 