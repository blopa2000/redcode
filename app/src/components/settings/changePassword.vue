<template>
  <v-container>
    <h1>Change password</h1>

    <v-form v-model="valid" ref="form">
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            type="password"
            v-model="CurrentPassword"
            label="Current password"
            :rules="passwordRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4">
          <v-text-field
            type="password"
            v-model="password"
            label="Password"
            :rules="passwordRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4">
          <v-text-field
            type="password"
            v-model="RepeatPassword"
            label="Repeat password"
            :rules="RepeatPasswordRules"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn color="accent" :disabled="!valid" @click="save"
            >save Changes</v-btn
          >
        </v-col>
      </v-row>
    </v-form>

    <div class="d-flex justify-center">
      <message :message="message" />
    </div>
  </v-container>
</template>

<script>
import message from "@/components/message";
import axios from "axios";
import { mapState, mapMutations } from "vuex";
export default {
  name: "changePassword",
  components: {
    message
  },
  data() {
    return {
      valid: false,
      message: {},
      CurrentPassword: "",
      password: "",
      RepeatPassword: "",
      passwordRules: [
        v => !!v || "Password is requerid",
        v => v.length >= 5 || "password must be at least 5 characters"
      ],
      RepeatPasswordRules: [
        v => !!v || "Password is requerid",
        v => v == this.password || "passwords don't match"
      ]
    };
  },
  computed: {
    ...mapState(["token"])
  },
  methods: {
    ...mapMutations(["setLoading"]),
    async save() {
      if (this.$refs.form.validate()) {
        this.setLoading(true);
        const response = await axios.post(
          "/functs/changePassword",
          { CurrentPassword: this.CurrentPassword, newPassword: this.password },
          { headers: { Authorization: this.token } }
        );
        this.setLoading(false);
        if (response.data.success) {
          this.message = {
            text: response.data.message,
            color: "success"
          };
          this.$refs.form.reset();
        } else {
          this.message = {
            text: response.data.message,
            color: "error"
          };
        }
      } else {
        this.message = {
          text: "It's not valid",
          color: "error"
        };
      }

      setTimeout(() => {
        this.message = {};
      }, 3000);
    }
  }
};
</script>
