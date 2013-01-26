var RunnerSprite = cc.Sprite.extend({
    _gameState: null,
    _currentRotation:0,
    _currentPosition: null,
    _runnerHeight:10,
    _runnerScale:0.3,
    ctor:function(){
        this.initWithFile("res/runner/stop.png");
        var size = cc.Director.getInstance().getWinSize();

        var runnerSize = this.getContentSize();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this._currentPosition = cc.p(size.width / 2, 
                                     runnerSize.height*this._runnerScale+this._runnerHeight)
        this.setPosition(this._currentPosition);
        this.setScale(-this._runnerScale,this._runnerScale);
        this.schedule(this.update);
        
    },
    init: function(gameState){
        this._gameState = gameState;
    },
    update: function(dt){
        if(this._gameState)
        {
            this._currentPosition.x+=this._gameState.runVel*dt;
            this.setPosition(this._currentPosition);
        }
    }
});


var RunnerLayer = cc.Layer.extend({
    isMouseDown:false,
    runnerSprite:null,

    init:function (gameState) {
        
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        this.runnerSprite = new RunnerSprite();
        this.runnerSprite.init(gameState);
        this.addChild(this.runnerSprite);

        return true;
    }

});


