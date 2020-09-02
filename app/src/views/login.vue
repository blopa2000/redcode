<template>
  <div class="login" v-if="!idUser">
    <v-container>
      <v-row justify="center">
        <v-col col="12" md="6" lg="5" class="col-hidden">
          <v-card
            elevation="0"
            class="text-center py-9"
            style="background-color: rgb(243, 243, 243)"
          >
            <img class="svg_chat_style" :src="svgChat" alt />
          </v-card>
        </v-col>
        <v-col col="12" md="6" lg="5">
          <v-card outlined class="text-center">
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
                <!-- REGISTER -->
                <div v-if="enableRegister">
                  <v-text-field
                    filled
                    shaped
                    type="text"
                    v-model.lazy="firstName"
                    :rules="firstNameRules"
                    label="First name"
                    required
                  ></v-text-field>
                  <v-text-field
                    filled
                    shaped
                    type="text"
                    v-model.lazy="lastName"
                    :rules="lastNameRules"
                    label="Last name"
                    required
                  ></v-text-field>
                  <v-text-field
                    filled
                    shaped
                    type="email"
                    v-model.lazy="email"
                    :rules="emailRules"
                    label="Email"
                    required
                  ></v-text-field>
                </div>
                <!-- /REGISTER -->
                <div class="mb-5 d-flex justify-space-between">
                  <a
                    v-if="!enableRegister"
                    @click="enableRegister = !enableRegister"
                    >register</a
                  >
                  <a
                    v-if="enableRegister"
                    @click="enableRegister = !enableRegister"
                    >login</a
                  >
                  <v-btn
                    v-if="!enableRegister"
                    type="submit"
                    small
                    :disabled="!valid"
                    color="primary"
                    >login</v-btn
                  >
                  <v-btn
                    v-if="enableRegister"
                    type="submit"
                    small
                    :disabled="!valid"
                    color="primary"
                    >Register</v-btn
                  >
                </div>

                <div v-if="!success">
                  <div v-if="!enableRegister">
                    <v-alert dense outlined :type="typeMessage">{{
                      dataMessage
                    }}</v-alert>
                  </div>

                  <div v-if="enableRegister">
                    <v-alert
                      dense
                      outlined
                      :type="typeMessage"
                      v-for="(item, index) of dataMessage"
                      :key="index"
                      >{{ item.message }}</v-alert
                    >
                  </div>
                </div>
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
      enableRegister: false,
      dataMessage: "",
      typeMessage: "error",
      username: "blopaDev",
      password: "1234322",
      firstName: "",
      lastName: "",
      email: "",
      nameRules: [
        v => !!v || "Name is required",
        v => v.length >= 4 || "Name is invalid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => v.length >= 4 || "password is invalid"
      ],
      firstNameRules: [
        v => !!v || "First name is required",
        v => v.length >= 4 || "First name is invalid"
      ],
      lastNameRules: [
        v => !!v || "Last name is required",
        v => v.length >= 4 || "Last name is invalid"
      ],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      svgChat: chat
    };
  },
  async created() {
    const session = localStorage.getItem("session");
    if (session) {
      const value = await jwt_decode(session);
      this.setIdUser(value.id);
      this.$router.push("/");
    }
  },
  computed: {
    ...mapState(["idUser"])
  },
  methods: {
    ...mapMutations(["setIdUser", "setToken"]),
    async save() {
      if (this.enableRegister) {
        if (this.$refs.formInside.validate()) {
          try {
            const response = await axios.post("/functs/register", {
              username: this.username,
              password: this.password,
              firstName: this.firstName,
              lastName: this.lastName,
              email: this.email
            });

            if (response.data.success) {
              this.enableRegister = !this.enableRegister;
              this.typeMessage = "success";
              this.success = !response.data.success;
              this.dataMessage = response.data.message;
              setTimeout(() => {
                this.success = true;
                this.dataMessage = "";
              }, 5000);
            } else {
              this.typeMessage = "error";
              this.success = response.data.success;
              this.dataMessage = response.data.error.errors;
              setTimeout(() => {
                this.success = true;
                this.dataMessage = "";
              }, 5000);
            }
          } catch (error) {
            console.error("there was an error registering");
          }
        }
      } else {
        if (this.$refs.formInside.validate()) {
          const db = await axios.post("/functs/inside", {
            username: this.username,
            password: this.password
          });
          if (db.data.success) {
            const value = await jwt_decode(db.data.token);
            localStorage.setItem("session", db.data.token);
            this.setIdUser(value.id);
            this.setToken(db.data.token);
            this.success = db.data.success;
            this.$router.push("/");
          } else {
            this.typeMessage = "error";
            this.success = db.data.success;
            this.dataMessage = db.data.message;
            setTimeout(() => {
              this.success = true;
              this.dataMessage = "";
            }, 2000);
          }
        }
      }
    }
  }
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
