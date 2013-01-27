var HudLayer = cc.Layer.extend({
    

    init:function (gameState) {
        
        //////////////////////////////
        // 1. super init first
        this._super();

        // initial values for debug label info
        this._musicTime = 0;
        this._beatPos = 0;
        this._bpm = 0;
        this._musicSync = "";
        this._patternQueue = "";
        this._patternQueue2 = "";
        // debug label
        this._countdownString = "FOLLOW THE BEAT!";
        this._countdownLabel = cc.LabelTTF.create("","Impact", 36, cc.size(600,30), cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(this._countdownLabel);
        var s = cc.Director.getInstance().getWinSize();
        this._countdownLabel.setPosition(new cc.Point(s.width/2,s.height/2));
        this._countdownLabel.setColor(new cc.Color3B(255,0,0));

        // debug label
        this._debugLabel = cc.LabelTTF.create("","Courier new", 24, cc.size(600,30), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(this._debugLabel);
        var s = cc.Director.getInstance().getWinSize();
        this._debugLabel.setPosition(new cc.Point(400,s.height - 30));
        this._debugLabel.setColor(new cc.Color3B(0,0,0));

        // fullHeart sprite
        this._emptyHeart = cc.Sprite.create("../res/icons/corazon_vacio.png");
        this._emptyHeart.setPosition(new cc.Point(30,s.height - 30));
        this.addChild(this._emptyHeart);
        this._fullHeart = cc.Sprite.create("../res/icons/corazon_lleno.png");
        this._fullHeart.setPosition(new cc.Point(30,s.height - 30));
        this.addChild(this._fullHeart);
        return true;
    },
    update: function() {
    },
    draw: function() {
        this._debugLabel.setString("Score: " + this._score + " queue: "+ this._patternQueue); // + " OK: " + this._okBeatCount + " Missed: " + this._missedBeatCount + " beatPos:" + this._beatPos.toFixed(2));
        //this._debugLabel.setString("halfBeatPos" + this._halfBeatPos.toFixed(2));

        this._countdownLabel.setString(this._countdownString);
        
        // beating heart
        var scale = 1.0 - Math.abs(Math.min(1.0, 2*this._beatPos));
        this._fullHeart.setScale(scale, scale);
        //if (scale > 0.8) 
        //    this.addChild(this._fullHeart);
        //else
        //    this.removeChild(this._fullHeart);
        var edge0 = 0.85;
        var edge1 = 0.95;
        var t = (scale-edge0)/(edge1-edge0);
        t = Math.max(0.0, Math.min(1.0, t));
        var opacity = t*t*(3-2*t);
        this._fullHeart.setOpacity(255*opacity);
        this._emptyHeart.setScale(scale, scale);
    }

});


