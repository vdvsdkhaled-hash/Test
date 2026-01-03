/**
 * إدارة المباني
 * يتعامل مع عرض وشراء المباني
 */

class BuildingsManager {
    constructor() {
        this.container = null;
    }
    
    /**
     * تهيئة مدير المباني
     */
    init() {
        this.container = document.getElementById('buildings-list');
        this.render();
    }
    
    /**
     * عرض جميع المباني
     */
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        
        CONFIG.BUILDINGS.forEach(building => {
            const buildingElement = this.createBuildingElement(building);
            this.container.appendChild(buildingElement);
        });
    }
    
    /**
     * إنشاء عنصر مبنى
     */
    createBuildingElement(building) {
        const div = document.createElement('div');
        div.className = 'building-item';
        div.dataset.buildingId = building.id;
        
        const count = gameState.buildings[building.id].count;
        const cost = gameState.getBuildingCost(building.id);
        const production = this.getBuildingProduction(building.id);
        const canAfford = gameState.cookies >= cost;
        
        if (!canAfford) {
            div.classList.add('disabled');
        }
        
        div.innerHTML = `
            <div class="building-icon">${building.icon}</div>
            <div class="building-info">
                <div class="building-name">${building.name}</div>
                <div class="building-description">${building.description}</div>
                <div class="building-stats">
                    <span class="building-cost">💰 ${this.formatNumber(cost)}</span>
                    <span>📈 ${this.formatNumber(production)}/ث</span>
                </div>
            </div>
            <div class="building-count">${count}</div>
        `;
        
        div.addEventListener('click', () => this.handleBuildingClick(building.id));
        
        return div;
    }
    
    /**
     * التعامل مع نقرة المبنى
     */
    handleBuildingClick(buildingId) {
        const success = gameState.buyBuilding(buildingId);
        
        if (success) {
            this.update();
            
            // تأثير بصري
            const buildingElement = this.container.querySelector(`[data-building-id="${buildingId}"]`);
            if (buildingElement) {
                buildingElement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    buildingElement.style.transform = '';
                }, 100);
            }
            
            // تحديث الترقيات (قد تصبح متاحة)
            if (window.upgradesManager) {
                window.upgradesManager.update();
            }
        }
    }
    
    /**
     * حساب إنتاج المبنى
     */
    getBuildingProduction(buildingId) {
        const building = CONFIG.BUILDINGS.find(b => b.id === buildingId);
        if (!building) return 0;
        
        const buildingMultiplier = gameState.multipliers.buildings[buildingId];
        const globalMultiplier = gameState.multipliers.global;
        
        return building.baseProduction * buildingMultiplier * globalMultiplier;
    }
    
    /**
     * تحديث عرض المباني
     */
    update() {
        if (!this.container) return;
        
        CONFIG.BUILDINGS.forEach(building => {
            const buildingElement = this.container.querySelector(`[data-building-id="${building.id}"]`);
            if (!buildingElement) return;
            
            const count = gameState.buildings[building.id].count;
            const cost = gameState.getBuildingCost(building.id);
            const production = this.getBuildingProduction(building.id);
            const canAfford = gameState.cookies >= cost;
            
            // تحديث الحالة
            if (canAfford) {
                buildingElement.classList.remove('disabled');
            } else {
                buildingElement.classList.add('disabled');
            }
            
            // تحديث المحتوى
            const countElement = buildingElement.querySelector('.building-count');
            const costElement = buildingElement.querySelector('.building-cost');
            const statsElement = buildingElement.querySelector('.building-stats span:last-child');
            
            if (countElement) countElement.textContent = count;
            if (costElement) costElement.textContent = `💰 ${this.formatNumber(cost)}`;
            if (statsElement) statsElement.textContent = `📈 ${this.formatNumber(production)}/ث`;
        });
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
const buildingsManager = new BuildingsManager();
