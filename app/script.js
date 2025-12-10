// ============================================================
// RUSO KP GENERATOR v3.3 - Print to PDF
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
// AI HELPER
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
        const priceNum = parseInt(formData.price.replace(/\s/g, '').replace(/[^\d]/g, '')) || 150000;

        return `Ты — коммерческий директор и арт-директор digital-агентства RUSO с 15+ летним опытом. 
Создай МАКСИМАЛЬНО ДЕТАЛЬНОЕ коммерческое предложение на 5-7 страниц.

=== АГЕНТСТВО RUSO ===
- 15+ лет на рынке, 250+ проектов
- Веб-разработка, дизайн, SEO, SMM
- Клиенты: страховые, банки, ритейл, автобренды
- Контакты: ${CONFIG.agency.email}, ${CONFIG.agency.phone}

=== ЗАПРОС КЛИЕНТА ===
${clientRequest}

${formData.projectUrl ? `Проект: ${formData.projectUrl}` : ''}

=== БЮДЖЕТ: ${priceNum} ₽ ===

=== ФОРМАТ JSON ===
{
    "project_title": "Название проекта",
    "client_name": "Клиент",
    "project_url": "URL если есть",
    "tagline": "Слоган проекта",
    
    "understanding": {
        "intro": "2-3 абзаца о проекте клиента",
        "critical_problems": [
            {"problem": "Проблема", "consequence": "Последствие для бизнеса"}
        ],
        "preparation_tasks": ["Задача 1", "Задача 2", "Задача 3"],
        "goal": "Цель проекта"
    },
    
    "solution": {
        "approach": "Название подхода",
        "approach_description": "Описание в 2-3 предложениях",
        "methodology": [
            {"name": "Методология", "description": "Описание"}
        ],
        "problems_table": [
            {"problem": "Проблема", "consequence": "Последствие", "solution": "Решение"}
        ]
    },
    
    "stages": [
        {
            "number": "1",
            "title": "НАЗВАНИЕ ЭТАПА",
            "duration": "X рабочих дней",
            "substages": [
                {"number": "1.1", "title": "Подэтап", "tasks": ["Задача 1", "Задача 2", "Задача 3"]}
            ]
        }
    ],
    
    "estimate": {
        "items": [
            {"number": 1, "stage": "Этап", "description": "Описание работ", "days": "X дней", "price": 15000}
        ],
        "total_price": ${priceNum},
        "total_days": "30 рабочих дней",
        "payment_terms": "50% предоплата / 50% по завершении",
        "validity": "10 дней"
    },
    
    "includes": ["Все работы по ТЗ", "2 раунда правок", "Гарантия 14 дней", "Рекомендации"],
    "optional": [{"service": "SEO-продвижение", "price": "от 25 000 ₽/мес"}],
    
    "why_us": [
        {"title": "Работаем по договору", "description": "юридические гарантии"},
        {"title": "Уникальные решения", "description": "не используем шаблоны"},
        {"title": "Опыт в нише", "description": "понимаем специфику"},
        {"title": "Прозрачность", "description": "еженедельные отчёты"}
    ],
    
    "cta": {
        "title": "Готовы обсудить проект?",
        "subtitle": "Созвонимся на 15-20 минут:",
        "steps": ["Уточним приоритеты", "Обсудим референсы", "Согласуем сроки"]
    }
}

ВАЖНО: Сумма items.price должна равняться ${priceNum}`;
    }
};

// ============================================================
// KP RENDERER
// ============================================================
const KPRenderer = {
    render(kp, formData) {
        const date = new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const formatPrice = (num) => new Intl.NumberFormat('ru-RU').format(num) + ' ₽';

        return `
<div style="font-family: 'Inter', -apple-system, sans-serif; font-size: 14px; line-height: 1.65; color: #1a1a1a; background: #fff; padding: 50px 55px; max-width: 800px; margin: 0 auto;">
    
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 45px; padding-bottom: 25px; border-bottom: 1px solid #e0e0e0;">
        <div style="font-size: 28px; font-weight: 800; letter-spacing: 2px; color: #000;">RUSO</div>
        <div style="text-align: right; font-size: 12px; color: #777;">
            <div><strong>Дата:</strong> ${date}</div>
            <div style="margin-top: 3px;">Коммерческое предложение</div>
        </div>
    </div>
    
    <!-- Title -->
    <div style="margin-bottom: 40px;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 10px;">Коммерческое предложение</div>
        <h1 style="font-size: 24px; font-weight: 700; line-height: 1.3; margin: 0 0 16px 0; color: #000;">${kp.project_title || 'Проект'}</h1>
        
        <div style="background: #f7f7f7; padding: 16px 20px; border-radius: 6px;">
            <div style="font-size: 13px; margin-bottom: 3px;"><strong>Клиент:</strong> ${kp.client_name || 'Клиент'}</div>
            ${kp.project_url ? `<div style="font-size: 13px;"><strong>Проект:</strong> ${kp.project_url}</div>` : ''}
        </div>
        
        ${kp.tagline ? `<div style="font-size: 14px; font-style: italic; color: #555; margin-top: 20px; padding-left: 16px; border-left: 3px solid #000;">${kp.tagline}</div>` : ''}
    </div>
    
    <!-- 01 Understanding -->
    <div style="margin-bottom: 35px;">
        <div style="display: flex; align-items: baseline; margin-bottom: 18px;">
            <span style="font-size: 38px; font-weight: 800; color: #e8e8e8; margin-right: 15px; line-height: 1;">01</span>
            <h2 style="font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #000; margin: 0;">Понимание задачи</h2>
        </div>
        
        <p style="margin: 0 0 12px 0; color: #444; font-size: 13px;">${kp.understanding?.intro || ''}</p>
        
        ${kp.understanding?.critical_problems?.length ? `
        <div style="background: #f9f9f9; padding: 16px 20px; border-radius: 6px; margin: 16px 0; border-left: 3px solid #c00;">
            <strong style="color: #c00; font-size: 13px;">Критические проблемы:</strong>
            <ul style="list-style: none; margin: 10px 0 0 0; padding: 0;">
                ${kp.understanding.critical_problems.map(p => `
                    <li style="padding: 5px 0 5px 20px; position: relative; font-size: 12px; color: #444;">
                        <span style="position: absolute; left: 0; color: #999;">—</span>
                        ${p.problem} — <strong style="color: #c00;">${p.consequence}</strong>
                    </li>
                `).join('')}
            </ul>
        </div>
        ` : ''}
        
        ${kp.understanding?.preparation_tasks?.length ? `
        <div style="font-size: 13px; font-weight: 600; margin: 18px 0 10px; color: #000;">Задачи:</div>
        <ul style="list-style: none; margin: 0; padding: 0;">
            ${kp.understanding.preparation_tasks.map(t => `<li style="padding: 4px 0 4px 20px; position: relative; font-size: 12px; color: #444;"><span style="position: absolute; left: 0; color: #999;">—</span>${t}</li>`).join('')}
        </ul>
        ` : ''}
        
        <p style="margin: 15px 0 0 0; font-size: 13px; color: #444;"><strong>Цель:</strong> ${kp.understanding?.goal || ''}</p>
    </div>
    
    <!-- 02 Solution -->
    <div style="margin-bottom: 35px;">
        <div style="display: flex; align-items: baseline; margin-bottom: 18px;">
            <span style="font-size: 38px; font-weight: 800; color: #e8e8e8; margin-right: 15px; line-height: 1;">02</span>
            <h2 style="font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #000; margin: 0;">Наше решение</h2>
        </div>
        
        <div style="font-size: 13px; font-weight: 600; margin: 0 0 8px; color: #000;">Подход: «${kp.solution?.approach || ''}»</div>
        <p style="margin: 0 0 15px 0; color: #444; font-size: 13px;">${kp.solution?.approach_description || ''}</p>
        
        ${kp.solution?.methodology?.length ? `
        <div style="font-size: 13px; font-weight: 600; margin: 18px 0 10px; color: #000;">Методология:</div>
        <ul style="list-style: none; margin: 0; padding: 0;">
            ${kp.solution.methodology.map(m => `<li style="padding: 4px 0 4px 20px; position: relative; font-size: 12px; color: #444;"><span style="position: absolute; left: 0; color: #999;">—</span><strong>${m.name}</strong> — ${m.description}</li>`).join('')}
        </ul>
        ` : ''}
        
        ${kp.solution?.problems_table?.length ? `
        <div style="font-size: 13px; font-weight: 600; margin: 20px 0 12px; color: #000;">Почему это важно:</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <tr>
                <th style="background: #222; color: #fff; padding: 10px 12px; text-align: left; font-weight: 500; font-size: 9px; text-transform: uppercase;">Проблема</th>
                <th style="background: #222; color: #fff; padding: 10px 12px; text-align: left; font-weight: 500; font-size: 9px; text-transform: uppercase;">Последствия</th>
                <th style="background: #222; color: #fff; padding: 10px 12px; text-align: left; font-weight: 500; font-size: 9px; text-transform: uppercase;">Решение</th>
            </tr>
            ${kp.solution.problems_table.map(row => `
                <tr>
                    <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-weight: 500;">${row.problem}</td>
                    <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #c00;">${row.consequence}</td>
                    <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #080; font-weight: 500;">${row.solution}</td>
                </tr>
            `).join('')}
        </table>
        ` : ''}
    </div>
    
    <!-- 03 Stages -->
    <div style="margin-bottom: 35px;">
        <div style="display: flex; align-items: baseline; margin-bottom: 18px;">
            <span style="font-size: 38px; font-weight: 800; color: #e8e8e8; margin-right: 15px; line-height: 1;">03</span>
            <h2 style="font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #000; margin: 0;">Этапы работ</h2>
        </div>
        
        ${(kp.stages || []).map(stage => `
        <div style="margin-bottom: 20px; padding: 18px; background: #f9f9f9; border-radius: 6px; border-left: 3px solid #222;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <span style="font-size: 13px; font-weight: 700; color: #000;">ЭТАП ${stage.number}: ${stage.title}</span>
                <span style="font-size: 10px; color: #666; background: #fff; padding: 3px 10px; border-radius: 12px; border: 1px solid #ddd;">${stage.duration}</span>
            </div>
            
            ${(stage.substages || []).map(sub => `
            <div style="margin-top: 10px;">
                <div style="font-size: 11px; font-weight: 600; color: #333; margin-bottom: 5px;">${sub.number}. ${sub.title}</div>
                <ul style="list-style: none; margin: 0; padding: 0;">
                    ${(sub.tasks || []).map(t => `<li style="font-size: 11px; padding: 3px 0 3px 16px; color: #555; position: relative;"><span style="position: absolute; left: 0; color: #aaa;">—</span>${t}</li>`).join('')}
                </ul>
            </div>
            `).join('')}
        </div>
        `).join('')}
    </div>
    
    <!-- 04 Estimate -->
    <div style="margin-bottom: 35px;">
        <div style="display: flex; align-items: baseline; margin-bottom: 18px;">
            <span style="font-size: 38px; font-weight: 800; color: #e8e8e8; margin-right: 15px; line-height: 1;">04</span>
            <h2 style="font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #000; margin: 0;">Смета и сроки</h2>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
                <tr>
                    <th style="background: #222; color: #fff; padding: 10px 8px; text-align: left; font-weight: 500; font-size: 9px; text-transform: uppercase; width: 5%;">№</th>
                    <th style="background: #222; color: #fff; padding: 10px 8px; text-align: left; font-weight: 500; font-size: 9px; text-transform: uppercase; width: 20%;">Этап</th>
                    <th style="background: #222; color: #fff; padding: 10px 8px; text-align: left; font-weight: 500; font-size: 9px; text-transform: uppercase; width: 45%;">Состав работ</th>
                    <th style="background: #222; color: #fff; padding: 10px 8px; text-align: center; font-weight: 500; font-size: 9px; text-transform: uppercase; width: 12%;">Срок</th>
                    <th style="background: #222; color: #fff; padding: 10px 8px; text-align: right; font-weight: 500; font-size: 9px; text-transform: uppercase; width: 18%;">Цена</th>
                </tr>
            </thead>
            <tbody>
                ${(kp.estimate?.items || []).map(item => `
                <tr>
                    <td style="padding: 10px 8px; border-bottom: 1px solid #eee; color: #888; font-weight: 600;">${item.number}</td>
                    <td style="padding: 10px 8px; border-bottom: 1px solid #eee; font-weight: 600;">${item.stage}</td>
                    <td style="padding: 10px 8px; border-bottom: 1px solid #eee;">${item.description}</td>
                    <td style="padding: 10px 8px; border-bottom: 1px solid #eee; text-align: center; color: #666;">${item.days}</td>
                    <td style="padding: 10px 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${formatPrice(item.price)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div style="background: #222; color: #fff; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid #444;">
                <span style="font-size: 12px; color: #aaa;">Общая стоимость:</span>
                <span style="font-size: 20px; font-weight: 700;">${formatPrice(kp.estimate?.total_price || 0)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid #444;">
                <span style="font-size: 12px; color: #aaa;">Срок:</span>
                <span style="font-size: 12px; font-weight: 500;">${kp.estimate?.total_days || ''}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: #aaa;">Оплата:</span>
                <span style="font-size: 12px; font-weight: 500;">${kp.estimate?.payment_terms || ''}</span>
            </div>
        </div>
        
        <div style="font-size: 10px; color: #999; text-align: center;">Цена действительна ${kp.estimate?.validity || '10 дней'}</div>
        
        ${kp.includes?.length ? `
        <div style="font-size: 12px; font-weight: 600; margin: 18px 0 10px; color: #000;">Что входит:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${kp.includes.map(i => `<span style="padding: 5px 10px; background: #f5f5f5; border-radius: 4px; font-size: 11px;">✓ ${i}</span>`).join('')}
        </div>
        ` : ''}
        
        ${kp.optional?.length ? `
        <div style="background: #f9f9f9; padding: 14px; border-radius: 6px; margin-top: 16px;">
            <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Опционально:</div>
            ${kp.optional.map(o => `
            <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 11px; border-bottom: 1px dashed #ddd;">
                <span>${o.service}</span><span>${o.price}</span>
            </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
    
    <!-- 05 Why Us -->
    <div style="margin-bottom: 35px;">
        <div style="display: flex; align-items: baseline; margin-bottom: 18px;">
            <span style="font-size: 38px; font-weight: 800; color: #e8e8e8; margin-right: 15px; line-height: 1;">05</span>
            <h2 style="font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #000; margin: 0;">Почему мы</h2>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(kp.why_us || []).map(item => `
            <div style="display: flex; align-items: flex-start; padding: 10px 14px; background: #f7f7f7; border-radius: 6px;">
                <span style="width: 18px; height: 18px; background: #222; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; margin-right: 10px; flex-shrink: 0;">✓</span>
                <span style="font-size: 12px;"><strong>${item.title}</strong> — ${item.description}</span>
            </div>
            `).join('')}
        </div>
    </div>
    
    <!-- CTA -->
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); color: #fff; padding: 28px; border-radius: 10px; text-align: center; margin-top: 30px;">
        <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px;">${kp.cta?.title || 'Готовы обсудить?'}</div>
        <div style="color: #bbb; font-size: 12px; margin-bottom: 20px;">${kp.cta?.subtitle || ''}</div>
        
        <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 22px; flex-wrap: wrap;">
            ${(kp.cta?.steps || []).map((step, i) => `
            <div style="text-align: center;">
                <div style="width: 22px; height: 22px; border: 1px solid #555; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; font-size: 10px; color: #888;">${i + 1}</div>
                <div style="font-size: 10px; color: #999; max-width: 90px;">${step}</div>
            </div>
            `).join('')}
        </div>
        
        <div style="display: flex; justify-content: center; gap: 25px; padding-top: 18px; border-top: 1px solid #444; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 26px; height: 26px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">📞</span>
                <span style="font-size: 12px;">${formData.managerPhone}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 26px; height: 26px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">✉️</span>
                <span style="font-size: 12px;">${formData.managerEmail}</span>
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
        <div style="font-size: 18px; font-weight: 800; letter-spacing: 2px; color: #000; margin-bottom: 4px;">RUSO</div>
        <div style="font-size: 10px; color: #888;">${CONFIG.agency.site}</div>
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

    // ============================================================
    // СКАЧАТЬ PDF / ПЕЧАТЬ — открывает новое окно без разрывов
    // ============================================================
    handleDownload() {
        this.openPrintWindow();
    },

    handlePrint() {
        this.openPrintWindow();
    },

    openPrintWindow() {
        const content = this.elements.preview.innerHTML;

        const printWindow = window.open('', '_blank', 'width=900,height=700');

        printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>КП RUSO</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            width: 100%;
            height: auto;
        }
        
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: #fff;
            padding: 0;
            margin: 0;
        }
        
        /* Убираем ВСЕ разрывы страниц */
        @media print {
            html, body {
                width: 210mm;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            @page {
                size: 210mm auto; /* Ширина A4, высота автоматическая */
                margin: 0;
            }
            
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Запрещаем все разрывы */
            * {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            
            div, table, tr, p, h1, h2, h3 {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
        }
        
        .print-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        }
        
        @media print {
            .print-controls {
                display: none !important;
            }
        }
        
        .print-btn {
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-family: inherit;
        }
        
        .print-btn-primary {
            background: #222;
            color: #fff;
        }
        
        .print-btn-primary:hover {
            background: #000;
        }
        
        .print-btn-secondary {
            background: #f0f0f0;
            color: #333;
        }
        
        .print-btn-secondary:hover {
            background: #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="print-controls">
        <button class="print-btn print-btn-primary" onclick="window.print()">
            📄 Сохранить как PDF / Печать
        </button>
        <button class="print-btn print-btn-secondary" onclick="window.close()">
            ✕ Закрыть
        </button>
    </div>
    
    ${content}
    
    <script>
        // Ждём загрузки шрифтов
        document.fonts.ready.then(function() {
            console.log('Fonts loaded, ready to print');
        });
    </script>
</body>
</html>
        `);

        printWindow.document.close();
    },

    handleClear() {
        if (confirm('Очистить форму?')) {
            localStorage.removeItem('ruso_kp_data');
            AIHelper.currentKP = null;
            location.reload();
        }
    },

    showLoading() {
        if (this.elements.loading) this.elements.loading.style.display = 'flex';
    },

    hideLoading() {
        if (this.elements.loading) this.elements.loading.style.display = 'none';
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
        try {
            const saved = JSON.parse(localStorage.getItem('ruso_kp_data') || '{}');
            if (this.elements.clientRequest) this.elements.clientRequest.value = saved.clientRequest || '';
            if (this.elements.projectUrl) this.elements.projectUrl.value = saved.projectUrl || '';
            if (this.elements.priceTotal) this.elements.priceTotal.value = saved.price || '150 000';
            if (this.elements.managerName) this.elements.managerName.value = saved.managerName || '';
            if (this.elements.managerPhone) this.elements.managerPhone.value = saved.managerPhone || '';
            if (this.elements.managerEmail) this.elements.managerEmail.value = saved.managerEmail || '';
        } catch (e) { }
    }
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => UI.init());