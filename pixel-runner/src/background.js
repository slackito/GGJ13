var BackgroundLayer = cc.Layer.extend({
    elements : [],
    nextPosition: 1200,
    randomSprite: function () {
        return this.config[Math.floor(Math.random()*this.config.length)];
    },
    loadSprite: function () {
        var element = {};
        var base = this.randomSprite();
        element.sprite = resources.bg[base[0]].create(this.gameState,0.1);

        element.position = this.nextPosition;
        element.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        element.sprite.setPosition(cc.p(element.position, 0));
        this.addChild(element.sprite, Math.random()*10 );        
        
        this.elements.push(element);
        var delta = base[1] + Math.random()*(base[2]-base[1]);// + element.sprite.getContentSize().width;
        console.log("Position:", this.nextPosition,delta,base[1], base[2], element.sprite.getContentSize());
        this.nextPosition -= delta;
    },
    update:function () {
        while (this.nextPosition > -700) this.loadSprite();

        while (this.elements.length && this.elements[this.elements.length-1].position > 1200) {
            this.elements.splice(-1,1);
        }
        
        var increment = this.gameState.distanceDelta*70;
        this.nextPosition += increment;
        for (var a = 0 ; a != this.elements.length ; ++a) {
            var el = this.elements[a];
            el.position += increment;
            el.sprite.setPosition(new cc.Point(el.position,250));
        }
    },
    init:function (state,config) {
        this.gameState = state;
        this.config = config;
        
        //var size = cc.Director.getInstance().getWinSize();
        this.schedule(this.update);

        return true;
    
    }
});

var Background = cc.Node.extend({
    init:function (state,config) {
        this.gameState = state;
        this.config = config;
        console.log(config);
        for (var it = 0 ; it != config.length ; ++it) {
            var ngb = new BackgroundLayer();
            
            ngb.init(state,resources.layer[config[it][0]]);
            this.addChild(ngb);
        }
        
        return true;
    }
});
