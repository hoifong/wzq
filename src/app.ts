/// <reference types="node"/>

import Game from './core/game';
import Player from './core/player';
import Robot from './core/robot';
import { createInterface } from 'readline';

let game: Game = null;
let player1: Player = null;
let player2: Player = null;

const r1 = createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = msg => new Promise(resolve => {
    r1.question(msg, answer => {
        resolve(answer);
    });
});

question('请输入玩家1名字：\n')
    .then((answer: string) => {
        player1 = new Robot({
            name: answer
        });
    
        console.log(`机器人已创建，玩家信息如下：\n`);
        console.log(player1.toString());

        return question('请输入玩家2名字：\n');
    })
    .then((answer: string) => {
        player2 = new Player({
            name: answer
        });
    
        console.log(`玩家2已创建，玩家信息如下：\n`);
        console.log(player2.toString());
    
        main();
    });

function main() {
    game = player1.createGame({
        maxTimeout: 15 * 1000
    });
    player2.join(game);

    game.on('move', game.logBoard);
    game.on('over', () => {
        r1.close();
    });

    player2.ready();
    player1.ready();

    getMove();
}

function getMove() {
    if (!game.ifOnGame) {
        return;
    }
    const activePlayer:Player = game.activePlayer;
    const activeSide = game.ifBlackActive ? '黑' : '白';
    return question(`请${activeSide}方落子：\n`)
        .then((answer: string) => {
            const [x, y] = answer.split(' ').map(it => parseInt(it));
            activePlayer.move({x, y});
            return getMove();
        });
}