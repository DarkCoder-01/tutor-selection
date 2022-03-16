<template>
  <div>
    <el-card class="post_card" v-show="currentStage > 1">
      <div class="card_title" slot="header">
        学生列表
        <div class="percentNum">
          当前已选：{{ multipleSelection.length }} / 剩余容量：{{ surplus }}
        </div>
        <div class="card_progress">
          <el-progress
              :percentage="percent"
              :format="format"
              :color="customColors"
          ></el-progress>
        </div>
      </div>
      <el-table
        ref="multipleTable"
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
        :row-key="getRowKeys"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @cell-click="handleCellClick"
        empty-text="当前还没有学生选择您！"
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
        <el-table-column
            :reserve-selection="true"
            align="center"
            type="selection"
            width="30"
            :selectable="selectable"
        >
        </el-table-column>
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
      <el-button type="primary" class="commitBtn" @click="confirm" v-show="currentStage > 2">确认提交</el-button>
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

    <el-card v-show="currentStage == 1" style="min-height: 70vh">
      <el-result icon="info" title="信息提示" subTitle="当前阶段为信息确认阶段，无法选择学生！" style="margin-top: 50px">
        <template slot="extra">
          <el-button type="primary" size="medium" @click="confirmInfo">去确认信息</el-button>
        </template>
      </el-result>
    </el-card>

  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      chooseForm: {
        tutorId: this.$store.state.userInfo.username,
        studentList: []
      },
      search: "",
      percent: 0,
      customColors: [
        { color: "#909399", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#6f7ad3", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#EE2C2C", percentage: 100 },
      ],
      surplus: 0,
      currentPage: 1,
      pageSize: 5,
      currentStage: 0,
    };
  },
  mounted() {
    this.$axios.get('/activity/current').then(res => {
      const data = res.data.data;
      if(data.length > 0) {
        this.currentStage = data[0].type;
        console.log(this.currentStage);
      }
    }).catch(function (error) {
      console.log(error);
    });
    this.$axios.get('/studentList?tutorId=' + this.$store.state.userInfo.username).then(res => {
      this.tableData = res.data.data;
    }).catch(function (error) {
      console.log(error);
    });
    this.$axios.get("/tutorInfo?tutorId=" + this.$store.state.userInfo.username).then(res => {
      this.surplus = res.data.data.studentMax - res.data.data.currentMatched;
    })
  },
  watch: {
    multipleSelection(newVal) {
      if (newVal.length == this.maxStudent) this.percent = 100;
      else this.percent = (newVal.length / this.surplus) * 100;
    },
  },
  methods: {
    handleSizeChange(pageSize) {
      this.currentPage = 1;
      this.pageSize = pageSize;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    handleSelectionChange(selection) {
      if (selection.length > this.surplus) {
        const del_row = selection.shift();
        this.$refs.multipleTable.toggleRowSelection(del_row, false);
      }
      this.multipleSelection = selection;
      this.chooseForm.studentList = [];
      selection.forEach((item) => {
        this.chooseForm.studentList.push(item.studentId);
      })
    },
    handleCellClick(item) {
      this.$refs.multipleTable.toggleRowExpansion(item);
    },
    selectable(row) {
      if(this.currentStage > 2) {
        return true;
      }else {
        return false;
      }
    },
    getRowKeys(row) {
      return row.studentId;
    },
    format(percentage) {
      return percentage === 100 ? "已满员" : `${percentage}%`;
    },
    confirm() {
      this.$confirm("确定提交选择列表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios.post('/volunteer/tutorConfirm', this.chooseForm)
        .then((res) => {
          this.$message({
            type: "info",
            message: "提交成功！",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
        this.reload();
      }).catch(() => {
        this.$message({
          type: "info",
          message: "取消提交！",
        });
      });
    },
    confirmInfo() {
      this.$router.push("/tutorInfo");
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
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<style scoped lang="scss">
.el-card {
  .card_title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    .percentNum {
      font-size: 15px;
      margin: 1em auto;
      color: #606266;
    }
    .card_progress {
      width: 30%;
      margin: 0 auto;
      margin-bottom: 0.5em;
      font-size: 15px;
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
