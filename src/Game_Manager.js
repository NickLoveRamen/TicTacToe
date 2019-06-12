//requires
const TTT = require("./TTT_Field");
const readline = require("readline");
const UI = require("./UI_Manager");

//start the program by getting game mode, then moving to appropriate function
function start(){
    //initialize an empty board
    TTT.init();

    //define codes for game types
    const twoPlayerString = '2 PLAYER GAME';
    const onePlayerString = 'VERSUS COMPUTER';
    const quit = 'QUIT';

    //get game mode
    UI.displayOptionsReturnSelected("TIC TAC TOE",[twoPlayerString,onePlayerString,quit],(res) =>{
        //once we get a selection, transition to the next state
        switch (res){
            case twoPlayerString : {
                console.log("Game_manager about to run playTwoPlayer();")
                playTwoPlayer();
                break;
            }
            case onePlayerString : {

                break;
            }
            case quit : {
                process.exit();
                break;
            }
        }
    })
}

//two player game
function playTwoPlayer(){
    //define game states
    const state_WIN = 'WIN';
    const state_TIE = 'TIE';
    const state_IP = 'IN PROGRESS';

    //keep track of current state
    var game_state = state_IP;

    //keep track of who won
    var winner = 'unknown';

    //alternate between player one and player two
    while (game_state == state_IP){
        //prompt player 1(X) and get thier coordinate selection
        console.log("in main game loop. setting game stte to TIE...");
        game_state = state_TIE;
        //insert their move

        //check if game over (win or tie)

        //prompt player 2(O) and get thier coordinate selection

        //insert their move

        //check if game over (win or tie)
    }

    //give an ending message based on gamestate
    var endingMessage = '';
    if(game_state != state_TIE){
        endingMessage = winner + ' WINS!';
    }
    else endingMessage = 'TIE GAME';

    //prompt for new game or quit
    const playAgain = 'PLAY AGAIN';
    const quit = 'QUIT';

    UI.displayOptionsReturnSelected(endingMessage,[playAgain,quit],(res)=>{
        //send them to the start screen
        if (res == playAgain){
            start();
        }else process.exit(); //if not, end the program
    });
}

//one player game

//play 2 player
async function twoplayer(){
    var gamestate = {"over" : false,
                     "winner" : ""};

    while(!gamestate.over){
        //X player (player1) goes first
        await prompt(TTT.X);

        //check if game over
        isOver(function(res){
            gamestate = res;
        });
            

        if(!gamestate.over){
            //O player (player2) goes second
            await prompt(TTT.O);
            //check if game over
            isOver(function(res){
                gamestate = res;
            });
        }
    }
    
    return new Promise((resolve) => {
        resolve(gamestate.winner);
    });
}

 function prompt(symbol){
    var player;
    if(symbol == TTT.X) player = "PLAYER ONE"
    else if (symbol == TTT.O) player = "PLAYER TWO"

    TTT.clear();
    TTT.display(player + "'S TURN",-1,-1);

    return new Promise((async function (resolve){
        var coords = await getCoordinates(symbol);
        while (coords == null){
            coords = await getCoordinates(symbol);
        }
        TTT.placeSymbol(coords.x,coords.y,symbol);
        resolve();
    }));
    
}

function getCoordinates(symbol){
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question('Enter coordinates to place a ' + symbol + ' (x y):', (input) => {
            rl.close();
            input = input.split(" ");
            if((input[0] >= TTT.ROWS || input[0] < 0) || (input[1] >= TTT.COLS || input[1] < 0)){
                console.log("Those coordinates are out of bounds, try again: ");
                resolve(null);
            }else if (TTT.getSymbol(input[0],input[1]) != TTT.BLANK){
                console.log("that spot is taken, try again: ");
                resolve(null);
            }else{
                resolve({"x" : input[0],"y" : input[1]});
            }
        });
    })
    
}

function isOver(callback){
    // cardinal directions
    const E = 0;
    const SE = 1;
    const S = 2;
    const SW = 3;

    //gamestate to be returned
    var gamestate = {"over" : false,
                     "winner" : ""};
    
    //iterate through array and check for TTT.win number of consecutive symbols
    var i,j,symbol;

    //keep track if all spaces have been filled
    var full = true; //assume it is filled until we encounter a TTT.BLANK space
    for(i = 0; i < TTT.ROWS; i++){
        for(j = 0; j < TTT.COLS; j++){
            //check if space is blank
            if(symbol = TTT.getSymbol(i,j) == TTT.BLANK){
                full = false;
            }else{//symbol is either TTT.X or TTT.O
                //check E (to the right)
                if(getConsec(E,symbol,i,j,true) >= TTT.WIN){
                    gamestate.over = true;
                    gamestate.winner = symbol;
                    callback(gamestate);
                }

                //check SE (down and to right)
                if(getConsec(SE,symbol,i,j,true) >= TTT.WIN){
                    gamestate.over = true;
                    gamestate.winner = symbol;
                    callback(gamestate);
                }

                //check S (down)
                if(getConsec(S,symbol,i,j,true) >= TTT.WIN){
                    gamestate.over = true;
                    gamestate.winner = symbol;
                    callback(gamestate);
                }

                //check SW (down and left)
                if(getConsec(SW,symbol,i,j,true) >= TTT.WIN){
                    gamestate.over = true;
                    gamestate.winner = symbol;
                    callback(gamestate);
                }

            }
        }
    }//end checking each index

    //see if TIE
    if(full && !gamestate.over){//board is full but we havnt found a winner
        gamestate.over = true;
        callback(gamestate);
    }

}

function getConsec(direction,symbol,startx,starty,reset){
    // cardinal directions
    const E = 0;
    const SE = 1;
    const S = 2;
    const SW = 3;

    //reset when called from isOver
    if(reset){
        getConsec.counter = 1;
    }
    var found = false;
    var newx = startx;
    var newy = starty;

    //verify that the next space in the direction exists, then check
    switch(direction){
        case E : { //East
            if(startx +1 < TTT.ROWS){
                if(TTT.getSymbol(startx+1,starty) == symbol){
                    found = true;
                    newx = startx + 1;
                } 
            }
            break;
        }
        case SE : {//South East
            if(startx +1 < TTT.ROWS && starty +1 < TTT.COLS){
                if(TTT.getSymbol(startx+1,starty+1) == symbol){
                    found = true;
                    newx = startx+1;
                    newy = starty+1;
                } 
            }
            break;
        }
        case S : {//south
            if(starty +1 < TTT.COLS){
                if(TTT.getSymbol(startx,starty+1) == symbol){
                    found = true;
                    newy = starty+1;
                } 
            }
            break;
        }
        case SW : {//south west
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

module.exports = {start};