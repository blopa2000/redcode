<template>
  <div id="home" class="d-flex justify-center">
    <div v-for="(item,index) of publications" :key="index"  >
      <div v-for="(publication,idPublication) of item.publications" :key="idPublication">
        <publication :idPublication="idPublication" :publication="publication" :item="item" :index="index" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import publication from "@/components/publication"
import moment from "moment"
import axios from "axios"
export default {
  name: 'Home',
  components:{
    publication
  },
  data() {
    return {
      publications:[],
      loading:false,
    }
  },
  created() {
    if (!this.dataUser) {
      this.$router.push("/login");
    }else{
      this.getPublicationsOfFollows()
    }
  },
  computed: {
    ...mapState(["dataUser","token"])
  },
  methods: {
    async getPublicationsOfFollows(){
      this.loading = true;
      const publicationsOfFollows = await axios.post("/functs/publicationsOfFollow",{},{headers:{"Authorization":this.token}});
      for(const item of publicationsOfFollows.data.publicationFollow){

        for(const id in item.publicationOfUser){
          const find = item.publicationOfUser[id].reactions.findIndex(element => { return element == this.dataUser._id });
          item.publicationOfUser[id].isLike = find < 0 ? false : true;
          item.publicationOfUser[id].timestamp = moment(item.publicationOfUser[id].timestamp).startOf("minute").fromNow()
        }
        this.publications.push({publications: item.publicationOfUser,...item.userFollow});
      }
      this.loading = false;
    },
    async updateLike(id,idFollow,idPublication){
      const updateLike = await axios.post("/functs/likePublication",{"idPublication":id},{headers:{"Authorization":this.token}})
      if(updateLike.data.success){
        if (updateLike.data.isLike) {
          //agregar
          this.publications[idFollow].publications[idPublication].reactions.push(this.dataUser._id) 
        }else{
          //eliminar
          const id = this.publications[idFollow].publications[idPublication].reactions.findIndex(id => id == this.dataUser._id)
          this.publications[idFollow].publications[idPublication].reactions.splice(id,1)
        }
        this.publications[idFollow].publications[idPublication].isLike = updateLike.data.isLike
      }
    },
    changeView(view){
      this.changeViewActive = view
    }
  },
  filters:{
    //se puede usar filtros de modo local por componente
  }
}
</script>
