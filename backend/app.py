from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db
import os
import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Firebase Admin with your service account
# Assuming the JSON file is in the same directory as app.py
service_account_path = os.path.join(os.path.dirname(__file__), 'service_acc.json')
cred = credentials.Certificate(service_account_path)

# Get database URL from environment variable or use a default
database_url = os.environ.get('FIREBASE_DATABASE_URL', 'https://palchemist-f50d0-default-rtdb.firebaseio.com')
firebase_admin.initialize_app(cred, {
    'databaseURL': database_url
})

@app.route('/api/scores', methods=['POST'])
def add_score():
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
    
    return jsonify({'success': True, 'message': 'Score added successfully'}), 201

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    # Get optional limit parameter (default to 10)
    limit = request.args.get('limit', default=10, type=int)
    if limit > 100:  # Cap at 100
        limit = 100
    
    try:
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
        
        return jsonify({'leaderboard': leaderboard})
    except Exception as e:
        # Log the error but return an empty leaderboard instead of failing
        print(f"Error fetching leaderboard: {e}")
        return jsonify({'leaderboard': [], 'error': 'Database not initialized yet'})

if __name__ == '__main__':
    app.run(debug=True) 