// ============================================================
// KP GENERATOR - Main Script V2.1 (Google Gemini 2.0 Flash)
// ============================================================

/* ============================================================
   AI HELPER - Google Gemini 2.0 Flash
   ============================================================ */
const AIHelper = {
    // Автоопределение URL: localhost → Flask proxy, production → Vercel serverless
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8080/api/chat'
        : '/api/chat',

    model: 'gemini-2.0-flash',

    // AI Generated КП data stored here
    currentAIKP: null,

    async generateDetailedKP(type, formData) {
        const prompt = this.constructDetailedPrompt(type, formData);

        try {
            console.log(`[AI] Sending request to: ${this.apiUrl}`);
            console.log(`[AI] Model: ${this.model}`);

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    max_tokens: 8192,
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API Error: ${response.status}`);
            }

            const data = await response.json();
            let contentStr = data.choices[0].message.content;

            // Очистка от markdown блоков если есть
            contentStr = contentStr.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

            console.log('[AI] Response received, length:', contentStr.length);

            const content = JSON.parse(contentStr);
            this.currentAIKP = content;
            return content;

        } catch (error) {
            console.error('[AI] Generation failed:', error);
            throw error;
        }
    },

    constructDetailedPrompt(type, data) {
        const systemPrompt = `Ты — профессиональный арт-директор и копирайтер в топовом дизайн-агентстве. 
Твоя задача — создать МАКСИМАЛЬНО ПОДРОБНОЕ и профессиональное коммерческое предложение на основе кратких данных клиента. 
КП должно быть объёмным, на 3-5 страниц, с детальным описанием каждого этапа работы.
Ответ должен быть ТОЛЬКО в формате JSON без дополнительного текста.`;

        if (type === 'logo') {
            return `${systemPrompt}

Создай детальное коммерческое предложение для разработки логотипа и фирменного стиля.

ИСХОДНЫЕ ДАННЫЕ:
- Клиент: ${data['client-name'] || 'Не указано'}
- Сфера: ${data['client-industry'] || 'Не указано'}
- Бюджет: ${data['price-total'] || '150000'} руб.

ОБЯЗАТЕЛЬНАЯ СТРУКТУРА JSON:
{
    "understanding": "Детальный раздел 'Понимание задачи' - 2-3 абзаца о компании, её сфере, целевой аудитории, важности айдентики в их отрасли",
    "solution": "Раздел 'Наше решение' - 3-4 абзаца о подходе агентства, уникальности методологии, почему это сработает для клиента",
    "stages": [
        {
            "number": "01",
            "title": "Исследование и Аналитика",
            "description": "3-5 абзацев ДЕТАЛЬНОГО описания этапа",
            "deliverables": ["Аналитический отчет", "Конкурентный анализ", "Moodboard"]
        },
        {
            "number": "02",
            "title": "Разработка Логотипа",
            "description": "3-5 абзацев детального описания",
            "deliverables": ["3 концепции лого", "Финальный логотип в векторе"]
        },
        {
            "number": "03",
            "title": "Фирменный Стиль",
            "description": "3-5 абзацев детального описания",
            "deliverables": ["Цветовая палитра", "Типографика", "Паттерны", "Дизайн носителей"]
        },
        {
            "number": "04",
            "title": "Брендбук",
            "description": "2-3 абзаца описания",
            "deliverables": ["Брендбук PDF", "Исходники", "Шаблоны"]
        }
    ],
    "why_us": ["Причина 1 - почему выбрать нас", "Причина 2", "Причина 3", "Причина 4"],
    "guarantee": "Развёрнутый параграф о гарантиях качества и поддержке"
}`;
        } else if (type === 'website') {
            return `${systemPrompt}

Создай детальное коммерческое предложение для разработки корпоративного сайта.

ИСХОДНЫЕ ДАННЫЕ:
- Клиент: ${data['client-name'] || 'Не указано'}
- Сфера: ${data['client-industry'] || 'Не указано'}
- Тип сайта: ${data['site-type'] || 'Корпоративный'}
- Цель: ${data['site-goal'] || 'Привлечение клиентов'}
- Бюджет: ${data['price-total'] || '250000'} руб.

ОБЯЗАТЕЛЬНАЯ СТРУКТУРА JSON:
{
    "understanding": "2-3 абзаца о бизнесе клиента и его потребностях в сайте",
    "solution": "3-4 абзаца о технологиях (React/Next.js), UX-подходе, Mobile First стратегии",
    "stages": [
        {
            "number": "01",
            "title": "Прототипирование и UX",
            "description": "4-5 абзацев детального описания",
            "deliverables": ["UX-исследование", "Wireframes", "Интерактивный прототип"]
        },
        {
            "number": "02",
            "title": "UI Дизайн",
            "description": "4-5 абзацев детального описания",
            "deliverables": ["Дизайн-концепция", "Макеты всех страниц", "UI Kit"]
        },
        {
            "number": "03",
            "title": "Frontend и Backend разработка",
            "description": "4-5 абзацев детального описания",
            "deliverables": ["Адаптивная вёрстка", "Программирование", "CMS интеграция"]
        },
        {
            "number": "04",
            "title": "Тестирование и Запуск",
            "description": "2-3 абзаца описания",
            "deliverables": ["QA тестирование", "SEO оптимизация", "Деплой", "Обучение"]
        }
    ],
    "why_us": ["Опыт 50+ проектов", "Современный стек технологий", "Гарантия 12 месяцев", "Техподдержка"],
    "guarantee": "Развёрнутый параграф о гарантиях"
}`;
        } else {
            // Express
            return `${systemPrompt}

Создай детальное ЭКСПРЕСС коммерческое предложение (компактное, но информативное).

ИСХОДНЫЕ ДАННЫЕ:
- Клиент: ${data['client-name'] || 'Не указано'}
- Услуга: ${data['service-name'] || 'Разработка'}
- Срок: ${data['duration'] || '5'} дней
- Бюджет: ${data['price-total'] || '50000'} руб.

ОБЯЗАТЕЛЬНАЯ СТРУКТУРА JSON:
{
    "intro": "2-3 предложения - яркое вступление о проекте",
    "what_included": "Детальное описание того, что входит в работу (5-7 пунктов списком через запятую или развёрнутый текст)",
    "results": ["Конкретный результат 1", "Конкретный результат 2", "Конкретный результат 3", "Конкретный результат 4"],
    "timeline": "Параграф о сроках выполнения и этапах",
    "guarantee": "Информация о гарантиях качества"
}`;
        }
    }
};

/* ============================================================
   TEMPLATES CONFIGURATION
   ============================================================ */
const TEMPLATES = {
    logo: {
        title: "Логотип и Фирменный стиль",
        fields: [
            { id: "client-name", label: "Название компании клиента", type: "text", placeholder: "ООО Ромашка", required: true },
            { id: "client-industry", label: "Сфера деятельности", type: "text", placeholder: "Строительство, IT, Медицина...", required: true },
            { id: "price-total", label: "Общая стоимость (₽)", type: "number", placeholder: "150000", required: true },
            { id: "manager-name", label: "Имя менеджера", type: "text", placeholder: "Иван Иванов", required: true },
            { id: "manager-phone", label: "Телефон", type: "tel", placeholder: "+7 (999) 000-00-00", required: true },
            { id: "manager-email", label: "Email", type: "email", placeholder: "manager@agency.com", required: true }
        ]
    },
    website: {
        title: "Корпоративный сайт",
        fields: [
            { id: "client-name", label: "Название компании клиента", type: "text", placeholder: "ООО Ромашка", required: true },
            { id: "client-industry", label: "Сфера деятельности", type: "text", placeholder: "Строительство, IT, Медицина...", required: true },
            { id: "site-type", label: "Тип сайта", type: "select", options: ["Landing Page", "Корпоративный сайт", "Интернет-магазин", "Промо-сайт"] },
            { id: "site-goal", label: "Цель сайта", type: "text", placeholder: "Привлечение клиентов, продажи..." },
            { id: "price-total", label: "Общая стоимость (₽)", type: "number", placeholder: "250000", required: true },
            { id: "manager-name", label: "Имя менеджера", type: "text", placeholder: "Иван Иванов", required: true },
            { id: "manager-phone", label: "Телефон", type: "tel", placeholder: "+7 (999) 000-00-00", required: true },
            { id: "manager-email", label: "Email", type: "email", placeholder: "manager@agency.com", required: true }
        ]
    },
    express: {
        title: "Экспресс-КП",
        fields: [
            { id: "service-type", label: "Тип услуги", type: "text", placeholder: "Логотип / Сайт / Дизайн", required: true },
            { id: "client-name", label: "Название компании", type: "text", placeholder: "ООО Ромашка", required: true },
            { id: "service-name", label: "Что разрабатываем", type: "text", placeholder: "Разработка логотипа", required: true },
            { id: "duration", label: "Срок (дней)", type: "number", placeholder: "5" },
            { id: "price-total", label: "Бюджет (₽)", type: "number", placeholder: "50000", required: true },
            { id: "manager-name", label: "Имя менеджера", type: "text", placeholder: "Иван Иванов", required: true },
            { id: "manager-phone", label: "Телефон", type: "tel", placeholder: "+7 (999) 000-00-00", required: true },
            { id: "manager-email", label: "Email", type: "email", placeholder: "manager@agency.com", required: true }
        ]
    }
};

/* ============================================================
   HELPERS
   ============================================================ */
const Storage = {
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

const DateHelper = {
    getToday() {
        return new Date().toLocaleDateString('ru-RU');
    },
    getFutureDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString('ru-RU');
    }
};

const NumberHelper = {
    format(num) {
        return new Intl.NumberFormat('ru-RU').format(num);
    }
};

/* ============================================================
   FORM BUILDER
   ============================================================ */
const FormHelper = {
    buildForm(templateKey, containerId) {
        const container = document.getElementById(containerId);
        const template = TEMPLATES[templateKey];

        if (!container || !template) return;

        container.innerHTML = '';

        // Add AI Button
        const aiBtn = document.createElement('button');
        aiBtn.className = 'btn btn-ai';
        aiBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Генерировать КП через AI (Gemini 2.0)';
        aiBtn.onclick = (e) => {
            e.preventDefault();
            this.handleAIGeneration(templateKey);
        };
        container.appendChild(aiBtn);

        template.fields.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';

            const label = document.createElement('label');
            label.className = `form-label ${field.required ? 'required' : ''}`;
            label.textContent = field.label;
            label.htmlFor = field.id;

            let input;
            if (field.type === 'select') {
                input = document.createElement('select');
                input.className = 'form-select';
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    input.appendChild(option);
                });
            } else if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.className = 'form-textarea';
                if (field.rows) input.rows = field.rows;
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.className = 'form-input';
            }

            input.id = field.id;
            input.name = field.id;
            if (field.placeholder) input.placeholder = field.placeholder;
            if (field.required) input.required = true;

            // Load saved data
            const savedData = Storage.get(`kp_data_${templateKey}`);
            if (savedData && savedData[field.id]) {
                input.value = savedData[field.id];
            }

            // Auto-save on change
            input.addEventListener('input', () => {
                const currentData = this.getFormData(containerId);
                Storage.save(`kp_data_${templateKey}`, currentData);
                // Update preview manually
                if (window.updatePreview) {
                    window.updatePreview();
                }
            });

            group.appendChild(label);
            group.appendChild(input);
            container.appendChild(group);
        });
    },

    getFormData(containerId) {
        const container = document.getElementById(containerId);
        const inputs = container.querySelectorAll('input, select, textarea');
        const data = {};
        inputs.forEach(input => {
            data[input.id] = input.value;
        });
        return data;
    },

    async handleAIGeneration(type) {
        const formData = this.getFormData('kpForm');

        // Validation
        if (!formData['client-name']) {
            alert('Пожалуйста, введите хотя бы название компании клиента.');
            return;
        }

        // Show loading
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="spinner"></div>
            <div style="color: white; font-weight: 500; margin-top: 20px;">
                🤖 Gemini 2.0 Flash создаёт детальное КП...
                <br><small>Это займёт 10-20 секунд</small>
            </div>
        `;
        document.body.appendChild(loading);

        try {
            // Call AI
            const aiKP = await AIHelper.generateDetailedKP(type, formData);

            // Remove loading
            document.body.removeChild(loading);

            if (aiKP) {
                // Trigger preview update
                if (window.updatePreview) {
                    window.updatePreview();
                }
                alert('✨ Детальное КП успешно сгенерировано!\n\nПосмотрите в предпросмотр справа.');
            }
        } catch (error) {
            // Remove loading
            if (document.body.contains(loading)) {
                document.body.removeChild(loading);
            }

            // Show user-friendly error
            let errorMessage = 'Ошибка генерации AI:\n\n';
            if (error.message.includes('API Key')) {
                errorMessage += '🔑 API ключ не настроен на сервере.\n\nПроверьте что:\n1. Локально: установлена переменная GEMINI_API_KEY\n2. Vercel: добавлен Environment Variable';
            } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
                errorMessage += '⏱️ Превышено время ожидания.\n\nПопробуйте ещё раз.';
            } else {
                errorMessage += error.message;
            }
            alert(errorMessage);
        }
    }
};

/* ============================================================
   EXPORTER
   ============================================================ */
const Exporter = {
    toPDF(elementId, filename) {
        const element = document.getElementById(elementId);
        const opt = {
            margin: 0,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                scrollY: 0,
                scrollX: 0,
                width: element.scrollWidth,
                height: element.scrollHeight,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: 'avoid-all', avoid: '.preview-paper' }
        };

        const btn = document.querySelector('.btn-primary');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Создание PDF...';

        html2pdf().set(opt).from(element).save().then(() => {
            btn.innerHTML = originalText;
        });
    },

    print(elementId) {
        const content = document.getElementById(elementId).innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Печать КП</title>');
        printWindow.document.write('<link rel="stylesheet" href="styles.css">');
        printWindow.document.write('<style>body{background: white; padding: 20px;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }
};

/* ============================================================
   GENERATORS (DETAILED AI OR MANUAL)
   ============================================================ */
function generateKPHTML(type, data) {
    const date = DateHelper.getToday();
    const price = NumberHelper.format(data['price-total'] || 0);

    // Check if AI generated КП exists
    const aiKP = AIHelper.currentAIKP;

    // Common Header
    let html = `
        <div style="padding: 40px; font-family: 'Inter', sans-serif; color: #333; line-height: 1.6; max-width: 800px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px;">
                <div style="font-weight: bold; font-size: 24px; color: #2563eb;">AGENCY</div>
                <div style="text-align: right; color: #666;">
                    <div>Коммерческое предложение</div>
                    <div>Дата: ${date}</div>
                </div>
            </div>
    `;

    if (type === 'logo') {
        html += `<h1 style="font-size: 32px; margin-bottom: 10px;">Разработка логотипа и фирменного стиля</h1>`;
        html += `<h2 style="font-size: 20px; color: #666; margin-bottom: 40px;">для компании «${data['client-name'] || 'Клиент'}»</h2>`;

        if (aiKP && aiKP.understanding) {
            // AI Generated Content
            html += `
                <div style="margin-bottom: 40px;">
                    <h3 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Понимание задачи</h3>
                    <div style="color: #555; font-size: 15px;">${aiKP.understanding.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div style="margin-bottom: 40px;">
                    <h3 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Наше решение</h3>
                    <div style="color: #555; font-size: 15px;">${aiKP.solution.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div style="margin-bottom: 40px;">
                    <h3 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Этапы работ</h3>
            `;

            aiKP.stages.forEach(stage => {
                html += `
                    <div style="margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px;">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <div style="font-size: 28px; font-weight: bold; color: #2563eb; margin-right: 15px;">${stage.number}</div>
                            <h4 style="margin: 0; font-size: 18px;">${stage.title}</h4>
                        </div>
                        <div style="color: #555; font-size: 14px; margin-bottom: 15px;">${stage.description.replace(/\n/g, '<br>')}</div>
                        <div style="border-top: 1px solid #ddd; padding-top: 10px;">
                            <strong style="font-size: 13px; color: #666;">Результаты:</strong>
                            <ul style="margin: 5px 0 0 20px; padding: 0;">
                                ${stage.deliverables.map(d => `<li style="font-size: 13px; color: #555;">${d}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;

            html += `
                <div style="margin-bottom: 40px;">
                    <h3 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Почему мы</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${aiKP.why_us.map(reason => `<li style="margin-bottom: 10px; padding-left: 25px; position: relative;"><span style="position: absolute; left: 0; color: #2563eb; font-size: 18px;">✓</span>${reason}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="margin-bottom: 40px; background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
                    <strong style="color: #2563eb;">Гарантии:</strong>
                    <div style="margin-top: 10px; color: #555;">${aiKP.guarantee}</div>
                </div>
            `;
        } else {
            // Manual/Simple Content
            html += `
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2563eb;">Концепция</h3>
                    <p style="color: #555;">Нажмите кнопку "Генерировать КП через AI" для получения детального описания.</p>
                </div>
            `;
        }
    } else if (type === 'website') {
        html += `<h1 style="font-size: 32px; margin-bottom: 10px;">Разработка корпоративного сайта</h1>`;
        html += `<h2 style="font-size: 20px; color: #666; margin-bottom: 40px;">для компании «${data['client-name'] || 'Клиент'}»</h2>`;

        if (aiKP && aiKP.understanding) {
            html += `
                <div style="margin-bottom: 40px;">
                    <h3 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Понимание задачи</h3>
                    <div style="color: #555; font-size: 15px;">${aiKP.understanding.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div style="margin-bottom: 40px;">
                    <h3 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Наше решение</h3>
                    <div style="color: #555; font-size: 15px;">${aiKP.solution.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div style="margin-bottom: 40px;">
                    <h3 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Этапы работ</h3>
            `;

            aiKP.stages.forEach(stage => {
                html += `
                    <div style="margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px;">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <div style="font-size: 28px; font-weight: bold; color: #2563eb; margin-right: 15px;">${stage.number}</div>
                            <h4 style="margin: 0; font-size: 18px;">${stage.title}</h4>
                        </div>
                        <div style="color: #555; font-size: 14px; margin-bottom: 15px;">${stage.description.replace(/\n/g, '<br>')}</div>
                        <div style="border-top: 1px solid #ddd; padding-top: 10px;">
                            <strong style="font-size: 13px; color: #666;">Результаты:</strong>
                            <ul style="margin: 5px 0 0 20px; padding: 0;">
                                ${stage.deliverables.map(d => `<li style="font-size: 13px; color: #555;">${d}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;

            html += `
                <div style="margin-bottom: 40px;">
                    <h3 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Почему мы</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${aiKP.why_us.map(reason => `<li style="margin-bottom: 10px; padding-left: 25px; position: relative;"><span style="position: absolute; left: 0; color: #2563eb; font-size: 18px;">✓</span>${reason}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="margin-bottom: 40px; background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
                    <strong style="color: #2563eb;">Гарантии:</strong>
                    <div style="margin-top: 10px; color: #555;">${aiKP.guarantee}</div>
                </div>
            `;
        } else {
            html += `
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2563eb;">Описание</h3>
                    <p style="color: #555;">Нажмите кнопку "Генерировать КП через AI" для получения детального описания.</p>
                </div>
            `;
        }
    } else {
        // Express
        html += `<h1 style="font-size: 32px; margin-bottom: 10px;">${data['service-name'] || 'Услуга'}</h1>`;
        html += `<h2 style="font-size: 20px; color: #666; margin-bottom: 40px;">для компании «${data['client-name'] || 'Клиент'}»</h2>`;

        if (aiKP && aiKP.intro) {
            html += `
                <div style="margin-bottom: 30px;">
                    <p style="font-size: 16px; color: #555;">${aiKP.intro}</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2563eb;">Что входит в работу:</h3>
                    <p style="color: #555;">${aiKP.what_included}</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2563eb;">Что вы получаете:</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${aiKP.results.map(r => `<li style="margin-bottom: 10px; padding-left: 25px; position: relative;"><span style="position: absolute; left: 0; color: #2563eb;">✓</span>${r}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2563eb;">Сроки:</h3>
                    <p style="color: #555;">${aiKP.timeline}</p>
                </div>
                
                <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
                    <strong>Гарантии:</strong> ${aiKP.guarantee}
                </div>
            `;
        } else {
            html += `
                <div style="margin-bottom: 30px;">
                    <p style="color: #555;">Нажмите кнопку "Генерировать КП через AI" для получения детального описания.</p>
                </div>
            `;
        }
    }

    // Footer
    html += `
            <div style="margin-top: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 14px; opacity: 0.9;">Стоимость проекта</div>
                        <div style="font-size: 32px; font-weight: bold; margin-top: 5px;">${price} ₽</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: bold; font-size: 16px;">${data['manager-name'] || 'Менеджер'}</div>
                        <div style="font-size: 14px; opacity: 0.9; margin-top: 5px;">${data['manager-phone'] || ''}</div>
                        <div style="font-size: 14px; opacity: 0.9;">${data['manager-email'] || ''}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return html;
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');

    if (window.location.pathname.includes('generator.html') && type) {
        FormHelper.buildForm(type, 'kpForm');

        // Preview update function
        window.updatePreview = () => {
            const data = FormHelper.getFormData('kpForm');
            const html = generateKPHTML(type, data);
            document.getElementById('kpPreview').innerHTML = html;
        };

        // Update preview on any input change
        document.getElementById('kpForm').addEventListener('input', window.updatePreview);

        // Initial call
        window.updatePreview();

        // Buttons
        document.getElementById('btnDownload').onclick = () => {
            Exporter.toPDF('kpPreview', `KP_${type}_${Date.now()}.pdf`);
        };

        document.getElementById('btnPrint').onclick = () => {
            Exporter.print('kpPreview');
        };

        document.getElementById('btnClear').onclick = () => {
            if (confirm('Очистить форму и AI данные?')) {
                localStorage.removeItem(`kp_data_${type}`);
                AIHelper.currentAIKP = null;
                location.reload();
            }
        };
    }
});