export class Gameplay extends Phaser.Scene {
    constructor(){
        super('Gameplay');

        //Declara as variáveis
        this.cursor;
        this.p1;
        this.p2;
        this.playerSpeed = 500;
        this.maxPlayerSpeed = 900;

        this.playerHeight = 200;
        this.minPlayerHeight = 100;
        
        this.ball;
        this.ballSpeed = 300;
        this.speedMultiply = 1.1;
        this.maxBallSpeed = 850;
        
        this.points;

        this.p1Points = 0;
        this.p2Points = 0;

        // Modo imortal para testes
        this.godmode = false;

    }

    preload(){
        
    }

    create(){
        this.p1 = this.add.rectangle(50, this.scale.height / 2, 20, this.playerHeight, 0xffffff);
        this.p2 = this.add.rectangle(this.scale.width-50, this.scale.height/2, 20, this.playerHeight, 0xffffff);

        this.ball = this.add.rectangle(this.scale.width/2, this.scale.height/2, 25, 25, 0xffffff)

        this.physics.add.existing(this.p1);
        this.physics.add.existing(this.p2);
        this.physics.add.existing(this.ball);
        this.cursor = this.input.keyboard.createCursorKeys();

        this.p1.body.setCollideWorldBounds(true);
        this.p2.body.setCollideWorldBounds(true);
        this.p1.body.setImmovable(true);
        this.p2.body.setImmovable(true);
        this.ball.body.setCollideWorldBounds(true);

        this.ball.body.setVelocityX(this.ballSpeed)
        this.ball.body.setVelocityY(this.ballSpeed)
        this.ball.body.setBounce(1)

        this.physics.add.collider(this.p2, this.ball, this.ballSpeedUp, null, this)
        this.physics.add.collider(this.p1, this.ball, this.ballSpeedUp, null, this)

        this.points = this.add.text(this.scale.width/2, 10, 0 + ' ' + 0, { fontSize: '64px', fill: '#FFF' }).setOrigin(0.5, 0);
    }

    update(){
        //Corrigir ângulo da bola;
        if((this.ball.body.velocity.x < 0 && this.ball.body.velocity.y < 0 && this.ball.body.velocity.x !== this.ball.body.velocity.y) || (this.ball.body.velocity.x > 0 && this.ball.body.velocity.y > 0 && this.ball.body.velocity.x !== this.ball.body.velocity.y)){
            this.ball.body.setVelocityY(this.ball.body.velocity.x)
        }

        // Atualiza o placar
        if(this.points.text !== this.p1Points + ' ' + this.p2Points){
            this.points.setText(this.p1Points + ' ' + this.p2Points)
        }
        
        // Define nova velocidade
        this.p1.body.setVelocityY(0);
        this.p2.body.setVelocityY(0);
        
        // 
        this.cursor.up.isDown ? this.p1.body.setVelocityY(-this.playerSpeed) : null;
        this.cursor.down.isDown ? this.p1.body.setVelocityY(this.playerSpeed) : null;

        // IA player 2
        if(this.ball.body.velocity.x > 0){
            if(this.p2.getWorldPoint().y < this.ball.getWorldPoint().y){
            this.p2.body.setVelocityY(this.playerSpeed*1.1)
        }

        if(this.p2.getWorldPoint().y > this.ball.getWorldPoint().y){
            this.p2.body.setVelocityY(-this.playerSpeed*1-1)
        }
        // Retorno da posição original do P2
        } else if(this.p2.getWorldPoint().y < this.scale.height/2 - 100){
            this.p2.body.setVelocityY(this.playerSpeed)
        } else if(this.p2.getWorldPoint().y > this.scale.height/2 + 100){
            this.p2.body.setVelocityY(-this.playerSpeed)
        }

        //Detecção de gol em P1
        if(this.p1.getWorldPoint().x > this.ball.getWorldPoint().x){
            if(!this.godmode){
                this.reset(2);
            }
        }

        // Detecção de gol em P2
        if(this.p2.getWorldPoint().x < this.ball.getWorldPoint().x){
                this.reset(1);
        }
    }

    ballSpeedUp(p1, ball) {
        // Verificar Velocidade máxima
        if(this.ball.body.velocity.x > 0 && this.ball.body.velocity.x > this.maxBallSpeed) {
            this.ball.body.setVelocityX(this.maxBallSpeed);
        }

        if(this.ball.body.velocity.x < 0 && this.ball.body.velocity.x < this.maxBallSpeed*-1) {
            this.ball.body.setVelocityX(this.maxBallSpeed*-1);
        }

        //Redirecionar Bola
        if(this.ball.body.velocity.y < 0 && this.p1.body.velocity.y > 0){
            this.ball.body.setVelocityY(this.ball.body.velocity.y*-1)
        }

        if(this.ball.body.velocity.y > 0 && this.p1.body.velocity.y < 0){
            this.ball.body.setVelocityY(this.ball.body.velocity.y*-1)
        }

        if(this.ball.body.velocity.y < 0 && this.p2.body.velocity.y > 0){
            this.ball.body.setVelocityY(this.ball.body.velocity.y*-1)
        }

        if(this.ball.body.velocity.y > 0 && this.p2.body.velocity.y < 0){
            this.ball.body.setVelocityY(this.ball.body.velocity.y*-1)
        }

        // Aumentar velocidade da bola
        this.ball.body.setVelocityX(this.ball.body.velocity.x*this.speedMultiply)
        this.ball.body.setVelocityY(this.ball.body.velocity.y*this.speedMultiply)

        this.playerSpeed *= this.speedMultiply
        if(this.playerSpeed > this.maxPlayerSpeed) {
            this.playerSpeed = this.maxPlayerSpeed;
        }

        // Diminuir tamanho
        this.resize(this.playerHeight-10)
    }

        // Redimenciona o tamanho dos jogadores
    resize(newHeight){

        // Atualiza a variável de altura (Separados para talvez uma futura atualização)
        this.p1.height = newHeight;
        this.p2.height = newHeight;

        // Atualiza visualmente o tamanho dos jogadores
        this.p1.body.setSize(20, newHeight);
        this.p2.body.setSize(20, newHeight);

        this.playerHeight = newHeight;
        // Detectar tamanho mínimo
        if(this.p1.height < this.minPlayerHeight){
            this.p1.height = this.minPlayerHeight
            this.p2.height = this.minPlayerHeight
            this.playerHeight = this.minPlayerHeight
        }
    }

        // Função de reset do jogo
    reset(playerWinner){
        // Reseta a posição do jogador
        this.p1.setPosition(50, this.scale.height / 2);
        this.p2.setPosition(this.scale.width-50, this.scale.height / 2);

        // Reseta a posição da bola
        this.ball.setPosition(this.scale.width/2, this.scale.height/2);

        // Redefine as velocidades
        this.playerSpeed = 500;
        this.ballSpeed = 300;
        this.ball.body.setVelocityX(this.ballSpeed)

        // Redimensiona os jogadores no tamanho original
        this.resize(200)

        // Incrementa pontos
        playerWinner === 1 ? this.p1Points++ : null;
        playerWinner === 2 ? this.p2Points++ : null;

        console.log("Gol marcado do jogador " + playerWinner)
    }
}

