import {Router} from 'express';

const RestRouter = function({automata}){
    const router = Router();

    router.post('/:id', async (req, res, next) => {
        try{
            const pluginId = req.params.id;
            const {method, args} = req.body;

            const project = automata.filter((val)=>val.id == pluginId);
            if(!project.length){
                throw new Error(`package "${pluginId}" not found`);
            }

            if(!project[0].instance[method]){
                throw new Error(`method "${method}" not found on instance of "${pluginId}"`);
            }
            
            return res.send(await project[0].instance[method](args));
        }catch(err){
            next(err);
        }
    });

    return router;
}
export default RestRouter;