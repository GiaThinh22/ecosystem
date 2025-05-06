class cattail{
    constructor(x,y,a,h){
        this.pos = createVector(x,y);
        this.a = a;
        this.sway;
        this.h = h;
    }
    update(){
        push();
        translate(this.pos.x, this.pos.y);
        this.sway = sin(this.a)*5; 
        rotate(radians(this.sway));
        fill(60, 120, 60);
        rect(-2, this.h, 4, 150);
        fill(139, 69, 19);
        rect(-5, this.h-20, 10, 30, 5);
        this.a+=random(0.01,0.04);
        pop();
    }
}