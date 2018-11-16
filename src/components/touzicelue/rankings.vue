<template>

</template>

<script>
    export default {
        name: "rankings",
      beforeCreate:function () {
        this.$store.state.clNowContent = 'rankings';
        this.$store.state.loadingCL = false;
        this.$store.state.nowContent = 'mine';
        this.$store.state.loadingContent = false;
      }
    }
</script>

<style scoped>

</style>
