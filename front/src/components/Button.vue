<template>
  <button :class="buttonClass">{{ buttonText }}</button>
</template>

<script>
export default {
  name: "ButtonVue",
  props: {
    buttonText: String,
    buttonClass: String,
  },
};
</script>

<style scoped>
.close {
  background-color: red;
}

.open {
  background-color: green;
}

.toto {
  background-color: purple;
}
</style>