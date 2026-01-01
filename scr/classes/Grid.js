import { Invasor } from "./Invasor.js";

export class Grid{
    constructor(configCL){
        this.rows = configCL.linha;
        this.cols = configCL.coluna;
        this.velocidade = 1;
        this.direction = "right";
        this.moveDown = false;

        this.invasor = this.init();
    }

    init(){
        const array = [];
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                const invasor = new Invasor({
                    x: j*55+30,
                    y: i*40+70
                },this.velocidade,this.canvaTM);
                array.push(invasor);
            }
        }
        return array;
    }

    draw(ctx,playerStatus){
        this.invasor.forEach((inv)=>{
            inv.draw(ctx);
        })
        this.update(playerStatus);
    }

    update(playerStatus){

        if(this.limiteDireito()){
            this.direction = "left";
            this.moveDown = true;
        }else if(this.limiteEsquerdo()){
            this.direction = "right";
            this.moveDown = true;
        }
    
        this.invasor.forEach((inv)=>{
            if(playerStatus){
                if(this.moveDown == true){
                    inv.moveDown();
                    inv.incrementoVelocidade(0.2);
                    this.velocidade = inv.velocidade;
                }
            }
            

            if(this.direction == "left"){
                inv.moveLeft();
            }

            if(this.direction == "right"){
                inv.moveRight();
            }

        });

        this.moveDown = false;
    }

    limiteEsquerdo(){
        return this.invasor.some((inv)=>{
            return inv.position.x <= 0;
        });
    }

    limiteDireito(){
        return this.invasor.some((inv)=>{
            return inv.position.x >= (window.innerWidth - inv.width);
        });
    }

    getRandonInvader(){
        const index = Math.floor(Math.random()*this.invasor.length)
        return this.invasor[index]
    }

    restart(){
        this.invasor = this.init();
        this.direction = "right";
    }
}
