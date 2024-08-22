import { db } from "../connection/connection.js";

class ContactsController {
    async getContacts(req, res) {
       try {
        const contacts = await db('contacts').innerJoin('clients', 'contacts.client_id', 'clients.id').select('contacts.*', 'clients.name as client_name')

         return res.status(200).send({rows: contacts})
       } catch (error) {
        return res.status(500).send({error})
       }
    }

    async createContacts(req, res) {
        try {
            const { client_id, name, email, phone } = req.body

            const existingClient = await db('clients').where({ id: client_id }).first();

            if (!existingClient) {
                return res.status(409).send({ error: 'Cliente inexistente' });
            }

            const existingContactEmail = await db('contacts').where({ email }).first();

            if (existingContactEmail) {
                return res.status(409).send({ error: 'O e-mail já está em uso' });
            }

            await db('contacts').insert({
                client_id,
                name,
                email,
                phone
            });
            return res.status(200).send({ok: 'Inserido com sucesso'})
        } catch (error) {
            return res.status(500).send({error})
        }
    }

    async updateContacts(req, res) {
      try {
        const { id, name, email, phone, client_id } = req.body;
    
        const existingContact = await db('contacts').where({ id }).first();
        
        if (!existingContact) {
          return res.status(404).send({ error: 'Contato não encontrado' });
        }
    
        if (email && email !== existingContact.email) {
          const emailInUse = await db('contacts').where({ email }).first();
          if (emailInUse) {
            return res.status(409).send({ error: 'O e-mail já está em uso por outro cliente' });
          }
        }
    
        await db('contacts')
          .where({ id })
          .update({
            name: name || existingContact.name,
            email: email || existingContact.email,
            phone: phone || existingContact.phone,
            client_id: client_id || existingContact.client_id
          });
    
        return res.status(200).send({ ok: 'Contato atualizado com sucesso' });
      } catch (error) {    
        console.log(error);
            
        return res.status(500).send({ error: 'Erro ao atualizar o contato' });
      }
    }

    async deleteContacts(req, res) {
      try {
        const { id } = req.body
    
        const existingContact = await db('contacts').where({ id }).first();
    
        if (!existingContact) {
          return res.status(404).send({ error: 'Contato não encontrado' });
        }
    
        await db('contacts').where({ id }).del();
    
        return res.status(200).send({ ok: 'Contato deletado com sucesso' });
      } catch (error) {
        return res.status(500).send({ error: 'Erro ao deletar o contato' });
      }
    }

    async listContactsOfClient(req, res) {
        try {
          const { client_id } = req.body

          const existingClient = await db('clients').select('*').where({ id: client_id })

          if (!existingClient.length) {
            return res.status(404).send({ error: 'Cliente não encontrado' });
          }
          const contacts = await db('contacts').select('*').where({client_id})
          return res.status(200).send({ contacts });
        } catch (error) {
            return res.status(500).send({ error });
        }
      }
}

export default new ContactsController()