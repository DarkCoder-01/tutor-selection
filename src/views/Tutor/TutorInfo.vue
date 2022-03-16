<template>
  <div>

    <el-card class="space_content">
      <div class="space_title">导师个人信息</div>
      <div class="space_form">
        <el-form
          ref="userForm"
          :model="userForm"
          :rules="rules"
          label-width="auto"
          hide-required-asterisk
          :disabled="currentStage > 1"
        >
          <el-form-item label="导师号" prop="tutorId">
            <el-input v-model="userForm.tutorId" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userForm.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职称" prop="title">
            <el-select v-model="userForm.title" placeholder="请选择职称">
              <el-option label="教授" value="教授"></el-option>
              <el-option label="副教授" value="副教授"></el-option>
              <el-option label="讲师" value="讲师"></el-option>
              <el-option label="助教" value="助教"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="研究方向" prop="research_direction">
            <el-input v-model="userForm.researchDirection"></el-input>
          </el-form-item>
          <el-form-item label="最大预带数" prop="studentMax">
            <el-input-number
              v-model="userForm.studentMax"
              :min="1"
              :max="5"
              label="最大预带数"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="办公室" prop="office">
            <el-input v-model="userForm.office"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="userForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="userForm.mail"></el-input>
          </el-form-item>
          <el-form-item label="个人简介" prop="personalDescription">
            <el-input
              type="textarea"
              v-model="userForm.personalDescription"
              maxlength="200"
              :autosize="{ minRows: 4, maxRows: 7 }"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="研究成果" prop="researchResult">
            <el-input
              type="textarea"
              v-model="userForm.researchResult"
              :autosize="{ minRows: 4, maxRows: 7 }"
              maxlength="200"
              show-word-limit
            >
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('userForm')" style="width: 100%">确认修改</el-button>
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
    this.$axios.get("/tutorInfo?tutorId=" + this.$store.state.userInfo.username).then(res => {
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
              this.$axios.post('/tutorInfo/edit', this.userForm).then(res => {
                const data = res.data.data;
                this.$store.commit("next")
              }).catch(function (error) {
                console.log(error);
              })
              this.$message({
                type: "info",
                message: "修改成功!",
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
