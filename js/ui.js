/**
 * إدارة واجهة المستخدم
 * يتعامل مع جميع عناصر الواجهة والتفاعلات
 */

class UIManager {
    constructor() {
        this.cookieButton = null;
        this.cookieCountElement = null;
        this.cpsElement = null;
        this.clickEffectContainer = null;
        this.lastUpdateTime = Date.now();
    }
    
    /**
     * تهيئة واجهة المستخدم
     */
    init() {
        // الحصول على العناصر
        this.cookieButton = document.getElementById('cookie-button');
        this.cookieCountElement = document.getElementById('cookie-count');
        this.cpsElement = document.getElementById('cookies-per-second');
        this.clickEffectContainer = document.getElementById('click-effect-container');
        
        // إعداد الأحداث
        this.setupEvents();
        
        // بدء حلقة التحديث
        this.startUpdateLoop();
        
        // إخفاء شاشة التحميل
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('game-container').style.display = 'flex';
        }, 1000);
    }
    
    /**
     * إعداد الأحداث
     */
    setupEvents() {
        // نقرة الكوكيز
        this.cookieButton.addEventListener('click', (e) => this.handleCookieClick(e));
        
        // تبديل التبويبات
        const shopTabs = document.querySelectorAll('.shop-tab');
        shopTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });
        
        // أزرار الفوتر
        document.getElementById('save-button').addEventListener('click', () => {
            saveSystem.save();
        });
        
        document.getElementById('reset-button').addEventListener('click', () => {
            this.showConfirmDialog(
                'هل أنت متأكد من إعادة تعيين اللعبة؟ سيتم حذف جميع البيانات!',
                () => {
                    saveSystem.reset();
                }
            );
        });
        
        document.getElementById('settings-button').addEventListener('click', () => {
            this.showSettingsModal();
        });
        
        // إغلاق النوافذ المنبثقة
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });
        
        // الإعدادات
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            gameState.settings.sound = e.target.checked;
        });
        
        document.getElementById('auto-save-toggle').addEventListener('change', (e) => {
            gameState.settings.autoSave = e.target.checked;
            if (e.target.checked) {
                saveSystem.startAutoSave();
            } else {
                saveSystem.stopAutoSave();
            }
        });
        
        document.getElementById('export-save').addEventListener('click', () => {
            saveSystem.export();
        });
        
        document.getElementById('import-save').addEventListener('click', () => {
            saveSystem.showImportDialog();
        });
        
        // نافذة التأكيد
        document.getElementById('confirm-no').addEventListener('click', () => {
            this.closeAllModals();
        });
    }
    
    /**
     * التعامل مع نقرة الكوكيز
     */
    handleCookieClick(event) {
        gameState.handleClick();
        
        // تأثير بصري
        this.createClickEffect(event);
        
        // تحديث العرض
        this.updateCookieCount();
    }
    
    /**
     * إنشاء تأثير النقرة
     */
    createClickEffect(event) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.textContent = '+' + this.formatNumber(gameState.clickValue);
        
        // حساب الموقع
        const rect = this.cookieButton.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        
        this.clickEffectContainer.appendChild(effect);
        
        // إزالة التأثير بعد الانتهاء
        setTimeout(() => {
            this.clickEffectContainer.removeChild(effect);
        }, 1000);
    }
    
    /**
     * تبديل التبويبات
     */
    switchTab(tabName) {
        // تحديث أزرار التبويبات
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // تحديث المحتوى
        document.querySelectorAll('.shop-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }
    
    /**
     * عرض نافذة الإعدادات
     */
    showSettingsModal() {
        const modal = document.getElementById('settings-modal');
        modal.classList.add('active');
        
        // تحديث قيم الإعدادات
        document.getElementById('sound-toggle').checked = gameState.settings.sound;
        document.getElementById('auto-save-toggle').checked = gameState.settings.autoSave;
    }
    
    /**
     * عرض نافذة التأكيد
     */
    showConfirmDialog(message, onConfirm) {
        const modal = document.getElementById('confirm-modal');
        const messageElement = document.getElementById('confirm-message');
        
        messageElement.textContent = message;
        modal.classList.add('active');
        
        // إزالة المستمعات القديمة
        const yesBtn = document.getElementById('confirm-yes');
        const newYesBtn = yesBtn.cloneNode(true);
        yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
        
        // إضافة المستمع الجديد
        newYesBtn.addEventListener('click', () => {
            onConfirm();
            this.closeAllModals();
        });
    }
    
    /**
     * إغلاق جميع النوافذ المنبثقة
     */
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    /**
     * بدء حلقة التحديث
     */
    startUpdateLoop() {
        const update = () => {
            const now = Date.now();
            const deltaTime = now - this.lastUpdateTime;
            this.lastUpdateTime = now;
            
            // تحديث حالة اللعبة
            gameState.update(deltaTime);
            
            // تحديث الواجهة
            this.updateCookieCount();
            this.updateCPS();
            
            // تحديث المباني والترقيات (كل 500ms)
            if (Math.random() < 0.1) {
                buildingsManager.update();
                upgradesManager.update();
            }
            
            requestAnimationFrame(update);
        };
        
        requestAnimationFrame(update);
    }
    
    /**
     * تحديث عدد الكوكيز
     */
    updateCookieCount() {
        if (this.cookieCountElement) {
            this.cookieCountElement.textContent = this.formatNumber(gameState.cookies);
        }
    }
    
    /**
     * تحديث الإنتاج في الثانية
     */
    updateCPS() {
        if (this.cpsElement) {
            this.cpsElement.textContent = this.formatNumber(gameState.cookiesPerSecond);
        }
    }
    
    /**
     * تحديث جميع العناصر
     */
    updateAll() {
        this.updateCookieCount();
        this.updateCPS();
        buildingsManager.update();
        upgradesManager.update();
    }
    
    /**
     * تنسيق الأرقام
     */
    formatNumber(num) {
        if (num < 1000) {
            return Math.floor(num).toString();
        }
        
        const suffixes = ['', 'ألف', 'مليون', 'مليار', 'تريليون', 'كوادريليون'];
        const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
        
        if (tier <= 0) return Math.floor(num).toString();
        
        const suffix = suffixes[tier] || 'e' + (tier * 3);
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;
        
        return scaled.toFixed(2) + ' ' + suffix;
    }
}

// إنشاء نسخة عامة
const uiManager = new UIManager();

// جعلها متاحة عالمياً
window.uiManager = uiManager;
window.buildingsManager = buildingsManager;
window.upgradesManager = upgradesManager;
