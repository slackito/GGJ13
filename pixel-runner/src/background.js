var Background = cc.Layer.extend({
    elements : [],
    nextPosition: 1200,
    loadSprite: function (sprite) {
        var element = {};
        element.sprite = sprite;
        element.position = 0;
        
        if (this.elements.length) {
            var lastElement =  this.elements[this.elements.length - 1];
            var lastPosition = lastElement.position;
            var advancePosition = Math.floor(200 * (1 - Math.random() * 0.3));
            element.position = lastPosition + advancePosition;
        }

        element.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        element.sprite.setPosition(cc.p(element.position, 250));
        this.addChild(element.sprite, Math.random()*10 );        
        
        this.elements.push(element);
        this.nextPosition -= 250;
    },
    update:function () {
        while (this.nextPosition > -700) {
            console.log("MOAR");
            this.loadSprite(resources.bg.montanya2.sprites[0]);
            
            this.gameState.distanceDelta;
        }
        
        this.nextPosition += this.gameState.distanceDelta*70;
        for (var a = 0 ; a != this.elements.length ; ++a) {
            var el = this.elements[a];
            el.position += this.gameState.distanceDelta*70;
            el.sprite.setPosition(new cc.Point(el.position,250));
        }
    },
    init:function (state) {
        this.gameState = state;
        
        //var size = cc.Director.getInstance().getWinSize();
    
        this.schedule(this.update);
        return true;
    
    }
});