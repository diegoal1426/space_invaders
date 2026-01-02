import {  CAMINHO_INVASOR, ESCALA_PLAYER } from "../utils/constantes.js";
import { Projeteis } from "./Projeteis.js";

export class Invasor{
    
    constructor(position,velocidade){
        this.width = 50;
        this.height = 37;
        this.velocidade = velocidade;
        this.position = position
        this.inimigo = this.getImage(CAMINHO_INVASOR);
    }

    getImage(path,){
        const image = new Image();
        image.src = path;
        return image;
    }

    draw(ctx){
        ctx.drawImage(
            this.inimigo,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
    incrementoVelocidade(boost){
        this.velocidade += boost;
    }
    moveLeft(){
        this.position.x -= this.velocidade ;
    }

    moveRight(){    
        this.position.x += this.velocidade ;
    }
    moveDown(){
        this.position.y += this.height;
    }

    shoot(projeteis_player){
        const tiro = new Projeteis({x: this.position.x + this.width/2-2,y:this.position.y+20},10);
        projeteis_player.push(tiro);
    }

    hit(projeteis){
        return(
            projeteis.position.x >= this.position.x &&
            projeteis.position.x <= this.position.x + this.width &&
            projeteis.position.y >= this.position.y &&
            projeteis.position.y <= this.position.y+this.height
        );
    }
}