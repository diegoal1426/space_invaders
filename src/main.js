import { Grid } from "./classes/Grid.js";
import { Obstaculo } from "./classes/Obstaculo.js";
import { Particulas } from "./classes/Particulas.js";
import { Player } from "./classes/Player.js";
import { GAMESTATE } from "./utils/constantes.js";
import { SoundEffects } from "./classes/SoundEffects.js";

const startScreen    = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi        = document.querySelector(".score-ui");
const scoreElement   = document.querySelector(".score > span");
const levelElement   = document.querySelector(".level > span");
const highElement    = document.querySelector(".high > span");
const buttonPlay     = document.querySelector(".button-play");
const buttonRestart  = document.querySelector(".restart");

const soundEffects = new SoundEffects();

const gameData = {
    score: 0,
    level: 0,
    high: 0
}

const showGameData = ()=>{
    scoreElement.textContent = gameData.score;
    levelElement.textContent = gameData.level;
    highElement.textContent = gameData.high;
}

gameOverScreen.remove();

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let currentState = GAMESTATE.START;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.imageSmoothingEnabled = false;

const player = new Player(canvas.width,canvas.height);

const playerProjeteis = [];
const invasorProjeteis = [];
const particulas = [];
const obstaculos = [];

const incrementScore = (value)=>{
    gameData.score += value;

    if(gameData.score > gameData.high){
        gameData.high = gameData.score;
    }
}

const initObstacules = () =>{
    const x = canvas.width/2-50;
    const y = canvas.height-250;
    const offset = canvas.width * 0.15;
    const color = "crimson";

    const obstaculo1 = new Obstaculo({x: x-offset,y},100,20,color);
    const obstaculo2 = new Obstaculo({x: x+offset,y},100,20,color);
    obstaculos.push(obstaculo1);
    obstaculos.push(obstaculo2);
};

initObstacules();

const drawObstaculos = ()=>{
    obstaculos.forEach((obst)=>{
        obst.draw(context);
    });
}

const criaExplosao = (position,size,color)=>{
    for (let i = 0; i < 10; i++){
        const particula = new Particulas(
            {
                x: position.x,
                y: position.y},
            {
                x: Math.random()-0.5*1.5,
                y: Math.random()-0.5*1.5
            },
            3,
            color
        );
        particulas.push(particula);
    }
}

const grid = new Grid({linha:2,coluna:5});

const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true
    }
}

const spawnGrid = ()=>{
    if(grid.invasor.length === 0){
        grid.rows = Math.round(Math.random()*Math.floor(canvas.height/100)+1);
        grid.cols = Math.round(Math.random()*9+1);
        grid.restart();
        gameData.level +=1;
        soundEffects.playNextLevelSound();
    }
}

const drawPojeteis = ()=>{
    const projeteis = [...playerProjeteis,...invasorProjeteis];

    projeteis.forEach((projetil,index)=>{
        projetil.draw(context);
    });

    playerProjeteis.forEach((projetil,index)=>{
        projetil.draw(context);
        if(projetil.position.y < 0){
            playerProjeteis.splice(index,1);
        }
    });
    invasorProjeteis.forEach((projetil,index)=>{
        projetil.draw(context);
        if(projetil.position.y >= window.innerHeight){
            invasorProjeteis.splice(index,1);
        }
    });
}

const drawParticulas = ()=>{
    particulas.forEach((part,index)=>{
        part.draw(context);
        if(part.opacidade == 0){
            particulas.splice(index,1);
        }
    });
}

const checkShootInvasores = ()=>{
    grid.invasor.forEach((inv,indx)=>{
        playerProjeteis.some((projetil,indexProjetil)=>{
            if(inv.hit(projetil)){
                criaExplosao({x:inv.position.x+inv.width/2,y:inv.position.y+inv.height/2},2,'purple');
                grid.invasor.splice(indx,1);
                playerProjeteis.splice(indexProjetil,1);
                incrementScore(gameData.level+1);
                soundEffects.playHitSound();
            }
        });
    });
}

const checkShootPlayer = ()=>{
    invasorProjeteis.some((projetil,indexProjetil)=>{
        if(player.hit(projetil)){
            gameOver();
            soundEffects.playExplosionSound();
            invasorProjeteis.splice(indexProjetil,1);
        }
    });
}

const checkShootObstaculos = ()=>{
    obstaculos.forEach((obst)=>{
        playerProjeteis.some((projetil,indexProjetil)=>{
            if(obst.hit(projetil)){
                playerProjeteis.splice(indexProjetil,1);
            }
        });
        invasorProjeteis.forEach((projetil,indexProjetil)=>{
            if(obst.hit(projetil)){
                invasorProjeteis.splice(indexProjetil,1);
            }
        });
    });
}

const gameOver = ()=>{
    criaExplosao({x:player.position.x+player.width/2,y:player.position.y+player.height/2},2,'white');
    criaExplosao({x:player.position.x+player.width/2,y:player.position.y+player.height/2},2,'#4d9be6');
    criaExplosao({x:player.position.x+player.width/2,y:player.position.y+player.height/2},2,'crimson');
    
    currentState = GAMESTATE.GAMEOVER;
    player.alive = false;
    document.body.append(gameOverScreen);
}

const gameLoop = () => {
    context.clearRect(0,0,canvas.width,canvas.height);
    context.save();

    if(currentState == GAMESTATE.PLAYING){
        showGameData();

        spawnGrid();
        
        drawObstaculos();

        drawPojeteis();
        drawParticulas();
        
        checkShootInvasores();
        checkShootPlayer();
        checkShootObstaculos();

        grid.draw(context,player.alive);
        
        context.translate(player.position.x+player.width/2,player.position.y+player.height/2);

        if(keys.left){
            player.moveLeft();
            context.rotate(-0.15);
        }

        if(keys.right){
            player.moveRight();
            context.rotate(0.15);
        }

        if(keys.shoot.pressed && keys.shoot.released){
            player.shoot(playerProjeteis)
            keys.shoot.released = false;
            soundEffects.playShootSound();
        }

        context.translate(-player.position.x-player.width/2,-player.position.y-player.height/2);

        player.draw(context);
    }

    if(currentState == GAMESTATE.GAMEOVER){
        drawParticulas();
        drawPojeteis();
        drawObstaculos();
        checkShootObstaculos();
        grid.draw(context,player.alive);
    }
    context.restore();

    window.requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown",(event)=>{
    const key = event.key.toLowerCase();

    if(key == "a" || key == "arrowleft"){
        keys.left = true
    }

    if(key == "d" || key == "arrowright"){
        keys.right = true
    }
    if(key == "j"){
        keys.shoot.pressed = true
    }
});

window.addEventListener("keyup",(event)=>{
    const key = event.key.toLowerCase();

    if(key == "a" || key == "arrowleft"){
        keys.left = false
    }

    if(key == "d" || key == "arrowright"){
        keys.right = false
    }

    if(key == "j"){
        keys.shoot.pressed = false
        keys.shoot.released = true
    }
})

buttonPlay.addEventListener("click",()=>{
    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = GAMESTATE.PLAYING;

    setInterval(()=>{
        const invader = grid.getRandonInvader();
        if(invader){
            invader.shoot(invasorProjeteis);              
        }
    },1000);

});

buttonRestart.addEventListener("click",()=>{
    player.alive = true;
    currentState = GAMESTATE.PLAYING

    grid.invasor.length = 0;
    grid.velocidade = 1;

    invasorProjeteis.length = 0;
    
    gameData.score = 0;
    gameData.level = 0;

    gameOverScreen.remove();
});

gameLoop();


