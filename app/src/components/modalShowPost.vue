<template>
  <v-dialog v-model="show" max-width="1050">
    <v-card class="d-flex" height="100%" style="overflow: hidden;">
      <v-row>
        <v-col cols="12" sm="6" class="py-0">
          <v-img
            height="490"
            width="500"
            position="center center"
            :src="post.images"
            :lazy-src="post.image"
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
        </v-col>
        <v-col cols="12" sm="6">
          <v-card elevation="0">
            <v-card-text>
              <p class="headline">{{ post.description }}</p>
              <span class="px-auto text-right text--disabled">
                {{ post.timestamp | formatTimestamp }}
              </span>
            </v-card-text>
            <v-card-actions>
              <div class="d-flex">
                <v-btn
                  icon
                  @click="updateLike(post._id)"
                  :color="isLike(post.reactions)"
                >
                  <v-icon>fas fa-heart</v-icon>
                </v-btn>
                <v-btn text class="btn-person" @click="changeView('likes')">
                  <span
                    v-if="post.reactions"
                    class="px-auto text-right text--disabled"
                    >{{ post.reactions.length }} Like</span
                  >
                </v-btn>
                <v-btn text class="btn-person" @click="changeView('comments')">
                  <span class="px-auto text-right text--disabled"
                    >Comments</span
                  >
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
          <likes-post
            v-show="changeViewActive == 'likes'"
            :reactions="post.reactions"
            @changeShowModal="show = $event"
          />
          <comments
            v-show="changeViewActive == 'comments'"
            :postId="post._id"
            @changeShowModal="show = $event"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import likesPost from "@/components/likesPost";
import comments from "@/components/comments";
import { mapState } from "vuex";
import axios from "axios";
import moment from "moment";
export default {
  name: "modalShowpost",
  components: {
    likesPost,
    comments
  },
  props: {
    enableModalPost: Boolean,
    post: Object
  },
  data() {
    return {
      changeViewActive: "comments"
    };
  },
  computed: {
    ...mapState(["idUser", "token"]),
    show: {
      get() {
        return this.enableModalPost;
      },
      set(value) {
        this.changeViewActive = "comments";
        this.$emit("changeActive", value);
      }
    }
  },
  methods: {
    async updateLike(id) {
      try {
        const updateLike = await axios.post(
          "/functs/likePost",
          { idPost: id },
          { headers: { Authorization: this.token } }
        );
        if (updateLike.data.success) {
          if (updateLike.data.isLike) {
            //agregar
            this.$emit("updateLike", true);
          } else {
            //eliminar
            this.$emit("updateLike", false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    isLike(reactions) {
      if (reactions === undefined) return "blue";
      const find = reactions.findIndex(element => {
        return element == this.idUser;
      });
      return find < 0 ? "blue" : "red";
    },
    changeView(view) {
      this.changeViewActive = view;
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

<style scope>
.btn-person {
  padding: 3px !important;
  text-transform: none !important;
}
</style>
