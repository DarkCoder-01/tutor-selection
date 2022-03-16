<template>
  <div>
    <el-card class="space_content">
      <div class="space_title">学生个人信息</div>
      <div class="space_form">
        <el-form
          ref="userForm"
          :model="userForm"
          :rules="rules"
          label-width="auto"
          hide-required-asterisk
          :disabled="currentStage > 1"
        >
          <el-form-item label="学号" prop="studentNo">
            <el-input v-model="userForm.studentId" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="userForm.name"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="userForm.sex" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-input v-model="userForm.major" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="userForm.mail"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="个人简介" prop="personalDescription">
            <el-input
              type="textarea"
              v-model="userForm.personalDescription"
              maxlength="200"
              :autosize="{ minRows: 3, maxRows: 7 }"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="专业特长" prop="specialty">
            <el-input
              type="textarea"
              v-model="userForm.specialty"
              :autosize="{ minRows: 3, maxRows: 7 }"
              maxlength="200"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="导师期望" prop="tutorExpectation">
            <el-input
              type="textarea"
              v-model="userForm.tutorExpectation"
              :autosize="{ minRows: 3, maxRows: 7 }"
              maxlength="200"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%; margin-top: 20px" type="primary" @click="submitForm('userForm')">确认修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userForm: {},
      rules: {
        phone: [{ required: true, validator: this.phoneReg, trigger: "blur" }],
        mail: [{ required: true, validator: this.emailReg, trigger: "blur" }],
      },
      currentStage: 0,
    };
  },
  mounted: function() {
    this.$axios.get('/activity/current').then(res => {
      const data = res.data.data;
      if(data.length > 0) {
        this.currentStage = data[0].type;
        console.log(this.currentStage);
      }
    }).catch(function (error) {
      console.log(error);
    });
    this.$axios.get("/studentInfo?studentId=" + this.$store.state.userInfo.username).then(res => {
      this.userForm = res.data.data
    })
  },
  methods: {
    phoneReg(rule, value, callback) {
      const reg =
        /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
      if (value == null || String(value).trim() === "") {
        return callback(new Error("不能为空"));
      } else if (!reg.test(value)) {
        return callback(new Error("请输入正确的手机号码！"));
      } else {
        return callback();
      }
    },
    emailReg(rule, value, callback) {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (value == null || String(value).trim() === "") {
        return callback(new Error("不能为空，最终结果将通过邮箱发送！"));
      } else if (!reg.test(value)) {
        return callback(
          new Error("邮箱格式不正确，请仔细填写，最终结果将通过邮箱发送！")
        );
      } else {
        return callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确定修改个人信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              if(this.currentStage > 1) {
                this.$message({
                  type: "info",
                  message: "已经过了信息确认阶段！如果信息仍有错误，请联系管理员修改！",
                });
                return
              }
              this.$axios.post('/studentInfo/edit', this.userForm).then(res => {
                const data = res.data.data;
                this.$store.commit("next")
              }).catch(function (error) {
                console.log(error);
              })
              this.$message({
                type: "info",
                message: "修改成功！",
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消修改！",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.space_content {
  .space_title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 0.3em;
    color: #2a3f54;
    margin-top: 0.1em;
    margin-bottom: 1em;
  }
  .space_form {
    width: 50%;
    margin: 0 auto;
    .el-form-item {
      &:last-child {
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
@import "../../assets/scss/color";
.space_content {
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: $color_dark;
  }
  .el-select {
    width: 100%;
  }
}
</style>
