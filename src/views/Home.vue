<template>
  <el-container style="min-height: 100vh">
    <el-header>
      <commen-header></commen-header>
    </el-header>
    <el-container>
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <commen-aside></commen-aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommenHeader from "../components/Home/CommenHeader.vue";
import CommenAside from "../components/Home/CommenAside.vue";

export default {
  components: {
    CommenHeader,
    CommenAside,
  },
  data() {
    return {};
  },
  computed: {
    isCollapsed() {
      return this.$store.state.isCollapsed;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-header {
  background: #2a3f54;
}
.el-aside {
  background: #32475c;
  transition: all 0.7s;
}
.el-main {
  background: #f4f4f4;
}
</style>
