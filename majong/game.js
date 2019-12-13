const tong = ['a','s','d','f','g','h','j','k','l'];
const tiao = ['z','x','c','v','b','n','m',',','.'];
const wan  = ['q','w','e','r','t','y','u','i','o'];
const dnxb = ['1','2','3','4','6','7','8'];
const cards = [...tong,...tiao,...wan,...dnxb];
//34*4=136
const template1 = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
]

class Game {
    constructor(template) {
        this.template = template;
        this.board = template.map(a=>[...a]);
    }
    buildBoard() {
        // let bucket = cards.reduce((a,b)=>(a[b]=4,a),{});
        let bucket = [...cards,...cards,...cards,...cards];
        for (let i=0; i<this.board.length; i++) {
            for (let j=0; j<this.board[i].length; j++) {
                let r = Math.floor(Math.random()*bucket.length);
                // this.board[i][j] = bucket[Object.keys(bucket)[r]];
                // if (--bucket[r] <= 0) {
                //     delete bucket[r];
                // }
                this.board[i][j] = bucket[r];
                bucket[r] = bucket[bucket.length-1];
                bucket.pop();
            }
        }
    }
}

function init() {
    this.game = new Game(template1);
    game.buildBoard();
    this.vm = new Vue({
        el: '#main',
        data: {
            tong, tiao, wan, game
        }
    });
}