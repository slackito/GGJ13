var SyncRunnerApp = cc.LayerColor.extend(
{
    // entities of the game (moveables and collisionables)
    _entities: { runner: null },
    _timeUntilSplash: 1.0,
    _timeUntilCredits: 4.0,
    _splashAdded: false,
    _fail: -10,
    _consts: {
        BEAT_TOLERANCE : 0.1,
        HALF_BEAT_TOLERANCE : 0.1,
        SONG_BPM : 125, //TODO: change if we put songs with different BPM
        PATTERNS : [
                { player:"--------" },
                { player:"a-------" },
                { player:"----a---" },
                { player:"a---a---" },
                { player:"-b------" },
                { player:"-----b--" },
                { player:"-b---b--" },
                { player:"a-a--b--" },
                { player:"-b-b--a-" },
                { player:"-b--a-a-" },
                { player:"-b-b--a-" },
                { player:"a--b--a-" },
                { player:"-b-b-b--" },
                { player:"a--b--a-" },
        ]
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
        playedCurrentHalfBeat: false,
        missedBeatCount: 0,        // number of beats that have passed without the user pushing the button
        okBeatCount: 0,            // number of beats the user hit correctly (TODO: separate perfect/ok/meh states for ok-ish presses, for scoring)
        gameOver: false,           // flag for gameOver, turns true in update method
        timeToDeath: 3,             // time in secs unti the death!!!!         
        patternQueue: "---------------"   ,        // first character = action to do on next half-beat
        patternQueue2: "---------------"   ,        // first character = action to do on next half-beat
        runnerPositionX: 600,         // ole
        currentHalfBeat: "-"
    },
    init:function(){
        this._super(new cc.Color4B(0,255,255,255));
        // audio init
        cc.AudioEngine.getInstance().init();
        cc.AudioEngine.getInstance().preloadMusic("../music/ggj13-1.ogg");
        //cc.AudioEngine.getInstance().preloadEffect("../music/heart.ogg");
        cc.AudioEngine.getInstance().setMusicVolume(0.8);
        cc.AudioEngine.getInstance().playMusic("../music/ggj13-1.ogg", true);

        //var size = cc.Director.getInstance().getWinSize();
        // config 
        this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);
        this.setPosition(new cc.Point(0,0));
        
        //Background
        this._background = new Background();
        this._background.init(this._gameState,resources.background.base);
        this.addChild(this._background);
        
        // runner
        this._runner = new RunnerLayer();
        this._runner.init(this._gameState);
        this.addChild(this._runner);
        
        this._hud = new HudLayer();
        this._hud.init(this._gameState);
        this.addChild(this._hud);
        
        this._deathLayer = new cc.LayerColor();
        this._deathLayer.init(new cc.Color4B(255,10,10,0),
                              this.getContentSize().width,
                              this.getContentSize().height);
        this.addChild(this._deathLayer);

        // global app update
        this.schedule(this.update);

        return true;
    },
    onEnter:function(){
        this._super();
    },
    update:function(dt){
        this._gameState.time += dt;
        var musicVolume = 1.0;
        if(!this._gameState.gameOver) { 
            // generate pattern queue
            while (this._gameState.patternQueue.length < 30) {
                var patternArray = this._consts.PATTERNS;
                var selection = Math.random() * 2 - 1;
                
                selection = Math.max(1,Math.min(0,selection));
                var pattern = patternArray[Math.round( selection * patternArray.length-1)];
                console.log(selection,patternArray.length);
                this._gameState.patternQueue += pattern.player;
                this._gameState.patternQueue2 += pattern.player;
            }

            // example: dynamically changing music playback rate
            cc.AudioEngine.getInstance().setMusicPlaybackRate(this._gameState.playbackRate);
            musicVolume = Math.min(1.0, 1.0 - 3*(this._gameState.playbackRate-1.0));
            cc.AudioEngine.getInstance().setMusicVolume(musicVolume);
            var musicTime = cc.AudioEngine.getInstance().getMusicCurrentTime();
            this._hud._musicTime = musicTime;

            this._gameState.distanceDelta = Math.min(20, musicTime - this._gameState.distance);
            this._gameState.distance = musicTime;
            


            var seconds_per_beat = 60/this._consts.SONG_BPM;
            var half_beat = seconds_per_beat / 2;
            var quarter_beat = seconds_per_beat / 4;

            var beatPos = musicTime % seconds_per_beat;
            if (beatPos > half_beat) {
                beatPos = beatPos - seconds_per_beat;
            }

            var halfBeatPos = musicTime % half_beat;
            if (halfBeatPos > quarter_beat) {
                halfBeatPos = halfBeatPos - half_beat;
            }


            var absPos = Math.abs(beatPos);
            this._gameState.lastBeatPos = this._gameState.beatPos;
            this._gameState.beatPos = beatPos;

            var absHalfPos = Math.abs(halfBeatPos);
            this._gameState.lastHalfBeatPos = this._gameState.halfBeatPos;
            this._gameState.halfBeatPos = halfBeatPos;
            

            // start new beat?
            if (this._gameState.lastBeatPos > 0 && this._gameState.beatPos < 0) {
                this._gameState.playedCurrentBeat = false;
                this._gameState.triggeredCurrentHeartEffect = false;
            }

            // start new halfbeat?
            if (musicTime > 0 && this._gameState.lastHalfBeatPos > 0 && this._gameState.halfBeatPos < 0) {
                this._gameState.playedCurrentHalfBeat = false;
                this._gameState.currentHalfBeat = this._gameState.patternQueue.charAt(0);
                this._gameState.patternQueue = this._gameState.patternQueue.substr(1);
            }

            // play heart sound effect?
            // if (!this._gameState.triggeredCurrentHeartEffect && (absPos < 0.015 || (this._gameState.lastBeatPos < 0 && this._gameState.beatPos >= 0))) {
            //     this._gameState.triggeredCurrentHeartEffect = true;
            //     var effectID = cc.AudioEngine.getInstance().playEffect("../music/heart.ogg");
            //     var effect = cc.AudioEngine.getInstance()._effectList[effectID];
            //     effect.volume = 0.1 + 3*(this._gameState.playbackRate-1.0);
            // }
            
            var beatThreshold = this._consts.BEAT_TOLERANCE * this._gameState.playbackRate;
            var halfBeatThreshold = this._consts.HALF_BEAT_TOLERANCE * this._gameState.playbackRate;

            if (absPos > beatThreshold && beatPos > 0 && !this._gameState.playedCurrentBeat) {
                // put here everything we need to do when the user misses a beat
                this._gameState.missedBeatCount += 1;
                this._fail += 1;
                this._gameState.playedCurrentBeat = true;
                //cc.AudioEngine.getInstance().playEffect("../music/fail.ogg");
            }

            // check if we missed halfbeat
            if (absHalfPos > halfBeatThreshold && halfBeatPos > 0 && !this._gameState.playedCurrentHalfBeat) {
                // put here everything we need to do when the user misses a halfbeat
                this._gameState.playedCurrentHalfBeat = true;
                if (this._gameState.currentHalfBeat !== "-") {
                    this._gameState.score -= 5000;
                    this._fail += 1;
                }
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
            this._hud._patternQueue = this._gameState.patternQueue;
            this._hud._halfBeatPos = this._gameState.halfBeatPos;
        }
        // game over stuff 
        if(this._fail>=2 && this._fail<=6)
        {
            this._deathLayer.setOpacity(this._fail*30);
        }
        if(this._fail > 3 || this._gameState.gameOver)
        {
            this._gameState.timeToDeath-=dt;
            if(this._gameState.timeToDeath <= 0)
            {
                this._gameState.gameOver = true;
                this._deathLayer.setOpacity(0);
                cc.AudioEngine.getInstance().setMusicVolume(1.0);
                cc.AudioEngine.getInstance().setMusicPlaybackRate(1.0);
                this._gameState.distanceDelta = 0;
                this._timeUntilSplash -= dt;
                this._timeUntilCredits -= dt;
                if(!this._splashAdded && this._timeUntilSplash <= 0 )
                {
                    var gameOverSplash = resources.bg.gameoversplash.create(this._gameState,0.11);
                    var size = cc.Director.getInstance().getWinSize();
                    gameOverSplash.setPosition(size.width/2.0,size.height/2.0);
                    gameOverSplash.setRunOnce(true);
                    this.addChild(gameOverSplash);
                    this._splashAdded = true;
                }
                if(this._timeUntilCredits <= 0)
                {
                    cc.AudioEngine.getInstance().pauseMusic();
                    startCredits(); 
                }
            }
        }
        else
        {
            this._gameState.timeToDeath = 3;
        }
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
            // check if we have hit current halfbeat
            if (this._gameState.currentHalfBeat !== "-") {
                if (!this._gameState.playedCurrentHalfBeat) {
                    var absHalfPos = Math.abs(this._gameState.halfBeatPos);
                    this._gameState.playedCurrentHalfBeat = true;
                    if (absHalfPos <= this._consts.HALF_BEAT_TOLERANCE) {
                        // cool!
                        this._gameState.score += 10000;
                    }
                    else {
                        // boo!
                        this._gameState.score -= 5000;
                    }
                }
            }
            else {
                this._gameState.score -= 5000;
            }
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
                    this._fail = 0;
                    this._timeToDeath = 3;
                    this._deathLayer.setOpacity(0);

                    // sfx
                    //cc.AudioEngine.getInstance().playEffect("../music/beep.ogg");
                }
                else {
                    this._gameState.missedBeatCount += 1;
                    // sfx
                    //cc.AudioEngine.getInstance().playEffect("../music/fail.ogg");
                }
            }
            else {
               // cc.AudioEngine.getInstance().playEffect("../music/fail.ogg");
            }
        }
    },
    onTouchesEnded:function(e)
    {
        if(this._gameState.gameOver && this._splashAdded)
        {
            cc.AudioEngine.getInstance().pauseMusic();
            startCredits();
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
        this._super(new cc.Color4B(0,255,255,0));
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
