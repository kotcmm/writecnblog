"use strict";
import * as vscode from 'vscode';

export class CnblogPickItem implements vscode.QuickPickItem {
		label: string;
		description: string;
		detail: string;   
    constructor(name : string,key:string) {
        this.label = name;
        this.detail = key;
      }
}