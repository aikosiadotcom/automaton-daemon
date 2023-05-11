import { chromium } from 'playwright';
import pf from 'portfinder';
import { publicIpv4 } from 'public-ip';
import httpProxy from 'http-proxy';
import { App } from '@aikosia/automaton-core';
import ProfileManager from '#lib/profile_manager';
import extend from "extend";

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
class BrowserManager extends App{
    /**
     * to store created browser profiles
     * @type {Object}
     */
    #browsers = {}
    /**
     * instance of profile manager
     * @type {ProfileManager}
     */
    #profileManager = new ProfileManager();

    /**
     * @param {object} [options] 
     * @param {object} [options.proxy] 
     * @param {object} [options.proxy.port]
     * @param {number} [options.proxy.port.min=49152]
     * @param {number} [options.proxy.port.max=65535]
     * @param {object} [option.profile]
     * @param {string} [option.profile.name=""]
     */
    constructor(options) {
        options = extend(true,{
            proxy:{
                port:{
                    min:49152,
                    max:65535
                }
            },
            profile:{
                name:""
            },
            expose:true
        },options);
        super({key:"Daemon",childKey:"BrowserManager"});

        this.options = options;

        pf.setBasePort(options.proxy.port.min);
        pf.setHighestPort(options.proxy.port.max);
    }

    /**
     * run the browser manager
     */
    async run() {
        try{
            
            this.profiler.start("run");
            await this.event.emit("start");

            const ip = this.options.expose ? await publicIpv4() : "localhost";
            let profiles = await this.#profileManager.get(this.options.profile.name);
            for (let i = 0; i < profiles.length; i++) {
                const port = await pf.getPortPromise();
                this.#browsers[profiles[i].name] = {
                    instance: null,
                    url: null,
                    port: port,
                    proxy:{
                        instance:null,
                        port:null
                    },
                    error:null
                };
                this.#browsers[profiles[i].name].instance = await chromium.launchPersistentContext(profiles[i].root, {
                    headless: false,
                    args: [
                        `--remote-debugging-port=${this.#browsers[profiles[i].name].port}`,
                    ]
                });
    
                const proxyPort = await pf.getPortPromise();
                this.#browsers[profiles[i].name].url = `http://${ip}:${this.options.expose ? proxyPort : port}`;

                if(this.options.expose){
                    this.#browsers[profiles[i].name].proxy.port = proxyPort;
                    this.#browsers[profiles[i].name].proxy.instance = httpProxy.createServer({
                        target: `ws://localhost:${port}`,
                        ws: true,
                        localAddress: ip
                    }).listen(proxyPort);
                }
            }
            this.logger.log("verbose",`loaded profiles: ${profiles.length}`, profiles);
            
        }catch(err){
            await this.event.emit("error",err);
        }finally{
            this.profiler.stop("run");
            await this.event.emit("end");
        }
    }

    /**
     * To get created browser profile
     * @param {string} [name="default"] - profile name
     * @returns {undefined | BrowserManager~CreatedProfile}
     */
    get(name = "default") {
        return this.#browsers[name];
    }

    async stop(){
        for(const key in this.#browsers){
            const instanceBrowser = this.#browsers[key].instance;
            if(instanceBrowser){
                await instanceBrowser.close();
            }

            if(this.options.expose){
                const instanceProxyServer = this.#browsers[key].proxy.instance;
                if(instanceProxyServer){
                    await instanceProxyServer.close();
                }
            }
        }
    }
}

export default BrowserManager;