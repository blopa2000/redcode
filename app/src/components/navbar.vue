<template>
  <div>
    <v-app-bar v-if="activeNavbar != 'login'|| dataUser != ''" fixed app dense :elevation="1.0" >
      <h1>redcode</h1>
      <v-spacer />
      <input placeholder="sherch">
      <v-spacer />

      <v-btn class="ma-2" text icon color="red lighten-2" to="/home" >
        <v-icon>fas fa-door-open</v-icon>
      </v-btn>
      <v-btn class="ma-2" text icon color="red lighten-2" :to="'/profile/'+dataUser" >
        <v-icon>fas fa-user-circle</v-icon>
      </v-btn>
        
    </v-app-bar>
  </div>
</template>

<script>
import {mapState} from "vuex"
export default {
  name: 'navbar',
  computed: {
    ...mapState(["dataUser","activeNavbar"])
  },
}
</script>


