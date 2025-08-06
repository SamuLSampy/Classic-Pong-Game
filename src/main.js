import { Gameplay } from './Gameplay.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    pixelArt: true,
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        Gameplay
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            