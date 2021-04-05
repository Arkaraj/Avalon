/* eslint-disable @typescript-eslint/naming-convention */
import fetch from "node-fetch";
import * as vscode from "vscode";
import { apiBaseUrl } from "./constant";

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
                // console.log(data.room);
                vscode.window.showInformationMessage(`Deleted Room: ${data.room.name}`);
            }
            else {
                vscode.window.showErrorMessage(data.msg);
            }

        })
        ;

};

export const leaveRoom = async (roomId: string, token: any) => {
    fetch(`${apiBaseUrl}/room/${roomId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
    })
        .then(res => res.json())
        .then(data => {
            if (!data.msgError) {
                // console.log(data.room);
                vscode.window.showInformationMessage(`Left Room: ${data.room.name}`);
            }
            else {
                vscode.window.showErrorMessage(data.msg);
            }

        })
        ;
};

export const kickFromRoom = async (userId: string,roomId:string, token: any) => {
    fetch(`${apiBaseUrl}/admin/${roomId}/${userId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
    })
        .then(res => res.json())
        .then(data => {
            if (!data.msgError) {
                vscode.window.showInformationMessage(`Removed User From: ${data.room.name}`);
            }
            else {
                vscode.window.showErrorMessage(data.msg);
            }

        })
        ;
};

export const addAdmin = async (githubId:{githubId: string},roomId:string, token: any) => {
    const res = await fetch(`${apiBaseUrl}/admin/addAdmins/${roomId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(githubId)
    });

    const data = await res.json();

    if (!data.msgError) {
        vscode.window.showInformationMessage(`Added ${data.user.name} as admin to room: ${data.room.name}` );
        return data;
    }
    else {
        vscode.window.showErrorMessage(data.msg);
        return null;
    }

};


