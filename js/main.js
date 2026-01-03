/**
 * الملف الرئيسي للعبة
 * يقوم بتهيئة وبدء اللعبة
 */

// الانتظار حتى يتم تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍪 بدء تحميل لعبة كوكيز كليكر...');
    
    try {
        // تهيئة نظام الحفظ أولاً
        console.log('📁 تهيئة نظام الحفظ...');
        saveSystem.init();
        
        // تهيئة المباني
        console.log('🏗️ تهيئة المباني...');
        buildingsManager.init();
        
        // تهيئة الترقيات
        console.log('⬆️ تهيئة الترقيات...');
        upgradesManager.init();
        
        // تهيئة واجهة المستخدم
        console.log('🎨 تهيئة واجهة المستخدم...');
        uiManager.init();
        
        console.log('✅ تم تحميل اللعبة بنجاح!');
        console.log('📊 حالة اللعبة:', {
            cookies: gameState.cookies,
            cps: gameState.cookiesPerSecond,
            buildings: gameState.buildings,
            upgrades: gameState.upgrades
        });
        
    } catch (error) {
        console.error('❌ خطأ في تحميل اللعبة:', error);
        alert('حدث خطأ في تحميل اللعبة. يرجى تحديث الصفحة.');
    }
});

// إضافة أنيميشن CSS للرسائل
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// معلومات المطور (للتطوير المستقبلي)
console.log(`
%c🍪 لعبة كوكيز كليكر 🍪
%cالإصدار: ${CONFIG.GAME_VERSION}
%cتم التطوير بواسطة: Blackbox AI
%cللتطوير المستقبلي، راجع ملف DEVELOPMENT.md
`, 
'font-size: 20px; font-weight: bold; color: #8B4513;',
'font-size: 14px; color: #666;',
'font-size: 14px; color: #666;',
'font-size: 14px; color: #4CAF50;'
);
