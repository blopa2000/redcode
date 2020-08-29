<template>
  <div>
    <v-row justify="center">
      <v-col cols="11">
        <v-text-field
          v-model="comment"
          :counter="45"
          label="comment"
          @keyup.enter="addComment"
        ></v-text-field>
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
                <v-list-item-avatar color="grey"
                  ><img :src="item.avatar" alt="avatar"
                /></v-list-item-avatar>
              </v-btn>
            </template>
            <span>{{ item.username }}</span>
          </v-tooltip>

          <v-list-item-content>
            <v-list-item-title class="headline">{{
              item.dataComment.comment
            }}</v-list-item-title>
            <v-list-item-subtitle>{{
              item.dataComment.timestamp
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
    <div v-if="comments == ''" class="text-center">
      no comment
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "comments",
  props: {
    publicationId: String,
  },
  data() {
    return {
      comments: [],
      comment: "",
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  async mounted() {
    this.getComments();
  },
  watch: {
    publicationId() {
      this.getComments();
    },
  },
  methods: {
    async addComment() {
      if (this.comment.length <= 45) {
        const newComment = await axios.post(
          "/functs/comment",
          { commentData: this.comment, publicationId: this.publicationId },
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
        { publicationId: this.publicationId },
        { headers: { Authorization: this.token } }
      );
      if (response.data.success) {
        let comments = response.data.comments;
        for (let i in comments) {
          comments[i].dataComment.timestamp = moment(
            comments[i].dataComment.timestamp
          )
            .startOf("minute")
            .fromNow();
        }
        this.comments = comments;
      }
    },
    anotherProfile(id) {
      this.$router.push("/profile/" + id);
      this.$emit("changeShowModal", false);
    },
  },
};
</script>

<style scope>
.scroll-comments {
  overflow: auto;
  height: 13em;
}
</style>
