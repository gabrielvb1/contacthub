<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        app
      >
        <v-list-item title="ContactHub" class="text-h6"></v-list-item>
        <v-divider></v-divider>

        <v-list dense nav>
          <RouterLink to="/" style="text-decoration: none; color: black;">
            <v-list-item prepend-icon="mdi-home-city" title="Home"></v-list-item>
          </RouterLink>
          <RouterLink to="/clients" style="text-decoration: none; color: black;">
            <v-list-item prepend-icon="mdi-account" title="Clientes"></v-list-item>
          </RouterLink>
          <RouterLink to="/contacts" style="text-decoration: none; color: black;">
            <v-list-item prepend-icon="mdi-account-group-outline" title="Contatos"></v-list-item>
          </RouterLink>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app>
        <v-toolbar-title>ContactHub</v-toolbar-title>
      </v-app-bar>

      <v-main>
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  setup() {
    const state = reactive({
      drawer: true,
      rail: false,
    })

    return {
      ...toRefs(state),
    }
  }
}
</script>

<style scoped>
/* Garantir que o drawer e o conteúdo sejam ajustados corretamente */
.v-application {
  min-height: 100vh;
}

.v-main {
  padding: 16px;
}
</style>
