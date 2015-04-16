define([], function(){
   var ChoiceGroup = function(somoManager, x, y, type){

       this.type = type;
       this.somoManager = somoManager;
       this.x = x;
       this.y = y;

       this.inChoiceTransition = false;

   }

    ChoiceGroup.prototype = {
        showMenu: function(type){
            this.renderChoiceGroup(type);
        },
        renderChoiceGroup: function(type){
            this.inChoiceTransition = false;
            this.spriteGroup = this.somoManager.game.add.group();
            this.choice1Sprite = this.somoManager.game.add.sprite(this.x,-300,type+'1');
            this.somoManager.game.physics.enable(this.choice1Sprite, Phaser.Physics.ARCADE);
            this.choice2Sprite = this.somoManager.game.add.sprite(this.x,-150,type+'2');
            this.somoManager.game.physics.enable(this.choice2Sprite, Phaser.Physics.ARCADE);
            this.choice3Sprite = this.somoManager.game.add.sprite(this.x,0,type+'3');
            this.somoManager.game.physics.enable(this.choice3Sprite, Phaser.Physics.ARCADE);
            this.spriteGroup.add(this.choice1Sprite);
            this.spriteGroup.add(this.choice2Sprite);
            this.spriteGroup.add(this.choice3Sprite);


            var bounce=this.somoManager.game.add.tween(this.spriteGroup);

            bounce.to({ y: this.y }, 3000, Phaser.Easing.Bounce.Out);
            bounce.start();
        },
        update: function(){

            this.somoManager.game.physics.arcade.collide(this.somoManager.debtor.legsSprite, this.choice1Sprite, this.choiceMade, null, this);
            this.somoManager.game.physics.arcade.collide(this.somoManager.debtor.legsSprite, this.choice2Sprite, this.choiceMade, null, this);
            this.somoManager.game.physics.arcade.collide(this.somoManager.debtor.legsSprite, this.choice3Sprite, this.choiceMade, null, this);

        },
        choiceMade: function(torsoSprite, choiceSprite){


            if(!this.inChoiceTransition){
                this.inChoiceTransition = true;
                var nextChoice = null;
                if(choiceSprite.key.indexOf('family') > -1) {
                    if (choiceSprite.key.indexOf('1') > -1) {
                        this.somoManager.debtor.principal = 1;
                        this.somoManager.debtor.dissonance = 3;
                        this.somoManager.debtor.stressRate = 1;
                    }
                    if (choiceSprite.key.indexOf('2') > -1) {
                        this.somoManager.debtor.principal = 2;
                        this.somoManager.debtor.dissonance = 2;
                        this.somoManager.debtor.stressRate = 2;
                    }
                    if (choiceSprite.key.indexOf('3') > -1) {
                        this.somoManager.debtor.principal = 3;
                        this.somoManager.debtor.dissonance = 1;
                        this.somoManager.debtor.stressRate = 3;
                    }
                    nextChoice = 'school';
                }
                if(choiceSprite.key.indexOf('school') > -1) {
                    if (choiceSprite.key.indexOf('1') > -1) {
                        this.somoManager.debtor.principal += 1;
                        this.somoManager.debtor.paymentAmount += 1;
                    }
                    if (choiceSprite.key.indexOf('2') > -1) {
                        this.somoManager.debtor.principal += 2;
                        this.somoManager.debtor.paymentAmount += 1;
                        this.somoManager.debtor.luck += 2;
                    }
                    if (choiceSprite.key.indexOf('3' > -1)) {
                        this.somoManager.debtor.principal += 2;
                        this.somoManager.debtor.paymentAmount += 1;
                        this.somoManager.debtor.luck += 1;
                        this.somoManager.debtor.dissonance -= 1;
                    }
                    if (choiceSprite.key.indexOf('4') > -1) {
                        this.somoManager.debtor.principal += 3;
                        this.somoManager.debtor.paymentAmount += 1;
                        this.somoManager.debtor.luck += 2;
                        this.somoManager.debtor.dissonance -= 1;
                    }
                    nextChoice = null;
                }

                this.somoManager.debtor.moveToCoords(250,this.somoManager.game.world.height/2);

                var bounce=this.somoManager.game.add.tween(this.spriteGroup);

                bounce.to({ y: -10 }, 3000, Phaser.Easing.Bounce.In);
                bounce.onComplete.add(function(){
                    this.spriteGroup.callAll('kill');
                    if(nextChoice)
                        this.renderChoiceGroup(nextChoice);
                    else
                        this.somoManager.runOpening();
                }, this);
                bounce.start();

            }

        }
    }

    return ChoiceGroup;
})