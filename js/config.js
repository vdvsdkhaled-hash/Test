/**
 * ملف الإعدادات الأساسية للعبة
 * يحتوي على جميع البيانات الثابتة للمباني والترقيات
 */

const CONFIG = {
    // إعدادات اللعبة الأساسية
    GAME_VERSION: '1.0.0',
    SAVE_KEY: 'cookie_clicker_save',
    AUTO_SAVE_INTERVAL: 30000, // 30 ثانية
    
    // قيمة النقرة الأساسية
    BASE_CLICK_VALUE: 1,
    
    // المباني المتاحة
    BUILDINGS: [
        {
            id: 'cursor',
            name: 'المؤشر',
            nameEnglish: 'cursor',
            description: 'ينقر تلقائياً على الكوكيز',
            icon: '👆',
            baseCost: 15,
            baseProduction: 0.1,
            costMultiplier: 1.15
        },
        {
            id: 'grandma',
            name: 'الجدة',
            nameEnglish: 'grandma',
            description: 'جدة تصنع الكوكيز بحب',
            icon: '👵',
            baseCost: 100,
            baseProduction: 1,
            costMultiplier: 1.15
        },
        {
            id: 'farm',
            name: 'المزرعة',
            nameEnglish: 'farm',
            description: 'مزرعة لزراعة مكونات الكوكيز',
            icon: '🌾',
            baseCost: 1100,
            baseProduction: 8,
            costMultiplier: 1.15
        },
        {
            id: 'mine',
            name: 'المنجم',
            nameEnglish: 'mine',
            description: 'منجم لاستخراج السكر والشوكولاتة',
            icon: '⛏️',
            baseCost: 12000,
            baseProduction: 47,
            costMultiplier: 1.15
        },
        {
            id: 'factory',
            name: 'المصنع',
            nameEnglish: 'factory',
            description: 'مصنع ضخم لإنتاج الكوكيز',
            icon: '🏭',
            baseCost: 130000,
            baseProduction: 260,
            costMultiplier: 1.15
        },
        {
            id: 'bank',
            name: 'البنك',
            nameEnglish: 'bank',
            description: 'بنك يستثمر في صناعة الكوكيز',
            icon: '🏦',
            baseCost: 1400000,
            baseProduction: 1400,
            costMultiplier: 1.15
        },
        {
            id: 'temple',
            name: 'المعبد',
            nameEnglish: 'temple',
            description: 'معبد يبارك إنتاج الكوكيز',
            icon: '🛕',
            baseCost: 20000000,
            baseProduction: 7800,
            costMultiplier: 1.15
        },
        {
            id: 'wizard',
            name: 'الساحر',
            nameEnglish: 'wizard',
            description: 'ساحر يستدعي الكوكيز من العدم',
            icon: '🧙',
            baseCost: 330000000,
            baseProduction: 44000,
            costMultiplier: 1.15
        },
        {
            id: 'spaceship',
            name: 'سفينة الفضاء',
            nameEnglish: 'spaceship',
            description: 'سفينة تجلب الكوكيز من الفضاء',
            icon: '🚀',
            baseCost: 5100000000,
            baseProduction: 260000,
            costMultiplier: 1.15
        },
        {
            id: 'timemachine',
            name: 'آلة الزمن',
            nameEnglish: 'timemachine',
            description: 'آلة تجلب الكوكيز من المستقبل',
            icon: '⏰',
            baseCost: 75000000000,
            baseProduction: 1600000,
            costMultiplier: 1.15
        }
    ],
    
    // الترقيات المتاحة
    UPGRADES: [
        // ترقيات النقرة
        {
            id: 'click_upgrade_1',
            name: 'إصبع قوي',
            description: 'يضاعف قوة النقرة',
            icon: '💪',
            cost: 100,
            effect: { type: 'click_multiplier', value: 2 },
            requirement: null
        },
        {
            id: 'click_upgrade_2',
            name: 'إصبع فولاذي',
            description: 'يضاعف قوة النقرة مرتين',
            icon: '🦾',
            cost: 500,
            effect: { type: 'click_multiplier', value: 2 },
            requirement: { type: 'upgrade', id: 'click_upgrade_1' }
        },
        {
            id: 'click_upgrade_3',
            name: 'إصبع ذهبي',
            description: 'يضاعف قوة النقرة ثلاث مرات',
            icon: '✨',
            cost: 10000,
            effect: { type: 'click_multiplier', value: 2 },
            requirement: { type: 'upgrade', id: 'click_upgrade_2' }
        },
        
        // ترقيات المؤشر
        {
            id: 'cursor_upgrade_1',
            name: 'مؤشرات أسرع',
            description: 'يضاعف إنتاج المؤشرات',
            icon: '⚡',
            cost: 100,
            effect: { type: 'building_multiplier', building: 'cursor', value: 2 },
            requirement: { type: 'building', id: 'cursor', count: 1 }
        },
        {
            id: 'cursor_upgrade_2',
            name: 'مؤشرات فائقة',
            description: 'يضاعف إنتاج المؤشرات مرتين',
            icon: '⚡⚡',
            cost: 500,
            effect: { type: 'building_multiplier', building: 'cursor', value: 2 },
            requirement: { type: 'building', id: 'cursor', count: 10 }
        },
        
        // ترقيات الجدة
        {
            id: 'grandma_upgrade_1',
            name: 'جدات أسرع',
            description: 'يضاعف إنتاج الجدات',
            icon: '👵✨',
            cost: 1000,
            effect: { type: 'building_multiplier', building: 'grandma', value: 2 },
            requirement: { type: 'building', id: 'grandma', count: 1 }
        },
        {
            id: 'grandma_upgrade_2',
            name: 'جدات خبيرات',
            description: 'يضاعف إنتاج الجدات مرتين',
            icon: '👵💫',
            cost: 5000,
            effect: { type: 'building_multiplier', building: 'grandma', value: 2 },
            requirement: { type: 'building', id: 'grandma', count: 5 }
        },
        
        // ترقيات المزرعة
        {
            id: 'farm_upgrade_1',
            name: 'أسمدة أفضل',
            description: 'يضاعف إنتاج المزارع',
            icon: '🌱',
            cost: 11000,
            effect: { type: 'building_multiplier', building: 'farm', value: 2 },
            requirement: { type: 'building', id: 'farm', count: 1 }
        },
        
        // ترقيات المنجم
        {
            id: 'mine_upgrade_1',
            name: 'معدات أفضل',
            description: 'يضاعف إنتاج المناجم',
            icon: '⛏️✨',
            cost: 120000,
            effect: { type: 'building_multiplier', building: 'mine', value: 2 },
            requirement: { type: 'building', id: 'mine', count: 1 }
        },
        
        // ترقيات المصنع
        {
            id: 'factory_upgrade_1',
            name: 'آلات أسرع',
            description: 'يضاعف إنتاج المصانع',
            icon: '🏭⚡',
            cost: 1300000,
            effect: { type: 'building_multiplier', building: 'factory', value: 2 },
            requirement: { type: 'building', id: 'factory', count: 1 }
        },
        
        // ترقيات عامة
        {
            id: 'global_upgrade_1',
            name: 'وصفة سرية',
            description: 'يزيد إنتاج جميع المباني بنسبة 10%',
            icon: '📜',
            cost: 50000,
            effect: { type: 'global_multiplier', value: 1.1 },
            requirement: null
        },
        {
            id: 'global_upgrade_2',
            name: 'كوكيز ذهبية',
            description: 'يزيد إنتاج جميع المباني بنسبة 20%',
            icon: '🌟',
            cost: 500000,
            effect: { type: 'global_multiplier', value: 1.2 },
            requirement: { type: 'upgrade', id: 'global_upgrade_1' }
        }
    ]
};

// تجميد الكائن لمنع التعديل عليه
Object.freeze(CONFIG);
