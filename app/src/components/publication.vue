<template>
  <v-container>
    <v-card
      flat
      class="mt-5"
      max-width="500"
      loader-height="2"
      :loading="loading"
      v-for="(publication, indexPublication) of user.publications"
      :key="indexPublication"
    >
      <v-img
        class="align-end grey lighten-2"
        width="100%"
        :src="publication.images"
        :lazy-src="publication.images"
        aspect-ratio="1"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>

      <v-list-item>
        <v-list-item-avatar color="grey darken-3">
          <v-img class="elevation-6" :src="user.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            <v-btn
              class="pl-0"
              text
              color="red lighten-2"
              :to="'/profile/' + user._id"
            >
              {{ user.username }}
            </v-btn>
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <span class="px-auto text-right text--disabled">{{
            publication.timestamp | formatTimestamp
          }}</span>
        </v-list-item-content>
      </v-list-item>

      <v-card-title class="pb-0">{{ publication.description }}</v-card-title>

      <v-card-actions>
        <v-btn
          icon
          @click="updateLike(publication._id, indexUser, indexPublication)"
          :color="isLike(publication.reactions)"
        >
          <v-icon>fas fa-heart</v-icon>
        </v-btn>
        <v-btn text class="btn-person" @click="changeView('likes')">
          <span
            v-if="publication.reactions"
            class="px-auto text-right text--disabled"
            >{{ publication.reactions.length }} Like</span
          >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import moment from "moment";
import { mapState } from "vuex";
import axios from "axios";
export default {
  name: "publication",

  props: {
    user: Object,
    loading: Boolean,
    indexUser: Number,
    item: Object,
  },
  data() {
    return {
      changeViewActive: "comments",
    };
  },
  methods: {
    isLike(reactions) {
      const find = reactions.findIndex((element) => {
        return element == this.dataUser;
      });
      return find < 0 ? "blue" : "red";
    },
    async updateLike(idPublication, indexUser, IndexPublication) {
      const updateLike = await axios.post(
        "/functs/likePublication",
        { idPublication: idPublication },
        { headers: { Authorization: this.token } }
      );

      if (updateLike.data.success) {
        this.$emit("updateLike", {
          islike: updateLike.data.isLike,
          user: indexUser,
          publication: IndexPublication,
        });
      }
    },
  },
  computed: {
    ...mapState(["dataUser", "token"]),
  },
  filters: {
    formatTimestamp(timestamp) {
      return moment(timestamp)
        .startOf("minutes")
        .fromNow();
    },
  },
};
</script>
