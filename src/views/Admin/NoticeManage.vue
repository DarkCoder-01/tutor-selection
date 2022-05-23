<template>
  <div>
    <el-card>
      <div slot="header" class="active_title">通知管理</div>
      <div class="create-notice">
        <el-form
            :model="noticeForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
        >
          <el-form-item label="通知标题" prop="title" required>
            <el-input v-model="noticeForm.title" placeholder="通知标题"></el-input>
          </el-form-item>
          <el-form-item label="通知内容" prop="content" required>
            <el-input type="textarea" v-model="noticeForm.content" :rows="10"></el-input>
          </el-form-item>
          <el-form-item class="btn_group">
            <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%">立即发布</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
          :data="noticeList"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="title" label="标题" width="400">
        </el-table-column>
        <el-table-column prop="content" label="内容" width="400">
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" sortable>
        </el-table-column>
        <el-table-column label="操作" header-align="center">
          <template slot-scope="scope">
            <el-popconfirm title="是否确定删除此公告？" @confirm="confirmDelete(scope.row)">
              <el-button slot="reference" type="plain" size="small">删除</el-button>
            </el-popconfirm>
            <el-button type="primary" size="small" style="margin-left: 10px" @click="editNotice(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data() {
    return {
      noticeForm: {
        title: "",
        content: "",
        createTime: "",
        author: this.$store.state.userInfo.username
      },
      rules: {
        title: [
          { required: true, message: "请输入通知标题", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请输入通知内容", trigger: "blur" },
        ]
      },
      noticeList: [
        {
          title: "通知1",
          content: "通知1内容",
          createTime: new Date()
        }
      ]
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.noticeForm)
          this.$axios.post('/notice/add', this.noticeForm).then(res => {
            console.log(res);
            this.reload();
          }).catch(function (error) {
            console.log(error);
          })
          this.$message.success("发布成功");
        } else {
          return false;
        }
      });
    },
    confirmDelete(notice) {
      console.log(notice)
      this.$axios.get('/notice/delete?id=' + notice.id).then(res => {
        this.reload();
        this.$message.success("删除成功");
      }).catch(function (error) {
        console.log(error);
      })
    },
    editNotice(notice) {
      this.noticeForm.content = notice.content;
      this.noticeForm.title = notice.title;
      console.log(notice);
    }
  },
  mounted() {
    this.$axios.get('/notice/list').then(res => {
      this.noticeList = res.data.data;
    }).catch(function (error) {
      console.log(error);
    })
  },
};
</script>

<style scoped lang="scss">
.active_title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.demo-ruleForm {
  margin: 20px auto;
  width: 100%;
}

.btn_group {
  margin: 0 auto;
}
</style>

<style>
.el-table .cell {
  width:400px;
  word-break:keep-all;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
</style>
