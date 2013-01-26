var Background = cc.Layer.extend({
    elements : [],
    spriteList : [ "../res/bg/montanya1.png",
            "../res/bg/montanya2.png",
            "../res/bg/montanya3.png"],
    loadSprite: function (sprite) {
        var element = {};
        element.sprite = sprite;
        sprite.position = 0;
        
        if (this.elements.length) {
            var lastElement =  this.elements[this.elements.length - 1];
            var lastPosition = lastElement.position;
            var advancePosition = Math.floor(lastElement.sprite.getContentSize().width * (1 - Math.random() * 0.3));
            element.position = lastPosition + advancePosition;
        }

        element.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        element.sprite.setPosition(cc.p(element.position, 250));
        this.addChild(element.sprite, Math.random()*10 );        
        
        this.elements.push(element);
        return this.elements.length-1;
    },
    init:function (state) {
        
        //var size = cc.Director.getInstance().getWinSize();

        console.log(resources);
        var montanyas = resources.bg.montanya.sprites;
        for (var i = 0 ; i != montanyas.length ; ++i) {
            this.loadSprite(montanyas[i]);
        }
        
        return true;
    }
});