import {Router} from 'express';

const RestRouter = function(runtime){
    const router = Router();

    router.post('/:scope/:name', async (req, res, next) => {
        try{
            const name = req.params.name;
            const scope = req.params.scope;
            const {method, args} = req.body;
            const project = runtime.automata.filter((val)=>val.name == `${scope}/${name}`);
            if(!project.length){
                throw new Error(`package "${name}" not found`);
            }

            if(!project[0].instance[method]){
                throw new Error(`method "${method}" not found on instance of "${name}"`);
            }
            
            // console.log("method",method,"args",args,project[0].instance[method]);
            // console.log("output",await project[0].instance[method](args));
            return res.send(await project[0].instance[method](args));
        }catch(err){
            next(err);
        }
    });

    return router;
}
export default RestRouter;