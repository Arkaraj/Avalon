import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { getNonce } from "./getNonce";
import { addAdmin, createRoom, deleteRoom, joinRoom, kickFromRoom, leaveAdmin, leaveRoom } from "./services";
import { TokenManager } from "./TokenManager";
export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionUri],
        };
        

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {

                case "getToken": {
                    webviewView.webview.postMessage({ type: 'Token', value: TokenManager.getToken() });
                    break;
                }
                case "authenticate": {
                    authenticate(() => {
                        webviewView.webview.postMessage({ type: 'Token', value: TokenManager.getToken() });
                    });
                    break;
                }
                case "logout": {
                    TokenManager.setToken("");
                    break;
                }
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
                case "createRoom": {
                    // vscode.window.showInformationMessage("Create room");
                    const name = await vscode.window.showInputBox({ placeHolder: "Enter Name of the Room", prompt: "Enter The name of the Room" });
                    const description = await vscode.window.showInputBox({ placeHolder: "Enter Description", prompt: "Enter a brief description about the Room" });
                    
                    const room = await createRoom({ name, description }, data.value);
                    // Refresh the webview
                    webviewView.webview.postMessage({ type: 'createdRoom', value: room });

                    break;
                }
                case "joinRoom": {
                    // vscode.window.showInformationMessage("Create room");
                    const code = await vscode.window.showInputBox({ placeHolder: "Enter Code of the Room you want to join", prompt: "Enter The code of the Room" });

                    // createRoom({ name, description }, data.value);
                    const room = await joinRoom({ code }, data.value);
                    // Refresh the webview

                    if(room)
                    {
                        webviewView.webview.postMessage({ type: 'joinRoom', value: room});
                    }
                    else {
                        
                    }

                    break;
                }
                case "deleteRoom": {
                    // vscode.window.showInformationMessage("Create room");

                    // joinRoom({ code }, data.value);
                    const answer = await vscode.window.showInformationMessage("Are you sure you want to delete this room, you can never restore it!", "Delete", "No");

                    if(answer == "Delete")
                    {
                        deleteRoom(data.value.roomId, data.value.accessToken);
                        // now render UI
                        webviewView.webview.postMessage({ type: 'deleteRoom', value:  data.value.roomId});
                    }
                    else {
                        vscode.window.showInformationMessage("Room was not removed");

                    }
                    break;
                }
                case "leaveRoom": {
                    // vscode.window.showInformationMessage("Create room");

                    // joinRoom({ code }, data.value);
                    const answer = await vscode.window.showInformationMessage("Are you sure you want to leave this room", "Leave", "Stay");

                    if(answer == "Leave")
                    {
                        leaveRoom(data.value.roomId, data.value.accessToken);
                        // now render UI
                        webviewView.webview.postMessage({ type: 'leaveRoom', value:  data.value.roomId});
                    }
                    else {
                        vscode.window.showInformationMessage("Still in the Room");

                    }

                    break;
                }
                case "removeUser": {
                   
                    const answer = await vscode.window.showInformationMessage("Are you sure you want to remove this user?", "Remove", "Keep");

                    if(answer == "Remove")
                    {
                        kickFromRoom(data.value.userId,data.value.roomId, data.value.accessToken);
                        // now render UI
                        webviewView.webview.postMessage({ type: 'kickRoom', value:  data.value.userId});
                    }
                    else {
                        vscode.window.showInformationMessage("User still in the Room");

                    }

                    break;
                }
                case "addAdmin": {

                    const githubId = await vscode.window.showInputBox({ placeHolder: "Enter GitHub Id of the User you want to make Admin", prompt: "Enter The GitHub Id of the User" });
                    
                    if(githubId)
                    {
                        await addAdmin({githubId},data.value.roomId,data.value.accessToken);
                    }
                    else {

                    }
                    break;
                }
                case "leaveAdmin": {

                    const answer = await vscode.window.showInformationMessage("Are you sure you want to Leave this Room?", "Leave", "Stay");
                    
                    if(answer === "Leave")
                    {
                        const result = await leaveAdmin(data.value.accessToken,data.value.roomId);

                        if(result)
                        {
                            webviewView.webview.postMessage({ type: 'leaveAdmin', value:  result.room});
                        }
                        else {

                        }
                    }
                    else {
                        vscode.window.showInformationMessage("Admin still in the Room");
                    }
                    break;
                }
            }
        });
    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
        );
        const styleVSCodeUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
        );

        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
        );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
        );

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource
            }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">

        <script nonce="${nonce}">
                const tsvscode = acquireVsCodeApi();
        </script>
			</head>
      <body>
      <script nonce="${nonce}" src="${scriptUri}"></script>
	    </body>
			</html>`;
    }
    // const accessToken = ${JSON.stringify(TokenManager.getToken())}
}