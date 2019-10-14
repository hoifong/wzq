import EventEmitter from 'events';
import { throttle } from 'lodash';
import Player from "./player";
import Game from "./game";

const updateTimeWait = 1000;

export class Hall extends EventEmitter {
    players: Array<Player> = []
    games: Array<Game> = []

    get Onlines() {
        return this.players.length;
    }

    get rooms() {
        return this.games.length;
    }

    get state() {
        return {
            players: this.players,
            games: this.games
        };
    }

    addPlayer: (player: Player) => void = player => {
        if (!this.isOnline(player)) {
            this.players.push(player);

            this.emitUpdate();
        }

    }

    removePlayer: (player: Player) => void = player => {
        const idx = this.players.findIndex(item => player.equal(item));
        this.players.splice(idx, 1);
        this.emitUpdate();
    }

    isOnline: (player: Player) => boolean = player => {
        return this.players.some(item => player.equal(item));
    }

    findPlayer: (username: string) => Player = username => {
        return this.players.find(item => item.idEqual(username));
    }

    addGame: (game: Game) => void = game => {
        this.games.push(game);
        this.emitUpdate();
    }

    emitUpdate = throttle(() => {
        this.emit(Hall.EVENTS.UPDATE);
    }, updateTimeWait)

    onUpdate = (handler: () => void) => {
        this.on(Hall.EVENTS.UPDATE, handler);
        return () => this.removeListener(Hall.EVENTS.UPDATE, handler);
    }

    static EVENTS = {
        ADD_PLAYER: 'add-player',
        DEL_PLAYER: 'del-player',
        ADD_ROOM: 'add-room',
        DEL_ROOM: 'del-room',
        UPDATE: 'update'
    }
} 

export default Hall;