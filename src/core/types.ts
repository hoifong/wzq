export interface Point {
    readonly x: number
    readonly y : number
}

export interface PlayerInfo {
    //  id
    id?: string //  8位
    //  用户名
    name?: string
    //  创建时间
    createTime?: Date
    //  等级
    level?: number
    //  头像
    pic?: string
}

export interface GameConfig {
    boardSize?: number
    firstMove?: PlayerSide
    maxTimeout?: number     //毫秒
}

export enum PlayerSide {
    WHITE, BLACK, VIEWER
}

//  棋格状态
export enum CellState {
    INIT, BLACK, WHITE
}

//  房间状态
export enum RoomState {
    INIT,       //房间初始化至双方玩家中一玩家准备前
    WAITING,    //双方玩家其中一方准备至开始游戏
    GAMING,     //开始游戏至暂停
    PAUSE,      //游戏过程中暂停
    OVER        //游戏结束
}