import { Router } from "express";

import { RoomRouter } from "./roomRoutes";

export const router = Router();

router.use('/room', RoomRouter);
