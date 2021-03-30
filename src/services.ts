/* eslint-disable @typescript-eslint/naming-convention */
import fetch from "node-fetch";
import * as vscode from "vscode";
import { apiBaseUrl } from "./constant";
import { DepNodeProvider } from "./TreeDataProvider";

type RoomDetail = {
    name: string | undefined;
    description: string | undefined;
};

export const createRoom = async (roomDetails: RoomDetail, token: any) => {

    const res = await fetch(`${apiBaseUrl}/room`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(roomDetails)
    });
    const data = await res.json();
    // console.log(data);
    if (!data.msgError) {
        // console.log(data.room);
        vscode.window.showInformationMessage(`Room Created 🎉🎉, Room Code: ${data.room.code}`);
        // Refresh the webview
        return data.room;
    }
    else {
        vscode.window.showErrorMessage(data.msg);
        return null;
    }
};

export const joinRoom = async (code: { code: string | undefined } | undefined, token: any) => {
    const res = await fetch(`${apiBaseUrl}/join`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(code)
    });
    const data = await res.json();
    if (!data.msgError) {

        vscode.window.showInformationMessage(`Joined Room 🎉🎉, Room Name: ${data.room.name}`);
        return data.room;
    }
    else {
        vscode.window.showErrorMessage(data.msg);
        return null;
    }
};

export const deleteRoom = (roomId: string, token: any) => {

    fetch(`${apiBaseUrl}/admin/${roomId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
    })
        .then(res => res.json())
        .then(data => {
            if (!data.msgError) {
                console.log(data.room);
                vscode.window.showInformationMessage(`Deleted Room: ${data.room.name}`);
            }
            else {
                vscode.window.showErrorMessage(data.msg);
            }

        })
        ;

};

export const roomMembers = (roomId: string, token: any) => {

    fetch(`${apiBaseUrl}/admin/${roomId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    })
        .then(res => res.json())
        .then(data => {
            if (!data.msgError) {

                // vscode.window.showInformationMessage(`Deleted Room: ${data.room.name}`);
                // data.members => array

	// vscode.window.registerTreeDataProvider('Avalon', new DepNodeProvider("/Users/arkarajghosh/Desktop/App-Code/brando"));

                console.log(data.members);
                // vscode.window.createWebviewPanel();
                data.members.forEach((member: any) => {
                    vscode.window.showInformationMessage(member.name);
                });
                // vscode.window.createTreeView("Room name", {
                //     treeDataProvider: new NodeDependenciesProvider(vscode.workspace.rootPath)
                //   });
                // const view = vscode.window.createTreeView('Avalon', {treeDataProvider: new DepNodeProvider("/Users/arkarajghosh/Desktop/App-Code/brando")});

                // console.log(view.reveal());
                
            }
            else {
                vscode.window.showErrorMessage(data.msg);
            }

        })
        ;

};

