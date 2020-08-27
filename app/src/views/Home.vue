<template>
  <div>
    <v-row>
      <v-col col="4"> </v-col>
      <v-col col="4" v-for="(item, index) of publications" :key="index">
        <publication :user="item" :loading="loading" />
      </v-col>
      <v-col col="4"> </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import publication from "@/components/publication";
//import moment from "moment"
import axios from "axios";
export default {
  name: "Home",
  components: {
    publication,
  },
  data() {
    return {
      publications: [],
      loading: false,
    };
  },
  created() {
    if (!this.dataUser) {
      this.$router.push("/login");
    } else {
      this.getPublicationsOfFollows();
    }
  },
  computed: {
    ...mapState(["dataUser", "token"]),
  },
  methods: {
    async getPublicationsOfFollows() {
      this.loading = true;
      const response = await axios.post(
        "/functs/publicationsOfFollow",
        {},
        { headers: { Authorization: this.token } }
      );
      this.publications = response.data;
      this.loading = false;
    },
    // async updateLike(id,idFollow,idPublication){
    //   const updateLike = await axios.post("/functs/likePublication",{"idPublication":id},{headers:{"Authorization":this.token}})
    //   if(updateLike.data.success){
    //     if (updateLike.data.isLike) {
    //       //agregar
    //       this.publications[idFollow].publications[idPublication].reactions.push(this.dataUser._id)
    //     }else{
    //       //eliminar
    //       const id = this.publications[idFollow].publications[idPublication].reactions.findIndex(id => id == this.dataUser._id)
    //       this.publications[idFollow].publications[idPublication].reactions.splice(id,1)
    //     }
    //     this.publications[idFollow].publications[idPublication].isLike = updateLike.data.isLike
    //   }
    // },
    // changeView(view){
    //   this.changeViewActive = view
    // }
  },
};
</script>
