const TTT = require("./TTT_Field");
const rl = require("readline");
rl.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

module.exports.displayOptionsReturnSelected = function(title,options){
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
    display(index,title,options);


    //get keypresses
    async function listener(key,data){
        //check for ctrl + c
        if (data.ctrl && data.name === 'c') {
            process.exit();
        }

        //check for up,down and enter
        switch (data.name){
            case up : {//user pressed up arrow key
                if(index > 0){
                    index --;
                }
                display(index,title,options);
                break;
            }
            case down : {//user pressed down arrow key
                if(index < options.length -1){
                    index ++;
                }
                display(index,title,options);
                break;
            }
            case enter : {//user pressed enter
                removeListener();
                return new Promise((resolve)=>{
                    resolve(options[index]); //return the option that was highlighted when enter was pressed
                });
                break;
            }
        }
    }
    process.stdin.on('keypress', listener);

    //end the listener
    function removeListener(){
        console.log("trying to remove listener");
        process.stdin.removeListener('keypress',listener);
        //rl.pause();
    }

    process.stdin.on('end', () => {
        process.stdout.write('end');
    });
}

//helper function
function display(index, title, options){
    //define the colors of selected options
    const selected = "\x1b[7m"

    //reset console back to normal colors
    const reset = "\x1b[0m"

    //clear screen, display field
    TTT.clear();
    TTT.display(title);

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