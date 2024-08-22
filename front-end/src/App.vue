<template>
  <v-app>
    <template v-if="isAuthenticated">
      <v-dialog v-model="dialogLogOut" max-width="500">
          <v-card title="Sair">
            <v-card-text>
             Deseja sair?
            </v-card-text>
      
            <v-card-actions>
              <v-spacer></v-spacer>
      
              <v-btn
                text="Não"
                color="grey"
                @click="dialogLogOut = false"
              ></v-btn>

              <v-btn
                text="Sim"
                color="red"
                @click="logOut"
              ></v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>
      <v-layout>
        <!-- Navegação fixa e barra de título -->
        <v-navigation-drawer
          v-model="drawer"
          :rail="rail"
          permanent
          app
        >
          <v-list-item
            title="Bem-vindo"
            nav
          >
            <template v-slot:append>
              <v-btn @click="dialogLogOut = true" v-if="!rail" size="small" icon variant="text" elevation="0">
                <v-icon>mdi-logout</v-icon>
              </v-btn>
              <v-btn
                :icon="rail ? 'mdi-menu' : 'mdi-chevron-left'"
                variant="text"
                :class="rail ? 'pr-2 mr-1': ''"
                @click.stop="rail = !rail"
              ></v-btn>
            </template>
          </v-list-item>
          

          <v-divider></v-divider>

            <v-list dense nav>
              <!-- Home -->
              <v-list-item
                to="/"
                prepend-icon="mdi-home-city"
                title="Home"
                
                :class="checkPage === '/' ? 'navBarHover': ''"
              ></v-list-item>


              <v-list-item
                to="/clients"
                prepend-icon="mdi-account"
                title="Clientes"
                :class="checkPage === '/clients' ? 'navBarHover': ''"
              ></v-list-item>


              <v-list-item
                to="/contacts"
                prepend-icon="mdi-account-group-outline"
                title="Contatos"
                :class="checkPage === '/contacts' ? 'navBarHover': ''"
              ></v-list-item>
            </v-list>

          </v-navigation-drawer>

        <!-- Barra de navegação superior -->
        <v-app-bar app color="#c475c4">
          <v-toolbar-title>ContactHub</v-toolbar-title>
        </v-app-bar>

        <!-- Conteúdo dinâmico da página -->
        <v-main>
          <router-view />
        </v-main>
      </v-layout>
    </template>

    <!-- Tela de login quando não autenticado -->
    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from 'vue';
import { api } from './services/api.js';
import { useAuth } from './stores/auth.js'; // Importa o estado de autenticação
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const { isAuthenticated } = useAuth();
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      drawer: true,
      rail: false,
      dialogLogOut: false
    });

    function logOut() {
      localStorage.removeItem('authToken')
      router.push('/login')
      state.dialogLogOut = false
    }

    const checkPage = computed(() => {
            return route.path
        })
    
    onMounted(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        isAuthenticated.value = true;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        isAuthenticated.value = false;
      }
    });

    return {
      ...toRefs(state),
      isAuthenticated,
      logOut,
      checkPage
    };
  }
};
</script>

<style scoped>
/* Garantir que o layout preencha a altura da tela */
.v-application {
  min-height: 100vh;
}

</style>
