<template>
  <v-card elevation="0">
    <v-row>
      <v-col cols="2" v-for="(item, index) of people" :key="index">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="white"
              class="px-0"
              @click="anotherProfile(item._id)"
              dark
              text
              v-bind="attrs"
              v-on="on"
            >
              <v-avatar>
                <img :src="item.avatar" alt />
              </v-avatar>
            </v-btn>
          </template>
          <span>{{ item.username }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  name: "likesPublication",
  props: {
    reactions: Array
  },
  data() {
    return {
      people: []
    };
  },
  mounted() {
    this.reactionsData();
  },
  watch: {
    reactions() {
      this.reactionsData();
    }
  },
  methods: {
    async reactionsData() {
      this.people = [];
      for (const item of this.reactions) {
        const data = await axios.post(`/functs/getProfile/${item}`);
        this.people.push(data.data.profile);
      }
    },
    anotherProfile(id) {
      this.$router.push("/profile/" + id);
      this.$emit("changeShowModal", false);
    }
  }
};
</script>
