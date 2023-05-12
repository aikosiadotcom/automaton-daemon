import {Runtime, App} from '@aikosia/automaton-core';
import BrowserManager from '#lib/browser_manager';
import express from 'express';
import BrowserRouter from '#route/browser';
import RestRouter from '#route/rest';
import extend from 'extend';

class Daemon extends App{
    /**
     * 
     * @param {object} [options] 
     * @param {string} [options.host="http://localhost"]
     * @param {number} [options.port=3000]
     */
    constructor(options){
        options = extend(true,{
            host:"",
            port:process.env.AUTOMATON_DAEMON_PORT ?? 3000,
            browser:{
                profile:{
                    name:''
                },
                expose:true
            },
            runtime:{
            }
        },options);
        super({"key":"Daemon","childKey":"Daemon"});
        this.options = options;
        this.host = options.host == "" ? "http://localhost" : options.host;
        this.port = options.port == "" ? (process.env.AUTOMATON_DAEMON_PORT ?? 3000) : options.port
    }

    async run(){
        try{
            this.profiler.start("run");
            await this.event.emit("start");
            /**browser management*/
            this.browserManager = new BrowserManager(this.options.browser);
            this.browserManager.event.on("error",(err)=>{
                this.event.emit("error",err);
            });
            await this.browserManager.run();
    
            /**load bot */
            this.runtime = new Runtime({
                ...this.options.runtime,
                endpoint:`${this.host}:${this.port}`
            });

            /**web server */
            const app = express();
            app.use(express.json());
            app.use(express.urlencoded({ extended: false }));
            app.use("/browser",BrowserRouter({browserManager:this.browserManager}));
            app.use("/rest",RestRouter(this.runtime));
            app.use((err, req, res, next) => {
                res.status(500).send(err.toString());
            });
        
            this.server = app.listen(this.port, async () => {
                console.log(`automaton daemon started at ${this.port}`);
                await this.runtime.run();
            });
        }catch(err){
            this.logger.log("error","exception",err);
            await this.event.emit('error',err);
        }finally{
            this.profiler.stop("run");
            await this.event.emit("end");
        }
    }

    async stop(){
        await this.browserManager.stop();
        await this.server.close();
    }

    async reload(){
        await this.runtime.run();
    }
}

export default Daemon;