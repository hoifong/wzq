import { Point } from '../types';

//  随机落子
export const randomMove = (
    blackSteps: ReadonlyArray<Point>,
    whiteSteps: ReadonlyArray<Point>,
    size: number
) => {
    const restBlanks = size*size - blackSteps.length - whiteSteps.length;
    let random = Math.floor(Math.random()*restBlanks) + 1;
    let i,j;
    for ( i = 0; i < size; i++) {
        for ( j = 0; j < size; j++) {
            if (
                blackSteps.findIndex(item => (item.x===i && item.y ===j)) !== -1
                || whiteSteps.findIndex(item => (item.x===i && item.y ===j)) !== -1
            ) {
                continue;
            }
            random -= 1;
            if (!random) return {x: i, y: j};
        }
    }
    return {x: size-1, y: size-1};
}