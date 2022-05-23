<template>
  <div>
    <el-card>
      <div slot="header" class="card_title">
        学生列表
        <el-button class="el-icon-circle-plus-outline" style="float: right; margin-bottom: 2em" @click="handleAdd">添加学生</el-button>
      </div>
      <el-table
          ref="table"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="
          studentList.filter((data) =>
                !search ||
                data.studentId.toString().toLowerCase().includes(search.toLowerCase()) ||
                data.name.toLowerCase().includes(search.toLowerCase())
            ).slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
          tooltip-effect="dark"
          style="width: 100%"
          empty-text="暂无数据"
      >

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="邮箱">
                <span>{{ props.row.mail }}</span>
              </el-form-item>
              <el-form-item label="电话">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="个人简介">
                <span>{{ props.row.personalDescription }}</span>
              </el-form-item>
              <el-form-item label="专业特长">
                <span>{{ props.row.specialty }}</span>
              </el-form-item>
              <el-form-item label="导师期望">
                <span>{{ props.row.tutorExpectation }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column prop="studentId" label="学号" align="center" sortable></el-table-column>
        <el-table-column prop="name" align="center" label="姓名" sortable></el-table-column>
        <el-table-column label="性别" align="center" prop="sex" min-width="75" sortable>
          <template slot-scope="scope">
            <i :class="scope.row.sex == '男' ? 'el-icon-male' : 'el-icon-female'" style="color: #409eff; font-size: 15px; font-weight: bold">
              {{ scope.row.sex }}
            </i>
          </template>
        </el-table-column>
        <el-table-column prop="major" align="center" label="专业" sortable></el-table-column>

        <el-table-column fixed="right" align="center" width="200">
          <template slot="header" slot-scope="scope">
            <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-popconfirm title="是否确定删除此学生？" @confirm="handleConfirmDelete(scope.$index, scope.row)" style="margin-left: 5px">
              <el-button
                  size="mini"
                  type="danger"
                  slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="studentList.length"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="学生信息" :visible.sync="dialogFormVisible" center>
      <el-form :model="studentForm" label-width="80px" label="left">
        <el-form-item label="学号">
          <el-input v-model="studentForm.studentId"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="studentForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="studentForm.major" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="studentForm.sex" placeholder="请选择活动区域">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="studentForm.mail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="studentForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input type="textarea" v-model="studentForm.personalDescription" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="特长">
          <el-input type="textarea" v-model="studentForm.specialty" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="导师期望">
          <el-input type="textarea" v-model="studentForm.tutorExpectation" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data() {
    return {
      loading: true,
      studentList: [],
      currentPage: 1,
      pageSize: 5,
      search: "",
      studentForm: {},
      formLabelWidth: 60,
      dialogFormVisible: false
    };
  },
  mounted() {
    this.$axios.get('/student/list?currentPage=' + this.currentPage + '&pageSize=' + this.pageSize).then(res => {
      this.studentList = res.data.data.records;
      this.loading = false;
    }).catch(function (error) {
      console.log(error);
    });
  },
  methods: {
    handleSizeChange(pageSize) {
      this.currentPage = 1;
      this.pageSize = pageSize;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    handleEdit(index, row) {
      this.studentForm = row;
      this.dialogFormVisible = true;
    },
    handleConfirmDelete(index, row) {
      this.studentForm = row;
      this.$axios.get('/student/delete?studentId=' + row.studentId).then(res => {
        this.$message({
          type: "info",
          message: "删除成功！",
        });
        this.reload();
      }).catch(function (error) {
        console.log(error);
      });
    },
    handleConfirmEdit() {
      this.$axios.post('/student/edit', this.studentForm).then(res => {
        this.$message({
          type: "info",
          message: "编辑成功！",
        });
        this.reload();
      }).catch(function (error) {
        console.log(error);
      });
    },
    handleAdd() {
      this.dialogFormVisible = true;
    }
  },
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 120px;
  width: 100%;
}
</style>

<style scoped lang="scss">
.el-card {
  .card_title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
  .el-pagination {
    height: 30px;
    margin-top: 1em;
  }
}

.el-dialog {
  border-radius: 20px;
}
</style>
