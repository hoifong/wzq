import Player, { PlayerInfo } from './player';
import { Point } from './types';
import { randomMove } from './calculator/robot';

export enum AUTO_LEVEL {
    RANDOM, LEVEL1
}

class Robot extends Player {
    constructor(info: PlayerInfo) {
        super(info);
    }

    onGameWait = () => {
        if (this.equal(this.game.host)) {
            this.ready();
        }
    }
    onGameStart = () => {
        const game = this.game;
        const ifMyBlack = this.equal(game.blackSide);
        if (game.ifBlackFirst === ifMyBlack) {
            const centerPos = Math.floor(game.config.boardSize / 2);
            this.move({
                x: centerPos,
                y: centerPos
            });
        }
    }
    onGameMoved = () => {
        const game = this.game;
        const { blackSteps, whiteSteps, ifBlackActive } = game;
        const size = game.config.boardSize;
        const ifMyBlack = this.equal(game.blackSide);
        if (ifBlackActive === ifMyBlack) {
            this.move(Robot.calculateNextMove(blackSteps, whiteSteps, ifBlackActive, size, AUTO_LEVEL.RANDOM));
            //  todo...
        }
        //  todo...
    }
    onGamePause = () => {
        //  todo...
    }
    onGameOver = () => {
        console.log('\nplayer can do st after game overed...');
        //  todo...
    }

    static calculateNextMove(
        blackSteps: ReadonlyArray<Point>,
        whiteSteps: ReadonlyArray<Point>,
        ifBlackFirst: boolean,
        size: number,
        level: AUTO_LEVEL
    ) {
        switch (level) {
            case AUTO_LEVEL.RANDOM: return randomMove(blackSteps, whiteSteps, size);
            default: return randomMove(blackSteps, whiteSteps, size);
        }
    }
}

export default Robot;