<template>
  <v-form @submit.prevent="handleSave" v-model="valid" class="d-flex flex-column align-center" style="width: 100%;">
    <v-text-field
      v-model="form.name"
      label="Nome Completo"
      class="mb-4"
      style="width: calc(100% - 48px);"
      :rules="[!!form.name || 'Nome é obrigatório',
       /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(form.name) || 'Insira um nome válido']"
      variant="outlined"
    ></v-text-field>

    <v-text-field
      v-model="form.email"
      label="E-mail"
      class="mb-4"
      style="width: calc(100% - 48px);"
      :rules="[!!form.email || 'E-mail é obrigatório']"
      variant="outlined"
    ></v-text-field>

    <v-text-field
      v-model="form.phone"
      label="Telefone"
      class="mb-4"
      style="width: calc(100% - 48px);"
      :rules="[!!form.phone || 'Telefone é obrigatório', /^\d*$/.test(form.phone) || 'O telefone deve conter apenas números']"
      variant="outlined"
    ></v-text-field>

    <!-- Botão de salvar -->
    <v-btn :disabled="!valid" type="submit" color="primary" class="mt-4">
      Salvar
    </v-btn>
  </v-form>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
export default {
  emits: ['save'],
  props: {
    client: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      valid: false,
      form: {
        name: '',
        email: '',
        phone: ''
      }
    })

    watch(
    () => props.client, 
    (newClient) => {
      state.form.name = newClient.name || '';
      state.form.email = newClient.email || '';
      state.form.phone = newClient.phone || '';
    }, 
    { immediate: true });

    function resetForm() {
      state.form.name = '';
      state.form.email = '';
      state.form.phone = '';
    };

    async function handleSave() {
      try {
        emit('save', { ...state.form, id: props.client.id }); 
        resetForm()
      } catch (error) {
        
      }
    }

    return {
      ...toRefs(state),
      handleSave
    }
  }
}
</script>
