<template>
  <div class="container-compo mx-auto">
    <div v-if="user" class="wall mx-auto">
      <h1 class="wall-title my-4">The News Feed</h1>
      <NewPost @newpost="setReload" />
      <Feed :key="compoKey"/>
    </div>
    <div v-else class="welcome mx-auto">
      <img src="../assets/icon-above-font.png" alt="logo Groupomania" class="logo mx-auto d-block">
      <h1 class="welcome-title mt-4">Welcome to the Groupomania social network</h1>
      <p class= "welcome-text mt-4">Sign up to share your ideas and inspirations and stay in touch with your colleagues!</p>
      <div class="d-flex align-items-center justify-content-between mt-5 welcome-btns">
          <router-link to="/signup" class="btn btn-primary btn-signup">Create an account</router-link>
          <span class="ms-auto">Already have an account ?</span>
          <router-link to="/login" class="btn btn-primary btn-login">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Feed from "@/components/Feed.vue";
import NewPost from "@/components/NewPost.vue";
import { mapGetters } from 'vuex';

export default {
  name: 'HomeView',
  components: {
    NewPost,
    Feed
  },
  data() {
    return {
      compoKey: 0
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted() {
   // console.log("logged", this.$store.state.logged);
  },
  updated() {
    //console.log('HomeView updated!')
  },
  methods: {
    setReload() {
      this.compoKey += 1;
    }
  }
}
</script>

<style scoped>

*{
  background-color: rgb(179, 175, 175);
};



  .container-compo {
    margin-top: 3%;
  }

  .wall {
    max-width: 680px;
    width: 80%;
  }

  .wall-title{
    font-weight: 700;
    text-align: center;
  } 

  .welcome {
    padding: 0 25px;
    max-width: 800px;
  }

  .welcome-title {
    font-weight: 700;
    font-size: 2rem;
  }

  .logo {
    max-width: 400px;
    width: 80%;
  }

  .welcome-btns {
    gap: 20px;
  }

  .welcome-btns span {
    font-size: 1.1rem;
    font-weight: 500;
  }

  .btn-signup {
    width: 200px;
    background-color: #fff;
    color: #333 !important;
    border: 2px solid #EFEFEF;
    font-size: 1.2rem;
  }

  .btn-signup:hover {
    background-color: #EFEFEF;
  }

  .btn-login {
    width: 200px;
    background-color: #fff;
    color: #333 !important;
    border: 2px solid #FD5835;
    font-size: 1.2rem;
  }

  .btn-login:hover {
    background-color: #FD5835;
    color: #fff !important;
  }

  @media screen and (max-width: 768px) {
    .wall {
      max-width: 680px;
      width: 95%;
    }
    
    .welcome-btns {
      flex-direction: column;
    }

    .welcome-btns span {
      margin-left: 0 !important;
      margin-top: 20px;
    }
  }
  
</style>
