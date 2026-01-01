export class Obstaculo{
    constructor(position,width,height,color){
        this.color = color;
        this.width = width;
        this.height = height;
        this.position = position;
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    hit(projeteis){
        const projectilPositionY = projeteis.velocity < 0 ? projeteis.position.y : projeteis.position.y + projeteis.height;
        return(
            projeteis.position.x >= this.position.x &&
            projeteis.position.x <= this.position.x  + this.width &&
            projectilPositionY >= this.position.y &&
            projectilPositionY <= this.position.y + this.height
        );
    }
}
