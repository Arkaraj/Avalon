import * as _vscode from "vscode";

declare global {
    const tsvscode: {
        postMessage: ({ type: string, value: any }) => void;
    };
    // const accessToken: string;
    const vscode1: {
        showInformationMessage: (message: string, ...items: string[]) => Thenable<string | undefined>
    };
}

// export function showInformationMessage(message: string, ...items: string[]): Thenable<string | undefined>;