<template>
  <div>
    <v-app-bar
      v-if="activeNavbar != 'login' && idUser != ''"
      fixed
      app
      dense
      :elevation="1.0"
    >
      <h1>redcode</h1>
      <v-spacer />
      <input placeholder="sherch" />
      <v-spacer />

      <v-btn class="m-2" text icon color="red lighten-2" to="/">
        <v-icon>fas fa-door-open</v-icon>
      </v-btn>

      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="m-2"
            text
            icon
            color="red lighten-2"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>fas fa-user-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="'/profile/' + idUser">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="exit()">
            <v-list-item-title>exit</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "navbar",
  computed: {
    ...mapState(["idUser", "activeNavbar"])
  },
  methods: {
    ...mapMutations(["setIdUser"]),
    exit() {
      localStorage.removeItem("session");
      this.setIdUser("");
      this.$router.push("/login");
    }
  }
};
</script>
