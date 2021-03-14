require("dotenv-save").config();
import express from "express";
import { connect } from "mongoose";
import User from "./models/User";
import { Strategy as GitHubStrategy } from 'passport-github';
import passport from "passport";
import jwt from 'jsonwebtoken';


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

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
        async (_, __, profile, cb) => {
            let user = await User.findOne({ githubId: profile.id });

            if (user) {
                user.name = profile.displayName;
                await user.save();
            }
            else {
                // Create user

                User.create({ name: profile.displayName, githubId: profile.id });

            }

            // console.log(profile);
            cb(null, { accessToken: jwt.sign({ userId: user?.id }, process.env.SECRET_JWT, { expiresIn: "3hr" }) });
        }
    ));

    app.get("/", (_req, res) => {
        res.send("hello");
    });

    app.get('/auth/github', passport.authenticate('github', { session: false }));

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