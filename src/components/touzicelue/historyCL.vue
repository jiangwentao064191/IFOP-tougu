<template>

</template>

<script>
    export default {
        name: "historyCL",
      beforeCreate:function () {
        this.$store.state.clNowContent = 'historyCL';
        this.$store.state.loadingCL = false;
        this.$store.state.nowContent = 'mine';
        this.$store.state.loadingContent = false;
      }
    }
</script>

<style scoped>

</style>
