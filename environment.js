class env{
    constructor(x,y,lenx,leny,solid,liquid,air){
        this.pos = createVector(x,y);
        this.len = createVector(lenx,leny);
        this.solid = solid;
        this.liquid = liquid;
        this.air = air;
    }
    show(){
        push();
        strokeWeight(1);
        if(this.solid) fill(112, 94, 72);
        if(this.liquid) fill(59,119,103);
        if(this.air){
            fill(190,214,158,day);
        }
        rect(this.pos.x,this.pos.y,this.len.x,this.len.y);
        pop();
    }
}

class STAR{
    constructor(x,y,size){
        this.pos = createVector(x,y);
        this.size = size;
        this.flicker = random(120,170);
    }
    show(){
            push();
            stroke(255,255,255,255-1.5*day);
            strokeWeight(this.size);
            if(frameCount%this.flicker <=3){
                strokeWeight(0);
            }
            point(this.pos.x,this.pos.y);
            pop();
            if(day == 500){
                this.pos = createVector(random(0,600),random(0,240));
            }
    }
}

class cloud{
    constructor(x,y,size,type){
        this.pos = createVector(x,y);
        this.size = size;
        this.type = type //1 default   2 large    3 long
      }
    show(){
        push();
        noStroke();
        fill(255,255,255,max(0,day)*2+20);  
        if(this.type == 1){
            circle(this.pos.x,this.pos.y,this.size);
            circle(this.pos.x+0.5*this.size,this.pos.y-0.17*this.size,this.size);
            circle(this.pos.x-0.5*this.size,this.pos.y-0.27*this.size,this.size);
            circle(this.pos.x-0.07*this.size,this.pos.y-0.5*this.size,this.size);
          }
          else if(this.type == 3){
            ellipse(this.pos.x,this.pos.y+0.1*this.size,2*this.size,this.size);
            ellipse(this.pos.x,this.pos.y-0.5*this.size,2*this.size,this.size);
            ellipse(this.pos.x+0.7*this.size,this.pos.y-0.2*this.size,2*this.size,this.size);
            ellipse(this.pos.x-0.6*this.size,this.pos.y-0.1*this.size,2*this.size,this.size);
          }
          else if(this.type == 2){
            circle(this.pos.x+0.5*this.size,this.pos.y,1.5*this.size);
            circle(this.pos.x-0.5*this.size,this.pos.y,1.5*this.size);
            circle(this.pos.x,this.pos.y-0.6*this.size,1.5*this.size);
          }
        pop();
        this.pos.x+=0.5;
        if(this.pos.x>=width){
            this.pos.x = 0;
        }
    }
}