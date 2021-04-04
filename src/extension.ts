// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { authenticate } from './authenticate';
import { HelloWorldPanel } from './HelloWorldPanel';
import { TaskProvider } from './taskProvider';
import { createRoom, joinRoom } from './services';
import { SidebarProvider } from './sidebarProvider';
import { TokenManager } from './TokenManager';
// import { DepNodeProvider } from "./TreeDataProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	TokenManager.globalState = context.globalState;

	// const nodeDependenciesProvider = new DepNodeProvider("/Users/arkarajghosh/Desktop/App-Code/Kuebiko");
	// vscode.window.registerTreeDataProvider('Avalon', nodeDependenciesProvider);

	// console.log("Token value is:", TokenManager.getToken());

	// console.log('Congratulations, your extension "avalon" is now active!');

	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"Avalon-sidebar", // Pass in the id
			sidebarProvider
		)
	);

	const taskProvider = new TaskProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"Avalon-task", // Pass in the id
			taskProvider
		)
	);

	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('avalon.refreshRoom', () =>
	// 	nodeDependenciesProvider.refresh())	
	// );

	// context.subscriptions.push(vscode.window.createTreeView('Avalon', {treeDataProvider: new DepNodeProvider("/Users/arkarajghosh/Desktop/App-Code/Kuebiko")}));

	context.subscriptions.push(
		vscode.commands.registerCommand('avalon.helloWorld', () => {
			// vscode.window.showInformationMessage('Hello World from Avalon!');
			HelloWorldPanel.createOrShow(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('avalon.authenticate', () => {
			try {
				authenticate(() => {

				});
			} catch (err) {
				console.log(err);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('avalon.createRoom', async () => {
			try {
				const name = await vscode.window.showInputBox({ placeHolder: "Enter Name of the Room", prompt: "Enter The name of the Room" });
                    const description = await vscode.window.showInputBox({ placeHolder: "Enter Description", prompt: "Enter a brief description about the Room" });
					const room = await createRoom({ name, description }, TokenManager.getToken());
                    // Refresh the webview
                    // webviewView.webview.postMessage({ type: 'createdRoom', value: room });
					sidebarProvider._view?.webview.postMessage({ type: 'createdRoom', value: room });
			} catch (err) {
				console.log(err);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('avalon.joinRoom', async () => {
			try {
				
				const code = await vscode.window.showInputBox({ placeHolder: "Enter Code of the Room you want to join", prompt: "Enter The code of the Room" });

                    // createRoom({ name, description }, data.value);
                    const room = await joinRoom({ code }, TokenManager.getToken());
					sidebarProvider._view?.webview.postMessage({ type: 'joinRoom', value: room });

			} catch (err) {
				console.log(err);
			}
		})
	);
	// Needs to Refresh
	context.subscriptions.push(
		vscode.commands.registerCommand('avalon.refreshTask', async () => {
			try {
				if(taskProvider._view)
				{
					//taskProvider.revive(taskProvider._view);
				}
				else {

				}

			} catch (err) {
				console.log(err);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('avalon.refreshWebViews', () => {
			// vscode.window.showInformationMessage('Hello World from Avalon!');
			HelloWorldPanel.kill();
			HelloWorldPanel.createOrShow(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('avalon.askQuestion', async () => {
			const answer = await vscode.window.showInformationMessage('How, was your day?', "good", "bad");


			if (answer === 'bad') {
				vscode.window.showInformationMessage('Sorry to hear that');
			} else {
				console.log({ answer });
			}

		})
	);

}

// this method is called when your extension is deactivated
export function deactivate() { }
