<template>
  <v-dialog
    width="600"
    v-model="dialogAddEditContact"
  >
    <v-card height="500" class="pa-4 d-flex flex-column justify-space-between">
      <div class="d-flex align-center justify-space-between mb-4">
        <h2>{{ isEditContact ? 'Editar Contato' : 'Adicionar Contato' }}</h2>
        <v-icon size="28px" @click="dialogAddEditContact = false">mdi-close</v-icon>
      </div>

      <div class="d-flex justify-center align-center flex-grow-1">
        <ContactForm 
          @save="handleSaveContact"
          :contact="selectedContact"
        />
      </div>
    </v-card>
  </v-dialog>

  <v-dialog
      v-model="dialogDeleteContact"
      max-width="500"
    >
    <v-card
      prepend-icon="mdi-alert"
      title="Excluir Contato"
      >
        <v-card-text>
          <h4>Deseja Excluir Esse Contato?</h4>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Não"
            variant="plain"
            color="gray"
            @click="dialogDeleteContact = false"
          ></v-btn>

          <v-btn
            color="red"
            text="Sim"
            variant="plain"
            @click="handleDeleteContact"
          ></v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>

  <div style="height: 100%;">
    <v-row class="d-flex flex-column">
      <v-col align="center">
        <v-btn @click="handleOpenAddContact" class="my-8">Adicionar Contato</v-btn>
      </v-col>
      <v-col align="center">
        <v-data-table 
          :items="tableContacts.items" 
          :headers="tableContacts.headers" 
          expand-on-click
          fixed-header
          height="500"
          style="width: 90%;"
          items-per-page-text="Linhas por página"
          no-data-text="Nenhum dado disponível"
        >
          <template v-slot:item.actions="{ item }">  
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn @click="handleOpenEditForm(item)" v-bind="props" icon elevation="0">
                  <v-icon color="primary">mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Editar Info Contato</span>
            </v-tooltip>
    
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn @click="handleOpenDeleteDialog(item)" v-bind="props" icon elevation="0">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Excluir Contato</span>
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
import ContactForm from '../components/ContactForm.vue';
import { api } from '@/services/api.js';

export default {
  components: { 
    ContactForm
  },
  setup() {
    const state = reactive({
      dialogAddEditContact: false,
      dialogDeleteContact: false,
      tableContacts: {
        headers: [
          { title: 'Nome', value: 'name' },
          { title: 'E-mail', value: 'email' },
          { title: 'Telefone', value: 'phone' },
          { title: 'Contato De', value: 'client_name' },
          { title: '', value: 'actions', width: 200 }
        ],
        items: []
      },
      selectedContact: {},
      snackbar: {
        show: false,
        message: '',
        timeout: 2000
      },
      isEditContact: false
    });

    function handleOpenAddContact() {
      if (Object.keys(state.selectedContact).length) {
        state.selectedContact= {}
        state.isEditContact = false
      }
      state.dialogAddEditContact = true
    }
    
    function handleOpenEditForm(contact) {
      state.isEditContact = true;
      state.dialogAddEditContact = true;
      state.selectedContact = { ...contact };
      console.log(state.selectedContact);
      
    }

    async function handleSaveContact(contact) {
      try {
        console.log(contact);
        if (state.isEditContact) {
          await api.put('/updatecontact', contact)
        } else {
          await api.post('/createcontact', contact);
        }
        const { data } = await api.get('/listallcontacts');
        state.tableContacts.items = data.rows;
        state.snackbar.message = state.isEditContact ? 'Contato editado com sucesso!' : 'Contato salvo com sucesso';
        state.snackbar.show = true;
        state.dialogAddEditContact = false;
      } catch (error) {
        state.dialogAddEditContact = false;
        state.snackbar.message = 'Erro ao salvar contato';
        state.snackbar.show = true;
      }
    }

    function handleOpenDeleteDialog(contact) {
      state.dialogDeleteContact = true
      state.selectedContact = {...contact}
    }

    async function handleDeleteContact() {
      try {
        await api.post('/deletecontact', {id: state.selectedContact.id})
        state.dialogDeleteContact = false
        const { data } = await api.get('/listallcontacts')
        state.tableContacts.items = data.rows
        state.snackbar.message = 'Contato excluido com sucesso!';
        state.snackbar.show = true;
      } catch (error) {
        state.dialogDeleteContact = false
        state.snackbar.message = 'Erro ao excluir contato';
        state.snackbar.show = true;
      }
    }

    onMounted(async () => {
      try {
        const { data } = await api.get('/listallcontacts');
        state.tableContacts.items = data.rows;
      } catch (error) {
        state.snackbar.message = 'Erro ao carregar contatos';
        state.snackbar.show = true;
      }
    });

    return {
      ...toRefs(state),
      handleOpenEditForm,
      handleSaveContact,
      handleOpenAddContact,
      handleOpenDeleteDialog,
      handleDeleteContact
    };
  }
};
</script>
