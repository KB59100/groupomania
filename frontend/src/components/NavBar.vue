<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <img
          src="../assets/icon-left-font.png"
          alt="logo Groupomania"
          class="d-inline-block align-text-top logo"
        />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto" v-if="!loggedIn">
          <li class="nav-item">
            <router-link to="/login" class="nav-link login-link">To log in</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/signup" class="nav-link signup-link">Register</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto" v-if="loggedIn">
          <li class="nav-item nav-item-home">
            <router-link to="/" class="nav-link d-flex"><i class="fas fa-home logo-home" title="Accueil"></i></router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'view-profile', params: { id: user.id }}" class="nav-link profile-link" data-toggle="tooltip" data-placement="bottom" :title="'Profile of ' + user.username">
              <div class="avatar-container">
                <img :src="user.avatar" alt="avatar account">
              </div>
            </router-link>
          </li>
          <li class="nav-item nav-item-logout">
            <button @click="logOut" class="nav-link logout-link btn btn-groupo">Sign out</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "NavBar",
  methods: {
    logOut() {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      this.$store.dispatch('setUser', null);
      this.$store.dispatch('setLogout');

      alert('You are loging out !');
      this.$router.push('/');
    }
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters(['loggedIn']),
  },
  beforeMount() {
    this.$store.dispatch('checkToken');
  }  
};
</script>

<style scoped>

  .navbar {
    border-bottom: 1px solid #EFEFEF;
    padding: 30px;
  }

  .navbar .logo {
    width: 225px;
    height: 50px;
  }

  .navbar-nav {
    gap: 30px;
  }

  .nav-item {
    font-weight: 500;
  }

  .nav-link {
    display: inline-block;
  }

  .login-link, .signup-link, .logout-link {
    padding: 8px 12px !important;
    border-radius: 24px;
  }

  .login-link, .logout-link {
    background-color: #FD5835;
    color: #fff !important;
  }

  .login-link:hover, .logout-link:hover  {
    background-color: #c1442b;
  }

  .signup-link {
    background-color: #EFEFEF;
    color: #111 !important;
  }

  .signup-link:hover {
    background-color: #d6d6d6;
  }

  .avatar-container {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
  }

  .avatar-container img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-link {
    border-radius: 50%;
  }
  .profile-link:hover {
    background-color: #EFEFEF;
  }

  .nav-item-logout, .nav-item-home {
    display: flex;
    align-items: center;
  }

  .logo-home {
    font-size: 2rem;
    color: #FD5835;
  }

  .logo-home:hover {
    font-size: 2rem;
    color: #c1442b;
  }

  @media screen and (max-width: 992px) {
    .navbar-nav {
      margin-top: 25px;
      gap: 15px;
      align-items: center;
    }
    .nav-link {
      padding: 0.5rem;
    }
  }

  @media screen and (max-width: 400px) {
    .navbar .logo {
      width: 130px;
      height: 30px;
    }
  }
</style>
