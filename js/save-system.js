/**
 * نظام الحفظ والتحميل
 * يتعامل مع حفظ وتحميل بيانات اللعبة
 */

class SaveSystem {
    constructor() {
        this.autoSaveInterval = null;
    }
    
    /**
     * تهيئة نظام الحفظ
     */
    init() {
        // تحميل البيانات المحفوظة
        this.load();
        
        // بدء الحفظ التلقائي
        if (gameState.settings.autoSave) {
            this.startAutoSave();
        }
        
        // حفظ عند إغلاق الصفحة
        window.addEventListener('beforeunload', () => {
            this.save();
        });
    }
    
    /**
     * حفظ اللعبة
     */
    save() {
        try {
            const saveData = gameState.getSaveData();
            const jsonData = JSON.stringify(saveData);
            localStorage.setItem(CONFIG.SAVE_KEY, jsonData);
            
            // عرض رسالة نجاح
            this.showSaveMessage('✅ تم الحفظ بنجاح');
            
            return true;
        } catch (error) {
            console.error('خطأ في الحفظ:', error);
            this.showSaveMessage('❌ فشل الحفظ', true);
            return false;
        }
    }
    
    /**
     * تحميل اللعبة
     */
    load() {
        try {
            const jsonData = localStorage.getItem(CONFIG.SAVE_KEY);
            
            if (!jsonData) {
                console.log('لا توجد بيانات محفوظة');
                return false;
            }
            
            const saveData = JSON.parse(jsonData);
            const success = gameState.loadSaveData(saveData);
            
            if (success) {
                console.log('تم تحميل البيانات بنجاح');
                return true;
            } else {
                console.warn('فشل تحميل البيانات');
                return false;
            }
        } catch (error) {
            console.error('خطأ في التحميل:', error);
            return false;
        }
    }
    
    /**
     * بدء الحفظ التلقائي
     */
    startAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            this.save();
        }, CONFIG.AUTO_SAVE_INTERVAL);
    }
    
    /**
     * إيقاف الحفظ التلقائي
     */
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }
    
    /**
     * تصدير البيانات
     */
    export() {
        try {
            const saveData = gameState.getSaveData();
            const jsonData = JSON.stringify(saveData);
            const base64Data = btoa(jsonData);
            
            // نسخ إلى الحافظة
            if (navigator.clipboard) {
                navigator.clipboard.writeText(base64Data).then(() => {
                    this.showSaveMessage('✅ تم نسخ البيانات إلى الحافظة');
                }).catch(() => {
                    this.showExportDialog(base64Data);
                });
            } else {
                this.showExportDialog(base64Data);
            }
            
            return base64Data;
        } catch (error) {
            console.error('خطأ في التصدير:', error);
            this.showSaveMessage('❌ فشل التصدير', true);
            return null;
        }
    }
    
    /**
     * استيراد البيانات
     */
    import(base64Data) {
        try {
            if (!base64Data || base64Data.trim() === '') {
                this.showSaveMessage('❌ البيانات فارغة', true);
                return false;
            }
            
            const jsonData = atob(base64Data);
            const saveData = JSON.parse(jsonData);
            
            const success = gameState.loadSaveData(saveData);
            
            if (success) {
                this.showSaveMessage('✅ تم استيراد البيانات بنجاح');
                
                // تحديث الواجهة
                if (window.uiManager) {
                    window.uiManager.updateAll();
                }
                
                return true;
            } else {
                this.showSaveMessage('❌ البيانات غير صالحة', true);
                return false;
            }
        } catch (error) {
            console.error('خطأ في الاستيراد:', error);
            this.showSaveMessage('❌ فشل الاستيراد', true);
            return false;
        }
    }
    
    /**
     * إعادة تعيين اللعبة
     */
    reset() {
        try {
            // حذف البيانات المحفوظة
            localStorage.removeItem(CONFIG.SAVE_KEY);
            
            // إعادة تعيين حالة اللعبة
            gameState.reset();
            
            // تحديث الواجهة
            if (window.uiManager) {
                window.uiManager.updateAll();
            }
            
            this.showSaveMessage('✅ تم إعادة تعيين اللعبة');
            
            return true;
        } catch (error) {
            console.error('خطأ في إعادة التعيين:', error);
            this.showSaveMessage('❌ فشلت إعادة التعيين', true);
            return false;
        }
    }
    
    /**
     * عرض رسالة الحفظ
     */
    showSaveMessage(message, isError = false) {
        // إنشاء عنصر الرسالة
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${isError ? '#F44336' : '#4CAF50'};
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-weight: bold;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        // إزالة الرسالة بعد 3 ثواني
        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }
    
    /**
     * عرض نافذة التصدير
     */
    showExportDialog(data) {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        dialog.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 15px; max-width: 90%; max-height: 80%; overflow: auto;">
                <h3 style="margin-bottom: 15px;">بيانات الحفظ</h3>
                <textarea readonly style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-family: monospace; font-size: 12px;">${data}</textarea>
                <div style="margin-top: 15px; text-align: center;">
                    <button id="copy-data-btn" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">نسخ</button>
                    <button id="close-dialog-btn" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">إغلاق</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // نسخ البيانات
        document.getElementById('copy-data-btn').addEventListener('click', () => {
            const textarea = dialog.querySelector('textarea');
            textarea.select();
            document.execCommand('copy');
            this.showSaveMessage('✅ تم النسخ');
        });
        
        // إغلاق النافذة
        document.getElementById('close-dialog-btn').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                document.body.removeChild(dialog);
            }
        });
    }
    
    /**
     * عرض نافذة الاستيراد
     */
    showImportDialog() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        dialog.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 15px; max-width: 90%; max-height: 80%; overflow: auto;">
                <h3 style="margin-bottom: 15px;">استيراد بيانات الحفظ</h3>
                <textarea id="import-data-input" placeholder="الصق بيانات الحفظ هنا..." style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-family: monospace; font-size: 12px;"></textarea>
                <div style="margin-top: 15px; text-align: center;">
                    <button id="import-data-btn" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">استيراد</button>
                    <button id="cancel-import-btn" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">إلغاء</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // استيراد البيانات
        document.getElementById('import-data-btn').addEventListener('click', () => {
            const data = document.getElementById('import-data-input').value;
            if (this.import(data)) {
                document.body.removeChild(dialog);
            }
        });
        
        // إلغاء
        document.getElementById('cancel-import-btn').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                document.body.removeChild(dialog);
            }
        });
    }
}

// إنشاء نسخة عامة
const saveSystem = new SaveSystem();
