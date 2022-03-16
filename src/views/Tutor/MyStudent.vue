<template>
  <div>
    <el-card class="post_card">
      <div class="card_title">
        <div class="title_content">我的学生</div>
      </div>
      <el-table
        :data="
          tableData
            .filter(
              (data) =>
                !search ||
                data.studentId.toString().toLowerCase().includes(search.toLowerCase()) ||
                data.name.toLowerCase().includes(search.toLowerCase())
            )
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        tooltip-effect="dark"
        style="width: 100%"
        @cell-click="handleCellClick"
        default-expand-all="true"
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
        <el-table-column prop="major" align="center" label="专业"></el-table-column>

        <el-table-column fixed="right" align="center" width="200">
          <template slot="header">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"
            />
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      search: "",
      currentPage: 1,
      pageSize: 5,
    };
  },
  mounted() {
    this.$axios.get('/studentListConfirmed?tutorId=' + this.$store.state.userInfo.username).then(res => {
      this.tableData = res.data.data;
      console.log(data)
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
    handleCellClick(item) {
      this.$refs.multipleTable.toggleRowExpansion(item);
    },
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
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<style scoped lang="scss">
@import "../../assets/scss/color";
.el-card {
  .card_title {
    display: flex;
    justify-content: space-between;
    letter-spacing: 0.3em;
    margin-top: 1em;
    margin-bottom: 0.2em;
    font-size: 20px;
    font-weight: bold;
    color: $color_dark;
    .title_content {
      margin: 0 auto;
    }
  }
  .el-tag {
    letter-spacing: 0;
  }
  .card_progress {
    width: 20%;
    margin: 0 auto;
    margin-bottom: 0.5em;
    font-size: 15px;
    .percentNum {
      float: left;
      margin-left: -3em;
      margin-top: -0.2em;
      color: #606266;
    }
  }
  .commitBtn {
    float: right;
    margin: 1em 0;
  }
  .el-pagination {
    height: 30px;
    margin-top: 1em;
  }
}
</style>
