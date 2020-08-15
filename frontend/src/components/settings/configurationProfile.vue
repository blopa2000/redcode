<template>
  <v-container>
    <div class="d-flex align-center flex-column">
      <div>
        <v-avatar size="90">
          <v-img :src="avatar">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center" >
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-avatar>
      </div>
      <div>
        <v-btn text color="light-blue lighten-4" class="buttonFile" >
          Update avatar
          <v-file-input class="FileAvatar" v-model="auxFileAvatar"  name="avatar" ref="avatar" @change="fileAvatar"></v-file-input>
        </v-btn>
      </div>
    </div>
    <v-form v-model="valid" ref="form">
      <v-container>
        <v-row>
          <v-col cols="12" sm="4" >
            <v-text-field v-model="form.username" :rules="userNameRules" label="User name" required ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" >
            <v-text-field v-model="form.firstName" :rules="nameRules" label="First name" required ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" >
            <v-text-field v-model="form.lastName" :rules="nameRules" label="Last name" required ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" >
            <v-text-field v-model="form.email" :rules="emailRules" label="Email" required ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" >
            <v-dialog ref="dialog" v-model="modalDatePicker" :return-value.sync="form.dateBirth" persistent width="290px" >
              <template v-slot:activator="{ on }">
                <v-text-field v-model="form.dateBirth" label="Picker in dialog" prepend-icon="far fa-calendar-times" readonly v-on="on" ></v-text-field>
              </template>
              <v-date-picker v-model="form.dateBirth" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalDatePicker = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(form.dateBirth)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" sm="4" >
            <v-select v-model="form.sex" :items="optionSex" :rules="[v => !!v || 'Item is required']" label="Sex" required ></v-select>
          </v-col>
          <v-col cols="12" >
            <v-textarea v-model="form.description" solo name="input-7-4" label="Description" ></v-textarea>
          </v-col>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn :disabled="!valid" color="accent" elevation="0" @click="submitForm">Save information</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
import axios from "axios"
import jwt_decode from "jwt-decode"
import {mapState, mapMutations} from "vuex"
export default {
  data() {
    return {
      valid: false,
      modalDatePicker:false,
      optionSex:[
        {
          value:"M",
          text:"masculino"
        },
        {
          value:"F",
          text:"Femenino"
        }
      ],
      form:{
        firstName:"",
        lastName:"",
        username:"",
        email:"",
        dateBirth:"",
        description:"",
        sex:"",
        //mirar uso de localidad para mirar si justifica ser usada en web
      },
      avatar:"",
      auxFileAvatar:{},//cuando se trabaja con el file-input la variable tiene que ser de tipo Object ya que lo que recibe es propiedades de un objeto de lo contrario sale error props value
      userNameRules:[
        v => !!v || 'user name is required',
        v => v.length >= 6 || 'user name must be less than 6 characters',
      ],
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length >= 4 || 'Name must be less than 4 characters',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
    }
  },
  mounted() {
    const values = {...this.dataUser}
    const date = values.dateBirth.split("T");
    this.form = {
      firstName: values.firstName,
      lastName : values.lastName,
      username : values.username,
      email : values.email,
      dateBirth : date[0],
      description : values.description,
      sex : values.sex,
    }
    this.avatar = values.avatar
  },
  computed: {
    ...mapState(["dataUser","token"])
  },
  methods: {
    ...mapMutations(["setDataUser"]),
    async submitForm(){
      if(this.$refs.form.validate()){
        const responst = await axios.post("/functs/updateUserInfo",this.form,{headers:{"Authorization":this.token}});
        this.responstData(responst)
      }
    },
    async fileAvatar(){
      let data = new FormData();
      data.append("avatar",this.auxFileAvatar);
      const responst = await axios.post("/functs/saveAvatar",data,{headers:{"Authorization":this.token}});
      this.responstData(responst)
    },
    async responstData(responst){
      if(responst.data.success){
        const value = await jwt_decode(responst.data.token)
        localStorage.setItem("session",responst.data.token)
        this.setDataUser(value.data)
        this.avatar = this.dataUser.avatar
      }else{
        console.log(responst.data.message);
        console.log(responst.data.error);
      }
    }
  },
  destroyed() {
    console.log("me ejecute desde configurationprofile.vue");
    this.form = {}
  },
}
</script>

<style scoped>
.buttonFile{
  position: relative;
}

.FileAvatar{
  position: absolute;
  left: 0;
  right: 0;
  opacity: 0;
}
</style>
