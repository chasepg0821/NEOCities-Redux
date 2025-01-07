import { Request, Response, Router } from "express";
import { customAlphabet } from "nanoid";
import { getClients } from "../clients";

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 5);

export const RoomRouter = Router();

RoomRouter.get('/', (req: Request, res: Response) => {
    const rooms: any[] = [];
    res.status(200).send({rooms});
});

RoomRouter.post('/make-room', (req: Request, res: Response) => {
    let roomID = nanoid();
    console.log(`Made room: ${roomID} with admin ${req.body.user.name}.`);
    res.status(201).send({roomID})
});

RoomRouter.get('/:room', (req: Request, res: Response) => {
    const room = req.params.room;
    // TODO: eventually provide JWTs to clients instead of having to pass in query (NOT IMPORTANT FOR MVP)
    const uid = req.query.uid;
    if (typeof uid === 'string') {
        if (!getClients().inRoom(uid, room)) res.status(403).send("Forbidden: Provided uid is not in the requested room.");
        // TODO: get real room information
        res.status(200).send({
            room
        });
    } else {
        res.status(400).send("Bad Request: uid was not a string.")
    }
    
})