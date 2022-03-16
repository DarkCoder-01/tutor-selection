<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true, //控制视图是否显示的变量
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false; //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true; //再打开
      });
    },
  },
};
</script>

<style lang="scss">
html,
body,
#app {
  font-family: "微软雅黑" Helvetica Neue, Helvetica, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

.el-card {
  margin-top: 20px;
}
</style>
