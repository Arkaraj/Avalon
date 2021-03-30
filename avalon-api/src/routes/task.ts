import { Router } from "express";
import Task from "../models/Task";

const task = Router();

// All the routes here is tested and it works

// To get tasks of the pirticular room => student
task.get("/:roomId", async (req: any, res) => {

    // array of tasks
    const roomTasks = await Task.find({ room: req.params.roomId, user: req.userId });
    if (roomTasks.length == 0) {
        res.send({ msg: "An error occured", msgError: true });
    }
    else {
        res.send({ roomTasks });
    }

});

// modify the task
task.put("/:taskId", async (req: any, res) => {

    // const { completed } = req.body;

    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            res.send({ msg: "Invalid room", msgError: true });
        } else {

            task.completed = !task.completed;
            task.save();

            res.send({ task, done: true });
        }

    } catch (err) {
        res.send({ msg: "Internal Error", msgError: true });
    }

});


export default task;