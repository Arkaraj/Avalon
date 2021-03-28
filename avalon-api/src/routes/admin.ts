import { Router } from "express";
import User from "../models/User";
import Task from "../models/Task";
import Room from "../models/Room";
import { isAdmin } from "../isAdmin";

const admin = Router();

// This route is tested and it works properly

// Get all rooms created
admin.get("/crooms", async (req: any, res) => {

    const rooms = await Room.find({ admin: req.userId });

    res.send({ rooms });

});

//  Gets members in the room
admin.get("/:roomId",isAdmin, async (req: any, res) => {

    Room.findById(req.params.roomId)
        .populate("members").exec((err, document) => {
            if (err) {
                res.send({ msg: "Internal Error", msgError: true });
            }
            else {
                const members = document?.members;

                res.send({ members, msgError:false });
            }
        });

});

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

// Get all the tasks assigned to the user

admin.get("/:roomId/:userId", async (req: any, res) => {

    // array of tasks
    const tasks = await Task.find({ room: req.params.roomId, user: req.params.userId });

    res.send({ tasks });

});

// Deletes tasks for other users
admin.delete("/task/:taskId", async (req: any, res) => {

    await Task.findByIdAndDelete(req.params.taskId);

    res.send({ msg: "successfully deleted the task", done: true });

});

admin.delete("/:roomId", isAdmin, async (req: any, res) => {

    const room = await Room.findByIdAndDelete(req.params.roomId);
    res.send({room, msgError: false});

});


admin.delete("/:roomId/:userId",isAdmin, async (req: any, res) => {

    try {
        const room = await Room.findById(req.params.roomId);

        if (!room) {
            res.send({ msg: "Invalid room", msgError: true });
        } else {
            // eslint-disable-next-line eqeqeq
            room.members = room.members.filter(r => r != req.params.userId);

            room.save((err) => {
                if (err) {
                    res.send({ msg: "Some error occured", msgError: true });
                }
                else {
                    res.send({ room, msgError: false });
                }
            });
        }

    } catch (err) {
        res.send({ msg: "Invalid room", msgError: true });
    }

});

export default admin;