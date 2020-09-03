<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="9" sm="8" md="10" class="pl-5">
        <v-text-field
          v-model="comment"
          :counter="45"
          label="comment"
          @keyup.enter="addComment"
        ></v-text-field>
      </v-col>
      <v-col cols="3" sm="4" md="2">
        <v-btn elevation="3" fab color="primary" @click="addComment">
          <v-icon>far fa-comment</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <div v-if="comments != ''" class="scroll-comments">
      <v-card elevation="0" v-for="(item, id) of comments" :key="id">
        <v-list-item>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="white"
                class="px-0"
                @click="anotherProfile(item.dataComment.author)"
                dark
                text
                v-bind="attrs"
                v-on="on"
              >
                <v-list-item-avatar color="grey">
                  <img :src="item.avatar" alt="avatar" />
                </v-list-item-avatar>
              </v-btn>
            </template>
            <span>{{ item.username }}</span>
          </v-tooltip>

          <v-list-item-content>
            <v-list-item-title class="headline">{{
              item.dataComment.comment
            }}</v-list-item-title>
            <v-list-item-subtitle>{{
              item.dataComment.timestamp | formatTimestamp
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
    <div v-if="comments == ''" class="text-center">
      <message :message="message" class="mr-5" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import moment from "moment";
import message from "@/components/message";
export default {
  name: "comments",
  components: {
    message
  },
  props: {
    postId: String
  },
  data() {
    return {
      comments: [],
      comment: "",
      message: {
        text: "no comment, add one",
        color: "info"
      }
    };
  },
  async mounted() {
    this.getComments();
  },
  watch: {
    postId() {
      this.getComments();
    }
  },
  computed: {
    ...mapState(["token"])
  },
  methods: {
    async addComment() {
      if (this.comment.length <= 45) {
        const newComment = await axios.post(
          "/functs/comment",
          { commentData: this.comment, postId: this.postId },
          { headers: { Authorization: this.token } }
        );
        if (newComment.data.success) {
          this.getComments();
          this.comment = "";
        }
      }
    },
    async getComments() {
      const response = await axios.post(
        "/functs/getComments",
        { postId: this.postId },
        { headers: { Authorization: this.token } }
      );
      if (response.data.success) {
        this.comments = response.data.comments;
      }
    },
    anotherProfile(id) {
      this.$router.push("/profile/" + id);
      this.$emit("changeShowModal", false);
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
.scroll-comments {
  overflow: auto;
  height: 13em;
}
</style>
