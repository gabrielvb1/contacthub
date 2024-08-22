import express from 'express';
import cors from 'cors';
import { createClientTable, createContactTable, createUserTable } from './DBTables.js';
import { router } from './router/routes.js';
import { openDb } from './configDB.js';

const app = express();
const port = 3033

app.use(cors());
app.use(express.json());


openDb().then(async (db) => {
  try {

    await createClientTable();
    await createContactTable();
    await createUserTable();


    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
  }
}).catch(error => {
  console.error('Erro ao abrir o banco de dados:', error);
});


app.use(router);

export default app;
