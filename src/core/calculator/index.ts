import { Point } from "../types";

export const judgeWinner = (moves: ReadonlyArray<Point>) => {
    const steps = [...moves];
    steps.sort((a, b) => (a.x === b.x) ? (a.y - b.y) : (a.x-b.x));
    let countx = 1;
    let county = 1;
    let countz = 1;
    
    for (let i = 1; i < steps.length; i+=1) {
        const curStep = steps[i];
        const lastStep = steps[i-1];
    
        //  横向
        if (curStep.x-lastStep.x === 1 && curStep.y === lastStep.y) {
            countx += 1;
            if (countx === 5) return true;
        } else {
            countx = 1;
        }
        
        //  纵向
        if (curStep.x === lastStep.x && curStep.y - lastStep.y === 1) {
            county += 1;
            if (county === 5) return true;
        } else {
            county = 1;
        }
    
        //  斜向
        if (curStep.x - lastStep.x === 1 && curStep.y - lastStep.y === 1) {
            countz += 1;
            if (countz === 5) return true;
        } else {
            countz = 1;
        }
    }
  
    return false;
}