class Gamer {
    constructor(board) {
        this.board = board;
        this.pawns = [];
    }
    assign_top() {
        let iter = roundOf({x:0,y:0});
    }
}

var _board = [
    [0],
    [0,0],
    [0,0,0],
    [0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0],
    [0,0,0],
    [0,0],
    [0],
];

var board = [
    [0],
    [-1,1],
    [-2,0,2],
    [-3,-1,1,3],
    [-12,-10,-8,-6,-4,-2,0,2,4,6,8,10,12],
    [-11,-9,-7,-5,-3,-1,1,3,5,7,9,11],
    [-10,-8,-6,-4,-2,0,2,4,6,8,10],
    [-9,-7,-5,-3,-1,1,3,5,7,9],
    [-8,-6,-4,-2,0,2,4,6,8],
    [-9,-7,-5,-3,-1,1,3,5,7,9],
    [-10,-8,-6,-4,-2,0,2,4,6,8,10],
    [-11,-9,-7,-5,-3,-1,1,3,5,7,9,11],
    [-12,-10,-8,-6,-4,-2,0,2,4,6,8,10,12],
    [-3,-1,1,3],
    [-2,0,2],
    [-1,1],
    [0],
]

function isInBound(pos) {
    return pos.y >= 0 && pos.y < board.length && pos.x >= 0 && pos.x < board[pos.y].length;
}

function* roundOf(pos) {
    switch(pos.y) {
        case 0:
            yield {y:1,x:0};
            return {y:1,x:1};
        case 1:
        case 2:
            
    }
}