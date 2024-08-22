<template>
    <v-container fluid fill-height class="login-container pt-10">
      <v-row no-gutters>
        <!-- Seção Publicitária -->
        <v-col cols="12" md="6" class="d-flex align-center justify-center promotional-section">
          <div class="promotional-text">
            <h1>Bem-vindo ao ContactHub!</h1>
            <p>Gerencie seus clientes e contatos de forma eficiente e organizada. Nosso sistema oferece uma plataforma intuitiva para cadastrar, visualizar e editar informações importantes de clientes e contatos.</p>
          </div>
        </v-col>
  
        <!-- Formulário de Login -->
        <v-col cols="12" md="6" class="d-flex align-center justify-center login-form">
          <v-card class="login-card" width="400" height="430">
            <v-card-title class="headline">Login</v-card-title>
            <v-card-subtitle>Entre na sua conta</v-card-subtitle>
            <v-card-text>
              <v-form @submit.prevent="login" v-model="valid">
                <v-text-field
                  label="Email"
                  type="email"
                  :rules="[!!form.email || 'E-mail é obrigatório']"
                  v-model="form.email"
                  required
                  prepend-icon="mdi-email"
                ></v-text-field>
                <v-text-field
                  label="Senha"
                  type="password"
                  v-model="form.password"
                  :rules="[!!form.password || 'Senha é obrigatório']"
                  required
                  prepend-icon="mdi-lock"
                ></v-text-field>
                <div class="text-center mt-4 mb-3">
                <span style="cursor: pointer;" @click="redirectToSignUp">Não possui conta? Crie uma clicando aqui</span>
              </div>
                <v-btn :disabled="!valid" type="submit" color="primary" block>Entrar</v-btn>
              </v-form>
            </v-card-text>
            <div class="d-flex justify-center mr-2">
              <span style="color: red;" v-if="errorMessage" type="error">{{ errorMessage }}</span>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { reactive, toRefs } from 'vue';
  import { useRouter } from 'vue-router';
  import { api } from '@/services/api';
  
  export default {
    setup() {
      const router = useRouter();
  
      const state = reactive({
        form: {
          email: '',
          password: ''
        },
        valid: false,
        errorMessage: ''
      });
  
      async function login() {
        try {
          const { data } = await api.post('/login', { email: state.form.email, password: state.form.password });
          localStorage.setItem('authToken', data.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          router.push('/');
        } catch (error) {     
          if (error.response && error.response.status === 404) {
          state.errorMessage = error.response.data.error
        } else {
          state.errorMessage = 'Erro ao fazer login. Tente novamente.';
        }
        }
      };
  
      const redirectToSignUp = () => {
        router.push('/signup');
      };
  
      return {
        ...toRefs(state),
        login,
        redirectToSignUp
      };
    }
  };
  </script>  
  
  <style scoped>
  .login-container {
    background-color: #c475c4;
    background-size: cover;
    background-position: center;
    height: 100vh;
  }
  
  .promotional-section {
    background-color: rgba(0, 0, 0, 0.5); /* Adiciona um overlay escuro para melhor legibilidade */
    color: white;
    padding: 20px;
  }
  
  .promotional-text {
    text-align: center;
  }
  
  .login-form {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-card {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  </style>
  