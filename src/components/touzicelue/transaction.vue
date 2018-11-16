<template>

</template>

<script>
    export default {
        name: "transaction",
      beforeCreate:function () {
        this.$store.state.clNowContent = 'transaction';
        this.$store.state.loadingCL = false;
        this.$store.state.nowContent = 'mine';
        this.$store.state.loadingContent = false;
      }
    }
</script>

<style scoped>

</style>
