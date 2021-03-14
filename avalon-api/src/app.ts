import express from "express";
import { connect } from "mongoose";
import User from "./models/User";


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

    const user = await User.create({ name: "Arkaraj" });

    console.log(user);

    const app = express();

    app.get("/", (_req, res) => {
        res.send("hello");
    });

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Listening on port ${port} 🚀`)
    });
};
main();