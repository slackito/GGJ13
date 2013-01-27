// Logic for the runner, animations and key/events actions
var AnimatedLayer = cc.Layer.extend({
    _sprite: null,
    _spriteAnimation:null,
    _spriteFiles: null,
    _gameState: null,
    _resetAnim: true,
    _delayPerUnit: 1.0,
    update: function(dt){
        if(this._gameState)
        {
            // just in case 
            //if(this._gameState.reset)
            //{
            //    this._resetAnim = true;
            //}
        }
    },
    //getContentSize: function() {
    //    return this._sprite.getContentSize()
    //},
    init:function (sprites,state,delayPerUnit) {
        
        this._super();
        this._spriteFiles = sprites;
        if(this._spriteFiles.length === 0)
        {
            cc.Assert("say what?, array of sprites 0");
            return false;
        }
        this._gameState = state;
        this._delayPerUnit = delayPerUnit;
       
        // anim!!!!    
        this.anim();
   
        this.schedule(this.update);
        
        return true;
    },
    anim: function() {
        
        if(this._resetAnim)
        {    
            this.removeChild(this._sprite);
            // idle frame sprite with
            this._sprite = cc.Sprite.create(this._spriteFiles[0]);
            // centered
            this._sprite.setAnchorPoint(cc.p(0.5,0.5));
            this._spriteAnimation = cc.Animation.create();
            for (i = 1; i < this._spriteFiles.length; i++) {
                this._spriteAnimation.addSpriteFrameWithFile(
                    this._spriteFiles[i]);
            } 
            // Todo: use playbackRate...
            this._spriteAnimation.setDelayPerUnit(this._delayPerUnit);
            this._spriteAnimation.setRestoreOriginalFrame(false);
            var runAction = cc.RepeatForever.create(
                cc.Animate.create(this._spriteAnimation));
            this._sprite.runAction(runAction);
            this.addChild(this._sprite);
            this._resetAnim = false;
        }
    }

});


