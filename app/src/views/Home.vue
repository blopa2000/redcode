<template>
  <div>
    <v-row>
      <v-col col="4"></v-col>
      <v-col col="4">
        <div v-if="posts.length > 0">
          <posts
            v-for="(item, index) of posts"
            :key="index"
            :user="item"
            :loading="loading"
            :indexUser="index"
            @updateLike="updateLike"
          />
        </div>
        <message :message="messages" />
      </v-col>
      <v-col col="4"></v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import posts from "@/components/posts";
import message from "@/components/message";
import axios from "axios";
export default {
  name: "Home",
  components: {
    posts,
    message
  },
  data() {
    return {
      posts: [],
      loading: false,
      messages: {}
    };
  },
  created() {
    if (!this.idUser) {
      this.$router.push("/login");
    } else {
      this.getPostsOfFollows();
    }
  },
  computed: {
    ...mapState(["idUser", "token"])
  },
  methods: {
    async getPostsOfFollows() {
      this.loading = true;
      const response = await axios.post(
        "/functs/postsOfFollow",
        {},
        { headers: { Authorization: this.token } }
      );
      if (response.data.success) {
        this.posts = response.data.posts;
        if (this.posts.length <= 0) {
          this.messages = {
            text: "Not following anyone yet, search to see their posts",
            color: "indigo"
          };
        } else {
          this.messages = {
            text: "Is already up to date",
            color: "info"
          };
        }
      }
      this.loading = false;
    },
    updateLike(values) {
      if (values.islike) {
        this.posts[values.user].posts[values.post].reactions.push(this.idUser);
      } else {
        const id = this.posts[values.user].posts[
          values.post
        ].reactions.findIndex(id => id == this.idUser);
        this.posts[values.user].posts[values.post].reactions.splice(id, 1);
      }
    }
  }
};
</script>
