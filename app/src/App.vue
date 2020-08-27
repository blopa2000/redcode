<template>
  <v-app class="dd">
    <navbar/>
    <v-container>
      <v-main>
        <router-view/>
      </v-main>
    </v-container>
  </v-app>
</template>

<script>
import navbar from "@/components/navbar"
import jwt_decode from "jwt-decode"
import {mapMutations} from "vuex"
export default {
  components:{
    navbar
  },
  async created(){
    const session = await localStorage.getItem("session")
    if(session){
      const value = await jwt_decode(session);
      this.setDataUser(value.id)
      this.setToken(session)
    }
  },
  watch: {
    '$route' (to, from) {
      from
      this.setActiveNavbar(to.name)
    }
  },
  methods: {
    ...mapMutations(["setDataUser","setToken","setActiveNavbar"]),
  },
}
</script>

<style >
.dd{
  background-color: rgb(243, 243, 243)!important;
}
/* p,strong{
  color: azure;
} */
</style>
