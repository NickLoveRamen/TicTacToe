//field
const ROWS = 3;
const COLS = 3;

var field = [[" "," "," "],[" "," "," "],[" "," "," "]];

//symbol definitions
const X = 'X';
const O = 'O';
const BLANK = " ";

module.exports = {X,O,BLANK,ROWS,COLS};

//clear function
module.exports.clear = function(){
    process.stdout.write('\x1b[2J');
}

//display function
module.exports.display = function(title){
    var i,j
    var temp = "";

    //print title
    console.log("   " + title);

    //coordinates X
    temp = "    ";
    for(i = 0; i < COLS; i++){
        temp += i.toString() + "   ";
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
        temp = i.toString() + " ║";
        for(j = 0; j < COLS; j++){
            temp += " " + field[i][j] + ' ║';
        }
        console.log(temp);

        //horizontal spacer
        if(i != 2){
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
