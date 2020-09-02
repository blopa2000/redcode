<template>
  <div class="loading" v-if="loading">
    <pulse-loader :loading="loading" color="#fff"></pulse-loader>
  </div>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader";
import { mapState } from "vuex";
export default {
  name: "loading",
  components: {
    PulseLoader
  },
  computed: {
    ...mapState(["loading"])
  }
};
</script>

<style>
.loading {
  position: absolute;
  z-index: 10000;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.308);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
