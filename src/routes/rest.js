import {Router} from 'express';

const RestRouter = function({runtime}){
    const router = Router();

    router.post('/:name', async (req, res, next) => {
        try{
            const name = req.params.name;
            const {method, args} = req.body;

            const project = runtime.filter((val)=>val.name == name);
            if(!project.length){
                throw new Error(`package "${name}" not found`);
            }

            if(!project[0].instance[method]){
                throw new Error(`method "${method}" not found on instance of "${name}"`);
            }
            
            return res.send(await project[0].instance[method](args));
        }catch(err){
            next(err);
        }
    });

    return router;
}
export default RestRouter;