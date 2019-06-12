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
async function playTwoPlayer(){
    //define game states
    const state_WIN = 'WIN';
    const state_TIE = 'TIE';
    const state_IP = 'IN PROGRESS';

    //keep track of current state
    var game_state = state_IP;

    //keep track of who won
    var winner = 'unknown';

    //loop until game is over
    while (game_state == state_IP){
        //player one's turn
        var coord = await UI.displayFieldReturnCoord("PLAYER ONE'S TURN");
        //insert
        TTT.placeSymbol(coord.x,coord.y,TTT.X);
        //check
        isOver((res)=>{
            winner = res.winner;
            game_state = res.game_state;
        });

        //check if player one ended the game
        if(game_state == state_IP){
            //player two's turn
            var coord = await UI.displayFieldReturnCoord("PLAYER TWO'S TURN");
            //insert
            TTT.placeSymbol(coord.x,coord.y,TTT.O);
            //check
            isOver((res)=>{
                winner = res.winner;
                game_state = res.game_state;
            });
        }
        
    }

    //give an ending message based on gamestate
    var endingMessage = '';
    if(game_state != state_TIE){
        if(winner == TTT.X) winner = ""
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

function isOver(callback){
    //define game states
    const state_WIN = 'WIN';
    const state_TIE = 'TIE';
    const state_IP = 'IN PROGRESS';

    // cardinal directions
    const E = 0;
    const SE = 1;
    const S = 2;
    const SW = 3;

    //gamestate to be returned
    var gamestate = {"game_state" : state_IP,
                     "winner" : 'unknown'};
    
    //iterate through array and check for TTT.win number of consecutive symbols
    var i,j,symbol;

    //keep track if all spaces have been filled
    var full = true; //assume it is filled until we encounter a TTT.BLANK space
    for(i = 0; i < TTT.ROWS; i++){
        for(j = 0; j < TTT.COLS; j++){
            //check if space is blank
            symbol = TTT.getSymbol(i,j);
            if(symbol  == TTT.BLANK){
                full = false;
            }else{//symbol is either TTT.X or TTT.O
                //check E (to the right)
                if(getConsec(E,symbol,i,j,true) >= TTT.WIN){
                    gamestate.game_state = state_WIN;
                    gamestate.winner = symbol;
                    callback(gamestate);
                }

                //check SE (down and to right)
                if(getConsec(SE,symbol,i,j,true) >= TTT.WIN){
                    gamestate.game_state = state_WIN;
                    gamestate.winner = symbol;
                    callback(gamestate);
                }

                //check S (down)
                if(getConsec(S,symbol,i,j,true) >= TTT.WIN){
                    gamestate.game_state = state_WIN;
                    gamestate.winner = symbol;
                    callback(gamestate);
                }

                //check SW (down and left)
                if(getConsec(SW,symbol,i,j,true) >= TTT.WIN){
                    gamestate.game_state = state_WIN;
                    gamestate.winner = symbol;
                    callback(gamestate);
                }

            }
        }
    }//end checking each index

    //see if TIE
    if(full && gamestate.game_state == state_IP){//board is full but we havnt found a winner
        gamestate.game_state = state_TIE;
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