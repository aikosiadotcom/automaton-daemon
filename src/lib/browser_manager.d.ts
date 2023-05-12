export default BrowserManager;
/**
 * ~CreatedProfile
 */
export type BrowserManager = {
    /**
     * :BrowserContext} instance
     */
    "": External;
    port: number;
    url: string;
    proxy: {
        port: number;
    };
};
/**
 * @external BrowserContext
 * @see https://playwright.dev/docs/api/class-browsercontext
 */
/**
 * @external App
 * @see https://github.com/aikosiadotcom/automaton-core
 */
/**
 * @external HttpProxy
 * @see https://www.npmjs.com/package/http-proxy?activeTab=readme
 */
/**
 * @typedef BrowserManager~CreatedProfile
 * @property {external:BrowserContext} instance
 * @property {number} port
 * @property {string} url
 * @property {object} proxy
 * @property {number} proxy.port
 * @property {external:HttpProxy} proxy.instance
 */
/**
 * To manage browsers
 *
 * @mermaid
 * graph TD;
 *  A-->B;
 *
 * @category API
 * @extends external:App
 */
declare class BrowserManager {
    /**
     * @param {object} [options]
     * @param {object} [options.proxy]
     * @param {object} [options.proxy.port]
     * @param {number} [options.proxy.port.min=49152]
     * @param {number} [options.proxy.port.max=65535]
     * @param {object} [option.profile]
     * @param {string} [option.profile.name=""]
     */
    constructor(options?: {
        proxy?: {
            port?: {
                min?: number;
                max?: number;
            };
        };
    });
    options: {
        proxy?: {
            port?: {
                min?: number;
                max?: number;
            };
        };
    };
    /**
     * run the browser manager
     */
    run(): Promise<void>;
    /**
     * To get created browser profile
     * @param {string} [name="default"] - profile name
     * @returns {undefined | BrowserManager~CreatedProfile}
     */
    get(name?: string): undefined | BrowserManager;
    stop(): Promise<void>;
    #private;
}
