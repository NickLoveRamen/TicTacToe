const TTT = require("./TTT_Field");
const rl = require('readline');
rl.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

//clear screen function
function clear(){
    process.stdout.write('\x1b[2J');
}

//display field with custome title and arrowkey selection options
function displayOptionsReturnSelected(title,options,callback){
    //this function will be keeping track of a selection index to manage which 
    //options are currently "selected"
    //should only update the display when a keypress is detected
    //pressing enter will return the option which is "selected" at the time the 
    //user presses enter

    //keep track of which is currently selected
    var index = 0;

    //define key press codes
    const up = 'up';
    const down = 'down';
    const enter = 'return';

    //display options
    displayWithOptions(index,title,options);

    //function to remove the listener
    function remove(){
        process.stdin.removeListener('keypress',listener);
    }

    //listener
    function listener(str, key){
        //check for ctrl + c
        if (key.ctrl && key.name === 'c') {
            process.exit();
        }

        //check for up,down and enter
        switch (key.name){
            case up : {//user pressed up arrow key
                if(index > 0){
                    index --;
                }
                displayWithOptions(index,title,options);
                break;
            }
            case down : {//user pressed down arrow key
                if(index < options.length -1){
                    index ++;
                }
                displayWithOptions(index,title,options);
                break;
            }
            case enter : {//user pressed enter
                remove();
                callback(options[index]);
                break;
            }
        }
    }

    //set the listener
    process.stdin.on('keypress', listener);
}

//helper function
function displayWithOptions(index, title, options){
    //define the colors of selected options
    const selected = "\x1b[7m"

    //reset console back to normal colors
    const reset = "\x1b[0m"

    //clear screen, display field
    clear();
    display(title,-1,-1);

    //display all options
    var i;
    for (i = 0; i < options.length; i++){
        if(i == index){//if the selected index, then print special
            console.log(selected,options[i],reset);
        }else{// print normally
            console.log(" " + options[i]);
        } 
    }
}

//display function
//displays the title at the top then displays the tic tac toe
//field with the current configuration
function display(title,x,y){
    var i,j,temp;

    //define the colors of selected options
    var selected = '';
    var reset = '';
    if(x != -1){
        selected = "\x1b[7m";
        reset = "\x1b[0m";
    }    

    //print title
    console.log("   " + title);

    //coordinates X
    temp = "    ";
    for(i = 0; i < TTT.COLS; i++){
        //handle double digit coordinates
        if(i >= 10){
            temp += i.toString() + "  ";
        }else{
            temp += i.toString() + "   ";
        }
    }
    console.log(temp);//write the line

    //coordinates for y

    //print top container
    temp = '  ╔';
    for(i = 0; i < TTT.COLS -1; i ++){
        temp += '═══╦';
    }
    temp += '═══╗'
    console.log(temp);//write the line

    //print each row
    temp = "";
    for(i = 0;i < TTT.ROWS; i++){
        //handle double digit coordinates
        if(i >= 10){
            temp = i.toString() + '║';
        }else {
            temp = i.toString() + " ║";
        }

        for(j = 0; j < TTT.COLS; j++){
            if(i == x && j == y){
                temp += " " + selected + TTT.getSymbol(j,i) + reset + ' ║';
            }else temp += " " + TTT.getSymbol(j,i) + ' ║';
            
        }
        console.log(temp);//write the line

        //horizontal spacer
        if(i < TTT.ROWS -1){
            temp = "  ╠"
            for(j = 0; j < TTT.COLS - 1; j++){
                temp += "═══╬"
            }
            temp += "═══╣";
            console.log(temp);//write the line
        }
    }

    //print final
    temp = "";
    temp += '  ╚'
    for(i = 0; i < TTT.COLS - 1; i ++){
        temp += '═══╩';
    }
    temp += '═══╝'
    console.log(temp);//write final line
}

module.exports = {display,displayOptionsReturnSelected,clear};