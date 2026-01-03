/**
 * إدارة الترقيات
 * يتعامل مع عرض وشراء الترقيات
 */

class UpgradesManager {
    constructor() {
        this.container = null;
    }
    
    /**
     * تهيئة مدير الترقيات
     */
    init() {
        this.container = document.getElementById('upgrades-list');
        this.render();
    }
    
    /**
     * عرض جميع الترقيات المتاحة
     */
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        
        const availableUpgrades = CONFIG.UPGRADES.filter(upgrade => 
            gameState.isUpgradeAvailable(upgrade.id)
        );
        
        if (availableUpgrades.length === 0) {
            this.container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #999;">
                    <p style="font-size: 40px; margin-bottom: 10px;">🔒</p>
                    <p>لا توجد ترقيات متاحة حالياً</p>
                    <p style="font-size: 12px; margin-top: 5px;">اشتري المزيد من المباني لفتح ترقيات جديدة</p>
                </div>
            `;
            return;
        }
        
        availableUpgrades.forEach(upgrade => {
            const upgradeElement = this.createUpgradeElement(upgrade);
            this.container.appendChild(upgradeElement);
        });
    }
    
    /**
     * إنشاء عنصر ترقية
     */
    createUpgradeElement(upgrade) {
        const div = document.createElement('div');
        div.className = 'upgrade-item';
        div.dataset.upgradeId = upgrade.id;
        
        const isPurchased = gameState.upgrades[upgrade.id].purchased;
        const canAfford = gameState.cookies >= upgrade.cost;
        
        if (isPurchased) {
            div.classList.add('purchased');
        } else if (!canAfford) {
            div.classList.add('disabled');
        }
        
        const effectDescription = this.getEffectDescription(upgrade.effect);
        
        div.innerHTML = `
            <div class="upgrade-icon">${upgrade.icon}</div>
            <div class="upgrade-info">
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-description">${upgrade.description}</div>
                <div class="upgrade-effect">${effectDescription}</div>
                <div class="upgrade-cost">
                    ${isPurchased ? '✅ تم الشراء' : '💰 ' + this.formatNumber(upgrade.cost)}
                </div>
            </div>
        `;
        
        if (!isPurchased) {
            div.addEventListener('click', () => this.handleUpgradeClick(upgrade.id));
        }
        
        return div;
    }
    
    /**
     * الحصول على وصف التأثير
     */
    getEffectDescription(effect) {
        switch (effect.type) {
            case 'click_multiplier':
                return `يضاعف قوة النقرة ×${effect.value}`;
                
            case 'building_multiplier':
                const building = CONFIG.BUILDINGS.find(b => b.id === effect.building);
                return `يضاعف إنتاج ${building ? building.name : 'المبنى'} ×${effect.value}`;
                
            case 'global_multiplier':
                const percentage = ((effect.value - 1) * 100).toFixed(0);
                return `يزيد الإنتاج الكلي بنسبة ${percentage}%`;
                
            default:
                return 'تأثير خاص';
        }
    }
    
    /**
     * التعامل مع نقرة الترقية
     */
    handleUpgradeClick(upgradeId) {
        const success = gameState.buyUpgrade(upgradeId);
        
        if (success) {
            this.update();
            
            // تأثير بصري
            const upgradeElement = this.container.querySelector(`[data-upgrade-id="${upgradeId}"]`);
            if (upgradeElement) {
                upgradeElement.classList.add('purchased');
                upgradeElement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    upgradeElement.style.transform = '';
                }, 100);
            }
            
            // تحديث المباني (قد يتغير الإنتاج)
            if (window.buildingsManager) {
                window.buildingsManager.update();
            }
        }
    }
    
    /**
     * تحديث عرض الترقيات
     */
    update() {
        if (!this.container) return;
        
        // إعادة العرض بالكامل لأن الترقيات المتاحة قد تتغير
        this.render();
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
const upgradesManager = new UpgradesManager();
