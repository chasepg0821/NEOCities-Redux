import { Request, Response, Router } from "express";
import { customAlphabet } from "nanoid";
import { getClients } from "../clients";
import { getRooms } from "../rooms";

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 5);

export const RoomRouter = Router();

RoomRouter.get('/', (req: Request, res: Response) => {
    const rooms: any[] = [];
    res.status(200).send({rooms});
});

RoomRouter.post('/make-room', (req: Request, res: Response) => {
    const rooms = getRooms();
    const clients = getClients();

    let roomID = nanoid();
    while (rooms.has(roomID)) roomID = nanoid();

    if (typeof req.query.uid !== 'string' || !clients.has(req.query.uid)) {
        res.status(400).send("Bad Request: user could not be found by the provided uid")
    } else {
        rooms.add({
            id: roomID,
            admin: req.query.uid,
            users: {},
            roomSetup: req.body.roomSetup
        });
    }
    
    console.log(`Made room: ${roomID} with admin ${req.query.uid}.`);
    res.status(201).send({room: roomID});
});

RoomRouter.get('/:room', (req: Request, res: Response) => {
    const clients = getClients();
    const room = req.params.room;
    const uid = req.query.uid;
    if (typeof uid === 'string') {
        if (!clients.inRoom(uid, room)) res.status(403).send("Forbidden: Provided uid is not in the requested room.");
        // TODO: get real room information
        res.status(200).send({
            room
        });
    } else {
        res.status(400).send("Bad Request: uid was not a string.")
    }
    
})