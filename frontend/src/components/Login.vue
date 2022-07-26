<template>
  <div class="container-compo mx-auto">
    <div class="container">
      <h1 class="mb-4">Login</h1>

      <form  @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="usernameInput" class="form-label">User Name</label>
          <input @click="resetErrorMessage" v-model="username" type="text" class="form-control" id="usernameInput" required />
        </div>
        <div class="mb-4">
          <label for="passwordInput" class="form-label">Password</label>
          <input @click="resetErrorMessage" v-model="password" type="password" class="form-control" id="passwordInput" required />
        </div>
        <p v-if="!valid" id="errorMessageId" class="validFeedback">{{ errorMessage }}</p>
        <button type="submit" class="btn btn-primary btn-groupo">To log in</button>
        <p class="mt-3">Dont have account yet? <router-link to="/signup">Registration</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import Api from '../services/Api';

export default {
  name: "LogIn",
  data() {
    return {
      username: '',
      password: '',
      valid: true,
      errorMessage: ''
    }
  },
  methods: {
    async handleSubmit() {
      const dataInput = {
        username: this.username,
        password: this.password
      }

      try {
        const response = await Api.post('users/signin', dataInput);

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        this.$store.dispatch('setUser', response.data.user);
        this.$store.dispatch('setLogin');
        this.$router.push('/');

      } catch (error) {
          console.log(error.response.data);
          this.valid = false;
          this.errorMessage = error.response.data.message;
      }
    },
    resetErrorMessage() {
      this.valid = true;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container-compo {
    max-width: 500px;
    margin-top: 5%;
  }

  h1 {
    font-weight: 700;
    text-align: center;
  }

  .validFeedback {
    color: rgb(255, 51, 0);
  }
</style>