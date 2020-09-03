<template>
  <div>
    <v-container v-if="user.posts != ''">
      <v-card
        flat
        class="mt-5"
        max-width="500"
        loader-height="2"
        :loading="loading"
        v-for="(post, indexPost) of user.posts"
        :key="indexPost"
      >
        <v-img
          class="align-end grey lighten-2"
          width="100%"
          :src="post.images"
          :lazy-src="post.images"
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
                >{{ user.username }}</v-btn
              >
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-content>
            <span class="px-auto text-right text--disabled">
              {{ post.timestamp | formatTimestamp }}
            </span>
          </v-list-item-content>
        </v-list-item>

        <v-card-title class="pb-0">{{ post.description }}</v-card-title>

        <v-card-actions>
          <v-btn
            icon
            @click="updateLike(post._id, indexPost)"
            :color="isLike(post.reactions)"
          >
            <v-icon>fas fa-heart</v-icon>
          </v-btn>
          <span class="px-auto text-right text--disabled"
            >{{ post.reactions.length }} Likes</span
          >
          <v-spacer />
          <v-btn icon color="info" @click="showImage(post, indexPost)">
            <v-icon>far fa-eye</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
    <modal-show-post
      :enableModalPost="enableModalPost"
      :post="dataImage"
      @changeActive="enableModalPost = $event"
      @updateLike="updateLikeEventModal"
    />
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import axios from "axios";
import modalShowPost from "@/components/modalShowPost";
export default {
  name: "post",
  components: {
    modalShowPost
  },
  props: {
    user: Object,
    loading: Boolean,
    indexUser: Number,
    item: Object
  },
  data() {
    return {
      enableModalPost: false,
      dataImage: {},
      indexPost: 0
    };
  },
  computed: {
    ...mapState(["idUser", "token"])
  },
  methods: {
    isLike(reactions) {
      const find = reactions.findIndex(element => {
        return element == this.idUser;
      });
      return find < 0 ? "blue" : "red";
    },
    async updateLike(idPost, indexPost) {
      const updateLike = await axios.post(
        "/functs/likePost",
        { idPost: idPost },
        { headers: { Authorization: this.token } }
      );

      if (updateLike.data.success) {
        this.$emit("updateLike", {
          islike: updateLike.data.isLike,
          user: this.indexUser,
          post: indexPost
        });
      }
    },
    showImage(item, indexPost) {
      this.enableModalPost = true;
      this.dataImage = item;
      this.indexPost = indexPost;
    },
    updateLikeEventModal(event) {
      this.$emit("updateLike", {
        islike: event,
        user: this.indexUser,
        post: this.indexPost
      });
    }
  },
  filters: {
    formatTimestamp(timestamp) {
      return moment(timestamp)
        .startOf("minutes")
        .fromNow();
    }
  }
};
</script>
