//requires
const gm = require("./src/Game_Manager");

//main
//ask if want to play,determine game mode, then play
console.log(gm.prompt());
/* gm.prompt(function (res){
    console.log("game.js receieved: " + res);
    /* if(res){
        gm.mode(function(res){
            if(res != "") gm.play(res);
        });
    } 
}); */

console.log("end of main");
var waitTill = new Date(new Date().getTime() + 2 * 1000);
while(waitTill > new Date()){}







