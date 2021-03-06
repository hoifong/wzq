/// <reference types="node"/>
import { EventEmitter } from 'events';
import { v1 as uuidV1 } from 'uuid';
import Player from './player';
import  { RoomState, Point, GameConfig, PlayerSide, CellState } from './types';
import { judgeWinner } from './calculator';



export class Game extends EventEmitter {
    //  房主
    host: Player | null = null
    //  房间状态
    roomState: RoomState = RoomState.INIT
    //  观众
    viewers: Array<Player> = []
    //  白方落子记录
    whiteSteps: Array<Point> = []
    //  黑方落子记录
    blackSteps: Array<Point> = []
    //  设置
    config: GameConfig
    //  对局开始时间
    startTime: Date
    //  对局结束时间
    endTime: Date
    
    // 房间id
    private roomId: String  //5位

    toJSON() {
        return {
            id: this.roomId,
            host: this.host.id,
            roomState: this.roomState,
            whiteSide: this._whiteSide && this._whiteSide.id || '',
            blackSide: this._blackSide && this._blackSide.id || '',
            whiteSteps: this.whiteSteps,
            blackSteps: this.blackSteps,
            startTime: this.startTime && this.startTime.getTime() || '',
            config: this.config
        };
    }

    get id() {
        return this.roomId;
    }

    //  白方
    private _whiteSide: Player | null = null

    get whiteSide() {
        return this._whiteSide;
    }
    
    set whiteSide(player: Player | null) {
        if (!player) {
            this.host = this._blackSide;
            this.roomState = RoomState.INIT;
        } else if (!this._blackSide) {
            this.host = player;
        }
        this._whiteSide = player;
    }

    //  黑方
    private _blackSide: Player | null = null

    get blackSide() {
        return this._blackSide;
    }

    set blackSide(player: Player | null) {
        if (!player) {
            this.host = this._whiteSide;
            this.roomState = RoomState.INIT;
        } else if(!this._whiteSide) {
            this.host = player;
        }
        this._blackSide = player;
    }

    //  赢方
    private _winner: Player | null = null

    get winner() {
        return this._winner;
    }
    set winner(player) {
        this._winner = player;
        this.roomState = RoomState.OVER;
        this.endTime = new Date();

        process.nextTick(() => {
            //  保证在触发move之后再触发over
            //  但是需要马上清除掉倒计时timer
            this.clearTimer();
            this.emit(Game.EVENTS.OVER, this);
        });
    }

    //  棋盘
    private _board: Array<Array<CellState>> = [];

    get board() {
        return this._board;
    }

    private initBoard() {
        const board:Array<Array<CellState>> = [];
        const size = this.config.boardSize;

        //  初始化棋盘
        for (let x=0;x<size;x++) {
            board.push([]);
            const row = board[x];
            for (let y=0;y<size;y++) {
                row.push(CellState.INIT);
            }
        }

        this._board = board;
    }

    private setCellSate(move: Point, state: CellState) {
        this._board[move.x][move.y] = state;
    }

    /**
     * ***************************************
     *                 落子倒计时功能
     * ***************************************
     */
    private lastMoveTime: number = 0
    private timer: NodeJS.Timeout = null

    get countDown() {
        if (!this.ifGaming) {
            return 0;
        }
        const now = new Date().getTime();
        return this.lastMoveTime + this.config.maxTimeout - now;
    }

    private startCountDown() {
        this.clearTimer();
        this.lastMoveTime = new Date().getTime();
        this.timer = setTimeout(this.setTimeoutWinner, this.config.maxTimeout);
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    private setTimeoutWinner = () => {
        console.log('player move timeout....');
        this.winner = this.ifBlackActive ? this._whiteSide : this._blackSide;
    }

    /**
     * ***************************************
     *                  getters
     * ***************************************
     */

    //  玩家人数
    get players() {
        let num = 0;
        if (this.blackSide) num++;
        if (this.whiteSide) num++;

        return num;
    }
    //  落子数
    get moves() {
        return this.whiteSteps.length + this.blackSteps.length;
    }
    //  当前执棋方是否为黑方
    get ifBlackActive() {
        return (this.blackSteps.length === this.whiteSteps.length) == this.ifBlackFirst;
    }
    //  当前执棋方
    get activePlayer() {
        return this.ifBlackActive ? this._blackSide : this._whiteSide;
    }
    //  是否黑棋先手
    get ifBlackFirst() {
        return this.config.firstMove === PlayerSide.BLACK;
    }

    //  是否正在游戏中
    get ifGaming() {
        return this.roomState === RoomState.GAMING;
    }

    get ifOnGame() {
        return this.ifGaming || this.roomState === RoomState.PAUSE;
    }

    //  对局时长
    get duration() {
        if (this.ifGaming) {
            return Math.floor(new Date().getTime()/1000 - this.startTime.getTime()/1000);
        } else if(this.roomState === RoomState.OVER) {
            return Math.floor(this.endTime.getTime()/1000 - this.startTime.getTime()/1000);
        }
        return 0;
    }

    /**
     * ***************************************
     *                  实例方法
     * ***************************************
     */

    //  添加一个player进入游戏
    join(player: Player) {
        if (this.roomState === RoomState.INIT
            && this.players < 2) {
                if (!this.blackSide) {
                    this.blackSide = player;
                    this.bindPlayer(player);
                    return true;
                }
                if (!this.whiteSide) {
                    this.whiteSide = player;
                    this.bindPlayer(player);
                    return true;
                }
            }
        return false;
    }

    //  从游戏中移除某个player
    unjoin(player: Player) {
        if (this.blackSide && player.equal(this.blackSide)) {
            this.blackSide = null;
        }
        if (this.whiteSide && player.equal(this.whiteSide)) {
            this.whiteSide = null;
        }
        this.unBindPlayer(player);
    }

    //  玩家准备
    ready(player: Player) {
        const isHost = player.equal(this.host);
        if (this.roomState === RoomState.WAITING && isHost) {
            this.roomState = RoomState.GAMING;

            //  游戏开始
            this.startCountDown();
            this.startTime = new Date();
            this.initBoard();
            this.emit(Game.EVENTS.START, this);
            return;
        }
        if (this.roomState === RoomState.INIT && !isHost) {
            this.roomState = RoomState.WAITING;
            this.emit(Game.EVENTS.WAIT, this);
            return;
        }
    }

    //  落子
    move(player: Player, moveTo: Point) {
        if (!this.canMove(moveTo)) {
            console.log(`Can not move to point {${moveTo.x}, ${moveTo.y}}`);
            return;
        }
        if (this.ifGaming && player.equal(this.activePlayer)) {
            const steps = this.ifBlackActive ? this.blackSteps :  this.whiteSteps;

            this.setCellSate(moveTo, this.ifBlackActive ? CellState.BLACK : CellState.WHITE);
            steps.push(moveTo);

            //  判断赢方
            if (judgeWinner(this._board, moveTo)) {
                this.winner = player;
            } else {
                this.startCountDown();
            }

            this.emit(Game.EVENTS.MOVE, this);
        }
    }

    //  投降
    surrender(player: Player) {
        if (this.ifGaming) {
            if (player.equal(this._whiteSide)) {
                this.winner = this._blackSide;
            } else if(player.equal(this._blackSide)) {
                this.winner = this._whiteSide;
            }
        }
    }

    //  该位置是否可以落子
    canMove(moveTo: Point) {
        const size = this.config.boardSize;
        return moveTo.x >=0 && moveTo.x <= size-1
            && moveTo.y >= 0 && moveTo.y <= size-1
            && (this.whiteSteps.findIndex(step => (step.x === moveTo.x && step.y === moveTo.y)) === -1)
            && (this.blackSteps.findIndex(step => (step.x === moveTo.x && step.y === moveTo.y)) === -1);
    }

    //  判断player是否在房间
    isInRoom(player: Player) {
        return player.equal(this._whiteSide) || player.equal(this._blackSide);
    }

    //  退回
    goBack(steps: number) {
        if (steps <= 0 || steps > this.moves) return;
        if (this.ifBlackActive) {
            // todo...
        }
    }

    //  清空重置
    clear() {
        this._blackSide = null;
        this._whiteSide = null;
        this.host = null;
        this.whiteSteps = [];
        this.blackSteps = [];
        this.viewers = [];
        this._winner = null;
        this.clearTimer();
    }

    //  在player上注册事件
    private bindPlayer(player: Player) {
        this.on(Game.EVENTS.WAIT, player.onGameWait);
        this.on(Game.EVENTS.START, player.onGameStart);
        this.on(Game.EVENTS.MOVE, player.onGameMoved);
        this.on(Game.EVENTS.OVER, player.onGameOver);
    }

    //  取消绑定
    private unBindPlayer(player: Player) {
        this.off(Game.EVENTS.WAIT, player.onGameWait);
        this.off(Game.EVENTS.START, player.onGameStart);
        this.off(Game.EVENTS.MOVE, player.onGameMoved);
        this.off(Game.EVENTS.OVER, player.onGameOver);
    }

    /**
     * ***************************************
     *                  钩子函数
     * ***************************************
     */

    /**
     *  defaultConfig = {
     *      boardSize: 20,
     *      firstMove: PlayerSide.BLACK,
     *      maxTimeout: 30000,
     *  }
     */
    constructor(config: GameConfig = {}) {
        super();
        this.config = {
            ...Game.defaultConfig,
            ...config
        };
        this.roomId = this.createId();
        this.on(Game.EVENTS.WAIT, this.onGameWait);
        this.on(Game.EVENTS.START, this.onGameStart);
        this.on(Game.EVENTS.MOVE, this.onGameMove);
        this.on(Game.EVENTS.OVER, this.onGameOver);
    }

    private createId() {
        return ('' + parseInt(uuidV1().slice(0, 8), 16)).slice(0, 5);
    }

    static defaultConfig = {
        boardSize: 20,
        firstMove: PlayerSide.BLACK,
        maxTimeout: 30000,
    }

    static EVENTS = {
        WAIT: 'wait',
        START: 'start',
        MOVE: 'move',
        // PAUSE: 'pause',
        // CONTINUE: 'continue',
        OVER: 'over'
    }

    onGameWait() {
        const host = this.host;
        const player = host === this._blackSide ? this._whiteSide : this._blackSide;
        console.log(`Player ${player.name} has been ready, now the host ${host.name} can start the game;\n`);
    }
    onGameStart() {
        const activeSide = this.ifBlackActive ? 'black' : 'white';
        const activePlayer = this.ifBlackActive ? this._blackSide : this._whiteSide;
        console.log(`The host ${this.host.name} has started the game, now the ${activeSide} side player ${activePlayer.name} move first;\n`);
    }
    onGameMove() {
        const lastMovePlayer = this.ifBlackActive ? this._whiteSide : this._blackSide;
        const lastMove = this.ifBlackActive ? this.whiteSteps[this.whiteSteps.length - 1] : this.blackSteps[this.blackSteps.length - 1];
        const activePlayer = this.ifBlackActive ? this._blackSide : this._whiteSide;
        console.log(`The player ${lastMovePlayer.name} has moved to (${lastMove.x},${lastMove.y}), now player ${activePlayer.name} move;\n`);

        this.logBoard();
    }
    onGamePause() {

    }
    onGameOver() {
        const lastActiveSide = this.ifBlackActive ? 'white' : 'black';
        const duration = this.duration;
        const winner = this.winner;
        console.log(`Congratulations! The ${lastActiveSide} player ${winner.name} win the game!\ngame duration: ${duration} s`);
    }

    /**
     * ***************************************
     *                  辅助api
     * ***************************************
     */

    logBoard() {
        const logs = this.board.map(row => {
            return row.map(state => {
                switch(state) {
                    case CellState.BLACK: return 'B';
                    case CellState.WHITE: return 'W';
                    default: return ' ';
                }
            }).join(' | ');
        }).join('\n');
        console.log(logs);
    }

    logGame() {
        //  todo...
    }
}

export default Game;