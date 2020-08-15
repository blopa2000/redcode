<template>
<div>
    <v-container v-if="exists">
        
        <div class="d-flex align-center mb-5">
            <div class="mr-5">
                <v-avatar size="90">
                    <v-img :src="infoUser.avatar">
                        <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center" >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                </v-avatar>
            </div>

            <div v-show="infoUser != ''">
                <p class="font-weight-black mb-0">{{infoUser.username}}</p>
                <strong class="mb-0">{{infoUser.firstName}} {{infoUser.lastName}} </strong>
                <p class="font-weight-thin mb-0">{{infoUser.description}} </p>
            </div>

            <div v-show="activeEvent">
                <v-btn  text icon color="red lighten-2" @click="infoProfile">
                    <v-icon>fas fa-toolbox</v-icon>
                </v-btn>
            </div>
            <div v-show="!activeEvent && dataUser != ''">
                <v-btn  color="red lighten-2 white--text" @click="UpdateFollow">
                    {{following[isFollow]}}
                </v-btn>
            </div>
        </div>

        <div v-if="activeEvent">
            <v-btn dark  :elevation="0" color="red lighten-2" @click="activeModal = true">
                upload publication
            </v-btn>

        </div>
        
        <div v-if="dataUserpublication != ''">
            <v-row>
                <v-col v-for="(item,index) of dataUserpublication" :key="index" class="d-flex child-flex" cols="12" sm="4">
                    <a @click="showImage(item,index)">
                        <v-card flat  class="d-flex">
                            <v-img :src="item.images" :lazy-src="item.images" aspect-ratio="1" class="grey lighten-2" >
                                <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center" >
                                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                    </v-row>
                                </template>
                            </v-img>
                        </v-card>
                    </a>
                </v-col>
            </v-row>
        </div>
        <div v-else>
            {{message}}
        </div>
    </v-container>
    <v-container v-else>
        <p class="error--text">
            {{message}}
        </p>
    </v-container>
    <modalPublication :activeModal="activeModal" @close="activeModal = false" @saveImages="updatePublication" />
    <modalConfigProfile :activeModalConfig="activeModalConfig" @closeConfig="activeModalConfig = false"/>
    <Modalimage :activeModalimage="activeModalimage" :dataImage="dataImage" @changeActive="activeModalimage = $event" @updateLike="updateLike" />
</div>
</template>

<script>
import moment from "moment"
import modalPublication from "@/components/modalPublication"
import Modalimage from "@/components/modalShowImage"
import modalConfigProfile from "@/components/settings/modalConfigProfile"
import axios from "axios"
import { mapState } from 'vuex'

export default {
    components:{
        modalPublication,
        modalConfigProfile,
        Modalimage
    },
    data() {
        return {
            activeEvent:true,
            exists:false,
            activeModal:false,
            activeModalConfig:false,
            activeModalimage:false,
            dataImage:{},
            infoUser:{
                avatar:"",
                username:"",
                firstName:"",
                lastName:"",
                description:"",
            },
            dataUserpublication:[],
            isFollow:false,
            IndexImage:0,
            following:{true:"unfollow",false:"follow"},
            message:"no se encuentra ese usuario",
   
        }
    },
    watch:{
        $route(to, from){
            to,from
            this.getuserInfoPublication()  
        },
        dataUser(){
            this.infoUser.username    = this.dataUser.username;
            this.infoUser.firstName   = this.dataUser.firstName;
            this.infoUser.lastName    = this.dataUser.lastName;
            this.infoUser.description = this.dataUser.description;
            this.infoUser.avatar      = this.dataUser.avatar;
        }
    },
    mounted() {
        this.getuserInfoPublication();
    },
    computed: {
        ...mapState(["dataUser","token"])
    },
    methods: {
        async getuserInfoPublication(){
            if(this.dataUser == "" || this.dataUser._id !== this.$route.params.id){
                const info = await axios.post("/functs/otherUserPosts",{idUser:this.$route.params.id});

                this.activeEvent = false;
                if(info.data.success){
                    this.exists = true;
                                 
                    //this.infoUser =  info.data.info;
                    //5ec331dbe827dc46e0b2db39

                    this.infoUser.avatar      = info.data.userData.avatar;
                    this.infoUser.username    = info.data.userData.username;
                    this.infoUser.firstName   = info.data.userData.firstName;
                    this.infoUser.lastName    = info.data.userData.lastName;
                    this.infoUser.description = info.data.userData.description;

                    if(this.token){
                        const getFollow = await axios.post('/functs/isFollowing',{idFollow:this.$route.params.id},{headers:{"Authorization":this.token}});
                        console.log(getFollow.data.success);
                        
                        if(getFollow.data.success){
                            this.isFollow = true;
                        }else{
                            this.isFollow = false;
                        }
                    }

                }else{
                    this.message = info.data.message;
                    this.exists = false;
                }
            }else{
                this.exists = true;
                this.activeEvent = true;
                
                this.infoUser.username    = this.dataUser.username;
                this.infoUser.firstName   = this.dataUser.firstName;
                this.infoUser.lastName    = this.dataUser.lastName;
                this.infoUser.description = this.dataUser.description;
                this.infoUser.avatar      = this.dataUser.avatar;
            
            }

            this.updatePublication();
        },
        async UpdateFollow(){
            let responst = {};
            if(this.isFollow){
                //defar de seguir
                responst = await axios.put(`/functs/unFollow`,{idFollow:this.$route.params.id},{headers:{"Authorization":this.token}});
            }else{
                //seguir
                responst = await axios.put(`/functs/follow`,{idFollow:this.$route.params.id},{headers:{"Authorization":this.token}});
            }
            responst
            this.isFollow = !this.isFollow;
        },
        async updatePublication(){
            this.dataUserpublication = ""
            const values = await axios.get(`/functs/publication/PublicPublications/${this.$route.params.id}`);
            if (values.data.success) {
                //alterando el timestamp y despues agrego todo el value a la variable reactiva !increible!
                for (const iterator of values.data.info) {
                    const find = iterator.reactions.findIndex(item =>  {return item == this.dataUser._id});
                    iterator.isLike = find < 0 ? false : true;
                    iterator.timestamp = await moment(iterator.timestamp).startOf("minute").fromNow();
                }
                this.dataUserpublication =  values.data.info;
            }else{
                this.dataUserpublication = []
                this.message = "No hay publicaciones todavia";
            }
        },
        infoProfile(){
            this.activeModalConfig = true
        },
        showImage(item,index){
            this.activeModalimage = true
            this.dataImage = item
            this.IndexImage = index
        },
        updateLike(event){
            const id = this.IndexImage
            this.dataUserpublication[id].isLike = event
            if (event){
                this.dataUserpublication[id].reactions.push(this.dataUser._id)
            }else{
                const idUser = this.dataUserpublication[id].reactions.findIndex(id => id == this.dataUser._id)
                this.dataUserpublication[id].reactions.splice(idUser,1)
            }
        }
    }
}
</script>

