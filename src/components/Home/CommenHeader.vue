<template>
  <div>
    <div class="top_header">
      <div class="header_left">
        <p>上海大学导师双向选择系统</p>
      </div>
      <div class="header_right">
        <el-dropdown :hide-on-click="false" @command="handleCommand">
          <div class="el-dropdown-link userMsgBox">
            <img
              v-if="userInfo.role_id == 1"
              src="../../assets/images/teacher_head.png"
              class="head_pic"
            />
            <img
              v-else-if="userInfo.role_id == 2"
              src="../../assets/images/doctor.png"
              class="head_pic"
            />
            <img v-else src="../../assets/images/admin.png" class="head_pic" />
            <p>{{ userInfo.username }}</p>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="mySpace">个人信息</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    handleCommand(command) {
      if(command == 'logout') {
        this.$message.success("退出登录成功！");
        this.$axios.get("/logout").then((res) => {
          this.$store.commit("removeInfo");
        }).catch(function (error) {
          console.log(error);
        })
        this.$router.push("/login");
      }
      else if(command == 'mySpace') {
        var roleId = this.$store.state.userInfo.roleId
        if(roleId == 3) {
          this.$router.push('/mySpace')
        } else if(roleId == 2) {
          this.$router.push('/tutorInfo')
        } else if(roleId == 1) {
          console.log("===========");
        }
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  }
};
</script>

<style scoped lang="scss">
.top_header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  .header_left {
    width: 400px;
    height: 100%;
    display: flex;
    align-items: center;
    .logo {
      width: 200px;
      height: 60px;
      // padding-top: 10px;
      transition: width 0.2s ease-in-out 0s;
      transform: scale(0.8);
      &:hover {
        cursor: pointer;
      }
    }
    p {
      width: 300px;
      display: inline-block;
      padding-left: 10px;
      height: 60px;
      line-height: 60px;
      color: white;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 1.5px;
    }
  }
  .header_right {
    display: flex;
    align-items: center;
    .head_pic {
      width: 30px;
      height: 30px;
      transition: width 0.2s ease-in-out 0s;
      transform: scale(0.8);
    }
    .el-dropdown-link {
      display: flex;
      align-items: center;
      img {
        margin-right: 3px;
        transform: scale(0.6);
      }
      i {
        color: white;
        display: inline-block;
        font-size: 18px;
        padding-right: 5px;
        transform: rotate(180deg) translateX(15%);
        transition: all 0.5s;
      }
      &:hover {
        i {
          transform: rotate(360deg) translateX(-5%);
        }
      }
    }
    .header_msg {
      .item {
        margin-right: 25px;
        color: white;
        font-size: 17px;
        sup {
          color: green;
        }
        &:hover {
          cursor: pointer;
        }
      }
      .item:first-child {
        margin-right: 30px;
      }
    }
    .userMsgBox {
      p {
        display: inline-block;
        margin-left: 10px;
        color: white;
        font-size: 16px;
      }
    }
  }
}
</style>
<style lang="scss">
</style>
