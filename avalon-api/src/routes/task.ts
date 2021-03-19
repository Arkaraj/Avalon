import { Router } from "express";
import Task from "../models/Task";

const task = Router();

// To get tasks of the pirticular room
task.get("/:roomId", async (req: any, res) => {

    const roomTask = await Task.find({ room: req.params.roomId });
    if (!roomTask) {
        res.send({ msg: "An error occured", msgError: true });
    }
    else {
        res.send({ roomTask });
    }

});


export default task;