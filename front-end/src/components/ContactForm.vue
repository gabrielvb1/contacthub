<template>
  <v-form @submit.prevent="handleSave" class="d-flex flex-column align-center" style="width: 100%;">
    <v-text-field variant="outlined" style="width: calc(100% - 48px);" v-model="form.name" label="Nome Completo" required></v-text-field>
    <v-text-field variant="outlined"  style="width: calc(100% - 48px);" v-model="form.email" label="E-mail" required></v-text-field>
    <v-text-field variant="outlined"  style="width: calc(100% - 48px);" v-model="form.phone" label="Telefone" required></v-text-field>
    <v-select
    variant="outlined" 
    style="width: calc(100% - 48px);"
    v-model="form.client_id"
    :items="allClients"
    item-title="title"
    item-value="value"
    label="Cliente"
    ></v-select>

    <v-btn type="submit" color="primary">Salvar Contato</v-btn>
  </v-form>
</template>

<script>
import { api } from '@/services/api'
import { reactive, toRefs, onMounted, watch } from 'vue'

export default {
  emits: ['save'],
  props: {
    contact: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      form: {
        name: '',
        email: '',
        phone: '',
        client_id: null
      },
      allClients: []
    })

    watch(
    () => props.contact, 
    (newContact) => {
      state.form.name = newContact.name || '';
      state.form.email = newContact.email || '';
      state.form.phone = newContact.phone || '';
      state.form.client_id = newContact.client_id || '';
    }, 
    { immediate: true });

    function resetForm() {
      state.form.name = '';
      state.form.email = '';
      state.form.phone = '';
      state.form.client_id = null;
    };

    async function handleSave() {
      try {
        emit('save', { ...state.form, id: props.contact.id }); 
        resetForm()
      } catch (error) {
        
      }
    }

    async function fetchAllClients() {
      try {
        const { data } = await api.get('/listclients');
        state.allClients = data.rows.map((el) => {
          return {title: el.name, value: el.id}
        });
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    }

    onMounted(async () => {
      await fetchAllClients();
    });

    return { 
      ...toRefs(state),
      handleSave
      
    }
  }
}
</script>
