/* eslint-disable @typescript-eslint/naming-convention */
import fetch from "node-fetch";
import * as vscode from "vscode";
import { apiBaseUrl } from "./constant";
type RoomDetail = {
    name: string | undefined;
    description: string | undefined;
};

export const createRoom = (roomDetails: RoomDetail, token: any) => {

    fetch(`${apiBaseUrl}/room`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(roomDetails)
    })
        .then(res => res.json())
        .then(data => {
            if (!data.msgError) {
                console.log(data.room);
                vscode.window.showInformationMessage(`Room Created 🎉🎉, Room Code: ${data.room.code}`);
            }
            else {
                vscode.window.showErrorMessage(data.msg);
            }

        })
        ;
};

export const joinRoom = (code: { code: string | undefined } | undefined, token: any) => {
    fetch(`${apiBaseUrl}/join`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(code)
    })
        .then(res => res.json())
        .then(data => {
            if (!data.msgError) {
                console.log(data.room);
                vscode.window.showInformationMessage(`Joined Room 🎉🎉, Room Name: ${data.room.name}`);
            }
            else {
                vscode.window.showErrorMessage(data.msg);
            }

        })
        ;
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