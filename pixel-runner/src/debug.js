var DebugLayer = cc.Layer.extend({
    

    init:function (gameState) {
        
        //////////////////////////////
        // 1. super init first
        this._super();

        this._helloLabel = cc.LabelTTF.create("","Courier new", 24, cc.size(600,50), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(this._helloLabel);
        var s = cc.Director.getInstance().getWinSize();
        this._helloLabel.setPosition(new cc.Point(300,s.height - 30));
        this._helloLabel.setColor(new cc.Color3B(0,0,0));
        this._musicTime = 0;
        this._beatPos = 0;
        this._bpm = 0;
        this._musicSync = "";

        return true;
    },
    draw: function() {
        this._helloLabel.setString(this._musicSync +"    OK: " + this._okBeatCount + " Missed: " + this._missedBeatCount);
    }

});


