import { Request, Response, Router } from "express";
import { customAlphabet } from "nanoid";
import { getClients } from "../clients";
import { getRooms, RoomInfoType } from "../rooms";

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 5);

export const RoomRouter = Router();

RoomRouter.get('/', (req: Request, res: Response) => {
    const rooms: RoomInfoType[] = []
    getRooms().getMap().forEach((room) => {
        rooms.push(room.getRoomInfo())
    })
    res.status(200).send({rooms});
});

RoomRouter.post('/make', (req: Request, res: Response) => {
    const rooms = getRooms();
    const clients = getClients();

    // get an unused room id, 5^36 possible combinations collisions should be low
    let roomID = nanoid();
    while (rooms.has(roomID)) roomID = nanoid();

    // TODO: check if the user is in another room, leave room, notify others
    // add the client
    clients.set(req.body.user.id, {
        name: req.body.user.name,
        room: roomID
    });

    // add the room based on the request
    rooms.add({
        id: roomID,
        admin: req.body.user,
        users: {},
        roomSetup: req.body.roomSetup
    });
    
    console.log(`Made room: ${roomID} with admin ${req.body.user.id}.`);
    res.status(201).send({room: rooms.get(roomID)?.getLobbyData()});
});

RoomRouter.post('/join', (req: Request, res: Response) => {
    const rooms = getRooms();
    const clients = getClients();

    // check if the room exists
    if (!rooms.has(req.body.room)) res.status(404).send({error: "Not Found", message: "Requested room does not exist."});
    
    console.log("hi");

    // add the client and put them into the room
    clients.set(req.body.user.id, {
        name: req.body.user.name,
        room: req.body.room
    });
    rooms.get(req.body.room)!.addUser(req.body.user.id, {
        name: req.body.user.name,
        latency: 0
    });

    console.log(`${req.body.user.id} joind room ${req.body.room}.`);
    res.status(200).send({room: rooms.get(req.body.room)?.getLobbyData()});
});

RoomRouter.get('/:room', (req: Request, res: Response) => {
    const room = req.params.room;
    const rooms = getRooms();

    if (!rooms.has(room)) res.status(404).send({error: "Not Found", message: "Requested room does not exist."});

    res.status(200).send(rooms.get(room)!.getRoomInfo());
})