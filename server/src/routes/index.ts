import { Router } from "express";

import roomRouter from "./roomRoutes";

const router = Router();

router.use('/room', roomRouter);

export default router;