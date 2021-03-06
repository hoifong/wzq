import { Request, Response } from "express";
import hall from "../server";
import { success } from "./helper";
import { Socket, Server } from "socket.io";

export function getRooms(req: Request, res: Response) {
    const rooms: Array<any> = hall.games;
    const { page = 1, pageSize = 10 } = req.query;

    res.json(success({
        data: rooms.slice((page-1)*pageSize, page*pageSize),
        total: rooms.length,
        page,
        pageSize
    }));
}

export function getPlayers(req: Request, res: Response) {
    const players: Array<any> = hall.players;
    const { page = 1, pageSize = 10 } = req.query;

    res.json(success({
        data: players.slice((page-1)*pageSize, page*pageSize),
        total: players.length,
        page,
        pageSize
    }));
}

export function initHallServer(server: Server) {
    server.of('/ws/hall').on('connection', socket => {
        socket.emit('update', hall.state);

        socket.on('disconnect', hall.onUpdate(() => {
            socket.emit('update', hall.state);
        }));
         
    });
}