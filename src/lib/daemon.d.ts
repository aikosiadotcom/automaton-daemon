export default Daemon;
declare class Daemon extends App {
    /**
     *
     * @param {object} [options]
     * @param {string} [options.host="http://localhost"]
     * @param {number} [options.port=3000]
     */
    constructor(options?: {
        host?: string;
        port?: number;
    });
    options: {
        host?: string;
        port?: number;
    };
    host: string;
    port: string | number;
    run(): Promise<void>;
    /**browser management*/
    browserManager: BrowserManager;
    /**load bot */
    runtime: Runtime;
    server: any;
    stop(): Promise<void>;
    reload(): Promise<void>;
}
import { App } from '@aikosia/automaton-core';
import BrowserManager from '#lib/browser_manager';
import { Runtime } from '@aikosia/automaton-core';
