import * as vscode from "vscode";
import { apiBaseUrl } from "./constant";
import * as polka from "polka";
import { TokenManager } from "./TokenManager";

export const authenticate = () => {

    const app = polka();

    app.get("/auth/:token", async (req, res) => {
        const { token } = req.params;

        if (!token) {
            res.end(`<h1>Something went wrong</h1>`);
            return;
        }

        await TokenManager.setToken(token);

        res.end(`<h1>Auth was sucessful, you can close this now</h1>`);

        app.server?.close();
    });

    app.listen(5001, (err: Error) => {
        if (err) {
            vscode.window.showErrorMessage(err.message);
        }
        else {

            vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(`${apiBaseUrl}auth/github`));
        }
    });

};