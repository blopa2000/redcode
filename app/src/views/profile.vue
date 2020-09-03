<template>
  <div>
    <v-container v-if="exists">
      <div class="d-flex align-center mb-5">
        <div class="mr-5">
          <v-avatar size="90">
            <v-img :src="profile.avatar">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-avatar>
        </div>

        <div v-show="profile != ''">
          <p class="font-weight-black mb-0">{{ profile.username }}</p>
          <strong class="mb-0"
            >{{ profile.firstName }} {{ profile.lastName }}</strong
          >
          <p class="font-weight-thin mb-0" style="max-width: 421px;">
            {{ profile.description }}
          </p>
        </div>

        <div v-show="activeEvent">
          <v-btn text icon color="red lighten-2 ml-5" @click="infoProfile">
            <v-icon>fas fa-toolbox</v-icon>
          </v-btn>
        </div>
      </div>
      <div v-show="!activeEvent && idUser != ''">
        <v-btn color="red lighten-2 white--text" @click="UpdateFollow">{{
          following[isFollow]
        }}</v-btn>
      </div>

      <div v-if="activeEvent">
        <v-btn
          dark
          :elevation="0"
          color="red lighten-2"
          @click="activeModal = true"
          >upload post</v-btn
        >
      </div>

      <!-- post  -->
      <div v-if="userPosts != ''">
        <v-row>
          <v-col
            v-for="(item, index) of userPosts"
            :key="index"
            class="d-flex child-flex"
            cols="12"
            sm="4"
          >
            <a @click="showImage(item, index)">
              <v-card flat class="d-flex">
                <v-img
                  :src="item.images"
                  :lazy-src="item.images"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-card>
            </a>
          </v-col>
        </v-row>
      </div>
      <!-- /post -->
    </v-container>
    <v-container>
      <message
        v-if="userPosts == '' || !exists"
        class="mt-5"
        :message="message"
      />
    </v-container>
    <!-- componentes -->
    <modal-upload-post
      :activeModal="activeModal"
      @close="activeModal = false"
      @savepost="getPosts"
    />
    <modal-config-profile
      :activeModalConfig="activeModalConfig"
      @closeConfig="activeModalConfig = false"
      @updateProfile="profile = $event"
    />
    <modal-show-post
      :enableModalPost="enableModalPost"
      :post="dataImage"
      @changeActive="enableModalPost = $event"
      @updateLike="updateLike"
    />
    <!-- /components -->
  </div>
</template>

<script>
import modalUploadPost from "@/components/modalUploadPost";
import modalShowPost from "@/components/modalShowPost";
import modalConfigProfile from "@/components/settings/modalConfigProfile";
import message from "@/components/message";
import axios from "axios";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    modalUploadPost,
    modalConfigProfile,
    modalShowPost,
    message
  },
  data() {
    return {
      activeEvent: true,
      exists: false,
      activeModal: false,
      activeModalConfig: false,
      enableModalPost: false,
      dataImage: {},
      userPosts: [],
      isFollow: false,
      IndexImage: 0,
      following: { true: "unfollow", false: "follow" },
      message: {},
      profile: {}
    };
  },
  mounted() {
    this.setLoading(true);
    this.getProfile();
    this.setLoading(false);
  },
  watch: {
    $route(to, from) {
      to, from;
      this.getProfile();
    }
  },
  computed: {
    ...mapState(["idUser", "token"])
  },
  methods: {
    ...mapMutations(["setLoading"]),
    async getProfile() {
      const response = await axios.post(
        `/functs/getProfile/${this.$route.params.id}`
      );
      if (this.idUser !== this.$route.params.id) {
        //another profile
        this.activeEvent = false;

        if (this.token) {
          const getFollow = await axios.post(
            "/functs/isFollowing",
            { idFollow: this.$route.params.id },
            { headers: { Authorization: this.token } }
          );
          if (getFollow.data.success) {
            this.isFollow = true;
          } else {
            this.isFollow = false;
          }
        }
      } else {
        //my profile
        this.activeEvent = true;
      }

      if (response.data.success) {
        this.exists = true;
        this.profile = response.data.profile;
        //get posts
        this.getPosts();
      } else {
        this.message = {
          text: `${response.data.message}...
          this may be an internal error or the user cannot be found
          `,
          color: "error"
        };
        this.exists = false;
      }
    },
    async getPosts() {
      this.userPosts = "";
      const response = await axios.post("/functs/posts", {
        id: this.$route.params.id
      });
      if (response.data.success) {
        this.userPosts = response.data.posts;
        if (this.userPosts.length <= 0) {
          if (this.idUser !== this.$route.params.id) {
            this.message = {
              text: "This user has no uploaded posts",
              color: "info"
            };
          } else {
            this.message = {
              text: "Has no posts... upload one",
              color: "info"
            };
          }
        }
      } else {
        this.userPosts = [];
        this.message = {
          text: response.data.message,
          color: "info"
        };
      }
    },
    async UpdateFollow() {
      if (this.isFollow) {
        //stop following
        await axios.put(
          `/functs/unFollow`,
          { idFollow: this.$route.params.id },
          { headers: { Authorization: this.token } }
        );
      } else {
        //following
        await axios.put(
          `/functs/follow`,
          { idFollow: this.$route.params.id },
          { headers: { Authorization: this.token } }
        );
      }

      this.isFollow = !this.isFollow;
    },
    infoProfile() {
      this.activeModalConfig = true;
    },
    showImage(item, index) {
      this.enableModalPost = true;
      this.dataImage = item;
      this.IndexImage = index;
    },
    updateLike(event) {
      const id = this.IndexImage;
      if (event) {
        this.userPosts[id].reactions.push(this.idUser);
      } else {
        const idUser = this.userPosts[id].reactions.findIndex(
          id => id == this.idUser
        );
        this.userPosts[id].reactions.splice(idUser, 1);
      }
    }
  }
};
</script>
