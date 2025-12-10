// ============================================================
// RUSO KP GENERATOR - AI-Powered Commercial Proposal System
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
                max_tokens: 8192,
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
        return `Ты — коммерческий директор digital-агентства RUSO с 15+ летним опытом. 
Твоя задача — проанализировать запрос клиента и создать ДЕТАЛЬНОЕ коммерческое предложение.

=== ИНФОРМАЦИЯ ОБ АГЕНТСТВЕ RUSO ===
- Более 15 лет на рынке digital-услуг
- 250+ реализованных проектов
- Полный комплекс услуг: веб-разработка, дизайн, SEO, SMM, аналитика
- Высокие стандарты UI/UX
- Работали с крупнейшими компаниями: страховые, банки, ритейл, автобренды
- Ценности: качество, клиентоориентированность, соблюдение сроков
- Контакты: hello@ruso.ru, +7 (985) 817-65-00
- Сайт: ruso.ru

=== ЗАПРОС КЛИЕНТА ===
${clientRequest}

${formData.projectUrl ? `Ссылка на проект: ${formData.projectUrl}` : ''}

=== БЮДЖЕТ ===
${formData.price} ₽

=== ЗАДАЧА ===
1. Проанализируй запрос и определи ВСЕ необходимые работы
2. Разбей на логические этапы (от 3 до 6 этапов)
3. Для каждого этапа укажи детальное описание и результаты
4. Напиши убедительное вступление и заключение

=== ФОРМАТ ОТВЕТА (ТОЛЬКО JSON) ===
{
    "project_title": "Название проекта (например: Аудит и редизайн сайта alexbrus.ru)",
    "client_name": "Название клиента (извлеки из запроса или напиши 'Клиент')",
    "project_type": "Тип проекта: Аудит / Редизайн / Разработка / SEO / Комплексный",
    "intro": "2-3 абзаца. Покажи понимание задачи клиента, его болей и целей. Упомяни что RUSO имеет релевантный опыт.",
    "solution_summary": "1-2 абзаца о предлагаемом решении и подходе RUSO",
    "stages": [
        {
            "number": "01",
            "title": "Название этапа",
            "description": "Подробное описание этапа на 3-5 предложений. Что будем делать, как, зачем.",
            "deliverables": ["Результат 1", "Результат 2", "Результат 3"],
            "duration": "X дней/недель"
        }
    ],
    "why_ruso": [
        "15+ лет экспертизы в digital",
        "Опыт с проектами подобного типа",
        "Фиксированная стоимость без скрытых платежей",
        "Поддержка после запуска"
    ],
    "total_duration": "Общий срок реализации",
    "guarantee": "Информация о гарантиях (1-2 предложения)"
}`;
    }
};

// ============================================================
// KP RENDERER - Generates HTML for preview
// ============================================================
const KPRenderer = {
    render(kp, formData) {
        const date = new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return `
        <div style="font-family: 'Inter', -apple-system, sans-serif; color: #1a1a1a; line-height: 1.7;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); color: white; padding: 48px; margin: -1px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
                    <div style="font-size: 28px; font-weight: 800; letter-spacing: -0.03em;">
                        RUSO<span style="color: #ff4d4d;">.</span>
                    </div>
                    <div style="text-align: right; font-size: 13px; color: rgba(255,255,255,0.6);">
                        <div>Коммерческое предложение</div>
                        <div style="margin-top: 4px;">${date}</div>
                    </div>
                </div>
                <h1 style="font-size: 32px; font-weight: 700; margin: 0 0 12px 0; letter-spacing: -0.02em;">
                    ${kp.project_title}
                </h1>
                <p style="font-size: 16px; color: rgba(255,255,255,0.7); margin: 0;">
                    для ${kp.client_name}
                </p>
            </div>

            <!-- Content -->
            <div style="padding: 48px;">
                <!-- Intro -->
                <div style="margin-bottom: 40px;">
                    <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 16px; font-weight: 600;">
                        Понимание задачи
                    </h2>
                    <div style="font-size: 15px; color: #444; white-space: pre-line;">
                        ${kp.intro}
                    </div>
                </div>

                <!-- Solution -->
                <div style="margin-bottom: 40px; padding: 24px; background: #f8f8f8; border-radius: 12px;">
                    <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 16px; font-weight: 600;">
                        Наше решение
                    </h2>
                    <div style="font-size: 15px; color: #444; white-space: pre-line;">
                        ${kp.solution_summary}
                    </div>
                </div>

                <!-- Stages -->
                <div style="margin-bottom: 40px;">
                    <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 24px; font-weight: 600;">
                        Этапы работ
                    </h2>
                    ${kp.stages.map(stage => `
                        <div style="margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid #eee;">
                            <div style="display: flex; align-items: flex-start; gap: 20px;">
                                <div style="font-size: 32px; font-weight: 700; color: #ddd; line-height: 1;">
                                    ${stage.number}
                                </div>
                                <div style="flex: 1;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                        <h3 style="font-size: 18px; font-weight: 600; margin: 0;">
                                            ${stage.title}
                                        </h3>
                                        <span style="font-size: 13px; color: #888; background: #f0f0f0; padding: 4px 12px; border-radius: 20px;">
                                            ${stage.duration}
                                        </span>
                                    </div>
                                    <p style="font-size: 14px; color: #555; margin-bottom: 16px; white-space: pre-line;">
                                        ${stage.description}
                                    </p>
                                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                        ${stage.deliverables.map(d => `
                                            <span style="font-size: 12px; color: #666; background: #f5f5f5; padding: 6px 12px; border-radius: 6px;">
                                                ✓ ${d}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Why RUSO -->
                <div style="margin-bottom: 40px;">
                    <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 20px; font-weight: 600;">
                        Почему RUSO
                    </h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        ${kp.why_ruso.map(reason => `
                            <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: #fafafa; border-radius: 8px;">
                                <span style="color: #22c55e; font-size: 16px;">✓</span>
                                <span style="font-size: 14px; color: #444;">${reason}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Guarantee -->
                <div style="padding: 20px; background: #f0fdf4; border-radius: 12px; border-left: 4px solid #22c55e; margin-bottom: 40px;">
                    <strong style="color: #166534;">Гарантии:</strong>
                    <span style="color: #444; margin-left: 8px;">${kp.guarantee}</span>
                </div>
            </div>

            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); color: white; padding: 40px 48px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 8px;">
                            Стоимость проекта
                        </div>
                        <div style="font-size: 36px; font-weight: 700;">
                            ${formData.price} ₽
                        </div>
                        <div style="font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 8px;">
                            Срок реализации: ${kp.total_duration}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">
                            ${formData.managerName}
                        </div>
                        <div style="font-size: 14px; color: rgba(255,255,255,0.7);">
                            ${formData.managerPhone}
                        </div>
                        <div style="font-size: 14px; color: rgba(255,255,255,0.7);">
                            ${formData.managerEmail}
                        </div>
                    </div>
                </div>
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

        // Auto-save on input
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
        const opt = {
            margin: 0,
            filename: `KP_RUSO_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        this.elements.btnDownload.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Создание...';

        html2pdf().set(opt).from(element).save().then(() => {
            this.elements.btnDownload.innerHTML = '<i class="fa-solid fa-download"></i> Скачать PDF';
        });
    },

    handlePrint() {
        const content = this.elements.preview.innerHTML;
        const win = window.open('', '', 'width=800,height=600');
        win.document.write(`
            <html>
            <head>
                <title>КП RUSO</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
            </head>
            <body style="margin:0;padding:0;">${content}</body>
            </html>
        `);
        win.document.close();
        setTimeout(() => { win.print(); win.close(); }, 500);
    },

    handleClear() {
        if (confirm('Очистить форму и сгенерированное КП?')) {
            localStorage.removeItem('ruso_kp_data');
            AIHelper.currentKP = null;
            location.reload();
        }
    },

    showLoading() {
        this.elements.loading.style.display = 'flex';
    },

    hideLoading() {
        this.elements.loading.style.display = 'none';
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