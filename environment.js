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
        this.s = size;
        this.flicker = random(120,170);
    }
    show(){
            push();
            stroke(255,255,255,255-1.5*day);
            strokeWeight(this.s);
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
    constructor(x,y,r){
        this.pos = createVector(x,y);
        this.r = r;
    }
    show(){
        push();
        noStroke();
        fill(255,255,255,max(0,day)*2+20);  
        circle(this.pos.x,this.pos.y,this.r);
        circle(this.pos.x+15,this.pos.y-5,this.r);
        circle(this.pos.x-15,this.pos.y-8,this.r);
        circle(this.pos.x-2,this.pos.y-15,this.r);
        pop();
        this.pos.x+=random(0.3,0.9);
        if(this.pos.x>=width){
            this.pos.x = 0;
        }
    }
}