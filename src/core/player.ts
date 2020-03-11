/// <reference types="node" path='index.js'/>
import { v1 as uuidV1 } from 'uuid';
import { EventEmitter } from 'events';
import Game from './game';
import { Point, GameConfig, PlayerInfo } from './types';

const defaultInfo: PlayerInfo = {
    name: 'Player',
    level: 0,
    pic: ''
}

export class Player extends EventEmitter {
    //  个人信息
    info: PlayerInfo
    //  所在的game
    protected game: Game | null

    /**
     * 实例化Player对象，如果info中不包含ID或createTime则自动创建
     * @param info 
     */
    constructor(info: PlayerInfo = {}) {
        super();

        this.info = {
            ...defaultInfo,
            id: this.createID(),
            createTime: new Date(),
            ...info
        };

    }

    static defaultInfo = defaultInfo

    // 生成id
    protected createID() {
        return ('' + parseInt(uuidV1().slice(0, 8), 16)).slice(0, 8);
    }

    /**
     * ***************************************
     *                  getters
     * ***************************************
     */

    get name() {
        return this.info.name;
    }
    get id() {
        return this.info.id;
    }
    get level() {
        return this.info.level;
    }

    /**
     * ***************************************
     *                  实例方法
     * ***************************************
     */

    //  打印信息
    printInfo() {
        const info = this.info;
        let output = `Player: [${info.name}]\n`
            +   `id: [${info.id}]\n`
            +   `level: [${info.level}]\n`
            +   `createTime: [${info.createTime.toLocaleString()}]`;
        console.log(output);
    }

    // 转化为string
    toString() {
        return JSON.stringify(this);
    }

    // stringify
    toJSON() {
        return {
            ...this.info,
            createTime: this.info.createTime.getTime()
        };
    }

    // 从json字符串实例化一个player对象
    static fromString(s: string) {
        const json = JSON.parse(s);

        return new Player({
            ...json,
            createTime: new Date(json.createTime)
        });
    }
    
    // 加入游戏
    join(game: Game) {
        if (this.game) {
            return false;
        }
        if (!game.join(this)) {
            return false;
        }
        this.game = game;
        this.onJoinGame();
        return true;
    }
    
    // 落子
    move(to: Point) {
        this.game && this.game.move(this, to);
    }

    // 准备
    ready() {
        this.game && this.game.ready(this);
    }

    // 退出游戏
    quitGame() {
        if (this.game) {
            this.game.unjoin(this);
            this.game = null;
        }
    }

    // 创建游戏
    createGame(config?: GameConfig) {
        const game = new Game(config);
        if (this.join(game)) {
            return game;
        }
        return null;
    }

    // 比较两个player是否相同
    equal(player: Player) {
        if (this === player) return true;
        if (this.info.id === player.info.id) return true;
        return false;
    }

    // 比较与目标id是否相等
    idEqual(id: string) {
        return this.info.id === id;
    }

    /**
     * ***************************************
     *                  钩子函数
     * ***************************************
     */

    static EVENTS = {
        READY: 'ready',
        QUIT: 'quit'
    }

    onJoinGame = () => {
        //  todo...
    }

    onGameWait = () => {
        // console.log('\nplayer can do st after game wait...');
        //  todo...
    }
    onGameStart = () => {
        // console.log('\nplayer can do st after game started...');
        //  todo...
    }
    onGameMoved = () => {
        // console.log('\nplayer can do st after player moved...');
        //  todo...
    }
    onGamePause = () => {
        //  todo...
    }
    onGameOver = () => {
        // console.log('\nplayer can do st after game overed...');
        //  todo...
    }
}

export default Player;