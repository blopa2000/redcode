<template>
  <div>
    <v-dialog
      v-model="show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <v-toolbar flat dark color="accent">
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer />

          <v-toolbar-items>
            <v-btn dark icon v-if="billboard != null" @click="back()">
              <v-icon>fas fa-undo-alt</v-icon>
            </v-btn>
            <v-btn icon dark @click="show = false">
              <v-icon>fas fa-times-circle</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text color="info">
          <AccessList v-if="billboard == null" @action="billboard = $event" />
          <configuration-profile
            v-if="billboard == 'configurationProfile'"
            @updateProfile="updateProfile"
          />

          <change-password v-if="billboard == 'changePassword'" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AccessList from "./AccessList";
import configurationProfile from "./configurationProfile";
import changePassword from "./changePassword";
export default {
  components: {
    AccessList,
    configurationProfile,
    changePassword
  },
  props: {
    activeModalConfig: Boolean
  },
  data() {
    return {
      billboard: null
    };
  },
  computed: {
    show: {
      get() {
        return this.activeModalConfig;
      },
      set(value) {
        this.$emit("closeConfig", value);
      }
    }
  },
  methods: {
    back() {
      switch (this.billboard) {
        case "configurationProfile":
          this.billboard = null;
          break;
        case "changePassword":
          this.billboard = null;
          break;
      }
    },
    updateProfile(event) {
      this.$emit("updateProfile", event);
    }
  }
};
</script>
