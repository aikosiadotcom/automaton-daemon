import {Daemon} from "#lib/index";

const daemon = new Daemon();
daemon.event.on("error",(err)=>{
    console.log(err);
});
await daemon.run();