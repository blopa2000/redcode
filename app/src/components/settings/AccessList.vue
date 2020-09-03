<template>
  <div>
    <v-list three-line subheader>
      <v-subheader>User Settings</v-subheader>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>user info</v-list-item-title>
          <v-list-item-subtitle
            class="d-flex align-center"
            @click="actions('configurationProfile')"
          >
            <v-btn icon color="accent" class="mr-5">
              <v-icon>far fa-user</v-icon> </v-btn
            >Edit profile
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider />

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>user info</v-list-item-title>
          <v-list-item-subtitle
            class="d-flex align-center"
            @click="actions('changePassword')"
          >
            <v-btn icon color="accent" class="mr-5">
              <v-icon>fas fa-unlock</v-icon> </v-btn
            >Change password
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
    </v-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      modelActions: null
    };
  },
  methods: {
    actions(action) {
      this.modelActions = action;
      this.$emit("action", action);
    }
  }
};
</script>
