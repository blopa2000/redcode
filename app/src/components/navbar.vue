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

      <v-menu offset-y bottom>
        <template v-slot:activator="{ on, attrs }">
          <input
            placeholder="serch"
            v-model="search"
            @keyup="searchUsers"
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <v-list v-if="users != ''">
          <v-list-item
            v-for="(user, index) of users"
            :key="index"
            :to="'/profile/' + user._id"
          >
            <v-list-item-title>
              <v-avatar size="30">
                <v-img :src="user.avatar">
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-avatar>
              {{ user.username }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
import axios from "axios";
export default {
  name: "navbar",
  data() {
    return {
      search: "",
      users: []
    };
  },
  computed: {
    ...mapState(["idUser", "activeNavbar"])
  },
  methods: {
    ...mapMutations(["setIdUser"]),
    exit() {
      localStorage.removeItem("session");
      this.setIdUser("");
      this.$router.push("/login");
    },
    async searchUsers() {
      const response = await axios.post("/functs/searchUser", {
        searchUsers: this.search
      });
      this.users = response.data;
    }
  }
};
</script>

<style></style>
