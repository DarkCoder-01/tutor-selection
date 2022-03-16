<template>
  <div class="login-container">
    <el-form
      ref="form"
      :model="loginForm"
      :rules="rules"
      label-position="left"
      class="login-page"
    >
      <h3 class="title">导师双向选择系统登录</h3>
      <el-form-item prop="username">
        <el-input
          prefix-icon="el-icon-user"
          type="text"
          v-model="loginForm.username"
          auto-complete="off"
          placeholder="用户名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          prefix-icon="el-icon-lock"
          type="password"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="密码"
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" class="rememberme">记住密码</el-checkbox>
      <Vcode :show="isShow" @success="onSuccess" />
      <el-form-item style="width: 100%">
        <el-button type="primary" @click="login" style="width: 100%; border-radius: 5px">登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vcode from "vue-puzzle-vcode";
export default {
  components: {
    Vcode,
  },
  data() {
    return {
      loginForm: {
        username: "17122415",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入学号或者工号", trigger: "blur" },
          {
            min: 3,
            max: 8,
            message: "学号或者工号长度为3 到 8 个 字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      checked: false,
      isShow: false,
    };
  },
  methods: {
    onSuccess(msg) {
      this.isShow = false;
      this.$axios.post('/login', this.loginForm).then(res => {
        const data = res.data.data
        this.$store.commit("setToken", res.headers["token"]);
        this.$store.commit("setUserInfo", data);
        this.$router.push('/selectProgress');
      }).catch(function (error) {
        console.log(error);
      })
    },
    vCodeclose() {
      this.isShow = false;
    },
    login() {
      this.isShow = true;
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        } else {
          this.isShow = true;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  text-align: center;
  line-height: 20px;
  font-size: 20px;
  margin-bottom: 20px;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 15px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>
