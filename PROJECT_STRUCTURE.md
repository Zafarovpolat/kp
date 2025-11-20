# 📦 Структура проекта KP Generator

```
kp/
├── 📄 README.md              # Основная документация
├── 🚀 DEPLOY.md              # Детальная инструкция по деплою
├── ⚡ QUICKSTART.md          # Быстрый старт деплоя (5 минут)
├── 🔧 vercel.json            # Конфигурация Vercel
├── 📝 .gitignore             # Git exclusions
├── 🐍 proxy.py               # Локальный Flask прокси (для разработки)
├── 📋 requirements.txt       # Python зависимости
│
├── 🌐 app/                   # Веб-приложение (фронтенд)
│   ├── index.html           # Главная страница (dashboard)
│   ├── generator.html       # Генератор КП
│   ├── styles.css           # Дизайн-система + респонсив
│   └── script.js            # Логика + AI integration
│
├── ☁️ api/                   # Serverless Functions (Vercel)
│   └── proxy.py             # CORS прокси для Zenmux AI
│
├── 📄 output/                # DOCX шаблоны (для MS Word)
│   ├── kp-logo-template.html
│   ├── kp-website-template.html
│   └── kp-express-template.html
│
├── 💡 prompts/               # AI промпты
│   ├── kp_gemini.md
│   └── kp_claude.md
│
├── 📚 examples/              # Примеры готовых КП
│   ├── kp1-gemini.md
│   ├── kp2-gemini.md
│   └── kp3-gemini.md
│
└── 📖 instructions/          # Инструкции по использованию
    ├── how-to-use.md
    └── how-to-design.md
```

---

## 🎯 Что где находится

### Для локальной разработки:
- `app/` - фронтенд, открывается в браузере
- `proxy.py` - запускается локально для AI функций
- `requirements.txt` - для установки Flask

### Для production (Vercel):
- `app/` - статика
- `api/proxy.py` - serverless function (автоматически)
- `vercel.json` - роутинг и CORS

### Для ручного редактирования:
- `output/` - HTML шаблоны для MS Word

---

## 🚀 Три способа использования:

### 1️⃣ Ручное редактирование (без кода)
- Откройте файлы из `output/` в Word
- Замените `[НАЗВАНИЕ]` на ваши данные
- Сохраните как DOCX

### 2️⃣ Локальное веб-приложение
```bash
# Без AI
cd app
python -m http.server 8000

# С AI
pip install flask flask-cors requests
python proxy.py  # В отдельном терминале
# Затем откройте app/index.html
```

### 3️⃣ Production деплой (Vercel)
```bash
# Читайте DEPLOY.md или QUICKSTART.md
git push origin main
# Затем импорт в Vercel
```

---

## 📊 Статистика проекта

- **Файлов кода**: 4 (HTML, CSS, JS)
- **API endpoints**: 1 (`/api/chat`)
- **Шаблонов**: 3 типа КП
- **AI моделей**: Gemini-3-Pro (Zenmux)
- **Зависимостей**: Flask, html2pdf.js
- **Размер**: ~15 KB (минифицированный)

---

## 🔑 Ключевые технологии

### Frontend:
- Vanilla JavaScript (ES6+)
- CSS Grid / Flexbox
- Google Fonts (Inter)
- Font Awesome Icons
- html2pdf.js

### Backend:
- Flask (локально)
- Vercel Serverless Functions (production)
- Zenmux AI API

### Design:
- Adaptive от 768px до 4K
- Dark theme с градиентами
- Micro-animations
- Transform scale для preview

---

**Версия**: 2.0.0 (с AI интеграцией)  
**Лицензия**: Свободное использование
