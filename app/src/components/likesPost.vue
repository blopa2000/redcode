<template>
  <v-card elevation="0">
    <v-row v-if="people != ''">
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
                <img :src="item.avatar" alt="avatar" />
              </v-avatar>
            </v-btn>
          </template>
          <span>{{ item.username }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <div v-if="people == ''" class="text-center">
      <message :message="message" class="mr-5" />
    </div>
  </v-card>
</template>

<script>
import axios from "axios";
import message from "@/components/message";
export default {
  name: "likesPost",
  components: {
    message
  },
  props: {
    reactions: Array
  },
  data() {
    return {
      people: [],
      message: {
        text: "this post has no likes",
        color: "info"
      }
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
      this.$router.push(`/profile/${id}`);
      this.$emit("changeShowModal", false);
    }
  }
};
</script>
