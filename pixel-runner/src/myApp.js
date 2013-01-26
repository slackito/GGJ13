
var SyncRunnerApp = cc.LayerColor.extend(
{
    // entities of the game (moveables and collisionables)
    _entities: { runner: null }, 
    // global state of the game (used in children)
    _gameState: { distance:0, runVel: 0, time: 0 },
    init:function(){
        this._super();
        //this.init(new cc.Color4B(0,0,0,255));
        //var size = cc.Director.getInstance().getWinSize();
        // config 
        this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);
        this.setPosition(new cc.Point(0,0));
        
             var gameState ={ distance : 0
        };
        
        //Background
        this._background = new Background();
        this._background.init(gameState);
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
    },
    onKeyUp:function(e){

    },
    onKeyDown:function(e){
        if(e === cc.KEY.left)
        {
            this._gameState.runVel+=1;
        }
        else if(e === cc.KEY.right)
        {
            this._gameState.runVel-=1; 
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
