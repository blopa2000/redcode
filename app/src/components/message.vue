<template>
  <div v-if="validate">
    <v-alert border="left" :color="message.color" text>
      {{ message.text }}
    </v-alert>
  </div>
</template>

<script>
export default {
  name: "message",
  props: {
    message: {
      text: "",
      color: ""
    }
  },
  computed: {
    validate() {
      return this.message.text;
    }
  }
};
</script>
