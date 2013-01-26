// Logic for the runner, animations and key/events actions
var RunnerLayer = cc.Layer.extend({
    _runnerSprite: null,
    _runnerSpriteAnimation:null,
    _runnerSpriteAnimationJump:null,
    _jumpAction:null,
    _runAction:null,
    _runnerSpriteFiles: 
        ["../res/runner/rastaIdle.png",
         "../res/runner/rastaRun1.png",
         "../res/runner/rastaRun2.png",
         "../res/runner/rastaRun3.png",
         "../res/runner/rastaJump.png"],
    _gameState: null,
    _currentRotation:0,
    _currentPosition: null,
    _runnerHeight:10,
    _runnerScale:0.3,
    _resetAnim: true,
    _runVel: 1.0,
    _updateT: 0,
    update: function(dt){
        if(this._gameState)
        {
            this._currentPosition.x+=this._gameState.runVel;
            this.setPosition(this._currentPosition);
            if(this._gameState.jumping)
            {
                this.jump();
                this._resetAnim = true;
            }
            else
            {
                this.run();
            }
            if(this._gameState.time - this._updateT > 1.0)
            {
                this._updateT = this._gameState.time;
                this._runVel = 0.1*(1.0/this._gameState.playbackRate);
                //console.log("dt:"+this._gameState.time+" runVel:" + this._runVel);
                this._resetAnim = true;
            }
        }
    },
    init:function (gameState) {
        
        //////////////////////////////
        // 1. super init first
        this._super();
        this._gameState = gameState;

        var size = cc.Director.getInstance().getWinSize();
        // idle frame sprite with
        this._runnerSprite = cc.Sprite.create(this._runnerSpriteFiles[0]);
        this._runnerSprite.setAnchorPoint(cc.p(0.5,0));
        this._currentPosition = cc.p(size.width/2.0, 
                                     this._runnerHeight);
        this.setPosition(this._currentPosition);
        //this._runnerSprite.setScale(-this._runnerScale,this._runnerScale);
        
        // RUN!!!!    
        this.run();
   
        this.schedule(this.update);
        

        return true;
    },
    jump: function () {
        this.removeChild(this._runnerSprite);
        this._runnerSprite = cc.Sprite.create(this._runnerSpriteFiles[4]);
        this._runnerSprite.setAnchorPoint(cc.p(0.5,0));
        //cc.AnimationManager.getInstance()
        //this._runnerSprite.runAction(this._jumpAction);
        this.addChild(this._runnerSprite);
        
    },
    run: function() {
        if(this._resetAnim)
        {    
            this.removeChild(this._runnerSprite,false);
            this._runnerSprite = cc.Sprite.create(this._runnerSpriteFiles[1]);
            this._runnerSprite.setAnchorPoint(cc.p(0.5,0));
            this._runnerSpriteAnimation = cc.Animation.create();
            for (i = 1; i < 3; i++) {
                this._runnerSpriteAnimation.addSpriteFrameWithFile(
                    this._runnerSpriteFiles[i]);
            } 
            // Todo: use playbackRate...
            this._runnerSpriteAnimation.setDelayPerUnit(this._runVel);
            this._runnerSpriteAnimation.setRestoreOriginalFrame(false);
            var runAction = cc.RepeatForever.create(
                cc.Animate.create(this._runnerSpriteAnimation));
            this._runnerSprite.runAction(runAction);
            this.addChild(this._runnerSprite);
            this._resetAnim = false;
        }
    }

});


