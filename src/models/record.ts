import * as mongoose from 'mongoose';
import { Point, GameConfig, PlayerSide } from '../core';

export interface IRecord extends mongoose.Document {
    id: string,
    date: Date,
    duration: number,
    blackSide: string,  //userid
    whiteSide: string,  //userid
    whiteSteps: Array<Point>,
    blackSteps: Array<Point>,
    config: GameConfig,
    winner: PlayerSide,
}

export const RecordSchema = new mongoose.Schema({
    
})