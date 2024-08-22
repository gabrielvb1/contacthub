<template>
  <v-dialog
    width="600"
    v-model="dialogAddEditClient"
  >
    <v-card height="500" class="pa-4 d-flex flex-column justify-space-between">
      <div class="d-flex align-center justify-space-between mb-4">
        <h2>{{ isEditClient ? 'Editar Cliente' : 'Adicionar Cliente' }}</h2>
        <v-icon size="28px" @click="dialogAddEditClient = false">mdi-close</v-icon>
      </div>

      <div class="d-flex justify-center align-center flex-grow-1">
        <ClientForm 
          @save="handleSaveClient"
          :client="selectedClient"
        />
      </div>
    </v-card>
  </v-dialog>

  <v-dialog
    width="600"
    v-model="dialogClientDetail"
  >
    <v-card>
      <v-card-title>
        <span v-if="contactsOfClient.length > 0" class="text-h6">Contatos de {{ selectedClient.name }}</span>
        <span v-else> {{ selectedClient.name }} ainda não possui contatos cadastrados</span>
      </v-card-title>

      <v-card-text>
        <v-list>
          <v-list-item v-for="(contact, index) in contactsOfClient" :key="contact.id">
            <v-list-item-title class="font-weight-bold">Nome:</v-list-item-title>
            <v-list-item-subtitle>{{ contact.name }}</v-list-item-subtitle>

            <v-list-item-title class="font-weight-bold mt-2">E-mail:</v-list-item-title>
            <v-list-item-subtitle>{{ contact.email }}</v-list-item-subtitle>

            <v-list-item-title class="font-weight-bold mt-2">Telefone:</v-list-item-title>
            <v-list-item-subtitle>{{ contact.phone }}</v-list-item-subtitle>

            <v-divider v-if="index < contactsOfClient.length - 1" class="my-3"></v-divider>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialogClientDetail = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="dialogDeleteClient"
    max-width="500"
  >
    <v-card prepend-icon="mdi-alert" title="Excluir Cliente">
      <v-card-text>
        <h4>Deseja Excluir Esse Cliente?</h4>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Não" variant="plain" color="gray" @click="dialogDeleteClient = false"></v-btn>

        <v-btn color="red" text="Sim" variant="plain" @click="handleDeleteClient"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div style="height: 100%;">
    <v-row class="d-flex flex-column">
      <v-col align="center">
        <v-btn @click="handleOpenAddClient" class="my-8">Adicionar Cliente</v-btn>
      </v-col>
      <v-col align="center">
        <v-data-table 
          :items="tableClients.items" 
          :headers="tableClients.headers" 
          expand-on-click
          fixed-header
          height="500"
          style="width: 90%;"
          items-per-page-text="Linhas por página"
          no-data-text="Nenhum dado disponível"
        >
          <template v-slot:item.created_at="{ item }">
            {{ formatDate(item.created_at) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" @click="openClientDetail(item)" icon elevation="0">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>Visualizar Contatos do Cliente</span>
            </v-tooltip>

            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn @click="handleOpenEditForm(item)" v-bind="props" icon elevation="0">
                  <v-icon color="primary">mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Editar Info Cliente</span>
            </v-tooltip>

            <v-tooltip location="top">
              <template v-slot:activator="{ props}">
                <v-btn @click="handleOpenDeleteDialog(item)" v-bind="props" icon elevation="0">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Excluir Cliente</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>  
    </v-row>
  </div>

  <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout">
    {{ snackbar.message }}
    <template v-slot:action="{ attrs }">
      <v-btn color="red" text v-bind="attrs" @click="snackbar.show = false">
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import ClientForm from '../components/ClientForm.vue';
import { api } from '@/services/api.js';

export default {
  components: { 
    ClientForm
  },
  setup() {
    const state = reactive({
      dialogAddEditClient: false,
      dialogClientDetail: false,
      dialogDeleteClient: false,
      isEditClient: false,
      tableClients: {
        headers: [
          { title: 'Nome', value: 'name' },
          { title: 'E-mail', value: 'email' },
          { title: 'Telefone', value: 'phone' },
          { title: 'Criado Em', value: 'created_at' },
          { title: '', value: 'actions', width: 200 }
        ],
        items: []
      },
      selectedClient: {},
      contactsOfClient: [],
      snackbar: {
        show: false,
        message: '',
        timeout: 2000
      }
    });

    async function openClientDetail(client) {
      try {
        state.selectedClient = client;
        state.dialogClientDetail = true;
        const { data } = await api.post('/contactsofclient', { client_id: client.id });
        state.contactsOfClient = data.contacts;
      } catch (error) {
        state.snackbar.message = 'Erro ao carregar contatos do cliente';
        state.snackbar.show = true;
      }
    }

    function handleOpenAddClient() {
      if (Object.keys(state.selectedClient).length) {
        state.selectedClient = {};
        state.isEditClient = false;
      }
      state.dialogAddEditClient = true;
    }

    function handleOpenEditForm(client) {
      state.isEditClient = true;
      state.dialogAddEditClient = true;
      state.selectedClient = { ...client };
    }

    function handleOpenDeleteDialog(client) {
      state.dialogDeleteClient = true;
      state.selectedClient = { ...client };
    }

    async function handleSaveClient(client) {
      try {
        if (state.isEditClient) {
          await api.put('/updateclient', client);
          state.snackbar.message = 'Cliente editado com sucesso!';
        } else {
          await api.post('/createclient', client);
          state.snackbar.message = 'Cliente salvo com sucesso!';
        }
        const { data } = await api.get('/listclients');
        state.tableClients.items = data.rows;
        state.dialogAddEditClient = false;
        state.snackbar.show = true;
      } catch (error) {
        state.snackbar.message = 'Erro ao salvar cliente';
        state.snackbar.show = true;
        state.dialogAddEditClient = false;
      }
    }

    async function handleDeleteClient() {
      try {
        await api.post('/deleteclient', { id: state.selectedClient.id });
        const { data } = await api.get('/listclients');
        state.tableClients.items = data.rows;
        state.dialogDeleteClient = false;
        state.snackbar.message = 'Cliente excluído com sucesso!';
        state.snackbar.show = true;
      } catch (error) {
        state.snackbar.message = 'Erro ao excluir cliente';
        state.snackbar.show = true;
        state.dialogDeleteClient = false;
      }
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }

    onMounted(async () => {
      try {
        const { data } = await api.get('/listclients');
        state.tableClients.items = data.rows;
      } catch (error) {
        state.snackbar.message = 'Erro ao carregar clientes';
        state.snackbar.show = true;
      }
    });

    return {
      ...toRefs(state),
      handleOpenAddClient,
      handleSaveClient,
      handleDeleteClient,
      handleOpenEditForm,
      handleOpenDeleteDialog,
      openClientDetail,
      formatDate
    };
  }
};
</script>