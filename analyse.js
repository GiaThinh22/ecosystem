function drawArrow(base, vecX,vecY, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vecX, vecY);
    let vec = createVector(vecX,vecY);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }
class vectorArrows{
    constructor(thing){
      this.target = thing;
      this.amplifier = 15;
      this.posAboveTarget = createVector(this.target.pos.x-this.target.dir*10,this.target.pos.y-40);
    }
    show(){
        this.posAboveTarget = createVector(this.target.pos.x-this.target.dir*10,this.target.pos.y-40);
        if(!this.target.touchG){        
            drawArrow(this.target.pos, this.amplifier*this.target.vel.x, 0,"blue"); //vector of frog's x velocity
            drawArrow(this.target.pos, 0, this.amplifier/2*this.target.vel.y,"red");//vector of frog's y velocity
            drawArrow(this.target.pos, this.amplifier*this.target.vel.x, this.amplifier/2*this.target.vel.y,"purple");//vector of frog's total velocity
        }
        drawArrow(this.posAboveTarget, this.target.dir*30, 0, "lime"); //vector of frog's direction


    }
}

class data{
    constructor(x,y,text,size){
        this.pos = createVector(x,y);
        this.message = text;
        this.size = size;
        this.mode = CENTER;
    }
    show(){
        push();
        rectMode(CENTER);
        fill(0);
        rect(this.pos.x,this.pos.y-5,50,30);
        fill("white");
        textAlign(this.mode);
        textSize(this.size);
        text(this.message,this.pos.x,this.pos.y);
        pop();
    }
}