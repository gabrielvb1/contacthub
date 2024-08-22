import { db } from "../connection/connection.js";

class ClientsController {
    async getClients(req, res) {
       try {

        const clients = await db('clients').select('*');

         return res.status(200).send({rows: clients})
       } catch (error) {
        return res.status(500).send({error})
       }
    }

    async createClients(req, res) {
      try {
       const { name, email, phone } = req.body

      const existingClient = await db('clients').where({ email }).first();

      if (existingClient) {
        return res.status(409).send({ error: 'O e-mail já está em uso' });
      }

       await db('clients').insert({
           name,
           email,
           phone
         });

        return res.status(200).send({ok: 'Inserido com sucesso'})
      } catch (error) {
       return res.status(500).send({error})
      }
    }

    async updateClient(req, res) {
      try {
        const { id, name, email, phone } = req.body;
    
        const existingClient = await db('clients').where({ id }).first();
    
        if (!existingClient) {
          return res.status(404).send({ error: 'Cliente não encontrado' });
        }
    
        if (email && email !== existingClient.email) {
          const emailInUse = await db('clients').where({ email }).first();
          if (emailInUse) {
            return res.status(409).send({ error: 'O e-mail já está em uso por outro cliente' });
          }
        }
    
        await db('clients')
          .where({ id })
          .update({
            name: name || existingClient.name,
            email: email || existingClient.email,
            phone: phone || existingClient.phone
          });
    
        return res.status(200).send({ ok: 'Cliente atualizado com sucesso' });
      } catch (error) {        
        return res.status(500).send({ error: 'Erro ao atualizar o cliente' });
      }
    }

    async deleteClient(req, res) {
      try {
        const { id } = req.body
    
        const existingClient = await db('clients').where({ id }).first();
    
        if (!existingClient) {
          return res.status(404).send({ error: 'Cliente não encontrado' });
        }
    
        await db('clients').where({ id }).del();
        await db('contacts').where({client_id: id}).del()
    
        return res.status(200).send({ ok: 'Cliente deletado com sucesso' });
      } catch (error) {
        return res.status(500).send({ error: 'Erro ao deletar o cliente' });
      }
    }    
}

export default new ClientsController()