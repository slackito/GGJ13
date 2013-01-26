var Background = cc.Layer.extend({
    elements : [],
    spriteList : [ "../res/bg/montanya1.png",
            "../res/bg/montanya2.png",
            "../res/bg/montanya3.png"],
    loadSprite: function (sprite,pos) {
        var element = {};
        element.sprite = sprite;
        element.position = 0;
        
        if (this.elements.length) {
            var lastElement =  this.elements[this.elements.length - 1];
            var lastPosition = lastElement.position;
            console.log(lastElement.sprite.getContentSize());
            var advancePosition = Math.floor(lastElement.sprite.getContentSize().width * (1 - Math.random() * 0.3));
            element.position = lastPosition + advancePosition+pos;
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
        this.loadSprite(resources.bg.montanya1.create(state,0.3),0);
        this.loadSprite(resources.bg.montanya2.create(state,0.3),50);
        this.loadSprite(resources.bg.montanya3.create(state,0.3),100);
        this.loadSprite(resources.bg.montanya5.create(state,0.3),150);
        
        return true;
    }
});