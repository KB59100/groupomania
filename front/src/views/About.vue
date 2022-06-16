<template>
  <div id="recs">
    <HelloWorld msg="kljhsdcjhlbscdljhbcsdljhdsb" />

    <ButtonClose buttonClass="close" buttonText="close" />

    <ButtonOpen buttonClass="open" buttonText="open" />

    <ButtonToto buttonClass="toto" buttonText="toto" />

    
  </div>
</template>

<script>
import HelloWorld from "../components/HelloWorld";
import Button from "../components/Button";

export default {
  name: "AboutVue",
  components: {
    HelloWorld: HelloWorld,
    ButtonClose: Button,
    ButtonOpen: Button,
    ButtonToto: Button,
  },
};
</script>