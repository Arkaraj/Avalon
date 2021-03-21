import { Router } from "express";
import User from "../models/User";
import Task from "../models/Task";
import Room from "../models/Room";

const admin = Router();

// Get all rooms created
admin.get("/crooms", async (req: any, res) => {

    const rooms = await Room.find({ admin: req.userId });

    res.send({ rooms });

});

admin.get("/:roomId", async (req: any, res) => {

    Room.findById(req.params.roomId)
        .populate("members").exec((err, document) => {
            if (err) {
                res.send({ msg: "Internal Error", msgError: true });
            }
            else {
                const members = document?.members;

                res.send({ members });
            }
        });

});

// Work on Progress
// Creating tasks for other users
admin.post('/task/:roomId/:userId', async (req: any, res) => {
    // const task = await (await Task.create(req.body)).save();

    const { text } = req.body;

    const setTask = {
        text,
        completed: false,
        room: req.params.roomId,
        user: req.params.userId
    };

    const task = await (await Task.create(setTask)).save();

    // console.log(task);

    const user = await User.findById(req.params.userId);

    user?.tasks.push(task._id);

    user?.save();

    res.send({ task });
});

admin.delete("/task/:taskId", async (req: any, res) => {

    await Task.findByIdAndDelete(req.params.taskId);

    res.send({ msg: "successfully deleted the task", done: true });

});


export default admin;