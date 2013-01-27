var Background = cc.Layer.extend({
    elements : [],
    nextPosition: 1200,
    loadSprite: function (sprite) {
        var element = {};
        element.sprite = sprite.create(this.gameState,0.3);

//        var advancePosition = Math.floor(200 * (1 - Math.random() * 0.3));
        element.position = this.nextPosition;
        element.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        element.sprite.setPosition(cc.p(element.position, 0));
        this.addChild(element.sprite, Math.random()*10 );        
        
        this.elements.push(element);
        this.nextPosition -= Math.random()*800;
    },
    update:function () {
        while (this.nextPosition > -700) {
            console.log("MOAR",this.elements.length);
            this.loadSprite(resources.bg.nube2);

        }


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
    init:function (state) {
        this.gameState = state;
        
        //var size = cc.Director.getInstance().getWinSize();
        this.schedule(this.update);

        return true;
    
    }
});