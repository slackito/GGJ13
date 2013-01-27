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
        score: 0, 
        beatPos: 0,                // music playing position relative to the current beat, if the user presses a button and beatPos = 0 it means a perfect hit, <0 is early, >0 is late
        lastBeatPos: 0,            // beat position in last frame, to detect when we start a new beat (sign change from positive to negative)
        playbackRate: 1.0,         // music speed multiplier (1.0 == normal speed)
        triggeredCurrentHeartEffect: false,
        playedCurrentBeat: false,  // flag that indicates if the user has pushed the button (on time or not) for the current beat
        missedBeatCount: 0,        // number of beats that have passed without the user pushing the button
        okBeatCount: 0             // number of beats the user hit correctly (TODO: separate perfect/ok/meh states for ok-ish presses, for scoring)
    },
    init:function(){
        this._super(new cc.Color4B(0,255,255,255));
        // audio init
        cc.AudioEngine.getInstance().init();
        cc.AudioEngine.getInstance().preloadMusic("../music/ggj13-1.ogg");
        cc.AudioEngine.getInstance().preloadEffect("../music/heart.ogg");
        cc.AudioEngine.getInstance().setMusicVolume(0.8);
        cc.AudioEngine.getInstance().playMusic("../music/ggj13-1.ogg", true);

        //var size = cc.Director.getInstance().getWinSize();
        // config 
        this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);
        this.setPosition(new cc.Point(0,0));
        
        //Background
        this._background = new BackgroundLayer();
        this._background.init(this._gameState);
        this.addChild(this._background);
        
        // runner
        this._runner = new RunnerLayer();
        this._runner.init(this._gameState);
        this.addChild(this._runner);
        
        this._hud = new HudLayer();
        this._hud.init(this._gameState);
        this.addChild(this._hud);

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
        var musicVolume = Math.min(1.0, 1.0 - 3*(this._gameState.playbackRate-1.0));
        cc.AudioEngine.getInstance().setMusicVolume(musicVolume);
        var musicTime = cc.AudioEngine.getInstance().getMusicCurrentTime();
        this._hud._musicTime = musicTime;

        this._gameState.distanceDelta = Math.min(20, musicTime - this._gameState.distance);
        this._gameState.distance = musicTime;
        

        var seconds_per_beat = 60/this._consts.SONG_BPM;
        var half_beat = seconds_per_beat / 2
        var beatPos = musicTime % seconds_per_beat;
        if (beatPos > half_beat) {
            beatPos = beatPos - seconds_per_beat;
        }
        var absPos = Math.abs(beatPos);
        this._gameState.lastBeatPos = this._gameState.beatPos;
        this._gameState.beatPos = beatPos;

        // start new beat?
        if (this._gameState.lastBeatPos > 0 && this._gameState.beatPos < 0) {
            this._gameState.playedCurrentBeat = false;
            this._gameState.triggeredCurrentHeartEffect = false;
        }

        // play heart sound effect?
        // if (!this._gameState.triggeredCurrentHeartEffect && (absPos < 0.015 || (this._gameState.lastBeatPos < 0 && this._gameState.beatPos >= 0))) {
        //     this._gameState.triggeredCurrentHeartEffect = true;
        //     var effectID = cc.AudioEngine.getInstance().playEffect("../music/heart.ogg");
        //     var effect = cc.AudioEngine.getInstance()._effectList[effectID];
        //     effect.volume = 0.1 + 3*(this._gameState.playbackRate-1.0);
        // }
        
        var beatThreshold = this._consts.BEAT_TOLERANCE * this._gameState.playbackRate;

        if (absPos > beatThreshold && beatPos > 0 && !this._gameState.playedCurrentBeat) {
            // put here everything we need to do when the user misses a beat
            this._gameState.missedBeatCount += 1;
            this._gameState.playedCurrentBeat = true;
            cc.AudioEngine.getInstance().playEffect("../music/fail.ogg");
        }

        // hud data
        this._hud._beatPos = beatPos;
        this._hud._score = this._gameState.score;

        // debug info
        // if (absPos < beatThreshold) {
        //     this._hud._musicSync = "#";
        // }
        // else {
        //     this._hud._musicSync = " ";
        // }
        //this._hud._bpm = this._consts.SONG_BPM;
        this._hud._okBeatCount = this._gameState.okBeatCount;
        this._hud._missedBeatCount = this._gameState.missedBeatCount;
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
        else if(e == cc.KEY.f)
        {
            if (!this._gameState.playedCurrentBeat) {
                var absPos = Math.abs(this._gameState.beatPos);
                this._gameState.playedCurrentBeat = true;
                if (absPos <= this._consts.BEAT_TOLERANCE) {
                    this._gameState.okBeatCount += 1;
                    this._gameState.score += 1000-200*Math.round(3*absPos/this._consts.BEAT_TOLERANCE);

                    // sfx
                    cc.AudioEngine.getInstance().playEffect("../music/beep.ogg");
                }
                else {
                    this._gameState.missedBeatCount += 1;
                    // sfx
                    cc.AudioEngine.getInstance().playEffect("../music/fail.ogg");
                }
            }
            else {
                cc.AudioEngine.getInstance().playEffect("../music/fail.ogg");
            }
        }
    }
});

/*var SyncRunnerScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var app = new SyncRunnerApp();
        this.addChild(app);
        app.init();
    }
});*/

var SyncRunnerStartApp = cc.LayerColor.extend(
{
    onEnter:function(){
        this._super();
    },
    init:function(){
        this._super(new cc.Color4B(0,255,255,255));
    }
});

var SyncRunnerStartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var app = new SyncRunnerStartApp();
        this.addChild(app);
        app.init();
    }
});
