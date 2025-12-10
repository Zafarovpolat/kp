"""
KP Generator Server for Render.com
Обслуживает статику + API прокси для Gemini
"""

from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import requests
import os

app = Flask(__name__, static_folder='app', static_url_path='')
CORS(app)

# ============================================================
# GEMINI API CONFIG
# ============================================================
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
GEMINI_MODEL = 'gemini-2.0-flash'
GEMINI_API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent'

# ============================================================
# STATIC FILES
# ============================================================
@app.route('/')
def index():
    return send_from_directory('app', 'index.html')

@app.route('/generator.html')
def generator():
    return send_from_directory('app', 'generator.html')

@app.route('/styles.css')
def styles():
    return send_from_directory('app', 'styles.css')

@app.route('/script.js')
def script():
    return send_from_directory('app', 'script.js')

# ============================================================
# API ENDPOINT
# ============================================================
@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def api_chat():
    # CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        # Check API key
        if not GEMINI_API_KEY:
            return jsonify({
                'error': 'GEMINI_API_KEY not set. Add it in Render Environment Variables.'
            }), 500
        
        data = request.get_json()
        
        # Extract prompt
        prompt = ""
        if 'messages' in data:
            prompt = '\n\n'.join([m.get('content', '') for m in data['messages']])
        else:
            prompt = data.get('prompt', '') or data.get('content', '')
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400
        
        # Build Gemini request
        gemini_payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": data.get('temperature', 0.7),
                "maxOutputTokens": data.get('max_tokens', 8192),
                "topP": 0.95,
                "topK": 40
            }
        }
        
        # JSON mode
        if data.get('response_format', {}).get('type') == 'json_object':
            gemini_payload["generationConfig"]["responseMimeType"] = "application/json"
        
        # Call Gemini API
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json=gemini_payload,
            headers={'Content-Type': 'application/json'},
            timeout=120
        )
        
        if response.status_code != 200:
            return jsonify({
                'error': f'Gemini API error: {response.status_code}',
                'details': response.text
            }), response.status_code
        
        result = response.json()
        content = result['candidates'][0]['content']['parts'][0]['text']
        
        return jsonify({
            'choices': [{'message': {'content': content}}],
            'model': GEMINI_MODEL
        })
        
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout'}), 504
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================
# HEALTH CHECK
# ============================================================
@app.route('/health')
def health():
    return jsonify({
        'status': 'ok',
        'model': GEMINI_MODEL,
        'api_key_set': bool(GEMINI_API_KEY)
    })

# ============================================================
# RUN
# ============================================================
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    print(f'🚀 Server starting on port {port}')
    print(f'🔑 API Key: {"SET" if GEMINI_API_KEY else "NOT SET"}')
    app.run(host='0.0.0.0', port=port)