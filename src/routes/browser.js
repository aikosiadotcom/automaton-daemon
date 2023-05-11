import {Router} from 'express';

const BrowserRouter = function({browserManager}){
    const router = Router();

    router.get('/:name', async (req, res, next) => {
        try{
            const instance = await browserManager.get(req.params.name);
            if(instance === undefined){
                throw new Error(`this bot have a runtime exceptions`)
            }

            return res.send(instance.url);
        }catch(err){
            next(err);
        }
    });

    return router;
}
export default BrowserRouter;