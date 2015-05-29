define(['phaser', 'debtor', 'debt', 'jobKiosk', 'choiceGroup'], function(Phaser, Debtor, Debt, Kiosk, ChoiceGroup){

    var SoMoManager = {};

    SoMoManager.Init = function(){
        SoMoManager.game = new Phaser.Game(1024, 768, Phaser.AUTO, 'applicationHost', {
            preload: SoMoManager.preload,
            create: SoMoManager.create,
            update: SoMoManager.update,
            render: SoMoManager.render });
    }

    SoMoManager.preload = function(){
        //SoMoManager.game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
        SoMoManager.game.load.image('principal', 'res/img/principalGreen.png');
        SoMoManager.game.load.spritesheet('torso', 'res/img/torso2.png', 32, 32);
        SoMoManager.game.load.spritesheet('projectile', 'res/img/projectile2.png', 32, 32);
        SoMoManager.game.load.spritesheet('legs', 'res/img/legs.png', 32, 32);
        SoMoManager.game.load.image('interest', 'res/img/interestGreen.png');
        SoMoManager.game.load.image('start', 'res/img/start.png');
        //SoMoManager.game.load.image('ground', 'res/img/ground.png');
        SoMoManager.game.load.image('logo', 'res/img/logo.png');
        SoMoManager.game.load.image('stress', 'res/img/stress.png');
        SoMoManager.game.load.image('time', 'res/img/time.png');
        SoMoManager.game.load.image('doubt', 'res/img/doubt.png');
        SoMoManager.game.load.image('family1', 'res/img/family1.png');
        SoMoManager.game.load.image('family2', 'res/img/family2.png');
        SoMoManager.game.load.image('family3', 'res/img/family3.png');
        SoMoManager.game.load.script('greenFlamez', 'js/filter/Fire.js');
        //SoMoManager.game.load.spritesheet('interestHit', 'assets/games/tanks/explosion.png', 64, 64, 23);
        //SoMoManager.game.load.spritesheet('principalHit', 'assets/games/tanks/explosion.png', 64, 64, 23);
    };

    SoMoManager.create = function(){
        SoMoManager.game.world.setBounds(0, 0, 1500, 200);

        //The ground
        //SoMoManager.groundSprite = SoMoManager.game.add.tileSprite(0,0,1024,768, 'ground');
        //Scrolls with the camera
        //SoMoManager.groundSprite.fixedToCamera = true;
        SoMoManager.backgroundFilter = SoMoManager.game.add.filter('Fire', SoMoManager.game.world.width, SoMoManager.game.world.height);
        SoMoManager.backgroundFilter.alpha = 0.1;
        var background = SoMoManager.game.add.sprite(0, 0);
        background.width = SoMoManager.game.world.width;
        background.height = SoMoManager.game.world.height;
        background.filters = [SoMoManager.backgroundFilter];


        SoMoManager.debtor = new Debtor(SoMoManager);

        SoMoManager.logo = SoMoManager.game.add.sprite(0,200,'logo');
        SoMoManager.logo.fixedtoCamera = true;

        SoMoManager.game.input.onDown.add(SoMoManager.removeLogo, this);

        SoMoManager.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        SoMoManager.game.camera.focusOnXY(0,0);

        SoMoManager.cursors = SoMoManager.game.input.keyboard.createCursorKeys();

        SoMoManager.startingChoiceGroup = new ChoiceGroup(SoMoManager, 10, 500, 'family');
        SoMoManager.startingChoiceGroup.showMenu('family');
    }

    SoMoManager.removeLogo = function(){
        SoMoManager.game.input.onDown.remove(SoMoManager.removeLogo, SoMoManager.game);
        SoMoManager.logo.kill();
    }

    SoMoManager.update = function(){

        if(SoMoManager.debt)
            SoMoManager.debt.update();
        if(SoMoManager.debtor)
            SoMoManager.debtor.update();
        if(SoMoManager.schoolKiosk)
            SoMoManager.schoolKiosk.update();

        if(SoMoManager.debt && SoMoManager.debtor){
            SoMoManager.game.physics.arcade.collide(SoMoManager.debtor.projectiles, SoMoManager.debt.interestSprite, SoMoManager.debt.paymentHitDebtball, null, SoMoManager.debt);
            SoMoManager.game.physics.arcade.collide(SoMoManager.debtor.legsSprite, SoMoManager.debt.interestSprite, SoMoManager.debtor.debtTouchedPlayer, null, SoMoManager.debtor);
        }
        SoMoManager.backgroundFilter.update();
        //Keep ground tile centered on camera
        //SoMoManager.groundSprite.tilePosition.x = -SoMoManager.game.camera.x;
        //SoMoManager.groundSprite.tilePosition.y = -SoMoManager.game.camera.y;

    }

    SoMoManager.render = function(){

    }

    SoMoManager.runOpening = function(){

        var cameraTween = SoMoManager.game.add.tween(SoMoManager.game.camera);

        cameraTween.onComplete.add(function(){
            console.log('instanced.');
            SoMoManager.debt = new Debt(SoMoManager, 10000, 1000, 0.1, SoMoManager.debtor.legsSprite);
            var cameraTweenBack = SoMoManager.game.add.tween(SoMoManager.game.camera);
            cameraTweenBack.to({x:0, y:0}, 2000, Phaser.Easing.Linear.None).delay(4000);
            cameraTweenBack.onComplete.add(function(){
                SoMoManager.game.camera.follow(SoMoManager.debtor.legsSprite);
                SoMoManager.spawnJobKiosk();
                SoMoManager.spawnRandomShops();
            }, SoMoManager);
            cameraTweenBack.start();
        }, SoMoManager);

        cameraTween.to({x:1000, y:100}, 4000, Phaser.Easing.Linear.None)
            .start();

    }

    return SoMoManager;
});