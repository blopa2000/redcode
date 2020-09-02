<template>
  <v-app class="background">
    <navbar />
    <v-container>
      <v-main>
        <router-view />
      </v-main>
      <loading />
    </v-container>
  </v-app>
</template>

<script>
import navbar from "@/components/navbar";
import jwt_decode from "jwt-decode";
import { mapMutations } from "vuex";
import loading from "@/components/loading";
export default {
  components: {
    navbar,
    loading
  },
  async created() {
    const session = await localStorage.getItem("session");
    if (session) {
      const value = await jwt_decode(session);
      this.setDataUser(value.id);
      this.setToken(session);
    }
  },
  watch: {
    $route(to, from) {
      from;
      this.setActiveNavbar(to.name);
    }
  },
  methods: {
    ...mapMutations(["setDataUser", "setToken", "setActiveNavbar"])
  }
};
</script>

<style>
.background {
  background-color: rgb(243, 243, 243) !important;
}
</style>
