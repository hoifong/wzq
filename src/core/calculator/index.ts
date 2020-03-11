import { Point, CellState } from "../types";

export function judgeWinner (board: Array<Array<CellState>>, newMove: Point){
    let count: number;

    let i: number;
    let j: number;
    const state: CellState = board[newMove.x][newMove.y];

    //  横向
    count = 1;
    i = newMove.x;
    //  向左
    for(
        j = newMove.y-1;
        board[i][j] === state && j >= 0;
        j--, count++
    );

    //  向右
    for(
        j = newMove.y+1;
        board[i][j] === state && j < board.length;
        j++, count++
    );

    if (count >= 5) {
        return true;
    }

    //  纵向
    j = newMove.y;
    count = 1;
    //  向上
    for(
        i = newMove.x-1;
        i >= 0 && board[i][j] === state;
        i--, count++
    );
    //  向下
    for(
        i = newMove.x+1;
        i < board.length && board[i][j] === state;
        i++,count++
    );

    if (count >= 5) {
        return true;
    }

    //  正斜

    count = 1;
    //  左上
    for(
        i = newMove.x-1, j = newMove.y-1;
        i >= 0 && j >= 0 && board[i][j] === state;
        i--, j--, count++
    );
    //  右下
    for(
        i = newMove.x+1, j = newMove.y+1;
        i < board.length && j < board.length && board[i][j] === state;
        i++, j++, count++
    );

    if (count >= 5) {
        return true;
    }

    //  反斜

    count = 1;
    //  右上
    for(
        i = newMove.x-1, j = newMove.y+1;
        i >= 0 && j < board.length && board[i][j] === state;
        i--, j++, count++
    );
    //  左下
    for(
        i = newMove.x+1, j = newMove.y-1;
        i < board.length && j >= 0 && board[i][j] === state;
        i++, j--, count++
    );

    if (count >= 5) {
        return true;
    }

    return false;
}