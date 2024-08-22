import jwt from 'jsonwebtoken';
import { API_PASS } from '../apipass.js';

export const tokenMiddleware = (async(req,res,next)=>{
    const { authorization } = req.headers;
    
    if(!authorization){
        return res.status(500).send({error: 'Verification Token not informed'});
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, API_PASS);
        req.id = id;
        next()
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
});