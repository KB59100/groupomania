<template>
<div class="container-xl">
<div class="form-floating">
  <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
  <label for="floatingTextarea2">Commentaires</label>
</div>

<label for="file-input" class="btn btn-secondary mt-1">
  add image
<input id="file-input" type="file" >
</label>

<button type="button" class="btn btn-primary mt-1">Poster</button>

<hr class="dropdown-divider mt-5">
</div>

<post></post>

</template>

<script>
import post from "../components/Post";
export default {
  name: "PostsVue",
   components: {
    post,
  }
 
}
</script>

<style>

input{display: none;}

</style>