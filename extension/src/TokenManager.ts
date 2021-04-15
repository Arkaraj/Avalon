import * as vscode from "vscode";

const KEY = "vsAvalontokenkey";

export class TokenManager {
    static globalState: vscode.Memento;

    static setToken(token: string) {
        return this.globalState.update(KEY, token);
    }

    static getToken(): string | vscode.Memento | undefined {
        return this.globalState.get(KEY);
    }
}