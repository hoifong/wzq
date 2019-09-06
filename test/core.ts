import 'mocha';
import { expect } from 'chai';

import {
    Game,
    Player,
    Robot,
    PlayerInfo,
    PlayerSide,
    RoomState,
    CellState,
    GameConfig
} from '../src/core';

let game:Game = null;
let player:Player = null;
let robot:Robot = null;

describe('五子棋核心基础模块测试:', () => {
    describe('Game类测试:', () => {
        describe('#case 1:Game构造函数默认配置测试：', () => {
            before(() => {
                game = new Game();
            })

            it('*test 1: 未传入构造参数下，提供默认设置', () => {
                expect(Game.defaultConfig).to.deep.equal(game.config);
            });
            it('*test 2: 钩子函数挂载到实例上开始监听：', () => {
                const events = Object.values(Game.EVENTS);
                expect(game.eventNames()).to.deep.equal(events);
                events.forEach(event => {
                    expect(game.listenerCount(event)).to.equal(1);
                });
            });
            it('*test 3：房间状态为初始状态', () => {
                expect(game.roomState).to.equal(RoomState.INIT);
            });
            it('*test 4：属性初始化', () => {
                expect(game.roomState).to.equal(RoomState.INIT);
                expect(game.host).to.equal(null);
                expect(game.whiteSide).to.equal(null);
                expect(game.blackSide).to.equal(null);
                expect(game.whiteSteps).to.deep.equal([]);
                expect(game.blackSteps).to.deep.equal([]);
                expect(game.winner).to.equal(null);
            });
            it('*test 5：getters', () => {
                expect(game.countDown).to.equal(0);
                expect(game.players).to.equal(0);
                expect(game.moves).to.equal(0);
                expect(game.ifBlackActive).to.equal(true);
                expect(game.activePlayer).to.equal(null);
                const board = game.board;
                expect(board.length).to.equal(20);
                expect(board[0].length).to.equal(20);
                expect(board[0][0]).to.equal(CellState.INIT);

                expect(game.ifGaming).to.equal(false);
            });

            after(() => {
                game = null;
            })
        });
        describe('#case 2:Game构造函数参数设置白棋先手，超时时间为10秒：', () => {
            before(() => {
                game = new Game({
                    firstMove: PlayerSide.WHITE,
                    maxTimeout: 10 * 1000
                });
            })

            it('*test 1: 未传入完整构造参数下，提供默认设置', () => {
                expect(game.config).to.deep.equal({
                    firstMove: PlayerSide.WHITE,
                    maxTimeout: 10 * 1000,
                    boardSize: 20
                });
            });

            it('*test 5：getters', () => {
                expect(game.ifBlackActive).to.equal(false);
                expect(game.activePlayer).to.equal(null);
                const board = game.board;
                expect(board.length).to.equal(20);
                expect(board[0].length).to.equal(20);

                expect(game.ifGaming).to.equal(false);
            });

            after(() => {
                game = null;
            });
        });
    });

    describe('Player类测试：', () => {
        describe('#case 1:Player无参构造、id构造、json构造：', () => {
            before(() => {
                player =  new Player();
            })

            it('*test 1：默认基本信息', () => {
                expect(player.name).to.equal(Player.defaultInfo.name);
                expect(player.level).to.equal(0);
                expect(player.id.length).to.equal(8);
            });

            it('*test 2：equal方法', () => {
                const copy = new Player({id: player.id});
                const diff = new Player();
                expect(player.equal(copy)).to.equal(true);
                expect(player.equal(diff)).to.equal(false);
            })

            it('*test 2：stringify', () => {
                const s = player.toString();
                const copy = Player.fromString(s);
                expect(player.equal(copy)).to.equal(true);
                expect(player.info).to.deep.equal(copy.info);
            });

            after(() => {
                player = null;
            });
        });
    });

    describe('游戏流程测试：', () => {
        before(() => {
            player = new Player();
            robot = new Robot();
        });
        describe('1、玩家创建游戏：', () => {
            before(() => {
                game = player.createGame();
            });
            describe('*test 1: ');
        });
    })
});