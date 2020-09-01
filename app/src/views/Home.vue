<template>
  <div>
    <v-row>
      <v-col col="4"></v-col>
      <v-col col="4">
        <publication
          v-for="(item, index) of publications"
          :key="index"
          :user="item"
          :loading="loading"
          :indexUser="index"
          @updateLike="updateLike"
        />
      </v-col>
      <v-col col="4"></v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import publication from "@/components/publication";
import axios from "axios";
export default {
  name: "Home",
  components: {
    publication
  },
  data() {
    return {
      publications: [],
      loading: false
    };
  },
  created() {
    if (!this.dataUser) {
      this.$router.push("/login");
    } else {
      this.getPublicationsOfFollows();
    }
  },
  computed: {
    ...mapState(["dataUser", "token"])
  },
  methods: {
    async getPublicationsOfFollows() {
      this.loading = true;
      const response = await axios.post(
        "/functs/publicationsOfFollow",
        {},
        { headers: { Authorization: this.token } }
      );
      this.publications = response.data;
      this.loading = false;
    },
    updateLike(values) {
      if (values.islike) {
        this.publications[values.user].publications[
          values.publication
        ].reactions.push(this.dataUser);
      } else {
        const id = this.publications[values.user].publications[
          values.publication
        ].reactions.findIndex(id => id == this.dataUser);
        this.publications[values.user].publications[
          values.publication
        ].reactions.splice(id, 1);
      }
    }
  }
};
</script>
