import {Router} from 'express';

const BrowserRouter = function({browserManager}){
    const router = Router();

    router.get('/:id', async (req, res, next) => {
        try{
            return res.send(await browserManager.get(req.params.id,["url"]));
        }catch(err){
            next(err);
        }
    });

    return router;
}
export default BrowserRouter;