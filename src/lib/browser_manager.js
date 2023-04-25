import { chromium, devices } from 'playwright';
import pf from 'portfinder';
import { publicIpv4 } from 'public-ip';
import httpProxy from 'http-proxy';
import { Ability, System } from '@aikosia/automaton-core';
import ProfileManager from './profile_manager.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: System.getPath("env") });

const pm = new ProfileManager()
const _ports = process.env.AUTOMATON_DEV_PROTOCOL_RANGE.split(":");

pf.setBasePort(_ports[0]);
pf.setHighestPort(_ports[1]);


class BrowserManager extends Ability{
    #browsers = {}

    constructor() {
        super({key:"BrowserManager"})
    }

    async start() {
        const ip = await publicIpv4();
        let profiles = await pm.get();

        for (let i = 0; i < profiles.length; i++) {
            this.logger.log("info","profiles", profiles);
            if (profiles[i].manifest.autoStart) {
                const port = await pf.getPortPromise();
                this.#browsers[profiles[i].id] = {
                    instance: null,
                    port: port,
                    url: null,
                    proxyPort: null,
                    proxyServer: null
                };
                this.#browsers[profiles[i].id].instance = await chromium.launchPersistentContext(profiles[i].absPath, {
                    headless: false,
                    ...devices['Desktop Chrome'],
                    args: [
                        // `--remote-debugging-address=0.0.0.0`,//not working if not headless
                        `--remote-debugging-port=${this.#browsers[profiles[i].id].port}`,
                        // '--start-maximized'
                    ]
                });

                const proxyPort = await pf.getPortPromise();
                this.#browsers[profiles[i].id].proxyPort = proxyPort;
                this.#browsers[profiles[i].id].url = `http://${ip}:${proxyPort}`;
                this.#browsers[profiles[i].id].proxyServer = httpProxy.createServer({
                    target: `ws://localhost:${port}`,
                    ws: true,
                    localAddress: ip
                }).listen(proxyPort);
            }
        }
    }

    async stop() {
        for (let [key, value] of Object.entries(this.#browsers)) {
            await value.instance.close();
            await value.proxyServer.close();
        }

        this.#browsers = {};
    }

    async restart() {
        await this.stop();
        await this.start();
    }

    get(id, key = "instance") {
        return this.#browsers[id][key];
    }
}

export default BrowserManager;