import { Request, Response, Router } from "express";
import { customAlphabet } from "nanoid";
import { getClients } from "../clients";
import { getRooms, RoomInfoType, RoomStateEnum } from "../rooms";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 5);

export const RoomRouter = Router();

RoomRouter.get("/", (req: Request, res: Response) => {
    const rooms: RoomInfoType[] = [];
    getRooms()
        .getMap()
        .forEach((room) => {
            rooms.push(room.getRoomInfo());
        });
    res.status(200).send({ rooms });
});

RoomRouter.post("/make", (req: Request, res: Response) => {
    const rooms = getRooms();
    const clients = getClients();

    // get an unused room id, 5^36 possible combinations collisions should be low
    let roomID = nanoid();
    while (rooms.hasRoom(roomID)) roomID = nanoid();

    // add the client
    clients.add(req.body.user.id, {
        name: req.body.user.name,
        room: roomID,
        latency: 0
    });

    // add the room based on the request
    rooms.add({
        id: roomID,
        state: RoomStateEnum.lobby,
        admin: req.body.user,
        users: {
            [req.body.user.id] : {
                name: req.body.user.name,
                latency: 0,
                loaded: false
            }
        },
        roomSetup: req.body.roomSetup
    });

    console.log(`Made room: ${roomID} with admin ${req.body.user.id}.`);
    res.status(201).send({ room: rooms.getRoom(roomID)?.getLobbyData() });
});

RoomRouter.post("/join", (req: Request, res: Response) => {
    const rooms = getRooms();
    const room = rooms.getRoom(req.body.room);
    const clients = getClients();
    const client = clients.getClient(req.body.user.id);

    // check if the room exists
    if (!room)
        res.status(404).send({
            error: "Not Found",
            message: "Requested room does not exist."
        });

    // if the client doesn't exist make the session and put them in the room
    if (!client) {
        clients.add(req.body.user.id, {
            name: req.body.user.name,
            room: req.body.room,
            latency: 0
        });
    // if the client is in another room, remove them and move them
    } else if (client.room !== req.body.room) {
        rooms.getRoom(client.room)?.removeUser(req.body.user.id);
        client.room = req.body.room;
    }

    room!.addUser(req.body.user.id, {
        name: req.body.user.name,
        loaded: false,
        latency: client ? client.latency : 0
    });

    res.status(200).send({ room: room!.getLobbyData() });
});

RoomRouter.get("/:room", (req: Request, res: Response) => {
    const room = getRooms().getRoom(req.params.room);

    if (!room)
        res.status(404).send({
            error: "Not Found",
            message: "Requested room does not exist."
        });

    res.status(200).send(room!.getRoomInfo());
});

RoomRouter.get("/:room/game", (req: Request, res: Response) => {
    const room = getRooms().getRoom(req.params.room);
    const clients = getClients();

    if (!room)
        res.status(404).send({
            error: "Not Found",
            message: "Requested room does not exist."
        });
    if (clients.getClient(req.query.uid as string)?.room !== req.params.room)
        res.status(403).send({
            error: "Forbidden",
            message: "You are not in this room."
        });
    res.status(200).send({ game: room!.getGame()?.getGameData() });
});
