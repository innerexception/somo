require.config({
    baseUrl: 'js',
    waitSeconds: 0,
    paths: {
        'phaser': 'vendor/phaser',
        'somoManager': 'somo/somoManager',
        'debt': 'somo/obj/debt',
        'debtor': 'somo/obj/debtor',
        'choiceGroup': 'somo/obj/choiceGroup',
        'jobKiosk': 'somo/obj/jobKiosk',
        'shop': 'somo/obj/shop'
    },
    shim: {
        'phaser': {
            exports: 'Phaser'
        }
    }
});

require(['somoManager'], function(somoManager){
    somoManager.Init();
});