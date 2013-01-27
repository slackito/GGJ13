// Logic for the runner, animations and key/events actions
var RunnerLayer = cc.Layer.extend({
    _runnerSprite: null,
    _runnerSpriteAnimation:null,
    _runnerSpriteAnimationJump:null,
    _runnerGameOverSprite:null,
    _dirtyGameOver: true,
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
    _runnerHeight:0,
    _runnerScale:0.3,
    _resetAnim: true,
    _runVel: 1.0,
    _updateT: 0,
    _stressX: 50,
    update: function(dt){
        if(this._gameState)
        {
            if(!this._gameState.gameOver)
            {
                var size = cc.Director.getInstance().getWinSize();
                var maxSizeX = size.width - this._stressX;
                this._currentPosition.x= maxSizeX - 50.0*this._gameState.playbackRate;
                if(this._currentPosition.x > maxSizeX)
                    this._currentPosition.x = maxSizeX;

                this.setPosition(this._currentPosition);
                this._gameState.runnerPositionX = this._currentPosition.x;
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
            if(this._gameState.gameOver)
            {
                this.gameOver();
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
        this._currentPosition = cc.p(size.width - this._stressX, 
                                     this._runnerHeight);
        this.setPosition(this._currentPosition);
        //this._runnerSprite.setScale(-this._runnerScale,this._runnerScale);
        //
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
    },
    gameOver: function()
    {
        if(this._dirtyGameOver)
        {
            this.removeAllChildren(true);
            this._runnerGameOverSprite = resources.bg.gameover.create(this._gameState,0.2);
            this._runnerGameOverSprite.setRunOnce(true);
            //this._runnerGameOverSprite.setAnchorPoint(cc.p(0.5,0));
            var size = cc.Director.getInstance().getWinSize();
            this.addChild(this._runnerGameOverSprite);
            var h = this._runnerGameOverSprite.getContentSize().height;
            this._currentPosition.y = h/2-60;
            this.setPosition(this._currentPosition);
            this._dirtyGameOver = false;
        }
    }
});


