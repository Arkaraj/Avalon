/* eslint-disable eqeqeq */
require("dotenv-save").config();
import express from "express";
import { CallbackError, connect } from "mongoose";
import User from "./models/User";
import { Strategy as GitHubStrategy } from 'passport-github';
import passport from "passport";
import jwt from 'jsonwebtoken';
import cors from "cors";
import { isAuth } from "./isAuth";
import Room from "./models/Room";
import room from "./routes/room";
import task from "./routes/task";
import admin from "./routes/admin";

const main = async () => {

    await connect('mongodb://localhost/vsExtension1', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (err) => {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log("Successfully Connected to Database!");
        }
    });

    // Testing Database
    // const user = await User.create({ name: "Arkaraj" });

    // console.log(user);

    const app = express();

    passport.serializeUser((user: any, done) => {
        done(null, user.accessToken);
    });

    app.use(passport.initialize());

    app.use(cors({ origin: "*" }));
    app.use(express.json());
    app.use("/room", isAuth, room);
    // there should be a isAdmin middleware for this
    app.use("/task", isAuth, task);
    app.use("/admin", isAuth, admin);

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
        async (_, __, profile, cb) => {
            let user = await User.findOne({ githubId: profile.id });

            if (user) {

                user.name = profile.displayName ? profile.displayName : profile.username;

                await user.save();
            }
            else {
                // Create user

                const name = profile.displayName ? profile.displayName : profile.username;
                User.create({ name, githubId: profile.id });

            }

            // console.log(profile);
            cb(null, { accessToken: jwt.sign({ userId: user?._id }, process.env.SECRET_JWT, { expiresIn: "30d" }) });
        }
    ));

    app.get("/me", async (req: any, res) => {
        // Bearer ej312rwjflksjflkal...
        const authHeader = req.headers.authorization;

        if (!authHeader) {

            res.send({ user: null });
            return;
        }

        const token = authHeader.split(" ")[1];
        if (!token) {

            res.send({ user: null });
            return;
        }

        // let userId = "";
        try {

            const payload: any = jwt.verify(token, process.env.SECRET_JWT);
            (req as any).userId = payload.userId;
            const user = await User.findById(req.userId);
            res.send({ user });

        } catch (err) {

            res.send({ user: null });
            return;
        }

    });

    app.get("/", (_req, res) => {
        res.send("hello");
    });

    app.get('/auth/github', passport.authenticate('github', { session: false }));

    // Joining a room
    app.post("/join", isAuth, async (req: any, res) => {

        const { code } = req.body;

        const room = await Room.findOne({ code });

        if (!room) {
            res.send({ msg: "Invalid room code", msgError: true });
        } else {
            // check if the user is already there or not, if the user is the admin or not

            if (room.members.includes(req.userId) || room.admin.includes(req.userId)) {
                res.send({ msg: "User already a member", msgError: true });
            }
            else {

                room.members.push(req.userId);

                room.save((err: CallbackError) => {
                    if (err) {
                        res.send({ msg: "Some error occured", msgError: true });
                    }
                    else {
                        res.send({ room, msgError: false });
                    }
                });

            }

        }

    });

    app.get('/auth/github/callback',
        passport.authenticate('github', { session: false }),
        function (req: any, res) {
            // Successful authentication, redirect home.
            res.redirect(`http://localhost:5001/auth/${req.user.accessToken}`);
        });

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Listening on port ${port} 🚀`);
    });
};
main();