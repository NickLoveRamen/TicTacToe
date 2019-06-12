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

//place symbol function
module.exports.placeSymbol = function(x,y,sym){
    field[x][y] = sym;
}

module.exports.getSymbol = function(x,y){
    return field[x][y];
}
