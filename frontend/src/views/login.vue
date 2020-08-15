<template>
  <div class="login" v-if="!dataUser" >
    <v-container >
      <v-row>
        <v-col md="6">
          <v-card outlined >
            aca ira una imagen del sistema
          </v-card>
        </v-col>
        <v-col md="6">
          <v-card outlined >
            <v-container>
              <div class="mb-5 text-center">
                <h1>redcode</h1>
              </div>
              <v-form ref="formInside" v-model="valid" :lazy-validation="lazy" @submit.prevent="save" >
                <v-text-field filled shaped v-model="username" :rules="nameRules" label="User Name" required ></v-text-field>
                <v-text-field filled shaped type="password" v-model.lazy="password" :rules="passwordRules" label="Password" required ></v-text-field>
                <div class="text-end mb-5">
                  <v-btn type="submit" small :disabled="!valid" color="primary">login</v-btn>
                </div>
                <v-alert dense outlined type="error" v-if="!success" >
                  {{dataMessage}}
                </v-alert>
              </v-form>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios"
import jwt_decode from "jwt-decode"
import {mapMutations, mapState} from "vuex"
export default {
  data() {
    return {
      valid:true,
      lazy: false,
      success:true,
      dataMessage:"",
      username:"blopaDev",
      password:"1234322",
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length >= 4 || 'Name is invalid',
      ],
      passwordRules: [
        v => !!v || 'Name is required',
        v => v.length >= 4 || 'password is invalid',
      ],
    }
  },
  async created() {
    const session = localStorage.getItem('session');
    if (session) {
      const value = await jwt_decode(session);
      this.setDataUser(value.data)
      this.$router.push("/");
    }
  },
  computed: {
    ...mapState(["dataUser"])
  },
  methods: {
    ...mapMutations(["setDataUser","setToken"]),
    async save(){
      if(this.$refs.formInside.validate()){
        const db = await axios.post("/functs/inside",{"username":this.username,"password":this.password});
        if(db.data.success){
          const value = await jwt_decode(db.data.token);
          localStorage.setItem('session',db.data.token)
          this.setDataUser(value.data);
          this.setToken(db.data.token)
          this.success = db.data.success;
          this.$router.push("/");
        }else{
          this.success = db.data.success;
          this.dataMessage = db.data.message;
          setTimeout(()=>{
            this.success = true;
            this.dataMessage = "";
          },2000)
        }
      }
    }
  },
}
</script>
<style  scoped>
.login{
  height: 100vh;
  display: flex;
  align-items: center;
}
</style>