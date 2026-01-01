import { CAMINHO_ESPACONAVE, CAMINHO_FOGO_MOTOR, CAMINHO_MOTOR_ESPACONAVE, ESCALA_PLAYER, FRAMES_INICIAL } from "../utils/constantes.js";
import { Projeteis } from "./Projeteis.js";

export class Player{
    
    constructor(canvasW,canvasH){
        this.width = 48*ESCALA_PLAYER;
        this.height = 48*ESCALA_PLAYER;
        this.velocidade = 7;
        this.canvasH = canvasH;
        this.canvasW = canvasW;
        this.alive = true;

        this.position = {
            x: this.canvasW/2 - this.width/2,
            y: this.canvasH - (this.height + 10)
        };

        this.nave = this.getImage(CAMINHO_ESPACONAVE);
        this.motor = this.getImage(CAMINHO_MOTOR_ESPACONAVE);
        this.fogo_motor = this.getImage(CAMINHO_FOGO_MOTOR);
        this.sx = 0;
        this.frameCounter = FRAMES_INICIAL;
    }

    getImage(path,){
        const image = new Image();
        image.src = path;
        return image;
    }

    draw(ctx){
        ctx.drawImage(
            this.nave,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        ctx.drawImage(
            this.fogo_motor,
            this.sx,0,
            48,48,
            this.position.x,
            this.position.y+12,
            this.width,
            this.height
        );

        ctx.drawImage(
            this.motor,
            this.position.x,
            this.position.y+10,
            this.width,
            this.height
        );
        this.update();
    }

    update(){
        if(this.frameCounter <= 0){
            if(this.sx == (this.width/ESCALA_PLAYER) * 2){
                this.sx = 0;
            }else{
                this.sx += (this.width/ESCALA_PLAYER);
            }
            this.frameCounter = FRAMES_INICIAL;
        }
        this.frameCounter--;
    }

    moveLeft(){
        if(this.position.x > 0){
            this.position.x -= this.velocidade ;
        }
    }

    moveRight(){
        if(this.position.x < (this.canvasW-this.width)){
            this.position.x += this.velocidade ;
        }
    }
    shoot(projeteis_player){
        const tiro = new Projeteis({x: this.position.x + this.width/2-2,y:this.position.y},-8);
        projeteis_player.push(tiro);
    }
    hit(projeteis){
        return(
            projeteis.position.x >= this.position.x+15 &&
            projeteis.position.x <= this.position.x +15 + this.width-30 &&
            projeteis.position.y >= this.position.y+15 &&
            projeteis.position.y <= this.position.y+this.height-20
        );
    }
}
