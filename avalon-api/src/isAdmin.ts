// To check if the user is the admin of the room or not
import { RequestHandler} from "express";
import Room from './models/Room';

export const isAdmin: RequestHandler<{}, any, any, {}> = async (req: any, res, next) => {

    const room = await Room.findById(req.params.roomId);

    if(room?.admin.includes(req.userId))
    {
        next();
    }
    else {
        res.send({ msg: "Invalid request, user not admin of this room", msgError: true });
    }


};