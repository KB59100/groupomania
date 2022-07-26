<template>
  <div class="container-compo mx-auto">

    <h1 class="mb-4">Profile</h1>

    <div class="card mb-4 card-profile">
      <div class="card-body text-center">
        <img :src="avatar" class="rounded-circle img-fluid avatar" alt="avatar"/>
        <h3 class="my-3">{{ username }}</h3>
        <p class="text-muted mb-3">{{ email }}</p>
        <p class="mb-4 text-bio" ref="bio"></p>
        <div class="d-flex justify-content-center mb-2 card-btns">
          <router-link :to="`/modify-profile/${user.id}`" class="btn btn-primary  btn-modify" v-if="loggedIn">Edit profile</router-link>
          <router-link :to="`/modify-password/${user.id}`" class="btn btn-primary btn-password" v-if="loggedIn">Change password</router-link>
          <button @click="deleteUser" class="btn btn-groupo">Delete account</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Api from '../services/Api';
import getClickableLink from '../utils/getClickableLink';

export default {
  name: "ViewProfile",
  data() {
    return {
      username: '',
      email: '',
      bio: '',
      avatar: '',
    };
  },
  computed: {
    ...mapGetters(["user"]),
    ...mapGetters(['loggedIn']),
  },
  methods: {
    async deleteUser() {

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      let okToDelete = confirm('Are you sure you want to delete your account?')
      if(!okToDelete) {
        return
      }

      try {
        await Api.delete(`users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }}
        );

        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        this.$store.dispatch('setLogout');

        alert('Account deleted!')

        // redirect to the registration page
        this.$router.push('/signup');

      } catch (error) {
        console.log(error.response.data);
      }
    },
    async getUser() {

      const token = localStorage.getItem("token");
      const userIdFromLocalStore = this.$store.state.user.id;
      const userIdParams = this.$route.params.id;

      try {
        
        if (parseInt(userIdParams) !== userIdFromLocalStore) {
          alert("Access to this page not authorized");
          this.$router.push('/');
          return
        }
        
        const response = await Api.get(`users/${userIdParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.username = response.data.username;
        this.email = response.data.email;
        this.bio = response.data.bio;
        this.$refs.bio.innerHTML = this.bio !== null ? getClickableLink(response.data.bio) : '';
        this.avatar = response.data.avatar;

        // Update of the plain email in the state

        const updatedUser = Object.assign({...this.$store.state.user}, {email: this.email});
        this.$store.dispatch('setUser', updatedUser);

      } catch (error) {
          console.log(error.response.data);
      }
    },
  },
  async beforeMount() {
    this.getUser();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container-compo {
    max-width: 600px;
    margin-top: 5%;
  }

  h1 {
    font-weight: 700;
    text-align: center;
  }

  .card-profile {
    border-radius: 20px;
  }

  .avatar {
    width: 150px;
    height: 150px;
    object-fit: cover;
  }

  .text-bio {
    white-space: pre-wrap;
  }

  .card-btns {
    display: flex;
    gap: 20px;
  }

  .btn-modify {
    background-color: #EFEFEF;
    border-color: #EFEFEF;
    color: #111 !important;
  }

  .btn-modify:hover {
    background-color: #d6d6d6;
  }

  .btn-password {
    background-color: #EFEFEF;
    border-color: #EFEFEF;
    color: #111 !important;
  }

  .btn-password:hover {
    background-color: #d6d6d6;
  }

  @media screen and (max-width: 768px) {
    .container-compo {
      width: 80%;
    }
    
    .card-btns {
      gap: 20px;
      flex-direction: column;
    }
  }
</style>
