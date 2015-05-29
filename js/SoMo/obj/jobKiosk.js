define([], function(){
   var jobKiosk = function(somoManager, x, y){
       this.somoManager = somoManager;
       this.x = x;
       this.y = y;
       this.renderJobKiosk();
   };

   jobKiosk.prototype = {
       renderJobKiosk: function(){
           this.jobKioskSprite = this.somoManager.game.add.sprite(this.x,-300,'jobKiosk');
           this.somoManager.game.physics.enable(this.jobKioskSprite, Phaser.Physics.ARCADE);

           var bounce=this.somoManager.game.add.tween(this.jobKioskSprite);

           bounce.to({ y: this.y }, 3000, Phaser.Easing.Bounce.Out);
           bounce.start();
       },
       update: function(){
           this.somoManager.game.physics.arcade.collide(this.somoManager.debtor.legsSprite, this.jobKioskSprite, this.doJobSearch, null, this);
       },
       doJobSearch: function(){
           this.somoManager.debtor.dockAtCoords(this.jobKioskSprite.x, this.jobKioskSprite.y);

       }
   }

   return jobKiosk;
});