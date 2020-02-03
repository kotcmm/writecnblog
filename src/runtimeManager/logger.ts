/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { lazy } from './lazy';


function isString(value: any): value is string {
    return Object.prototype.toString.call(value) === '[object String]';
}

export class Logger {

    private readonly outputChannel = lazy(() => vscode.window.createOutputChannel('write-cnblog'));

    public log(message: string, data?: any): void {
        this.appendLine(`[Log - ${(new Date().toLocaleTimeString())}] ${message}`);
        if (data) {
            this.appendLine(Logger.data2String(data));
        }
    }

    public appendLine(value: string = '') {
        return this.outputChannel.value.appendLine(value);
    }

    public append(value: string) {
        return this.outputChannel.value.append(value);
    }

    public show() {
        this.outputChannel.value.show();
    }

    private static data2String(data: any): string {
        if (data instanceof Error) {
            if (isString(data.stack)) {
                return data.stack;
            }
            return (data as Error).message;
        }
        if (isString(data)) {
            return data;
        }
        return JSON.stringify(data, undefined, 2);
    }
}