<template>
  <div class="container-compo mx-auto">
    <div class="container mt-2">
      <h1 class="mb-4">Editing the profile</h1>

      <form @submit.prevent="handleSubmit" id="myForm" enctype="multipart/form-data" class="mb-5">
        <div class="mb-3">
          <label for="usernameInput" class="form-label">User Name</label>
          <input v-model="username" @click="resetErrorMessage" type="text" class="form-control" id="usernameInput" required />
        </div>
        <div class="mb-3">
          <label for="emailInput" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="emailInput" disabled />
        </div>
        <div class="mb-3">
          <label for="bioInput" class="form-label">Bio</label>
          <textarea v-model="bio" @click="resetErrorMessage" type="text" class="form-control" id="bioInput" rows="5" @input="checkBio" />
        </div>
        <p v-if="isBioTooLong" class="validFeedback">The biografi must not exceed the 255 characters allowed</p>
        <div class="mb-4">
            <label for="avatarInput" class="form-label">Avatar</label>
            <div class="imagePreviewWrapper mb-3" :style="{'background-image': `url(${previewAvatar})`}" ></div>
            <input v-if="!isNewAvatar" class="form-control" type="file" id="avatarInput" ref="fileInput" @change="onFileSelected"  @click="resetErrorMessage">
            <button v-else @click.prevent="removeImage" class="btn btn-cancel mb-3">Change avatar</button>
        </div>
        <p v-if="!valid" class="validFeedback">{{ errorMessage }}</p>
        <button @click.prevent="abort" class="btn btn-light btn-space btn-abort">Return</button>
        <button :disabled="!valid" type="submit" class="btn btn-space btn-groupo">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Api from '../services/Api';

export default {
  name: "ModifyProfile",
  data() {
    return {
      username: this.$store.state.user.username,
      email: this.$store.state.user.email,
      bio: this.$store.state.user.bio,
      userId: this.$store.state.user.id,
      selectedFile: null,
      valid: true,
      errorMessage: '',
      previewAvatar: this.$store.state.user.avatar,
      previousAvatar: this.$store.state.user.avatar,
      isBioTooLong: false,
      isNewAvatar : false
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    async handleSubmit() {
      
      const userInfos = {
        username: this.username,
        bio: this.bio
      }
      let body = userInfos;

      // if image uploaded, send a formData object

      if (this.selectedFile !== null) {
        const formData = new FormData();
        formData.append('user', JSON.stringify(userInfos));
        formData.append('avatar', this.selectedFile);
        body = formData;
      }

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const response = await Api.put(`users/${userId}`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }});

        const updatedData = response.data.updatedData;
        const updatedUser = Object.assign({...this.$store.state.user}, {...updatedData});
        
        // mise à jour de user dans localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // mise à jour de user dans le state
        this.$store.dispatch('setUser', updatedUser);

        alert('Changes have been saved !');

        // redirect to the ViewProfile page
        this.$router.go(-1);

      } catch (error) {
          console.log(error.response.data);
          this.valid = false;
          this.errorMessage = error.response.data.message;
          
      }
    },
    onFileSelected(e) {
      const file = e.target.files[0];
      if (!file) {
        this.previewAvatar = this.previousAvatar;
        this.selectedFile = null;
        return
      }
      const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      const MAX_SIZE = 1048576;
      const tooLarge = file.size > MAX_SIZE;

      if(allowedTypes.includes(file.type) && !tooLarge) {
        this.selectedFile = e.target.files[0];
        this.isNewAvatar = true;

        // preview uploaded image
        let reader = new FileReader;
        reader.onload = e => {
          this.previewAvatar = e.target.result;
        }
        reader.readAsDataURL(file);
        // this.$emit('input', file);

      } else {
          this.valid = false;
          this.errorMessage = tooLarge ? "Fichier trop volumineux : la taille ne doit pas dépasser 1 Mo" : "Seules les images sont autorisées";
          this.$refs.fileInput.value = '';
      }
    },
    abort() {
      // redirection vers la page ViewProfile
        this.$router.go(-1);
    },
    resetErrorMessage() {
        this.valid = true;
    },
    checkBio() {
      const bioLength = document.getElementById('bioInput').value.length;
      
      if (bioLength > 255) {
        this.isBioTooLong = true;
        this.valid = false;
      }  else {
        this.isBioTooLong = false;
      }
    },
    removeImage() {
        this.previewAvatar = this.previousAvatar;
        this.selectedFile = null;
        this.isNewAvatar = false;
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container-compo {
    max-width: 500px;
    margin-top: 3%;
  }

  h1 {
    font-weight: 700;
    text-align: center;
  }

  textarea {
    resize: none;
  }

  .btn-cancel {
    background-color: #EFEFEF;
    border-color: #EFEFEF;
    color: #111 !important;
  }

  .btn-cancel:hover {
    background-color: #d6d6d6;
  }

  .btn-space {
    margin-right: 10px;
  }

  .btn-abort:hover {
    background-color: #d6d6d6;
  }

  .imagePreviewWrapper {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: block;
    background-size: cover;
    background-position: center center;
  }

  .validFeedback {
    color: red;
  }
</style>
