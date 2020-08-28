<template>
  <div class="login" v-if="!dataUser">
    <v-container>
      <v-row justify="center">
        <v-col col="12" md="6" lg="5" class="col-hidden">
          <v-card
            elevation="0"
            class="text-center py-9 "
            style="background-color: rgb(243, 243, 243)"
          >
            <img class="svg_chat_style" :src="svgChat" alt="" />
          </v-card>
        </v-col>
        <v-col col="12" md="6" lg="5">
          <v-card outlined class="text-center ">
            <v-container>
              <div class="mb-5 text-center">
                <h1>redcode</h1>
              </div>
              <v-form
                ref="formInside"
                v-model="valid"
                :lazy-validation="lazy"
                @submit.prevent="save"
              >
                <v-text-field
                  filled
                  shaped
                  v-model="username"
                  :rules="nameRules"
                  label="User Name"
                  required
                ></v-text-field>
                <v-text-field
                  filled
                  shaped
                  type="password"
                  v-model.lazy="password"
                  :rules="passwordRules"
                  label="Password"
                  required
                ></v-text-field>
                <div class="text-end mb-5">
                  <v-btn type="submit" small :disabled="!valid" color="primary"
                    >login</v-btn
                  >
                </div>
                <v-alert dense outlined type="error" v-if="!success">
                  {{ dataMessage }}
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
import axios from "axios";
import jwt_decode from "jwt-decode";
import { mapMutations, mapState } from "vuex";
import chat from "@/assets/chat.svg";

export default {
  data() {
    return {
      valid: true,
      lazy: false,
      success: true,
      dataMessage: "",
      username: "blopaDev",
      password: "1234322",
      nameRules: [
        v => !!v || "Name is required",
        v => v.length >= 4 || "Name is invalid",
      ],
      passwordRules: [
        v => !!v || "password is required",
        v => v.length >= 4 || "password is invalid",
      ],
      svgChat: chat,
    };
  },
  async created() {
    const session = localStorage.getItem("session");
    if (session) {
      const value = await jwt_decode(session);
      this.setDataUser(value.id);
      this.$router.push("/");
    }
  },
  computed: {
    ...mapState(["dataUser"]),
  },
  methods: {
    ...mapMutations(["setDataUser", "setToken"]),
    async save() {
      if (this.$refs.formInside.validate()) {
        const db = await axios.post("/functs/inside", {
          username: this.username,
          password: this.password,
        });
        if (db.data.success) {
          const value = await jwt_decode(db.data.token);
          localStorage.setItem("session", db.data.token);
          this.setDataUser(value.id);
          this.setToken(db.data.token);
          this.success = db.data.success;
          this.$router.push("/");
        } else {
          console.error(db.data.message);
          this.success = db.data.success;
          this.dataMessage = db.data.message;
          setTimeout(() => {
            this.success = true;
            this.dataMessage = "";
          }, 2000);
        }
      }
    },
  },
};
</script>

<style scoped>
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.svg_chat_style {
  max-width: 20em;
}
@media (max-width: 700px) {
  .col-hidden {
    display: none;
  }
}
</style>
