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
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
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
            >{{ user.username }}</v-btn>
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <span class="px-auto text-right text--disabled">
            {{
            publication.timestamp | formatTimestamp
            }}
          </span>
        </v-list-item-content>
      </v-list-item>

      <v-card-title class="pb-0">{{ publication.description }}</v-card-title>

      <v-card-actions>
        <v-btn
          icon
          @click="updateLike(publication._id, indexPublication)"
          :color="isLike(publication.reactions)"
        >
          <v-icon>fas fa-heart</v-icon>
        </v-btn>
        <span class="px-auto text-right text--disabled">{{ publication.reactions.length }} Likes</span>
        <v-spacer />
        <v-btn icon color="info" @click="showImage(publication, indexPublication)">
          <v-icon>far fa-eye</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <modal-image
      :enableModalImage="enableModalImage"
      :dataImage="dataImage"
      @changeActive="enableModalImage = $event"
      @updateLike="updateLikeEventModal"
    />
  </v-container>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import axios from "axios";
import modalImage from "@/components/modalShowImage";
export default {
  name: "publication",
  components: {
    modalImage
  },
  props: {
    user: Object,
    loading: Boolean,
    indexUser: Number,
    item: Object
  },
  data() {
    return {
      enableModalImage: false,
      dataImage: {},
      IndexPublication: 0
    };
  },
  methods: {
    isLike(reactions) {
      const find = reactions.findIndex(element => {
        return element == this.dataUser;
      });
      return find < 0 ? "blue" : "red";
    },
    async updateLike(idPublication, IndexPublication) {
      const updateLike = await axios.post(
        "/functs/likePublication",
        { idPublication: idPublication },
        { headers: { Authorization: this.token } }
      );

      if (updateLike.data.success) {
        this.$emit("updateLike", {
          islike: updateLike.data.isLike,
          user: this.indexUser,
          publication: IndexPublication
        });
      }
    },
    showImage(item, indexPublication) {
      this.enableModalImage = true;
      this.dataImage = item;
      this.IndexPublication = indexPublication;
    },
    updateLikeEventModal(event) {
      this.$emit("updateLike", {
        islike: event,
        user: this.indexUser,
        publication: this.IndexPublication
      });
    }
  },
  computed: {
    ...mapState(["dataUser", "token"])
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
