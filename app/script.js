// ============================================================
// RUSO KP GENERATOR - AI-Powered Commercial Proposal System
// v3.1 - Fixed PDF Export
// ============================================================

const CONFIG = {
    apiUrl: '/api/chat',
    model: 'gemini-2.0-flash',
    agency: {
        name: 'RUSO',
        experience: '15+ лет',
        projects: '250+',
        email: 'hello@ruso.ru',
        phone: '+7 (985) 817-65-00',
        site: 'ruso.ru'
    }
};

// ============================================================
// AI HELPER (без изменений - оставляем как было)
// ============================================================
const AIHelper = {
    currentKP: null,

    async generateKP(clientRequest, formData) {
        const prompt = this.buildPrompt(clientRequest, formData);

        const response = await fetch(CONFIG.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 16000,
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `API Error: ${response.status}`);
        }

        const data = await response.json();
        let content = data.choices?.[0]?.message?.content || '';
        content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        this.currentKP = JSON.parse(content);
        return this.currentKP;
    },

    buildPrompt(clientRequest, formData) {
        return `Ты — коммерческий директор и арт-директор digital-агентства RUSO с 15+ летним опытом. 
Твоя задача — проанализировать запрос клиента и создать МАКСИМАЛЬНО ДЕТАЛЬНОЕ коммерческое предложение.

КП должно быть ОЧЕНЬ подробным — на 5-7 страниц A4, с детализацией каждого этапа, подэтапами, конкретными работами и результатами.

=== ИНФОРМАЦИЯ ОБ АГЕНТСТВЕ RUSO ===
- Более 15 лет на рынке digital-услуг
- 250+ реализованных проектов
- Полный комплекс услуг: веб-разработка, дизайн, SEO, SMM, аналитика
- Высокие стандарты UI/UX
- Работали с крупнейшими компаниями: страховые, банки, ритейл, автобренды
- Ценности: качество, клиентоориентированность, соблюдение сроков
- Контакты: ${CONFIG.agency.email}, ${CONFIG.agency.phone}
- Сайт: ${CONFIG.agency.site}

=== ЗАПРОС КЛИЕНТА ===
${clientRequest}

${formData.projectUrl ? `Ссылка на проект: ${formData.projectUrl}` : ''}

=== БЮДЖЕТ КЛИЕНТА ===
${formData.price} ₽

=== ТРЕБОВАНИЯ К КП ===
1. Проанализируй ВСЕ задачи из запроса клиента
2. Выяви КОНКРЕТНЫЕ проблемы и их бизнес-последствия
3. Разбей на 3-6 основных этапов
4. Каждый этап разбей на 2-4 подэтапа с конкретными задачами
5. Составь ДЕТАЛЬНУЮ смету по каждой работе (цены должны в сумме = бюджету клиента)
6. Укажи реалистичные сроки в рабочих днях

=== ФОРМАТ ОТВЕТА (ТОЛЬКО JSON) ===
{
    "project_title": "Название проекта (например: Комплексная модернизация авторского сайта)",
    "client_name": "Название клиента или имя (извлеки из запроса)",
    "project_url": "URL сайта если есть",
    "tagline": "Краткий слоган проекта (например: Решения, которые превращают сайт в инструмент продаж)",
    
    "understanding": {
        "intro": "1-2 абзаца. Описание проекта клиента и контекста.",
        "critical_problems": [
            {
                "problem": "Название проблемы",
                "consequence": "Бизнес-последствие (потери, упущенная выгода)"
            }
        ],
        "preparation_tasks": ["Задача 1", "Задача 2", "Задача 3"],
        "goal": "Чёткая формулировка цели проекта"
    },
    
    "solution": {
        "approach": "Название подхода (например: Сначала работает — потом красиво)",
        "approach_description": "Описание подхода в 2-3 предложениях",
        "methodology": [
            {
                "name": "Название методологии",
                "description": "Краткое описание"
            }
        ],
        "problems_table": [
            {
                "problem": "Проблема",
                "consequence": "Последствие для бизнеса",
                "solution": "Наше решение"
            }
        ]
    },
    
    "stages": [
        {
            "number": "1",
            "title": "НАЗВАНИЕ ЭТАПА КАПСОМ",
            "duration": "X рабочих дней",
            "substages": [
                {
                    "number": "1.1",
                    "title": "Название подэтапа",
                    "tasks": ["Конкретная задача 1", "Конкретная задача 2", "Конкретная задача 3", "Конкретная задача 4"]
                }
            ]
        }
    ],
    
    "estimate": {
        "items": [
            {
                "number": 1,
                "stage": "Название этапа",
                "description": "Подробное описание состава работ",
                "days": "X дней",
                "price": 15000
            }
        ],
        "total_price": 140000,
        "total_days": "30 рабочих дней",
        "payment_terms": "50% предоплата / 50% по завершении",
        "validity": "10 дней с даты КП"
    },
    
    "includes": ["Все работы по ТЗ", "2 раунда правок по дизайну", "Гарантийная поддержка 14 дней", "Рекомендации по развитию"],
    
    "optional": [
        {
            "service": "SEO-продвижение",
            "price": "от 25 000 ₽/мес"
        }
    ],
    
    "why_us": [
        {
            "title": "Работаем по договору",
            "description": "юридические гарантии сроков и результата"
        },
        {
            "title": "Не используем шаблоны",
            "description": "только уникальные решения под бренд клиента"
        },
        {
            "title": "Опыт в нише клиента",
            "description": "понимаем специфику бизнеса"
        },
        {
            "title": "Комплексный подход",
            "description": "не просто красивый дизайн, а работающий инструмент"
        },
        {
            "title": "Прозрачность",
            "description": "еженедельные отчёты о ходе работ"
        }
    ],
    
    "cta": {
        "title": "Готовы обсудить детали проекта?",
        "subtitle": "Предлагаю созвониться на 15-20 минут для уточнения деталей:",
        "steps": [
            "Уточним приоритеты по функционалу",
            "Обсудим референсы по дизайну", 
            "Согласуем график работ"
        ]
    }
}

ВАЖНО:
- Суммы в estimate.items должны давать в сумме = estimate.total_price = бюджету клиента (${formData.price} ₽)
- Каждый этап должен иметь 2-4 подэтапа
- Подэтапы должны иметь 3-5 конкретных задач
- Пиши на русском языке
- Будь конкретен — никаких общих фраз`;
    }
};

// ============================================================
// KP RENDERER - Generates detailed HTML with print styles
// ============================================================
const KPRenderer = {
    render(kp, formData) {
        const date = new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const formatPrice = (num) => {
            return new Intl.NumberFormat('ru-RU').format(num) + ' ₽';
        };

        return `
<div class="kp-document">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .kp-document {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #1a1a1a;
            background: #fff;
        }
        
        .kp-document * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        .page {
            padding: 50px 60px;
            background: #fff;
        }
        
        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 50px;
            padding-bottom: 25px;
            border-bottom: 1px solid #e5e5e5;
        }
        
        .logo { font-size: 32px; font-weight: 800; letter-spacing: 3px; color: #000; }
        .header-info { text-align: right; font-size: 12px; color: #666; }
        .header-info p { margin-bottom: 4px; }
        
        /* Title Section */
        .title-section { margin-bottom: 45px; }
        .document-type { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 12px; }
        .main-title { font-size: 26px; font-weight: 700; line-height: 1.3; margin-bottom: 18px; color: #000; }
        
        .client-info { background: #f8f8f8; padding: 18px 22px; border-radius: 8px; }
        .client-info p { margin-bottom: 4px; font-size: 14px; }
        .client-info strong { color: #000; }
        
        .tagline { font-size: 15px; font-style: italic; color: #555; margin-top: 25px; padding-left: 18px; border-left: 3px solid #000; }
        
        /* Section */
        .section { 
            margin-bottom: 40px; 
            page-break-inside: avoid;
        }
        .section-header { display: flex; align-items: baseline; margin-bottom: 20px; }
        .section-number { font-size: 42px; font-weight: 800; color: #e5e5e5; margin-right: 18px; line-height: 1; }
        .section-title { font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #000; }
        
        /* Content */
        .kp-document h3 { font-size: 14px; font-weight: 600; margin: 20px 0 12px; color: #000; }
        .kp-document p { margin-bottom: 10px; color: #333; font-size: 13px; }
        
        .highlight-box {
            background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
            padding: 18px 22px;
            border-radius: 8px;
            margin: 18px 0;
            border-left: 4px solid #000;
            page-break-inside: avoid;
        }
        .highlight-box strong { color: #c00; }
        
        .kp-document ul { list-style: none; margin: 12px 0; }
        .kp-document ul li { padding: 6px 0 6px 22px; position: relative; font-size: 13px; }
        .kp-document ul li::before { content: "—"; position: absolute; left: 0; color: #888; }
        
        /* Tables */
        .kp-document table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 18px 0; 
            font-size: 12px; 
            page-break-inside: avoid;
        }
        .kp-document th {
            background: #1a1a1a;
            color: #fff;
            padding: 12px 14px;
            text-align: left;
            font-weight: 500;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .kp-document td { padding: 12px 14px; border-bottom: 1px solid #eee; vertical-align: top; }
        .kp-document tr:hover td { background: #fafafa; }
        .table-number { font-weight: 600; color: #888; }
        .table-price { font-weight: 600; text-align: right; white-space: nowrap; }
        .table-days { text-align: center; color: #666; }
        
        /* Problem Table */
        .problem-table td { padding: 10px 14px; }
        .problem-table td:first-child { font-weight: 500; width: 25%; }
        .problem-table td:nth-child(2) { color: #c00; width: 35%; }
        .problem-table td:last-child { color: #080; font-weight: 500; }
        
        /* Total Box */
        .total-box {
            background: #1a1a1a;
            color: #fff;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            page-break-inside: avoid;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #333;
        }
        .total-row:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .total-label { font-size: 13px; color: #aaa; }
        .total-value { font-size: 22px; font-weight: 700; }
        .total-value.price { color: #fff; }
        .total-small { font-size: 13px; font-weight: 500; }
        .validity { font-size: 11px; color: #888; text-align: center; margin-top: 12px; }
        
        /* Includes */
        .includes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 18px 0; }
        .include-item { padding: 8px 12px; background: #f8f8f8; border-radius: 6px; font-size: 12px; }
        .include-item::before { content: "✓"; color: #080; margin-right: 8px; font-weight: bold; }
        
        /* Optional */
        .optional-box { 
            background: #fafafa; 
            padding: 18px; 
            border-radius: 8px; 
            margin-top: 20px; 
            page-break-inside: avoid;
        }
        .optional-box h4 { font-size: 12px; color: #666; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .optional-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #ddd; font-size: 12px; }
        .optional-item:last-child { border-bottom: none; }
        
        /* Stages */
        .stage {
            margin-bottom: 25px;
            padding: 22px;
            background: #fafafa;
            border-radius: 8px;
            border-left: 4px solid #000;
            page-break-inside: avoid;
        }
        .stage-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .stage-title { font-size: 14px; font-weight: 700; color: #000; }
        .stage-time { font-size: 11px; color: #666; background: #fff; padding: 4px 10px; border-radius: 20px; border: 1px solid #ddd; }
        .substage { margin-top: 12px; }
        .substage-title { font-size: 12px; font-weight: 600; color: #333; margin-bottom: 6px; }
        .substage ul { margin: 0; }
        .substage li { font-size: 12px; padding: 4px 0 4px 18px; color: #555; }
        
        /* Why Us */
        .why-grid { display: grid; gap: 12px; margin-top: 18px; }
        .why-item { 
            display: flex; 
            align-items: flex-start; 
            padding: 12px 16px; 
            background: #f8f8f8; 
            border-radius: 8px; 
            page-break-inside: avoid;
        }
        .why-check { width: 22px; height: 22px; background: #000; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; margin-right: 12px; flex-shrink: 0; }
        .why-text { font-size: 13px; }
        
        /* CTA */
        .cta-section {
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            color: #fff;
            padding: 35px;
            border-radius: 12px;
            text-align: center;
            margin-top: 35px;
            page-break-inside: avoid;
        }
        .cta-title { font-size: 20px; font-weight: 700; margin-bottom: 15px; }
        .cta-text { color: #ccc; margin-bottom: 25px; font-size: 13px; }
        .cta-steps { display: flex; justify-content: center; gap: 25px; margin-bottom: 30px; }
        .cta-step { text-align: center; }
        .step-num { width: 28px; height: 28px; border: 2px solid #555; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 11px; color: #888; }
        .step-text { font-size: 11px; color: #aaa; line-height: 1.4; }
        .contacts { display: flex; justify-content: center; gap: 35px; padding-top: 20px; border-top: 1px solid #333; }
        .contact-item { display: flex; align-items: center; gap: 8px; }
        .contact-icon { width: 32px; height: 32px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .contact-value { font-size: 13px; font-weight: 500; }
        
        /* Footer */
        .footer { margin-top: 40px; padding-top: 25px; border-top: 1px solid #e5e5e5; text-align: center; }
        .footer-logo { font-size: 22px; font-weight: 800; letter-spacing: 3px; color: #000; margin-bottom: 8px; }
        .footer-text { font-size: 11px; color: #888; }
        
        /* Print & PDF styles */
        @media print {
            .kp-document {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .page {
                padding: 15mm 20mm !important;
            }
            
            .section {
                page-break-inside: avoid;
            }
            
            .stage, .why-item, .total-box, .cta-section, .highlight-box, .optional-box {
                page-break-inside: avoid;
            }
            
            .kp-document table {
                page-break-inside: avoid;
            }
            
            .kp-document tr {
                page-break-inside: avoid;
            }
        }
    </style>

    <div class="page">
        <!-- Header -->
        <header class="header">
            <div class="logo">RUSO</div>
            <div class="header-info">
                <p><strong>Дата:</strong> ${date}</p>
                <p>Коммерческое предложение</p>
            </div>
        </header>
        
        <!-- Title -->
        <section class="title-section">
            <p class="document-type">Коммерческое предложение</p>
            <h1 class="main-title">${kp.project_title}</h1>
            
            <div class="client-info">
                <p><strong>Клиент:</strong> ${kp.client_name}</p>
                ${kp.project_url ? `<p><strong>Проект:</strong> ${kp.project_url}</p>` : ''}
            </div>
            
            ${kp.tagline ? `<p class="tagline">${kp.tagline}</p>` : ''}
        </section>
        
        <!-- Section 01: Understanding -->
        <section class="section">
            <div class="section-header">
                <span class="section-number">01</span>
                <h2 class="section-title">Понимание задачи</h2>
            </div>
            
            <p>${kp.understanding.intro}</p>
            
            ${kp.understanding.critical_problems?.length ? `
            <div class="highlight-box">
                <strong>Критические проблемы:</strong>
                <ul>
                    ${kp.understanding.critical_problems.map(p => `
                        <li>${p.problem} — <strong>${p.consequence}</strong></li>
                    `).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${kp.understanding.preparation_tasks?.length ? `
            <h3>Задачи на подготовку:</h3>
            <ul>
                ${kp.understanding.preparation_tasks.map(t => `<li>${t}</li>`).join('')}
            </ul>
            ` : ''}
            
            <p><strong>Цель проекта:</strong> ${kp.understanding.goal}</p>
        </section>
        
        <!-- Section 02: Solution -->
        <section class="section">
            <div class="section-header">
                <span class="section-number">02</span>
                <h2 class="section-title">Наше решение</h2>
            </div>
            
            <h3>Подход: «${kp.solution.approach}»</h3>
            <p>${kp.solution.approach_description}</p>
            
            ${kp.solution.methodology?.length ? `
            <h3>Методология:</h3>
            <ul>
                ${kp.solution.methodology.map(m => `<li><strong>${m.name}</strong> — ${m.description}</li>`).join('')}
            </ul>
            ` : ''}
            
            ${kp.solution.problems_table?.length ? `
            <h3>Почему это важно для бизнеса:</h3>
            <table class="problem-table">
                <tr>
                    <th>Проблема</th>
                    <th>Последствия</th>
                    <th>Наше решение</th>
                </tr>
                ${kp.solution.problems_table.map(row => `
                    <tr>
                        <td>${row.problem}</td>
                        <td>${row.consequence}</td>
                        <td>${row.solution}</td>
                    </tr>
                `).join('')}
            </table>
            ` : ''}
        </section>
        
        <!-- Section 03: Stages -->
        <section class="section">
            <div class="section-header">
                <span class="section-number">03</span>
                <h2 class="section-title">Этапы работ</h2>
            </div>
            
            ${kp.stages.map(stage => `
            <div class="stage">
                <div class="stage-header">
                    <span class="stage-title">ЭТАП ${stage.number}: ${stage.title}</span>
                    <span class="stage-time">${stage.duration}</span>
                </div>
                
                ${stage.substages.map(sub => `
                <div class="substage">
                    <p class="substage-title">${sub.number}. ${sub.title}</p>
                    <ul>
                        ${sub.tasks.map(t => `<li>${t}</li>`).join('')}
                    </ul>
                </div>
                `).join('')}
            </div>
            `).join('')}
        </section>
        
        <!-- Section 04: Estimate -->
        <section class="section">
            <div class="section-header">
                <span class="section-number">04</span>
                <h2 class="section-title">Смета и сроки</h2>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%;">№</th>
                        <th style="width: 22%;">Этап работ</th>
                        <th style="width: 43%;">Состав работ</th>
                        <th style="width: 12%;">Срок</th>
                        <th style="width: 18%;">Стоимость</th>
                    </tr>
                </thead>
                <tbody>
                    ${kp.estimate.items.map(item => `
                    <tr>
                        <td class="table-number">${item.number}</td>
                        <td><strong>${item.stage}</strong></td>
                        <td>${item.description}</td>
                        <td class="table-days">${item.days}</td>
                        <td class="table-price">${formatPrice(item.price)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="total-box">
                <div class="total-row">
                    <span class="total-label">Общая стоимость проекта:</span>
                    <span class="total-value price">${formatPrice(kp.estimate.total_price)}</span>
                </div>
                <div class="total-row">
                    <span class="total-label">Общий срок выполнения:</span>
                    <span class="total-value total-small">${kp.estimate.total_days}</span>
                </div>
                <div class="total-row">
                    <span class="total-label">Условия оплаты:</span>
                    <span class="total-value total-small">${kp.estimate.payment_terms}</span>
                </div>
            </div>
            
            <p class="validity">Цена действительна ${kp.estimate.validity}</p>
            
            ${kp.includes?.length ? `
            <h3>Что входит в стоимость:</h3>
            <div class="includes-grid">
                ${kp.includes.map(i => `<div class="include-item">${i}</div>`).join('')}
            </div>
            ` : ''}
            
            ${kp.optional?.length ? `
            <div class="optional-box">
                <h4>Опционально (на будущее):</h4>
                ${kp.optional.map(o => `
                <div class="optional-item">
                    <span>${o.service}</span>
                    <span>${o.price}</span>
                </div>
                `).join('')}
            </div>
            ` : ''}
        </section>
        
        <!-- Section 05: Why Us -->
        <section class="section">
            <div class="section-header">
                <span class="section-number">05</span>
                <h2 class="section-title">Почему мы</h2>
            </div>
            
            <div class="why-grid">
                ${kp.why_us.map(item => `
                <div class="why-item">
                    <div class="why-check">✓</div>
                    <div class="why-text"><strong>${item.title}</strong> — ${item.description}</div>
                </div>
                `).join('')}
            </div>
        </section>
        
        <!-- CTA Section -->
        <section class="cta-section">
            <h2 class="cta-title">${kp.cta.title}</h2>
            <p class="cta-text">${kp.cta.subtitle}</p>
            
            <div class="cta-steps">
                ${kp.cta.steps.map((step, i) => `
                <div class="cta-step">
                    <div class="step-num">${i + 1}</div>
                    <div class="step-text">${step}</div>
                </div>
                `).join('')}
            </div>
            
            <div class="contacts">
                <div class="contact-item">
                    <div class="contact-icon">📞</div>
                    <div class="contact-value">${formData.managerPhone}</div>
                </div>
                <div class="contact-item">
                    <div class="contact-icon">✉️</div>
                    <div class="contact-value">${formData.managerEmail}</div>
                </div>
            </div>
        </section>
        
        <!-- Footer -->
        <footer class="footer">
            <div class="footer-logo">RUSO</div>
            <p class="footer-text">Веб-разработка и дизайн • ${CONFIG.agency.site}</p>
        </footer>
    </div>
</div>
        `;
    }
};

// ============================================================
// UI CONTROLLER
// ============================================================
const UI = {
    elements: {},

    init() {
        this.elements = {
            form: document.getElementById('kpForm'),
            preview: document.getElementById('kpPreview'),
            btnGenerate: document.getElementById('btnGenerate'),
            btnDownload: document.getElementById('btnDownload'),
            btnPrint: document.getElementById('btnPrint'),
            btnClear: document.getElementById('btnClear'),
            loading: document.getElementById('loadingOverlay'),
            clientRequest: document.getElementById('client-request'),
            projectUrl: document.getElementById('project-url'),
            priceTotal: document.getElementById('price-total'),
            managerName: document.getElementById('manager-name'),
            managerPhone: document.getElementById('manager-phone'),
            managerEmail: document.getElementById('manager-email')
        };

        this.bindEvents();
        this.loadSavedData();
    },

    bindEvents() {
        this.elements.btnGenerate?.addEventListener('click', () => this.handleGenerate());
        this.elements.btnDownload?.addEventListener('click', () => this.handleDownload());
        this.elements.btnPrint?.addEventListener('click', () => this.handlePrint());
        this.elements.btnClear?.addEventListener('click', () => this.handleClear());
        this.elements.form?.addEventListener('input', () => this.saveData());
    },

    async handleGenerate() {
        const clientRequest = this.elements.clientRequest?.value?.trim();

        if (!clientRequest) {
            alert('Пожалуйста, вставьте запрос клиента');
            this.elements.clientRequest?.focus();
            return;
        }

        const formData = {
            projectUrl: this.elements.projectUrl?.value?.trim() || '',
            price: this.elements.priceTotal?.value?.trim() || '150 000',
            managerName: this.elements.managerName?.value?.trim() || 'Менеджер',
            managerPhone: this.elements.managerPhone?.value?.trim() || CONFIG.agency.phone,
            managerEmail: this.elements.managerEmail?.value?.trim() || CONFIG.agency.email
        };

        this.showLoading();

        try {
            const kp = await AIHelper.generateKP(clientRequest, formData);
            const html = KPRenderer.render(kp, formData);

            this.elements.preview.innerHTML = html;
            this.elements.btnDownload.disabled = false;
            this.elements.btnPrint.disabled = false;

            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            console.error('Generation error:', error);
            alert('Ошибка генерации: ' + error.message);
        }
    },

    handleDownload() {
        const element = this.elements.preview;

        // Создаём временный контейнер для PDF
        const pdfContainer = document.createElement('div');
        pdfContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 794px;
        background: white;
    `;

        // Клонируем содержимое
        pdfContainer.innerHTML = element.innerHTML;
        document.body.appendChild(pdfContainer);

        // Ждём рендеринга
        setTimeout(() => {
            const contentHeight = pdfContainer.scrollHeight;

            // A4: 210 x 297 мм, но делаем одну длинную страницу
            const pageWidthMm = 210;
            const pageWidthPx = 794; // 210mm при 96dpi
            const ratio = pageWidthMm / pageWidthPx;
            const pageHeightMm = Math.ceil(contentHeight * ratio) + 20;

            const opt = {
                margin: [10, 0, 10, 0], // top, left, bottom, right
                filename: `KP_RUSO_${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false
                },
                jsPDF: {
                    unit: 'mm',
                    format: [pageWidthMm, pageHeightMm],
                    orientation: 'portrait'
                }
            };

            const btnText = this.elements.btnDownload.innerHTML;
            this.elements.btnDownload.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Создание...';
            this.elements.btnDownload.disabled = true;

            html2pdf()
                .set(opt)
                .from(pdfContainer)
                .save()
                .then(() => {
                    document.body.removeChild(pdfContainer);
                    this.elements.btnDownload.innerHTML = btnText;
                    this.elements.btnDownload.disabled = false;
                })
                .catch((err) => {
                    console.error('PDF Error:', err);
                    document.body.removeChild(pdfContainer);
                    this.elements.btnDownload.innerHTML = btnText;
                    this.elements.btnDownload.disabled = false;
                });
        }, 100);
    },

    handlePrint() {
        const content = this.elements.preview.innerHTML;
        const win = window.open('', '_blank', 'width=900,height=700');
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>КП RUSO</title>
                <meta charset="UTF-8">
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
                <style>
                    @page {
                        size: A4;
                        margin: 15mm 20mm;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                </style>
            </head>
            <body>${content}</body>
            </html>
        `);
        win.document.close();

        // Ждём загрузки шрифтов
        setTimeout(() => {
            win.print();
        }, 1000);
    },

    handleClear() {
        if (confirm('Очистить форму и сгенерированное КП?')) {
            localStorage.removeItem('ruso_kp_data');
            AIHelper.currentKP = null;
            location.reload();
        }
    },

    showLoading() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'flex';
        }
    },

    hideLoading() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'none';
        }
    },

    saveData() {
        const data = {
            clientRequest: this.elements.clientRequest?.value || '',
            projectUrl: this.elements.projectUrl?.value || '',
            price: this.elements.priceTotal?.value || '',
            managerName: this.elements.managerName?.value || '',
            managerPhone: this.elements.managerPhone?.value || '',
            managerEmail: this.elements.managerEmail?.value || ''
        };
        localStorage.setItem('ruso_kp_data', JSON.stringify(data));
    },

    loadSavedData() {
        const saved = localStorage.getItem('ruso_kp_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (this.elements.clientRequest) this.elements.clientRequest.value = data.clientRequest || '';
                if (this.elements.projectUrl) this.elements.projectUrl.value = data.projectUrl || '';
                if (this.elements.priceTotal) this.elements.priceTotal.value = data.price || '150 000';
                if (this.elements.managerName) this.elements.managerName.value = data.managerName || '';
                if (this.elements.managerPhone) this.elements.managerPhone.value = data.managerPhone || '';
                if (this.elements.managerEmail) this.elements.managerEmail.value = data.managerEmail || '';
            } catch (e) {
                console.warn('Failed to load saved data');
            }
        }
    }
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});