import express from 'express';
import clients from '../controller/clients.js';
import contacts from '../controller/contacts.js';
import loginUsers from '../controller/userLogin.js'
import { tokenMiddleware } from '../middlewares/tokenMiddleware.js';

export const router = express();
router.post('/signup', loginUsers.signUpUser)
router.post('/login', loginUsers.loginUser)
router.use(tokenMiddleware)
router.get('/listclients', clients.getClients)
router.post('/createclient', clients.createClients)
router.put('/updateclient', clients.updateClient)
router.post('/deleteclient', clients.deleteClient)

router.get('/listallcontacts', contacts.getContacts)
router.post('/contactsofclient', contacts.listContactsOfClient)
router.post('/createcontact', contacts.createContacts)
router.put('/updatecontact', contacts.updateContacts)
router.post('/deletecontact', contacts.deleteContacts)

export default router