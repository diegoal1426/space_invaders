export class Particulas{
    constructor(posicao,velocidade,radio,cor){
        this.posicao = posicao;
        this.velocidade = velocidade;
        this.radio = radio;
        this.cor = cor;
        this.opacidade = 1;
    }

    draw(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.opacidade;
        ctx.arc(
            this.posicao.x,
            this.posicao.y,
            this.radio,
            0,
            Math.PI*2
        );
        ctx.fillStyle = this.cor;
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        this.update();
    }

    update(){
        this.posicao.x += this.velocidade.x;
        this.posicao.y += this.velocidade.y;
        this.opacidade = (this.opacidade - 0.01) < 0 ? 0 : this.opacidade - 0.008;
    }
}
