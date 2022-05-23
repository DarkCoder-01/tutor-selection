<template>
  <div>
    <div class="toggle_button" @click="toggleCollapse">|||</div>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      background-color="#32475C"
      text-color="#fff"
      active-text-color="white"
      :unique-opened="true"
      :collapse="isCollapsed"
      :collapse-transition="false"
    >
      <el-menu-item
          index="1"
          v-if="roleId == 1"
          @click="asideRouter('/notification')"
      >
        <i class="el-icon-data-analysis"></i>
        <span slot="title">查看进度</span>
      </el-menu-item>

      <el-menu-item
          index="2"
          v-if="roleId == 1"
          @click="asideRouter('/activity')"
      >
        <i class="el-icon-timer"></i>
        <span slot="title">活动管理</span>
      </el-menu-item>

      <el-submenu index="3" v-if="roleId == 1">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1" @click="asideRouter('studentManagement')">学生管理</el-menu-item>
          <el-menu-item index="3-2" @click="asideRouter('tutorManagement')">导师管理</el-menu-item>
          <el-menu-item index="3-3" @click="asideRouter('userManagement')">用户管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-menu-item
          index="4"
          v-if="roleId == 1"
          @click="asideRouter('/matchManagement')"
      >
        <i class="el-icon-connection"></i>
        <span slot="title">匹配管理</span>
      </el-menu-item>

      <el-menu-item
          index="5"
          v-if="roleId == 1"
          @click="asideRouter('/notice')"
      >
        <i class="el-icon-message-solid"></i>
        <span slot="title">通知管理</span>
      </el-menu-item>

      <el-menu-item
          index="1"
          v-if="roleId == 2"
          @click="asideRouter('/notification')"
      >
        <i class="el-icon-data-analysis"></i>
        <span slot="title">查看进度</span>
      </el-menu-item>

      <el-menu-item
          index="2"
          v-if="roleId == 2"
          @click="asideRouter('/chooseStuent')"
      >
        <i class="el-icon-user"></i>
        <span slot="title">选择学生</span>
      </el-menu-item>

      <el-menu-item
          index="3"
          v-if="roleId == 2"
          @click="asideRouter('/myStudent')"
      >
        <i class="el-icon-school"></i>
        <span slot="title">我的学生</span>
      </el-menu-item>

      <el-menu-item
          index="4"
          v-if="roleId == 2"
          @click="asideRouter('/tutorInfo')"
      >
        <i class="el-icon-user-solid"></i>
        <span slot="title">个人信息</span>
      </el-menu-item>

      <el-menu-item
          index="1"
          v-if="roleId == 3"
          @click="asideRouter('/notification')"
      >
        <i class="el-icon-data-analysis"></i>
        <span slot="title">查看进度</span>
      </el-menu-item>

      <el-menu-item
        index="2"
        v-if="roleId == 3"
        @click="asideRouter('/chooseTutor')"
      >
        <i class="el-icon-edit-outline"></i>
        <span slot="title">选择导师</span>
      </el-menu-item>

      <el-menu-item
        index="3"
        v-if="roleId == 3"
        @click="asideRouter('/myTutor')"
      >
        <i class="el-icon-office-building"></i>
        <span slot="title">我的导师</span>
      </el-menu-item>

      <el-menu-item
          index="4"
          v-if="roleId == 3"
          @click="asideRouter('/mySpace')"
      >
        <i class="el-icon-user-solid"></i>
        <span slot="title">个人信息</span>
      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    toggleCollapse() {
      this.$store.commit("toggleCollapse");
    },
    asideRouter(ways) {
      this.$router.push({
        path: ways,
      });
    },
  },
  computed: {
    isCollapsed() {
      return this.$store.state.isCollapsed;
    },
    roleId() {
      return this.$store.state.userInfo.roleId;
    }
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/scss/color.scss";
.toggle_button {
  background-color: $color_middle_grey;
  color: white;
  font-size: 10px;
  line-height: 30px;
  height: 30px;
  text-align: center;
  font-weight: bold;
  letter-spacing: 0.2em;
  cursor: pointer;
  &:hover {
    background-color: rgb(102, 118, 135);
  }
}
.el-menu {
  width: 100% !important;
  border-right: none;
  i {
    color: white;
  }
  .is-active {
    color: #fff;
    box-shadow: 0 1px 1px #374452;
    border-top: 1px solid #6f8397;
    background: #4c6075 !important;
    position: relative;
    transition: none;
    &:after {
      content: "";
      position: absolute;
      right: 0;
      top: -1px;
      height: 56px;
      width: 5px;
      background: #66b1ff;
    }
  }
}
</style>
<style lang="scss">
.el-menu {
  .el-menu-item {
    transition: all 1s !important;
  }
  .is-active {
    transition: all 1s !important;
  }
  .el-tooltip {
    transition: all 1s !important;
  }
}
</style>
