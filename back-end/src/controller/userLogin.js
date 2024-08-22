import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../connection/connection.js';
import { API_PASS } from '../apipass.js';

class UserLoginController {
    async signUpUser(req, res) {
        try {
            const { name, email, password } = req.body;
            
            const cryptedPassword = await bcrypt.hash(password, 10)
            
            const checkEmail = await db('users').where('email', email).first()
            
            if (checkEmail) {
                return res.status(401).send({error: 'E-mail já existe!'})
            }
            const registerUser = await db('users').insert({ name, email, password: cryptedPassword }).returning('*');
            return res.status(200).send(registerUser)
        } catch (error) {
            return res.status(400).send({error})
        }
    }
    
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            
            const selectQuery = await db('users').where('email', email);

            if (!selectQuery.length) {
                return res.status(404).send({error: 'E-mail ou senha inválidos'})
            }
            
            const validPassword = await bcrypt.compare(password, selectQuery[0].password);

            if (!validPassword) {
                return res.status(404).send({error: 'E-mail ou senha inválidos'});
            }

            const token = jwt.sign({ id: selectQuery[0].id }, API_PASS, { expiresIn: '8h' });
            
            const { password: _, ...loggedUser } = selectQuery[0];

            return res.status(200).send({ loggedUser, token });
        } catch (error) {
            return res.status(404).send(error.message)
        }
    }
}

export default new UserLoginController()