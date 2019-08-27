/// <reference types="node"/>
import { v1 as uuidV1 } from 'uuid';
import { EventEmitter } from 'events';
import Game, { GameConfig } from './game';
import { Point } from './types';

export interface PlayerInfo {
    //  id
    id?: string
    //  用户名
    name?: string
    //  创建时间
    createTime?: Date
    //  等级
    level?: number
    //  头像
    pic?: string
}

const defaultInfo: PlayerInfo = {
    name: 'Player',
    level: 0,
    pic: ''
}

class Player extends EventEmitter {
    //  个人信息
    protected info: PlayerInfo
    //  所在的game
    protected game: Game | null

    /**
     * 实例化Player对象，如果info中不包含ID或createTime则自动创建
     * @param info 
     */
    constructor(info: PlayerInfo) {
        super();
        const id = info.id || this.createID();
        const createTime = info.createTime || new Date();

        const reWrites:PlayerInfo = {
            id,
            createTime
        }

        this.info = Object.assign({}, defaultInfo, info, reWrites);
    }

    // 生成id
    protected createID() {
        return '' + parseInt(uuidV1().slice(0, 8), 16)%100000;
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

    /**
     * ***************************************
     *                  实例方法
     * ***************************************
     */

    //  打印信息
    printInfo() {
        console.log(this.toString());
    }

    // 转化为string
    toString() {
        const info = this.info;
        return `Player: [${info.name}]\n`
            +   `id: [${info.id}]\n`
            +   `level: [${info.level}]\n`
            +   `createTime: [${info.createTime.toLocaleString()}]`;
    }

    // stringify
    toJSON() {
        return JSON.stringify({
            ...this.info,
            createTime: this.info.createTime.getTime()
        });
    }

    // 从json字符串实例化一个player对象
    fromJSON(jsonStr: string) {
        const json = JSON.parse(jsonStr);

        return new Player({
            ...json,
            createTime: new Date(json.createTime)
        });
    }

    
    // 加入游戏
    join(game: Game) {
        if (this.game) {
            throw new Error('can not join both two games');
        }
        if (!game.join(this)) {
            throw new Error('can not join this game');
        }
        this.game = game;
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
        this.join(game);
        return game;
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