import {Runtime, Ability} from '@aikosia/automaton-core';
import BrowserManager from './browser_manager.js';
import express from 'express';
import BrowserRouter from '../routes/browser.js';
import RestRouter from '../routes/rest.js';

let instance = null;

class Daemon extends Ability{
    constructor(){
        super({"key":"daemon"});

        /**error handling */
        process.once('uncaughtException',  (err) => {
            this.logger.log("error","uncaughtException",err.stack);
        });

        process.once('unhandledRejection',  (err) => {
            this.logger.log("error","unhandledRejection",err.stack);
        });
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
            this.automata = await this.loader.run();

            /**web server */
            const app = express();
            app.use(express.json());
            app.use(express.urlencoded({ extended: false }));
            app.use("/browser",BrowserRouter({browserManager:this.bm}));
            app.use("/rest",RestRouter({automata:this.automata.filter(value=>{
                return value.manifest.template == 'rest';
            })}));
            app.use((err, req, res, next) => {
                res.status(500).send(err.toString());
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