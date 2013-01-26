
var SyncRunnerApp = cc.LayerColor.extend(
{
    // entities of the game (moveables and collisionables)
    _entities: { runner: null }, 
    // global state of the game (used in children)
    _gameState: { distance:0, runVel: 0, time: 0, jumping: false },
    init:function(){
        this._super(new cc.Color4B(0,255,255,255));
        // audio init
        cc.AudioEngine.getInstance().init();
        cc.AudioEngine.getInstance().preloadMusic("../music/ggj13-1.ogg");
        cc.AudioEngine.getInstance().playMusic("../music/ggj13-1.ogg");

        //var size = cc.Director.getInstance().getWinSize();
        // config 
        this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);
        this.setPosition(new cc.Point(0,0));
        
        //Background
        this._background = new Background();
        this._background.init(this._gameState);
        this.addChild(this._background);
        
        // runner
        this._runner = new RunnerLayer();
        this._runner.init(this._gameState);
        this.addChild(this._runner);
        
        // global app update
        this.schedule(this.update);

        return true;
    },
    onEnter:function(){
        this._super();
    },
    update:function(dt){
        this._gameState.time = dt;
        
        // example: dynamically changing music playback rate
        // cc.AudioEngine.getInstance().setMusicPlaybackRate(1.0 + 0.4*Math.sin(this._gameState.time));
    },
    onKeyUp:function(e){
        if(e === cc.KEY.up)
        {
            this._gameState.jumping = false;
        }
    },
    onKeyDown:function(e){
        if(e === cc.KEY.up)
        {
            this._gameState.jumping = true;
        }
    }
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var app = new SyncRunnerApp();
        this.addChild(app);
        app.init();
    }
});
