/**
 * إدارة حالة اللعبة
 * يحتوي على جميع البيانات المتغيرة للعبة
 */

class GameState {
    constructor() {
        // البيانات الأساسية
        this.cookies = 0;
        this.totalCookies = 0; // إجمالي الكوكيز المكتسبة على مدار اللعبة
        this.cookiesPerSecond = 0;
        this.clickValue = CONFIG.BASE_CLICK_VALUE;
        
        // المباني المملوكة
        this.buildings = {};
        CONFIG.BUILDINGS.forEach(building => {
            this.buildings[building.id] = {
                count: 0,
                totalCost: 0
            };
        });
        
        // الترقيات المشتراة
        this.upgrades = {};
        CONFIG.UPGRADES.forEach(upgrade => {
            this.upgrades[upgrade.id] = {
                purchased: false
            };
        });
        
        // المضاعفات
        this.multipliers = {
            click: 1,
            global: 1,
            buildings: {}
        };
        
        CONFIG.BUILDINGS.forEach(building => {
            this.multipliers.buildings[building.id] = 1;
        });
        
        // الإعدادات
        this.settings = {
            sound: true,
            autoSave: true
        };
        
        // إحصائيات
        this.stats = {
            totalClicks: 0,
            playTime: 0,
            startTime: Date.now()
        };
    }
    
    /**
     * إضافة كوكيز
     */
    addCookies(amount) {
        this.cookies += amount;
        this.totalCookies += amount;
    }
    
    /**
     * إنفاق كوكيز
     */
    spendCookies(amount) {
        if (this.cookies >= amount) {
            this.cookies -= amount;
            return true;
        }
        return false;
    }
    
    /**
     * حساب تكلفة المبنى
     */
    getBuildingCost(buildingId) {
        const building = CONFIG.BUILDINGS.find(b => b.id === buildingId);
        if (!building) return 0;
        
        const count = this.buildings[buildingId].count;
        return Math.floor(building.baseCost * Math.pow(building.costMultiplier, count));
    }
    
    /**
     * شراء مبنى
     */
    buyBuilding(buildingId) {
        const cost = this.getBuildingCost(buildingId);
        
        if (this.spendCookies(cost)) {
            this.buildings[buildingId].count++;
            this.buildings[buildingId].totalCost += cost;
            this.calculateCookiesPerSecond();
            return true;
        }
        
        return false;
    }
    
    /**
     * شراء ترقية
     */
    buyUpgrade(upgradeId) {
        const upgrade = CONFIG.UPGRADES.find(u => u.id === upgradeId);
        if (!upgrade || this.upgrades[upgradeId].purchased) return false;
        
        if (this.spendCookies(upgrade.cost)) {
            this.upgrades[upgradeId].purchased = true;
            this.applyUpgrade(upgrade);
            this.calculateCookiesPerSecond();
            return true;
        }
        
        return false;
    }
    
    /**
     * تطبيق تأثير الترقية
     */
    applyUpgrade(upgrade) {
        const effect = upgrade.effect;
        
        switch (effect.type) {
            case 'click_multiplier':
                this.multipliers.click *= effect.value;
                this.clickValue = CONFIG.BASE_CLICK_VALUE * this.multipliers.click;
                break;
                
            case 'building_multiplier':
                this.multipliers.buildings[effect.building] *= effect.value;
                break;
                
            case 'global_multiplier':
                this.multipliers.global *= effect.value;
                break;
        }
    }
    
    /**
     * حساب الإنتاج في الثانية
     */
    calculateCookiesPerSecond() {
        let total = 0;
        
        CONFIG.BUILDINGS.forEach(building => {
            const count = this.buildings[building.id].count;
            const buildingMultiplier = this.multipliers.buildings[building.id];
            const production = building.baseProduction * count * buildingMultiplier;
            total += production;
        });
        
        this.cookiesPerSecond = total * this.multipliers.global;
    }
    
    /**
     * التحديث في كل إطار
     */
    update(deltaTime) {
        // إضافة الإنتاج التلقائي
        const cookiesToAdd = (this.cookiesPerSecond * deltaTime) / 1000;
        this.addCookies(cookiesToAdd);
        
        // تحديث وقت اللعب
        this.stats.playTime = Date.now() - this.stats.startTime;
    }
    
    /**
     * التعامل مع النقرة
     */
    handleClick() {
        this.addCookies(this.clickValue);
        this.stats.totalClicks++;
    }
    
    /**
     * التحقق من توفر الترقية
     */
    isUpgradeAvailable(upgradeId) {
        const upgrade = CONFIG.UPGRADES.find(u => u.id === upgradeId);
        if (!upgrade || this.upgrades[upgradeId].purchased) return false;
        
        // التحقق من المتطلبات
        if (upgrade.requirement) {
            const req = upgrade.requirement;
            
            if (req.type === 'building') {
                return this.buildings[req.id].count >= req.count;
            }
            
            if (req.type === 'upgrade') {
                return this.upgrades[req.id].purchased;
            }
            
            if (req.type === 'cookies') {
                return this.totalCookies >= req.amount;
            }
        }
        
        return true;
    }
    
    /**
     * الحصول على بيانات الحفظ
     */
    getSaveData() {
        return {
            version: CONFIG.GAME_VERSION,
            cookies: this.cookies,
            totalCookies: this.totalCookies,
            buildings: this.buildings,
            upgrades: this.upgrades,
            multipliers: this.multipliers,
            settings: this.settings,
            stats: this.stats,
            timestamp: Date.now()
        };
    }
    
    /**
     * تحميل بيانات محفوظة
     */
    loadSaveData(data) {
        if (!data || data.version !== CONFIG.GAME_VERSION) {
            console.warn('إصدار الحفظ غير متوافق');
            return false;
        }
        
        this.cookies = data.cookies || 0;
        this.totalCookies = data.totalCookies || 0;
        this.buildings = data.buildings || this.buildings;
        this.upgrades = data.upgrades || this.upgrades;
        this.multipliers = data.multipliers || this.multipliers;
        this.settings = data.settings || this.settings;
        this.stats = data.stats || this.stats;
        
        // إعادة حساب القيم
        this.clickValue = CONFIG.BASE_CLICK_VALUE * this.multipliers.click;
        this.calculateCookiesPerSecond();
        
        return true;
    }
    
    /**
     * إعادة تعيين اللعبة
     */
    reset() {
        this.cookies = 0;
        this.totalCookies = 0;
        this.cookiesPerSecond = 0;
        this.clickValue = CONFIG.BASE_CLICK_VALUE;
        
        CONFIG.BUILDINGS.forEach(building => {
            this.buildings[building.id] = {
                count: 0,
                totalCost: 0
            };
        });
        
        CONFIG.UPGRADES.forEach(upgrade => {
            this.upgrades[upgrade.id] = {
                purchased: false
            };
        });
        
        this.multipliers = {
            click: 1,
            global: 1,
            buildings: {}
        };
        
        CONFIG.BUILDINGS.forEach(building => {
            this.multipliers.buildings[building.id] = 1;
        });
        
        this.stats = {
            totalClicks: 0,
            playTime: 0,
            startTime: Date.now()
        };
        
        this.calculateCookiesPerSecond();
    }
}

// إنشاء نسخة عامة من حالة اللعبة
const gameState = new GameState();
