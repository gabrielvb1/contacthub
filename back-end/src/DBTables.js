import { db } from "./connection/connection.js";

export const createClientTable = async () => {
    try {
      const exists = await db.schema.hasTable('clients');

      if (!exists) {
        await db.schema.createTable('clients', table => {
          table.increments('id').primary();
          table.text('name').notNullable();
          table.text('email').notNullable().unique();
          table.text('phone').notNullable();
          table.timestamp('created_at').defaultTo(db.fn.now());
        });
        console.log('Tabela "clients" criada com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
    }
};

export const createContactTable = async () => {
  try {
    const exists = await db.schema.hasTable('contacts');

    if (!exists) {
      await db.schema.createTable('contacts', table => {
        table.increments('id').primary();
        table.integer('client_id').unsigned().notNullable();
        table.text('name').notNullable();
        table.text('email').notNullable().unique();
        table.text('phone').notNullable();

        table.foreign('client_id').references('id').inTable('clients').onDelete('CASCADE');
      });
      console.log('Tabela "contacts" criada com sucesso.');
    }
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
  }
};

export const createUserTable = async () => {
  try {
    const exists = await db.schema.hasTable('users');

    if (!exists) {
      await db.schema.createTable('users', table => {
        table.increments('id').primary();
        table.text('name').notNullable();
        table.text('email').notNullable().unique();
        table.text('password').notNullable();
      });
      console.log('Tabela "users" criada com sucesso.');
    }
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
  }
};
