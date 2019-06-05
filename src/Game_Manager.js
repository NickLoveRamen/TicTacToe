//requires
const TTT = require("./TTT_Field");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

//would you like to play?
module.exports.prompt = function (callback){
    TTT.clear();
    TTT.display("TIC TAC TOE");

    readline.question('start a new game? (Y for yes, and other key to exit): ', (input) => {
        //readline.close();
    
        if(input == 'y' || input == 'Y'){
            //start a game
            callback(true)
        }
        else{
            //end
            callback(false)
        }
    });
}

//ask if two player or vs computer
module.exports.mode = function(callback){
    TTT.clear();
    TTT.display("TIC TAC TOE");

    readline.question('2-player game or play against the computer? (t for 2-player, c for computer, any other key to quit): ', (input) => {
        //readline.close();
    
        if(input == "t" || input == "T"){
            callback("t");
        }
        else if(input == "c" || input == "C"){
            callback("c");
        }else{
            callback("broke");
        }
    });
}

//play the game based on what mode
module.exports.play = async function(mode){
    var winner = "";

    if(mode == "t"){
        winner = twoplayer();
        await congradulate(winner);
    }
    else if(mode == "c"){
        winner = oneplayer();
        await congradulate(winner);
    }else{
        console.log("Something wrong in gm.play(mode)");
    }
}

//play 2 player
async function twoplayer(){
    var gamestate = {"over" : false,
                     "winner" : ""};

    while(!gamestate.over){
        //X player (player1) goes first
        await promptP1();

        //check if game over
        isOver(function(res){
            gamestate = res;
        });

        if(!gamestate.over){
            //O player (player2) goes second
            await promptP2();

            //check if game over
            isOver(function(res){
                gamestate = res;
            });
        }
        
    }
    
    return gamestate.winner;
}

function promptP1(){
    TTT.clear();
    TTT.display("PLAYER ONE'S TURN");
    readline.question('Enter coordinates to place a ' + TTT.X + ' (x y):', (input) => {
        //readline.close();
        
        input = input.split(" ");
        TTT.placeSymbol(input[0],input[1],TTT.X);
    });
}

 function promptP2(){
    TTT.clear();
    TTT.display("PLAYER TWO'S TURN");
    readline.question('Enter coordinates to place a ' + TTT.Y + ' (x y):', (input) => {
        //readline.close();
        
        input = input.split(" ");
        TTT.placeSymbol(input[0],input[1],TTT.Y);
    });
}

function isOver(){
    // cardinal directions
    const E = 0;
    const SE = 1;
    const S = 2;
    const SW = 3;

    //iterate through array and check for TTT.win number of consecutive symbols
    var i,j;
    for(i = 0; i < TTT.ROWS; i++){
        for(j = 0; j < TTT.COLS; j++){
            //see if a symbol
            if(TTT.getSymbol(i,j) == TTT.X){
                //check E (to the right)
                if(getConsec(E,TTT.X,i,j,true) >= TTT.WIN){
                    return {"over" : true,"winner" : "PLAYER1"}
                }

                //check SE (down and to right)
                if(getConsec(SE,TTT.X,i,j,true) >= TTT.WIN){
                    return {"over" : true,"winner" : "PLAYER1"}
                }

                //check S (down)
                if(getConsec(S,TTT.X,i,j,true) >= TTT.WIN){
                    return {"over" : true,"winner" : "PLAYER1"}
                }

                //check SW (down and left)
                if(getConsec(SW,TTT.X,i,j,true) >= TTT.WIN){
                    return {"over" : true,"winner" : "PLAYER1"}
                }

            }else if(TTT.getSymbol(i,j) == TTT.Y){
                //check E (to the right)
                if(getConsec(E,TTT.Y,i,j,true) >= TTT.WIN){
                    return {"over" : true,"winner" : "PLAYER2"}
                }

                //check SE (down and to right)
                if(getConsec(SE,TTT.Y,i,j,true) >= TTT.WIN){
                    return {"over" : true,"winner" : "PLAYER2"}
                }

                //check S (down)
                if(getConsec(S,TTT.Y,i,j,true) >= TTT.WIN){
                    return {"over" : true,"winner" : "PLAYER2"}
                }

                //check SW (down and left)
                if(getConsec(SW,TTT.Y,i,j,true) >= TTT.WIN){
                    return {"over" : true,"winner" : "PLAYER2"}
                }

            }
        }
    }

}

function getConsec(direction,symbol,startx,starty,reset){
    //reset when called from isOver
    if(reset){
        getConsec.counter = 1;
    }
    var found = false;
    var newx = startx;
    var newy = starty;

    //verify that the next space in the direction exists, then check
    switch(direction){
        case 0 : { //East
            if(startx +1 < TTT.ROWS){
                if(TTT.getSymbol(startx+1,starty) == symbol){
                    found = true;
                    newx = startx + 1;
                } 
            }
            break;
        }
        case 1 : {//South East
            if(startx +1 < TTT.ROWS && starty +1 < TTT.COLS){
                if(TTT.getSymbol(startx+1,starty+1) == symbol){
                    found = true;
                    newx = startx+1;
                    newy = starty+1;
                } 
            }
            break;
        }
        case 2 : {//south
            if(starty +1 < TTT.COLS){
                if(TTT.getSymbol(startx,starty+1) == symbol){
                    found = true;
                    newy = starty+1;
                } 
            }
            break;
        }
        case 3 : {//south west
            if(startx -1 >= 0 && starty +1 < TTT.COLS){
                if(TTT.getSymbol(startx-1,starty+1) == symbol){
                    found = true;
                    newx = startx-1;
                    newy = starty+1;
                } 
            }
            break;
        }
    }

    //if we found something, increment the consecutive count then check further
    if(found){
        getConsec.counter++;
        getConsec(direction,symbol,newx,newy,false);
    }

    return getConsec.counter;
}

function congradulate(winner){
    TTT.clear();
    TTT.display(winner + " WINS!");
}
