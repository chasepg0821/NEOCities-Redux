import { Request, Response, Router } from "express";
import { customAlphabet } from "nanoid";

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 5);

const router = Router();

router.post('/make-room', (req: Request, res: Response) => {
    let roomID = nanoid();
    console.log(`Made room: ${roomID} with admin ${req.body.user.name}.`);
    res.status(201).send({roomID})
})

export default router;