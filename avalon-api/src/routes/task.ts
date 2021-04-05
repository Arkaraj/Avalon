import { Router } from "express";
import Room from "../models/Room";
import Task from "../models/Task";

const task = Router();

// All the routes here is tested and it works

// To get all tasks of the pirticular user
task.get("/", async (req: any, res) => {
    // array of tasks
    Task.find({ user: req.userId }).populate("room")
    .exec((err, doc) => {
        if(err) {
            res.send({ msg: "An error occured", msgError: true });
        }
        else {
            res.send({ roomTasks: doc,  msgError: false });
        }
    });

});


// To get tasks of the pirticular room => member
task.get("/:roomId", async (req: any, res) => {

    // array of tasks
    const roomTasks = await Task.find({ room: req.params.roomId, user: req.userId });

    Room.findById(req.params.roomId).populate('admin').exec((err, document) => {
        if(err)
        {
            res.send({ msg: "An error occured", msgError: true });
        }
        else {
            const admin = document?.admin[0];
            res.send({ roomTasks, admin, msgError: false });
        }
    });

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
            await task.save();

            res.send({ task, msgError: false });
        }

    } catch (err) {
        res.send({ msg: "Internal Error", msgError: true });
    }

});


export default task;