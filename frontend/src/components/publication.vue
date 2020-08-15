<template >
  <div>
    <v-card flat class="mt-5" max-width="500" loader-height="2" :loading="loading">
      <v-img class="align-end grey lighten-2" width="100%" :src="publication.images" :lazy-src="publication.images" aspect-ratio="1"  >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center" >
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
      <v-list-item>
        <v-list-item-avatar color="grey darken-3">
          <v-img class="elevation-6" :src="item.avatar" ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            <v-btn class="pl-0" text  color="red lighten-2" :to="'/profile/'+item._id" >
              {{item.username}}
            </v-btn>
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <span class="px-auto text-right text--disabled">{{publication.timestamp}}</span>
        </v-list-item-content>
        
      </v-list-item>
      <v-card-title  class="pb-0">{{publication.description}}</v-card-title>
      <v-card-actions>
        <v-btn icon @click="updateLike(publication._id,index,idPublication)" :color="publication.isLike ? 'red' : 'blue'">
          <v-icon>fas fa-heart</v-icon>
        </v-btn>
        <v-btn text class="btn-person" @click="changeView('likes')">
          <span v-if="publication.reactions" class="px-auto text-right text--disabled">{{publication.reactions.length}} Like</span>
        </v-btn>
        <v-btn text class="btn-person"  @click="changeView('comments')">
          <span class="px-auto text-right text--disabled">Comments</span>
        </v-btn>
      </v-card-actions>
      <likesPublication v-if="changeViewActive == 'likes'" :reactions="publication.reactions" />
      <comments v-show="changeViewActive == 'comments'" :publicationId="publication._id" />
    </v-card>
  </div>
</template>
<script>
import likesPublication from "@/components/likesPublication"
import comments from "@/components/comments"
export default {
  name:"publication",
  components: {
    likesPublication,
    comments
  },
  props: {
    idPublication:Number,
    publication:Object,
    item:Object,
    index:Number,
    loading:Boolean,
  },
  data() {
    return {
      changeViewActive:"comments"
    }
  },
  methods: {
    changeView(view){
      this.changeViewActive = view
    }
  },
}
</script>