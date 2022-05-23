<template>
  <div>
    <el-card>
      <div slot="header" class="card_title">
        导师列表
        <el-button class="el-icon-circle-plus-outline" style="float: right; margin-bottom: 2em" @click="handleAdd">添加导师</el-button>
      </div>
      <el-table
          ref="table"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="
          tutorList
            .filter(
              (data) =>
                !search ||
                data.tutorId.toString().includes(search.toLowerCase()) ||
                data.name.toLowerCase().includes(search.toLowerCase()) ||
                data.researchDirection.toLowerCase().includes(search.toLowerCase()) ||
                data.title.toLowerCase().includes(search.toLowerCase())
            )
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
          style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="邮箱">
                <span>{{ props.row.mail }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="办公室">
                <span>{{ props.row.office }}</span>
              </el-form-item>
              <el-form-item label="个人简介">
                <span>{{ props.row.personalDescription }}</span>
              </el-form-item>
              <el-form-item label="研究成果">
                <span>{{ props.row.researchResult }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="导师号" prop="tutorId" sortable></el-table-column>

        <el-table-column label="姓名" prop="name" sortable></el-table-column>

        <el-table-column label="职称" prop="title"  :filters="titleFilter" :filter-method="filterTitleHandler"></el-table-column>

        <el-table-column label="研究方向" prop="researchDirection"  :filters="researchDirectionFilter" :filter-method="filterResearchDirectionHandler"></el-table-column>

        <el-table-column label="已选学生/预带人数" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.currentChoose >= scope.row.studentMax ? 'danger' : 'plain'">
              {{ scope.row.currentChoose }} / {{ scope.row.studentMax }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" align="center" width="200">
          <template slot="header">
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
          :total="tutorList.length"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="导师信息" :visible.sync="dialogFormVisible" center>
      <el-form :model="tutorForm" label-width="80px" label="left">
        <el-form-item label="导师号" prop="tutorId">
          <el-input v-model="tutorForm.tutorId"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="tutorForm.name"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-select v-model="tutorForm.title" placeholder="请选择职称">
            <el-option label="教授" value="教授"></el-option>
            <el-option label="副教授" value="副教授"></el-option>
            <el-option label="讲师" value="讲师"></el-option>
            <el-option label="助教" value="助教"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="研究方向" prop="research_direction">
          <el-input v-model="tutorForm.researchDirection"></el-input>
        </el-form-item>
        <el-form-item label="最大预带数" prop="studentMax">
          <el-input-number
              v-model="tutorForm.studentMax"
              :min="1"
              :max="5"
              label="最大预带数"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="办公室" prop="office">
          <el-input v-model="tutorForm.office"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="tutorForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="tutorForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="个人简介" prop="personalDescription">
          <el-input
              type="textarea"
              v-model="tutorForm.personalDescription"
              maxlength="200"
              :autosize="{ minRows: 4, maxRows: 7 }"
              show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item label="研究成果" prop="researchResult">
          <el-input
              type="textarea"
              v-model="tutorForm.researchResult"
              :autosize="{ minRows: 4, maxRows: 7 }"
              maxlength="200"
              show-word-limit
          >
          </el-input>
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
      tutorList: [],
      currentPage: 1,
      pageSize: 5,
      search: "",
      tutorForm: {},
      formLabelWidth: 60,
      dialogFormVisible: false
    };
  },
  mounted() {
    this.$axios.get('/tutorList?currentPage=' + this.currentPage + '&pageSize=' + this.pageSize).then(res => {
      this.tutorList = res.data.data.records;
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
      this.$axios.get('/tutor/delete?tutorId=' + row.tutorId).then(res => {
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
      this.$axios.post('/tutor/edit', this.tutorForm).then(res => {
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
