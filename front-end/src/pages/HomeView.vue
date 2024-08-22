<template>
    <div class="d-flex flex-column justify-center align-center" style="height: 100%; gap: 100px;">
        <h2>Bem vindo a ContactHub</h2>
        <div class="d-flex">
            <div class="d-flex flex-column mr-10">
                <v-btn
                icon
                size="x-large"
                class="ml-1"
                to="/clients"
                >
                    <v-icon>mdi-account</v-icon>
                </v-btn>
                <h3>Clientes</h3>
            </div>
            <div class="d-flex flex-column">
                <v-btn
                icon
                size="x-large"
                class="ml-2"
                to="/contacts"
                >
                    <v-icon>mdi-account-group-outline</v-icon>
                </v-btn>
                <h3>Contatos</h3>
            </div>
        </div>
    </div>
</template>
<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter()
    
    function goToPage(page) {
        router.push(`/${page}`)
    }

    return {
      goToPage
    };
  }
};
</script>