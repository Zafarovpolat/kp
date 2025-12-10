# ⚡ Быстрый деплой на Vercel

## За 5 минут:

### 1️⃣ Подготовка
```powershell
cd c:\Users\x\Downloads\kp
git init
git add .
git commit -m "Initial: KP Generator with AI"
```

### 2️⃣ GitHub
1. Создайте репозиторий на github.com
2. Скопируйте команды:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/kp-generator.git
git branch -M main
git push -u origin main
```

### 3️⃣ Vercel
1. Зайдите на [vercel.com](https://vercel.com)
2. Sign Up → Continue with GitHub
3. "New Project" → Импортируйте ваш репозиторий
4. **Output Directory**: `app`
5. Deploy!

**Готово!** Ваш сайт живёт на `https://your-project.vercel.app`

---

## 📝 Важные файлы уже созданы:
- ✅ `vercel.json` - конфигурация
- ✅ `api/proxy.py` - serverless function
- ✅ `.gitignore` - исключения
- ✅ `app/script.js` - автоопределение production/dev

## 🔐 Безопасность (опционально):
В Vercel Dashboard → Settings → Environment Variables:
- Добавьте `ZENMUX_API_KEY` = `your-api-key`

## 🆘 Troubleshooting:
- Логи: Vercel Dashboard → Functions
- CORS: Проверьте `vercel.json`
- 404: Root directory должен быть пустым, Output = `app`
