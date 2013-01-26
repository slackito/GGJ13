var SyncRunnerApp = cc.LayerColor.extend(
{
    // entities of the game (moveables and collisionables)
    _entities: { runner: null }, 
    _consts: {
        BEAT_TOLERANCE : 0.1,
        SONG_BPM : 125 //TODO: change if we put songs with different BPM
    },
    // global state of the game (used in children)
    _gameState: {
        distance:0,
        distanceDelta: 0, 
        runVel: 0,
        time: 0,
        jumping: false,
        beatPos: 0,                // music playing position relative to the current beat, if the user presses a button and beatPos = 0 it means a perfect hit, <0 is early, >0 is late
        lastBeatPos: 0,            // beat position in last frame, to detect when we start a new beat (sign change from positive to negative)
        playbackRate: 1.0,         // music speed multiplier (1.0 == normal speed)
        playedCurrentBeat: false,  // flag that indicates if the user has pushed the button (on time or not) for the current beat
        missedBeatCount: 0,        // number of beats that have passed without the user pushing the button
        okBeatCount: 0             // number of beats the user hit correctly (TODO: separate perfect/ok/meh states for ok-ish presses, for scoring)
    },
    init:function(){
        this._super(new cc.Color4B(0,255,255,255));
        // audio init
        cc.AudioEngine.getInstance().init();
        cc.AudioEngine.getInstance().preloadMusic("../music/ggj13-1.ogg");
        cc.AudioEngine.getInstance().playMusic("../music/ggj13-1.ogg", true);

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
        
        this._debug = new DebugLayer();
        this._debug.init(this._gameState);
        this.addChild(this._debug);

        // global app update
        this.schedule(this.update);

        return true;
    },
    onEnter:function(){
        this._super();
    },
    update:function(dt){
        this._gameState.time += dt;

        // example: dynamically changing music playback rate
        cc.AudioEngine.getInstance().setMusicPlaybackRate(this._gameState.playbackRate);
        var musicTime = cc.AudioEngine.getInstance().getMusicCurrentTime();
        this._debug._musicTime = musicTime;

        this._gameState.distanceDelta = Math.min(20, musicTime - this._gameState.distance);
        this._gameState.distance = musicTime;
        
        // check if the user missed a beat


        var seconds_per_beat = 60/this._consts.SONG_BPM;
        var half_beat = seconds_per_beat / 2
        var beatPos = musicTime % seconds_per_beat;
        if (beatPos > half_beat) {
            beatPos = beatPos - seconds_per_beat;
        }
        this._gameState.lastBeatPos = this._gameState.beatPos;
        this._gameState.beatPos = beatPos;

        // start new beat?
        if (this._gameState.lastBeatPos > 0 && this._gameState.beatPos < 0) {
            this._gameState.playedCurrentBeat = false;
        }

        if (Math.abs(beatPos) > this._consts.BEAT_TOLERANCE && beatPos > 0 && !this._gameState.playedCurrentBeat) {
            // put here everything we need to do when the user misses a beat
            this._gameState.missedBeatCount += 1;
            this._gameState.playedCurrentBeat = true;
        }

        // debug info
        if (Math.abs(beatPos) < this._consts.BEAT_TOLERANCE) {
            this._debug._musicSync = "#";
        }
        else {
            this._debug._musicSync = " ";
        }
        this._debug._beatPos = beatPos;
        this._debug._bpm = this._consts.SONG_BPM;
        this._debug._okBeatCount = this._gameState.okBeatCount;
        this._debug._missedBeatCount = this._gameState.missedBeatCount;
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
        if(e === cc.KEY.right)
        {
            this._gameState.playbackRate+=0.1;
        }
        else if(e === cc.KEY.left)
        {
            this._gameState.playbackRate-=0.1; 
        } 
        else if(e == cc.KEY.space)
        {
            if (!this._gameState.playedCurrentBeat) {
                this._gameState.playedCurrentBeat = true;
                if (Math.abs(this._gameState.beatPos) <= this._consts.BEAT_TOLERANCE) {
                    this._gameState.okBeatCount += 1;
                }
                else {
                    this._gameState.missedBeatCount += 1;
                }
            }
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
