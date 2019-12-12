const hasPawn = (hole) => hole.val != 0;
const hasNotPawn = (hole) => !hasPawn(hole);

class Player {
    constructor(board, id='') {
        this.board = board;
        this.pawns = [];
        this.id = id;
        if (id) {
            this.assign(id);
        }
    }
    assign(id) {
        this.id = id;
        g_board_player[id].forEach(([y,rx]) => {
            let hole = this.board.getHole(y, rx);
            hole.val = this.id;
            this.pawns.push(hole);
        });
    }
    move(from, to) {
        if (from.val == this.id && to.val == 0) {
            from.val = 0;
            to.val = this.id;
        }
    }
}

var g_board = [
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

var g_board_player = {
tp: [
    [0,0],
    [1,-1],[1,1],
    [2,-2],[2,0],[2,2],
    [3,-3],[3,-1],[3,1],[3,3]
],
tl: [
    [4,-12],[4,-10],[4,-8],[4,-6],
    [5,-11],[5,-9],[5,-7],
    [6,-10],[6,-8],
    [7,-9]
],
tr: [
    [4,6],[4,8],[4,10],[4,12],
    [5,7],[5,9],[5,11],
    [6,8],[6,10],
    [7,9]
],
bl: [
    [9,-9],
    [10,-10],[10,-8],
    [11,-11],[11,-9],[11,-7],
    [12,-12],[12,-10],[12,-8],[12,-6]
],
br: [
    [9,9],
    [10,8],[10,10],
    [11,7],[11,9],[11,11],
    [12,6],[12,8],[12,10],[12,12]
],
bt: [
    [13,-3],[13,-1],[13,1],[13,3],
    [14,-2],[14,0],[14,2],
    [15,-1],[15,1],
    [16,0]
],
}

class Board {
    constructor() {
        this.rels = g_board;
        this.holes = [];
        this.init();
    }
    init() {
        this.holes = [];
        for (let i=0; i<this.rels.length; i++) {
            this.holes.push([]);
            for (let j=0; j<this.rels[i].length; j++) {
                this.holes[i].push({y: i, x: j, rx: this.rels[i][j], val: 0});
            }
        }
    }
    isInBound(y, rx) {
        return y >= 0 && y < this.rels.length && this.rels[y].indexOf(rx) != -1;
    }
    getHole(y, rx) {
        if (y >= 0 && y < this.rels.length) {
            let x = this.rels[y].indexOf(rx);
            if (x != -1) {
                return this.holes[y][x];
            }
        }
        return null;
    }
    * _lineIter(hole, dy, dx) {
        let y = hole.y, rx = hole.rx, ret;
        while (y+=dy,rx+=dx, ret=this.getHole(y, rx)) {
            yield ret;
        }
    }
    * _roundIter(hole) {
        let y=hole.y, rx=hole.rx, ret;
        if (ret=this.getHole(y-1,rx-1)) yield ret;
        if (ret=this.getHole(y-1,rx+1)) yield ret;
        if (ret=this.getHole(y  ,rx-2)) yield ret;
        if (ret=this.getHole(y  ,rx+2)) yield ret;
        if (ret=this.getHole(y+1,rx-1)) yield ret;
        if (ret=this.getHole(y+1,rx+1)) yield ret;
    }
    /** 返回一个方向上可以跳到的点或null */
    _lineJump(hole, dy, dx) {
        let lineHoles = [...this._lineIter(hole, dy, dx)];
        let stone_index = lineHoles.findIndex(hasPawn);
        if (stone_index != -1) {
            let jump_index = (stone_index+1) * 2 - 1;
            if (jump_index < lineHoles.length &&
                lineHoles.slice(stone_index+1, jump_index+1).every(hasNotPawn)) {
                return lineHoles[jump_index];
            }
        }
        return null;
    }
    * _jump(hole) {
        let h;
        if (h=this._lineJump(hole, -1, -1)) yield h;
        if (h=this._lineJump(hole, -1, +1)) yield h;
        if (h=this._lineJump(hole,  0, -2)) yield h;
        if (h=this._lineJump(hole,  0, +2)) yield h;
        if (h=this._lineJump(hole, +1, -1)) yield h;
        if (h=this._lineJump(hole, +1, +1)) yield h;
    }
    _getPossibleJump(hole) {
        let results = [];
        results.push(...this._jump(hole));
        let start = 0, end = results.length - 1;
        while (end >= start) {
            for (let i=start; i<=end; i++) {
                for (let h of this._jump(results[i])) {
                    if (!results.some(result => result.x == h.x && result.y == h.y)) {
                        results.push(h);
                    }
                }
            }
            start = end + 1;
            end = results.length - 1;
        }
        return results;
    }
    _getPossibleWalk(hole) {
        return [...this._roundIter(hole)].filter(hasNotPawn);   
    }
    getPossibleMove(hole) {
        return this._getPossibleWalk(hole).concat(this._getPossibleJump(hole));
    }
}