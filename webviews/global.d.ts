import * as _vscode from "vscode";

declare global {
    const tsvscode: {
        postMessage: ({ type: string, value: any }) => void;
    };
    // const accessToken: string;
}

// export function showInformationMessage(message: string, ...items: string[]): Thenable<string | undefined>;