define(['phaser'], function(Phaser){
    var Debtor = function(somoManager){
        this.somoManager = somoManager;

        var x = 300;
        var y = somoManager.game.world.height/2;

        this.stress = 0;
        this.speed = 0;
        this.nextFireInterval = 1000;
        this.rateOfFire = 1000;
        this.paymentAmount = 10;
        this.isTweening = false;

        //anchor is for 2d physics center
        //this.shadowSprite = somoManager.game.add.sprite(x,y,'shadow');
        //this.shadowSprite.anchor.set(0.5);
        this.legsSprite = somoManager.game.add.sprite(x, y, 'legs');
        this.legsSprite.animations.add('walk');
        this.legsSprite.anchor.set(0.5);
        //this.legsSprite.animations.add('move', ['move1', 'move2', 'move3'], 20, true);
        this.torsoSprite = somoManager.game.add.sprite(x,y, 'torso');
        this.torsoSprite.anchor.set(0.5);
        this.torsoSprite.animations.add('throw');

        somoManager.game.physics.enable(this.legsSprite, Phaser.Physics.ARCADE);
        this.legsSprite.body.immovable = false;
        this.legsSprite.body.collideWorldBounds = true;
        this.legsSprite.body.drag.set(0.2);
        this.legsSprite.body.maxVelocity.setTo(400,400);
        //1 == full rebound elasticity on collision
        this.legsSprite.body.bounce.setTo(1,1);
        //Angle == rotation
        this.legsSprite.angle = somoManager.game.rnd.angle();

        //Projectiles group
        this.projectiles = somoManager.game.add.group();
        this.projectiles.enableBody = true;
        this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
        this.projectiles.createMultiple(25, 'projectile');

        this.projectiles.setAll('anchor.x', 0.5);
        this.projectiles.setAll('anchor.y', 0.5);
        this.projectiles.setAll('outOfBoundsKill', true);
        this.projectiles.setAll('checkWorldBounds', true);
        this.projectiles.callAll('animations.add', 'animations', 'spin');


        this.legsSprite.bringToTop();
        this.torsoSprite.bringToTop();

        this.stressEmitter = somoManager.game.add.emitter(this.legsSprite.x, this.legsSprite.y, 200);

        this.stressEmitter.makeParticles(['stress', 'doubt', 'time']);

        this.stressEmitter.setRotation(0, 0);
        this.stressEmitter.setAlpha(0.3, 0.8);
        this.stressEmitter.setScale(0.5, 1);
        this.stressEmitter.gravity = 0;

        //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
        //	The 5000 value is the lifespan of each particle before it's killed
        this.stressEmitter.start(false, 3000, 1000);



    };
    Debtor.prototype = {
        damaged: function(stress){
            if(this.stress <=100){
                this.stress += stress;
            }
            if(this.stress > 100){
                this.playerLoss();
            }
        },
        update: function(){

            if(!this.isTweening){
                if(this.somoManager.cursors.left.isDown){
                    this.legsSprite.angle -=4;

                }
                else if(this.somoManager.cursors.right.isDown){
                    this.legsSprite.angle +=4;

                }
                if(this.somoManager.cursors.up.isDown){
                    this.speed = 150;
                    this.legsSprite.animations.play('walk', 10);

                }
                else{
                    if(this.speed > 0){
                        this.speed -=14;
                    }
                }
                if(this.somoManager.game.input.activePointer.isDown){
                    //Pew.
                    this.throwPayment();
                }

                if(this.speed > 0){
                    this.somoManager.game.physics.arcade.velocityFromRotation(this.legsSprite.rotation, this.speed, this.legsSprite.body.velocity);
                }

            }

            if(this.stress > 1000){
                this.playerLoss();
            }

            //this.shadowSprite.x = this.legsSprite.x;
            //this.shadowSprite.y = this.legsSprite.y;
            //this.shadowSprite.rotation = this.legsSprite.rotation;

            this.torsoSprite.x = this.legsSprite.x;
            this.torsoSprite.y = this.legsSprite.y;

            this.torsoSprite.rotation = this.somoManager.game.physics.arcade.angleToPointer(this.torsoSprite);

            this.stressEmitter.x = this.legsSprite.x;
            this.stressEmitter.y = this.legsSprite.y;
            this.stress += 0.1;

            if(this.stressEmitter.frequency > 80)
                this.stressEmitter.frequency -= this.stress/100;


        },
        throwPayment: function(){
            if(this.somoManager.game.time.now > this.nextFireInterval && this.projectiles.countDead() > 0){
                this.nextFireInterval = this.somoManager.game.time.now + this.rateOfFire;
                this.torsoSprite.animations.play('throw', 5, false);
                var payment = this.projectiles.getFirstExists(false);
                payment.amount = this.paymentAmount;
                payment.reset(this.torsoSprite.x, this.torsoSprite.y);
                this.somoManager.game.physics.arcade.velocityFromRotation(this.torsoSprite.rotation, 400, payment.body.velocity);
                payment.animations.play('spin', 8, true);
            }
        },
        debtTouchedPlayer: function(){
            this.stress += 10;
        },
        playerLoss : function(){
            alert('lose.');
        },

        playerWin : function(){
            alert('a winner is you');
        },

        dockAtCoords: function(x,y){
            if(!this.isTweening){
                this.isTweening = true;
                var tractorBeamA = this.somoManager.game.add.tween(this.torsoSprite);
                var tractorBeamB = this.somoManager.game.add.tween(this.legsSprite);

                tractorBeamA.to({x:x, y:y}, 2000, Phaser.Easing.Linear.None);
                tractorBeamA.onComplete.add(function(){
                    console.log('tractor beam a completed.');
                }, this);
                tractorBeamB.to({x:x, y:y}, 2000, Phaser.Easing.Linear.None);
                tractorBeamB.onComplete.add(function(){
                    console.log('tractor beam b completed.');
                    this.legsSprite.body.velocity.x = 0;
                    this.legsSprite.body.velocity.y = 0;
                }, this);


                tractorBeamA.start();
                tractorBeamB.start();

                console.log('tractor beam started.');
            }
        },
        moveToCoords: function(x,y){
            if(!this.isTweening){
                this.isTweening = true;
                var tractorBeamA = this.somoManager.game.add.tween(this.torsoSprite);
                var tractorBeamB = this.somoManager.game.add.tween(this.legsSprite);

                tractorBeamA.to({x:x, y:y}, 2000, Phaser.Easing.Linear.None);
                tractorBeamA.onComplete.add(function(){
                    console.log('tractor beam a completed.');
                }, this);
                tractorBeamB.to({x:x, y:y}, 2000, Phaser.Easing.Linear.None);
                tractorBeamB.onComplete.add(function(){
                    console.log('tractor beam b completed.');
                    this.legsSprite.body.velocity.x = 0;
                    this.legsSprite.body.velocity.y = 0;
                    this.isTweening = false;
                }, this);

                tractorBeamA.start();
                tractorBeamB.start();

                console.log('tractor beam started.');
            }
        }

};
    return Debtor;
});