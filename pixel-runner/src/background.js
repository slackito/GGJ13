var BackgroundLayer = cc.Layer.extend({
    randomSprite: function () {
        return this.config[Math.floor(Math.random()*this.config.length)];
    },
    addSprite: function(name) {
        var element = {};
        element.sprite = resources.bg[name].create(this.gameState,4);

        element.position = this.nextPosition;
        element.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        element.sprite.setPosition(cc.p(element.position, 0));
        this.addChild(element.sprite, this.depth() );        
        
        this.elements.push(element);

    },
    loadSprite: function () {
        var base = this.randomSprite();
        this.addSprite(base[0]);
        var delta = base[1] + Math.random()*(base[2]-base[1]);
        this.nextPosition -= delta;
    },
    advanceSprites: function() {
        var increment = this.gameState.distanceDelta*this.speed;
        this.nextPosition += increment;
        for (var a = 0 ; a != this.elements.length ; ++a) {
            var el = this.elements[a];
            el.position += increment;
            el.sprite.setPosition(cc.p(el.position,250));
        }
    },
    update:function () {
        while (this.nextPosition > -600) this.loadSprite();
        
        while (this.elements.length > 0 && this.elements[0].position > 1200) {
            this.removeChild(this.elements[0].sprite,true);
            this.elements.splice(0,1);

        }
        this.advanceSprites();
    },
    init:function (state,config,name) {
        this._super();

        this.gameState = state;
        this.config = config;
        this.name = name;
        
        this.elements = [];
        this.nextPosition= 800;
        this.depth =function(){ return Math.round(Math.random()+4);};
        this.speed = 70;

        //var size = cc.Director.getInstance().getWinSize();
        this.schedule(this.update);

        return true;
    
    }
});

var BackgroundLayerObstacle = BackgroundLayer.extend({
    ppb: 120,
    loadSprite: function() {
        this.addSprite("agujero");
        this.nextPosition -= this.ppb;
    },
    update: function(){
        while (this.nextPosition > -200) this.loadSprite();

        while (this.elements.length != 0 && this.elements[0].position > 800) {
            this.removeChild(this.elements[0].sprite,true);
            this.elements.splice(0,1);
        }
        this.advanceSprites();
    },
    init:function (state) {
        this._super(state,null,"player");
        
        this.elements = [];
        this.nextPosition= 0;
        this.depth =function(){ return 3;};
        this.speed = 800;

        this.schedule(this.update);

        return true;
    
    }
});

var Background = cc.Node.extend({
    init:function (state,config) {
        this._super();

        this.gameState = state;
        this.config = config;
        for (var it = 0 ; it != config.length ; ++it) {
            var ngb = new BackgroundLayer();
            
            var c = config[it];
            
            ngb.init(state,resources.layer[c[0]],c[0]);
            ngb.depth = function() { return Math.round(Math.random()*(c[2]-c[1])+c[1]);};
            ngb.speed = c[3];
            this.addChild(ngb);
        }
        
        var lPlayer = new BackgroundLayerObstacle();
        lPlayer.init(state);
        this.addChild(lPlayer);
        
        return true;
    }
});
