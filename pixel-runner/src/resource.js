var resourcePath = "../"

// Agrupa archivos segun elementos de la ruta y se los pasa al metodo en loaders que toque,
// eliminando ese elemento comun a todos. si no hay nada en loaders, se lo pasa a fallback
function loadSelector(loaders,fallback,array) {
    var ob = {};
    var it = 0;
    while (it < array.length) {
        var group = [];
        var starter = array[it].splitted[0];
        var current = starter;
        do {
            group.push({ splitted:array[it].splitted.slice(1), name:array[it].name });
            ++it;
            if(it >= array.length) break;
            current = array[it].splitted[0];
        } while (starter === current );
        
        var result = null;
        if (loaders[starter]) result = loaders[starter](group);
        else if(fallback) result = fallback(starter,group);
    
        if(result) ob[result[0]] = result[1];
    }
    return ob;
}


// Cargado desde archivo autogenerado, si parece obsoleto haz commit una o 2 veces
var _res = resources;
resources = {};


var g_ressources = [];
var g_rescallbacks = [];

var resourceLoaders = {
    bg : function( arr ) {
        function bgLoader(name, arr ) {
            
            var bgVarsLoader = {
                vars: function(arr) {
                    return  ["vars",{}];
                }
            };
            function fallback(name,arr) {
                var sprites = [];
                for (var it = 0 ; it != arr.length ; ++it) {
                    g_ressources.push({type:"image",src:arr[it].name});
                    
                    var item = arr[it].name;
                    g_rescallbacks.push(function(){ sprites.push( cc.Sprite.create(item)); })
                }
                return ["sprites",sprites];
            }
            return [name, loadSelector(bgVarsLoader,fallback,arr)];
        };
        
        return ["bg", loadSelector({},bgLoader,arr)];
    }
};


var _res2 = [];
for (var it =0; it != _res.length; ++it) {
    var splitted = _res[it].replace(/\//g,".").split(".").slice(1);
    var name = resourcePath+_res[it];
    _res2.push({ splitted:splitted, name:name });
}
resources = loadSelector(resourceLoaders,function(name,arr){console.error("No loader for "+name);},_res2);


var s_RunnerStop = "../res/runner/stop.png";
var s_RunnerRunLeft = "../res/runner/runleft.png";

var g_ressources = [
    //image
    {type:"image", src:"../res/runner/rastaIdle.png"},
    {type:"image", src:"../res/runner/rastaRun1.png"},
    {type:"image", src:"../res/runner/rastaRun2.png"},
    {type:"image", src:"../res/runner/rastaRun3.png"},
    {type:"image", src:"../res/runner/rastaJump.png"},

    //plist

    //fnt

    //tmx

    //bgm

    //effect
];