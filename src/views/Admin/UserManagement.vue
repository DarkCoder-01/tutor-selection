<template>
  <div>
    <el-card class="card">
      <div>
        <el-upload
            drag
            ref="upload"
            :limit="limitNum"
            :auto-upload="false"
            accept=".xlsx,.xls"
            :action="UploadUrl()"
            :on-change="fileChange"
            :on-exceed="exceedFile"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="fileList"
            class="fileUpload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传xlsx或xls文件，且不超过5M</div>
        </el-upload>
        <br/>
        <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
        <el-button size="small">取消</el-button>
      </div>
      <div>
        <el-table
            :data="userList"
            style="width: 100%">
          <el-table-column
              prop="username"
              label="用户名"
              width="180">
          </el-table-column>
          <el-table-column
              prop="roleId"
              label="角色">
            <template slot-scope="scope">
              <el-tag>导师</el-tag>
<!--              <el-tag v-show="scope.roleId == 1">管理员</el-tag>-->
<!--              <el-tag v-show="scope.roleId == 2" type="info">导师</el-tag>-->
<!--              <el-tag v-show="scope.roleId == 3" type="success">学生</el-tag>-->
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="100">
            <template slot-scope="scope">
              <el-button type="plain" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            align="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userList.length"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data() {
    return {
      limitNum: 1,  // 上传excell时，同时允许上传的最大数
      fileList: [],   // excel文件列表
      userList: [],
      currentPage: 1,
      pageSize: 5,
    };
  },
  created() {

  },
  mounted() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$axios.post('/userList?currentPage=' + this.currentPage + '&pageSize=' + this.pageSize).then((res) => {
        this.userList = res.data.data;
      }).catch(function (error) {
        console.log(error);
      });
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserList()
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      this.fileList = []
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== 'xlsx' && extension !== 'xls') {
        this.$message.warning('请上传Excel文件（后缀为.xlsx或.xls）');
        return
      }
      if (size > 5) {
        this.$message.warning('文件大小不得超过5M');
        return
      }
      this.fileList.push(file.raw)
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success('文件上传成功');
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error('文件上传失败');
    },
    UploadUrl: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return ""
    },
    uploadFile() {
      if (this.fileList.length === 0) {
        this.$message.warning('请上传文件');
      } else {
        console.log(this.fileList)
        let form = new FormData();
        form.append('file', this.fileList);
        console.log(form)
        this.$refs.upload.submit();
        // this.$axios({
        //     headers: {
        //     'Content-Type': 'multipart/form-data'
        //     },
        //     url: '/user/batch',
        //     data: data,
        //     method: 'post'
        // }).then(res=>{
        //     console.log(res)
        // },err =>{
        //     console.log(err)
        // })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  text-align: center;
  padding: 0;
}

.el-upload .el-upload-dragger {
  width: 100%;
}
</style>

<style>
.el-card {
   margin-top: 0;
}
</style>
