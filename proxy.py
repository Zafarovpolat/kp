"""
CORS Proxy Server для KP Generator - Google Gemini 2.0 Flash
Запуск: python proxy.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import traceback
import os

app = Flask(__name__)
CORS(app)

# ============================================================
# КОНФИГУРАЦИЯ GEMINI API
# ============================================================
# Вставьте ваш API ключ здесь ИЛИ используйте переменную окружения
GEMINI_API_KEY = 'AIzaSyDbnWgd0Vk_kfirKq5SbBiEI0dkXynRlQ4'
GEMINI_MODEL = 'gemini-2.0-flash'
GEMINI_API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent'


@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def proxy_chat():
    """Проксирует запросы к Google Gemini API"""
    
    # Обработка preflight CORS запроса
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        data = request.get_json()
        
        print(f"[DEBUG] Received request")
        print(f"[DEBUG] Request data keys: {list(data.keys())}")
        
        # Извлекаем prompt из разных возможных форматов
        prompt = ""
        if 'messages' in data:
            # Старый формат (OpenAI-style) - конвертируем
            messages = data.get('messages', [])
            prompt = '\n\n'.join([msg.get('content', '') for msg in messages])
        elif 'prompt' in data:
            prompt = data.get('prompt', '')
        elif 'content' in data:
            prompt = data.get('content', '')
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400
        
        print(f"[DEBUG] Prompt length: {len(prompt)} chars")
        
        # Формируем запрос для Gemini API
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
        
        # Добавляем response_format если запрошен JSON
        if data.get('response_format', {}).get('type') == 'json_object':
            gemini_payload["generationConfig"]["responseMimeType"] = "application/json"
        
        # Отправляем запрос к Gemini API
        print(f"[DEBUG] Sending request to Gemini API...")
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json=gemini_payload,
            headers={
                'Content-Type': 'application/json'
            },
            timeout=120  # Увеличен timeout для длинных ответов
        )
        
        print(f"[DEBUG] Gemini API response status: {response.status_code}")
        
        if response.status_code != 200:
            error_text = response.text
            print(f"[ERROR] Gemini API error: {error_text}")
            return jsonify({
                'error': 'Gemini API error',
                'status': response.status_code,
                'details': error_text
            }), response.status_code
        
        gemini_response = response.json()
        
        # Извлекаем текст из ответа Gemini
        try:
            content = gemini_response['candidates'][0]['content']['parts'][0]['text']
            print(f"[DEBUG] Response content length: {len(content)} chars")
        except (KeyError, IndexError) as e:
            print(f"[ERROR] Failed to parse Gemini response: {e}")
            print(f"[ERROR] Full response: {gemini_response}")
            return jsonify({
                'error': 'Failed to parse Gemini response',
                'details': str(gemini_response)
            }), 500
        
        # Возвращаем в формате, совместимом с фронтендом
        return jsonify({
            'choices': [{
                'message': {
                    'content': content
                }
            }],
            'model': GEMINI_MODEL,
            'usage': gemini_response.get('usageMetadata', {})
        })
        
    except requests.exceptions.Timeout:
        print("[ERROR] Timeout connecting to Gemini API")
        return jsonify({'error': 'Request timeout - try again'}), 504
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Request error: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': f'Request failed: {str(e)}'}), 500
    except Exception as e:
        print(f"[ERROR] Unexpected error: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': f'Internal error: {str(e)}'}), 500


@app.route('/health', methods=['GET'])
def health():
    """Проверка работоспособности"""
    api_key_status = 'SET' if GEMINI_API_KEY and GEMINI_API_KEY != 'ВАШ_API_КЛЮЧ_СЮДА' else 'NOT SET!'
    return jsonify({
        'status': 'OK',
        'service': 'Gemini Proxy for KP Generator',
        'model': GEMINI_MODEL,
        'api_key': api_key_status
    })


if __name__ == '__main__':
    print('=' * 60)
    print('🚀 Gemini Proxy Server Started')
    print(f'📡 Model: {GEMINI_MODEL}')
    print(f'🔑 API Key: {"SET ✓" if GEMINI_API_KEY and GEMINI_API_KEY != "ВАШ_API_КЛЮЧ_СЮДА" else "NOT SET ✗"}')
    print('=' * 60)
    print('🌐 URL: http://localhost:8080')
    print('📍 Endpoint: http://localhost:8080/api/chat')
    print('❤️  Health: http://localhost:8080/health')
    print('=' * 60)
    
    if GEMINI_API_KEY == 'ВАШ_API_КЛЮЧ_СЮДА':
        print('')
        print('⚠️  ВНИМАНИЕ: API ключ не установлен!')
        print('   Получите ключ: https://aistudio.google.com/apikey')
        print('   Установите: export GEMINI_API_KEY=ваш_ключ')
        print('   Или измените переменную GEMINI_API_KEY в коде')
        print('')
    
    app.run(host='127.0.0.1', port=8080, debug=True, use_reloader=False)