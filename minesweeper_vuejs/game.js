const isNumber = (val) => val.cell[0]>0;
const isMine = (val) => val.cell[0]==-1;
const isNull = (val) => val.cell[0]==0;
const isOpen = (val) => val.cell[1];
const isFlag = (val) => val.cell[2];
const isNotNumber = (val) => !isNumber(val);
const isNotMine = (val) => !isMine(val);
const isNotNull = (val) => !isNull(val);
const isNotOpen = (val) => !isOpen(val);
const isNotFlag = (val) => !isFlag(val);

class Game {
  constructor(height, width, mines) {
    this.height = height;
    this.width = width;
    this.mines = mines < height * width / 2 ? mines : 0;
    this.over = false;
    this.clear();
  }
  clear() {
    this.init = false;
    this.opened = 0;
    this.over = false;
    this.grid = new Array(this.height);
    for (let i=0; i<this.height; i++) {
      this.grid[i] = new Array(this.width);
      for (let j=0; j<this.width; j++) {
        this.grid[i][j] = [0, false, false];
        /** -1:mine,0:empty,1-8:digit | opened? | flag? */
      }
    }
  }
  isInBound(y, x) {
    return y >= 0 && y < this.height && x >= 0 && x < this.width;
  }
  roundOf(y, x, f) {
    if (this.isInBound(y-1,x-1))   f(y-1,x-1);
    if (this.isInBound(y-1,x))     f(y-1,x);
    if (this.isInBound(y-1,x+1))   f(y-1,x+1);
    if (this.isInBound(y,x-1))     f(y,x-1);
    if (this.isInBound(y,x+1))     f(y,x+1);
    if (this.isInBound(y+1,x-1))   f(y+1,x-1);
    if (this.isInBound(y+1,x))     f(y+1,x);
    if (this.isInBound(y+1,x+1))   f(y+1,x+1);
  }
  setup() {
    console.log(`SETUP: height: ${this.height} width: ${this.width} mines: ${this.mines}`);
    if (this.init) this.clear();
    else this.init = true;
    let sum = this.height * this.width;
    for (let i=0; i<this.mines; ) {
      let p = Math.floor(Math.random()*sum);
      let y = Math.floor(p / this.width);
      let x = Math.floor(p % this.width);
      let val = {cell: this.grid[y][x], y: y, x: x};
      if (isMine(val) || isOpen(val)) {
        continue;
      }
      val.cell[0] = -1;
      wu(this.roundIter(val)).filter(isNotMine).forEach(val => val.cell[0]++);
      i++;
    }
  }
  gameover() {
    this.over = true;
    wu(this.allIter()).filter(isMine).forEach(val => val.cell[1] = true);
  }
  * allIter() {
    for (let i=0; i<this.height; i++) {
      for (let j=0; j<this.width; j++) {
        yield { cell: this.grid[i][j], y: i, x: j};
      }
    }
  }
  * roundIter(val) {
    let y, x;
    if (y=val.y-1,x=val.x-1,this.isInBound(y,x)) yield {cell: this.grid[y][x], y: y, x: x};
    if (y=val.y-1,x=val.x  ,this.isInBound(y,x)) yield {cell: this.grid[y][x], y: y, x: x};
    if (y=val.y-1,x=val.x+1,this.isInBound(y,x)) yield {cell: this.grid[y][x], y: y, x: x};
    if (y=val.y  ,x=val.x-1,this.isInBound(y,x)) yield {cell: this.grid[y][x], y: y, x: x};
    if (y=val.y  ,x=val.x+1,this.isInBound(y,x)) yield {cell: this.grid[y][x], y: y, x: x};
    if (y=val.y+1,x=val.x-1,this.isInBound(y,x)) yield {cell: this.grid[y][x], y: y, x: x};
    if (y=val.y+1,x=val.x  ,this.isInBound(y,x)) yield {cell: this.grid[y][x], y: y, x: x};
    if (y=val.y+1,x=val.x+1,this.isInBound(y,x)) yield {cell: this.grid[y][x], y: y, x: x};
  }
  get win() {
    return this.init && wu(this.allIter()).filter(isNumber).every(isOpen);
  }
  get flags() {
    return wu(this.allIter()).filter(isFlag).toArray().length;
  }
  flag(y, x) {
    if (this.isInBound(y, x) && !this.grid[y][x][1])
      this.grid[y][x][2] ^= true;
  }
  act(y, x) {
    if (!this.isInBound(y, x)) return;
    console.log(`ACT: y:${y} x:${x}`);
    let val = { cell: this.grid[y][x], y: y, x: x};
    if (!this.init) {
      val.cell[1] = true;
      wu(this.roundIter(val)).forEach(val => val.cell[1] = true);
      this.setup();
      wu(this.roundIter(val)).filter(isNull).forEach(val => {
        this._act(val);
      });
    } else {
      this._act(val);
    }
  }
  _openNull(val) {
    wu(this.roundIter(val)).filter(isNotOpen).forEach(val => {
      val.cell[1] = true;
      val.cell[2] = false;
      if (isNull(val)) {
        this._openNull(val);
      }
    });
  }
  _openRound(val) {
    console.log(`__OPEN_ROUND: y:${val.y} x:${val.x}`);
    if (wu(this.roundIter(val)).filter(isNotOpen).filter(isNotFlag).forEach(val => {
      val.cell[1] = true;
      if (isMine(val)) {
        this.gameover();
      } else if (isNull(val)) {
        this._openNull(val);
      }
    }));
  }
  _act(val) {
    console.log(`_ACT: y:${val.y} x:${val.x}`);
    if (isOpen(val) &&
        isNumber(val) &&
        wu(this.roundIter(val))
          .filter(val => (isOpen(val) && isMine(val)) || isFlag(val))
          .toArray().length == val.cell[0]) {
      this._openRound(val);
      return;
    }
    val.cell[1] = true;
    val.cell[2] = false;
    if (isMine(val)) {
      this.gameover();
      return;
    }
    if (isNull(val)) {
      val.cell[1] = true;
      this._openNull(val);
      return;
    }
  }
}
