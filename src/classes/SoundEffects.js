export class SoundEffects{
    constructor(){
        this.shootSound = [
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3")
        ];
        this.hitSound = [
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3")
        ];
        this.explosaoSound = new Audio("src/assets/audios/explosion.mp3");
        this.nextLevelSound = new Audio("src/assets/audios/next_level.mp3");

        this.currentShootSound = 0;
        this.currentHitSound = 0;

        this.adjustVolumes();
    }

    adjustVolumes(){
        this.explosaoSound.volume = 0.2;
        this.nextLevelSound.volume = 0.4;
        this.hitSound.forEach((sound)=>{
            sound.volume = 0.2;
        });
       this.shootSound.forEach((sound)=>{
            sound.volume = 0.5;
        });
    }

    playExplosionSound(){
        this.explosaoSound.play();
    }
    playNextLevelSound(){
        this.nextLevelSound.play();
    }
    playShootSound(){
        this.shootSound[this.currentShootSound].currentTime = 0;
        this.shootSound[this.currentShootSound].play();
        this.currentShootSound = (this.currentShootSound +1) % 5;
    }
    playHitSound(){
        this.hitSound[this.currentHitSound].currentTime = 0;
        this.hitSound[this.currentHitSound].play();
        this.currentHitSound = (this.currentHitSound +1) % 5;
    }
}
