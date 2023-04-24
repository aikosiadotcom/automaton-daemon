import {Runtime, Ability} from '@aikosia/automaton';
import BrowserManager from './browser_manager.js';
import express from 'express';
import BrowserRouter from '../route/browser.js';

let instance = null;

class Daemon extends Ability{
    constructor(){
        super({"key":"daemon"});
    }

    static getInstance() {
        if (!instance) {
            instance = new Daemon();
        }

        return instance;
    }

    async start(){
        try{
            this.profiler.start("bootstrap");

            /**browser management*/
            this.bm = new BrowserManager();
            await this.bm.start();
    
            /**load bot */
            this.loader = new Runtime();
            await this.loader.run();
    
            /**web server */
            const app = express();
            app.use(express.json());
            app.use("/browser",BrowserRouter({browserManager:this.bm}));
        
            app.use((err, req, res, next) => {
                res.status(500).send(err.data);
            });
        
            this.server = app.listen(process.env.AUTOMATON_DAEMON_PORT, () => {
                this.profiler.stop("bootstrap");
                console.log(`automaton daemon started at ${process.env.AUTOMATON_DAEMON_PORT}`);
                this.emitter.emit('ready');
            });
        }catch(err){
            this.logger.log('error','bootstrap',err);
        }
    }

}

const daemon = Daemon.getInstance();

export default daemon;