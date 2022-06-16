<template>
 
 <div>
 <img class="mb-4" src="../assets/icon-left-font.png" alt="" width="300" height="200">
 <h1>Bienvenue sur le réseau social de Groupomania!</h1>
</div>
<posts></posts>

</template>

<script>
import posts from "../components/Posts";
export default {
  name: "HomeVue",
   components: {
    posts,
  }
}
</script>
