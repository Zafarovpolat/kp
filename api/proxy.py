"""
Vercel Serverless Function - Google Gemini 2.0 Flash Proxy
Путь: api/proxy.py
"""

from http.server import BaseHTTPRequestHandler
import json
import os
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

# ============================================================
# КОНФИГУРАЦИЯ GEMINI API
# ============================================================
# На Vercel: Settings → Environment Variables → GEMINI_API_KEY
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
GEMINI_MODEL = 'gemini-2.0-flash'
GEMINI_API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent'


class handler(BaseHTTPRequestHandler):
    
    def send_cors_headers(self):
        """Добавляет CORS заголовки"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_cors_headers()
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()

    def do_GET(self):
        """Health check endpoint"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_cors_headers()
        self.end_headers()
        
        response = {
            'status': 'ok',
            'model': GEMINI_MODEL,
            'endpoint': '/api/chat',
            'api_key_set': bool(GEMINI_API_KEY)
        }
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_POST(self):
        """Proxy POST request to Google Gemini API"""
        try:
            # Проверяем наличие API ключа
            if not GEMINI_API_KEY:
                self.send_error_response(500, 'GEMINI_API_KEY not configured on server')
                return
            
            # Читаем тело запроса
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            # Извлекаем prompt из разных форматов
            prompt = ""
            if 'messages' in data:
                messages = data.get('messages', [])
                prompt = '\n\n'.join([msg.get('content', '') for msg in messages])
            elif 'prompt' in data:
                prompt = data.get('prompt', '')
            elif 'content' in data:
                prompt = data.get('content', '')
            
            if not prompt:
                self.send_error_response(400, 'No prompt provided')
                return
            
            # Формируем запрос для Gemini
            gemini_payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": data.get('temperature', 0.7),
                    "maxOutputTokens": data.get('max_tokens', 8192),
                    "topP": 0.95,
                    "topK": 40
                }
            }
            
            # JSON режим если запрошен
            if data.get('response_format', {}).get('type') == 'json_object':
                gemini_payload["generationConfig"]["responseMimeType"] = "application/json"
            
            # Отправляем запрос к Gemini API
            api_url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
            req = Request(
                api_url,
                data=json.dumps(gemini_payload).encode('utf-8'),
                headers={
                    'Content-Type': 'application/json'
                },
                method='POST'
            )
            
            with urlopen(req, timeout=120) as response:
                gemini_response = json.loads(response.read().decode('utf-8'))
            
            # Извлекаем текст из ответа
            try:
                content = gemini_response['candidates'][0]['content']['parts'][0]['text']
            except (KeyError, IndexError) as e:
                self.send_error_response(500, f'Failed to parse Gemini response: {str(e)}')
                return
            
            # Отправляем успешный ответ
            result = {
                'choices': [{
                    'message': {
                        'content': content
                    }
                }],
                'model': GEMINI_MODEL
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except HTTPError as e:
            error_body = e.read().decode('utf-8')
            self.send_error_response(e.code, f'Gemini API error: {error_body}')
            
        except URLError as e:
            self.send_error_response(500, f'Network error: {str(e)}')
            
        except json.JSONDecodeError as e:
            self.send_error_response(400, f'Invalid JSON: {str(e)}')
            
        except Exception as e:
            self.send_error_response(500, f'Internal error: {str(e)}')
    
    def send_error_response(self, status_code, message):
        """Отправляет ошибку с CORS заголовками"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps({
            'error': message,
            'status': status_code
        }).encode('utf-8'))