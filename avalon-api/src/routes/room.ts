/* eslint-disable eqeqeq */
import { Router } from "express";
import { CallbackError } from "mongoose";
import Room from "../models/Room";
import User from "../models/User";

const room = Router();

// Creating a room
room.post('/', async (req: any, res) => {

    const { name } = req.body;

    const window = {
        "admin": [req.userId],
        name
    };

    const room = await (await Room.create(window)).save();
    const user = await User.findById(req.userId);

    user?.createdRooms.push(room._id);

    user?.save();

    res.send({ room });
});

// Leaving a room
room.delete("/:roomId", async (req: any, res) => {

    try {
        const room = await Room.findById(req.params.roomId);

        if (!room) {
            res.send({ msg: "Invalid room", msgError: true });
        } else {
            room.members = room.members.filter(r => r != req.userId);

            room.save((err: CallbackError) => {
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

export default room;