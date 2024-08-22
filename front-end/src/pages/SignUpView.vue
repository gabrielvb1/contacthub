<template>
    <v-container fluid fill-height class="sign-up-container">
          <v-card class="sign-up-card" width="400">
            <v-card-title class="headline">Criar Conta</v-card-title>
            <v-card-subtitle>Preencha os dados abaixo para criar sua conta</v-card-subtitle>
            <v-card-text>
              <v-form @submit.prevent="handleSave" v-model="valid">
                <v-text-field
                  label="Nome Completo"
                  :rules="[!!form.name || 'Nome é obrigatório',
                  /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(form.name) || 'Insira um nome válido']"
                  v-model="form.name"
                  required
                  prepend-icon="mdi-account"
                ></v-text-field>
                <v-text-field
                  label="Email"
                  :rules="[!!form.email || 'E-mail é obrigatório']"
                  type="email"
                  v-model="form.email"
                  required
                  prepend-icon="mdi-email"
                ></v-text-field>
                <v-text-field
                  label="Senha"
                  type="password"
                  :rules="[!!form.password || 'Senha é obrigatório']"
                  v-model="form.password"
                  required
                  prepend-icon="mdi-lock"
                ></v-text-field>
                <v-btn :disabled="!valid" type="submit" color="primary" block class="mt-4">Criar Conta</v-btn>
              </v-form>
            </v-card-text>
            <div class="d-flex justify-center mr-2">
              <span style="color: red;" v-if="errorMessage" type="error">{{ errorMessage }}</span>
            </div>
          </v-card>
    </v-container>
  </template>
  
  <script>
  import { reactive, toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  import { api } from '@/services/api.js'
  
  export default {
    setup() {
      const router = useRouter()
  
      const state = reactive({
        form: {
          name: '',
          email: '',
          password: ''
        },
        valid: false,
        errorMessage: ''
      })
  

      async function handleSave() {
          try {

            await api.post('/signup', { name: state.form.name, email: state.form.email, password: state.form.password })
            router.push('/login')
          } catch (error) {
            if (error.response && error.response.status === 401) {
              state.errorMessage = error.response.data.error
            }
            console.error('Erro ao criar conta:', error)
          }
      }
  
      return {
        ...toRefs(state),
        handleSave
      }
    }
  }
  </script>
  
  <style scoped>
  .sign-up-container {
    background-color: rgb(196, 117, 196);
    background-size: cover;
    background-position: center;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .sign-up-card {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  </style>