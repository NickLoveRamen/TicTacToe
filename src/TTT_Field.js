//field
const ROWS = 3;
const COLS = 3;
const WIN = 3;

var field = [];

//symbol definitions
const X = 'X';
const O = 'O';
const BLANK = " ";

module.exports = {X,O,BLANK,ROWS,COLS,WIN};

//initialize the array based on the row and col lengths
module.exports.init = function(){
    field.length = ROWS;

    for (var i = 0; i < ROWS; i++){
        var temp = [];
        temp.length = COLS;
        for(var j = 0; j < COLS; j++){
            temp[j] = BLANK;
        }
        field[i] = temp;
    }
}

//clear screen function
module.exports.clear = function(){
    process.stdout.write('\x1b[2J');
}

//display function
//displays the title at the top then displays the tic tac toe
//field with the current configuration
module.exports.display = function(title){
    var i,j,temp;

    //print title
    console.log("   " + title);

    //coordinates X
    temp = "    ";
    for(i = 0; i < COLS; i++){
        //handle double digit coordinates
        if(i >= 10){
            temp += i.toString() + "  ";
        }else{
            temp += i.toString() + "   ";
        }
    }
    console.log(temp);

    //coordinates for y

    //print top container
    temp = '  ╔';
    for(i = 0; i < COLS -1; i ++){
        temp += '═══╦';
    }
    temp += '═══╗'
    console.log(temp);

    //print each row
    temp = "";
    for(i = 0;i < ROWS; i++){
        //handle double digit coordinates
        if(i >= 10){
            temp = i.toString() + '║';
        }else {
            temp = i.toString() + " ║";
        }

        for(j = 0; j < COLS; j++){
            temp += " " + field[j][i] + ' ║';
        }
        console.log(temp);

        //horizontal spacer
        if(i < ROWS -1){
            temp = "  ╠"
            for(j = 0; j < COLS - 1; j++){
                temp += "═══╬"
            }
            temp += "═══╣";
            console.log(temp);
        }
    }

    //print final
    temp = "";
    temp += '  ╚'
    for(i = 0; i < COLS - 1; i ++){
        temp += '═══╩';
    }
    temp += '═══╝'
    console.log(temp);
}

//place symbol function
module.exports.placeSymbol = function(x,y,sym){
    field [x][y] = sym;
}

module.exports.getSymbol = function(x,y){
    return field[x][y];
}
