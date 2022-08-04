<template>
  <div class="container-compo mx-auto">
    <div class="container mt-5">
      <h1 class="mb-4">Mise à jour<br />Changer le mot de passe</h1>

      <form @submit.prevent="handleSubmit" id="myForm">
        <div class="mb-3">
          <label for="currentPwd" class="form-label">Mot de passe actuel</label>
          <input
            v-model="currentPwd"
            @click="resetErrorMessage"
            type="password"
            class="form-control"
            id="currentPwd"
            required
          />
        </div>
        <div class="mb-3">
          <label for="newPwd" class="form-label">Nouveau mot de passe</label>
          <input
            v-model="newPwd"
            @click="resetErrorMessage"
            type="password"
            class="form-control"
            id="newPwd"
            required
          />
        </div>
        <p v-if="isSamePassword" class="validFeedback">
          Le nouveau mot de passe doit être différent !
        </p>
        <div class="mb-4">
          <label for="confirmPwd" class="form-label"
            >Confirmez le mot de passe</label
          >
          <input
            v-model="confirmPwd"
            @click="resetErrorMessage"
            type="password"
            class="form-control"
            id="confirmPwd"
            required
          />
        </div>
        <p v-if="!isConfirmPasswordOK" class="validFeedback">
          The passwords are different!
        </p>
        <p v-if="!valid" class="validFeedback">{{ errorMessage }}</p>

        <button
          @click.prevent="abort"
          class="btn btn-light btn-space btn-abort"
        >
          Revenir
        </button>
        <button
          :disabled="isSamePassword || !isConfirmPasswordOK"
          type="submit"
          class="btn btn-primary btn-space btn-groupo"
        >
          Valider
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Api from "../services/Api";

export default {
  name: "ModifyPassword",
  data() {
    return {
      currentPwd: "",
      newPwd: "",
      confirmPwd: "",
      valid: true,
      errorMessage: "",
    };
  },
  computed: {
    isSamePassword() {
      return this.newPwd !== "" && this.currentPwd === this.newPwd;
    },
    isConfirmPasswordOK() {
      if (this.confirmPwd !== "") {
        return this.newPwd === this.confirmPwd;
      } else {
        return true;
      }
    },
  },
  methods: {
    abort() {
      // redirection vers la page ModifyProfile
      this.$router.go(-1);
    },
    async handleSubmit() {
      const dataInput = {
        currentPassword: this.currentPwd,
        newPassword: this.newPwd,
      };

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        await Api.put(`users/${userId}/password`, dataInput, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Le mot de passe a bien été modifié !");

        // redirection vers la page ViewProfile
        this.$router.go(-1);
      } catch (error) {
        console.log(error.response.data);
        this.valid = false;
        if (error.response.data.message === "Mot de passe actuel incorrect !") {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage =
            "Votre mot de passe doit contenir au moins 8 caractères, contenir des lettres (au moins une majuscule et au moins une minuscule), au moins 2 chiffres et au moins un caractère spécial.";
        }
      }
    },
    resetErrorMessage() {
      this.valid = true;
    },
  },
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

.btn-space {
  margin-right: 10px;
}

.btn-abort:hover {
  background-color: #d6d6d6;
}

.validFeedback {
  color: red;
}
</style>
