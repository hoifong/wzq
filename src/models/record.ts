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
    id: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true, min: 0 },
    blackSide: { type: String, required: true },
    whiteSide: { type: String, required: true },
    whiteSteps: { type: Array },
    blackSteps: { type: Array },
    config: { type: Object },
    winner: { type: Number }
})

const Record = mongoose.model<IRecord>("Record", RecordSchema);

export default Record;