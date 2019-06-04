//requires
const TTT = require("./TTT_Field");

//main
TTT.clear();
TTT.display("TIC TAC TOE");

//game manager

//get input
var state;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('start a new game? (Y for yes, and other key to exit): ', (input) => {
    readline.close();

    if(input == 'y' || input == 'Y'){
        //start a game
        state = "go"
    }
    else{
        //end
        state = "end"
    }
});







