//requires
const gm = require("./src/Game_Manager");

//main
//ask if want to play,determine game mode, then play
gm.prompt(function (res){
    if(res){
        gm.mode(function(res){
            if(res != "") gm.play(res);
        });
    }
});






