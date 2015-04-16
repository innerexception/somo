define(['phaser'], function(Phaser){
    var Debt = function(somoManager, amount, interest, interestRate, debtorSprite){
        this.somoManager = somoManager;

        var x = somoManager.game.world.width - 20;
        var y = somoManager.game.world.height/2;

        this.principal = amount;
        this.interest = interest;
        this.interestRate = interestRate;
        this.debtorSprite = debtorSprite;

        //anchor is for 2d physics center
        this.shadowSprite = somoManager.game.add.sprite(x,-10,'shadow');
        this.shadowSprite.anchor.set(0.5);
        this.interestSprite = somoManager.game.add.sprite(x, -10, 'interest');
        this.interestSprite.anchor.set(0.5);
        this.principalSprite = somoManager.game.add.sprite(x,-10, 'principal');
        this.principalSprite.anchor.set(0.5);

        somoManager.game.physics.enable(this.interestSprite, Phaser.Physics.ARCADE);
        this.interestSprite.body.immovable = true;

        this.interestSprite.body.collideWorldBounds = false;
        //1 == full rebound elasticity on collision
        this.interestSprite.body.bounce.setTo(1,1);
        //Angle == rotation
        this.interestSprite.angle = somoManager.game.rnd.angle();

        somoManager.game.physics.enable(this.principalSprite, Phaser.Physics.ARCADE);
        this.principalSprite.body.immovable = true;
        this.principalSprite.body.collideWorldBounds = false;

        this.explosionEmitter = somoManager.game.add.emitter(x, y, 100);

        this.explosionEmitter.makeParticles(['stress', 'doubt', 'time']);

        this.explosionEmitter.setRotation(0, 0);
        this.explosionEmitter.setAlpha(0.3, 0.8);
        this.explosionEmitter.setScale(0.5, 1);
        this.explosionEmitter.gravity = 0;

        this.spriteGroup = this.somoManager.game.add.group();
        this.spriteGroup.add(this.interestSprite);
        this.spriteGroup.add(this.principalSprite);

        var bounce=this.somoManager.game.add.tween(this.spriteGroup);

        bounce.to({ y: y }, 3000, Phaser.Easing.Bounce.Out);
        bounce.start();

    };
    Debt.prototype = {
        paymentHitDebtball: function(debt, payment){
            if(this.interest <=0){
                this.principal -= payment.amount;
                this.principalSprite.scale.x = 1-(payment.amount/this.principal);
                this.principalSprite.scale.y = 1-(payment.amount/this.principal);
            }
            else{
                this.interest -= payment.amount;

            }
            if(this.principal <= 0){
                this.somoManager.debtor.playerWin();
            }

            this.explosionEmitter.x = payment.x;
            this.explosionEmitter.y = payment.y;
            this.explosionEmitter.start(true, 500, 0, 20);

            var bounceBack = this.somoManager.game.add.tween(this.interestSprite.scale);
            var newX = 1-(payment.amount/this.interest);
            var newY = 1-(payment.amount/this.interest);

            payment.kill();

            bounceBack.to({x:newX, y:newY}, 1000, Phaser.Easing.Elastic.Out, true);
        },
        update: function(){
            this.principalSprite.rotation = this.somoManager.game.physics.arcade.angleBetween(this.principalSprite, this.debtorSprite);
            this.interestSprite.scale.x += 0.001;
            this.interestSprite.scale.y += 0.001;
            this.interestSprite.rotation += 0.001;
        }
    };

    return Debt;
});