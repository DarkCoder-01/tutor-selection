<template>
  <div>
    <el-card>
      <div slot="header" class="card_title">
        匹配情况
        <el-button class="el-icon-download" style="float: right; margin-bottom: 2em" size="mini" @click="handleExport">导出匹配表</el-button>
      </div>
      <el-table
          ref="table"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="
          matchInfo.filter((data) =>
                !search ||
                data.studentId.toString().includes(search) ||
                data.studentName.toLowerCase().includes(search.toLowerCase()) ||
                data.tutorId.toString().includes(search) ||
                data.tutorName.toLowerCase().includes(search.toLowerCase())
            ).slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
          tooltip-effect="dark"
          style="width: 100%"
          empty-text="暂无数据"
      >

        <el-table-column prop="studentId" label="学号" align="center" sortable></el-table-column>
        <el-table-column prop="studentName" label="姓名" align="center" sortable></el-table-column>
        <el-table-column prop="tutorId" label="导师号" align="center" min-width="75" sortable></el-table-column>
        <el-table-column prop="tutorName" label="导师姓名" align="center" sortable></el-table-column>
        <el-table-column prop="tutorConfirm" label="是否双向匹配" align="center" sortable>
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-connection" size="mini" v-show="scope.row.tutorConfirm">已双向匹配</el-button>
            <el-button type="info" icon="el-icon-warning" size="mini" v-show="!scope.row.tutorConfirm">未匹配成功</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" width="200">
          <template slot="header" slot-scope="scope">
            <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-button :disabled="scope.row.tutorConfirm"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
          :total="matchInfo.length"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="手动分配导师" :visible.sync="dialogFormVisible" center>
      <el-form :model="studentForm" label-width="150px" label="left">
        <el-form-item label="学号">
          <el-input v-model="studentForm.studentId" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="studentForm.studentName" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="导师号" >
          <el-select v-model="studentForm.tutorId" filterable placeholder="请选择分配的导师">
            <el-option
                v-for="item in options"
                :key="item.tutorId"
                :label="item.tutorId"
                :value="item.tutorId">
            </el-option>
          </el-select>
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
      matchInfo: [],
      currentPage: 1,
      pageSize: 5,
      search: '',
      dialogFormVisible: false,
      studentForm: {},
      options: [],
    }
  },
  methods: {
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleExport(val) {
      console.log(val);
    },
    handleEdit(index, row) {
      this.studentForm = row;
      this.dialogFormVisible = true;
    },
    handleConfirmEdit() {
      let submitForm = {
        studentId: this.studentForm.studentId,
        volunteerTutor: this.studentForm.tutorId
      }
      this.$axios.post('/volunteer/matchByAdmin', submitForm).then(res => {
        this.$message({
          type: "info",
          message: "手动匹配成功！",
        });
        this.reload();
      }).catch(function (error) {
        console.log(error);
      });
    },
  },
  mounted() {
    //获取匹配列表
    this.$axios.get('/volunteer/matchInfo').then(res => {
      this.matchInfo = res.data.data;
      this.loading = false;
    }).catch(function (error) {
      console.log(error);
    });
    //获取还有空余容量的导师号，姓名
    this.$axios.get('/tutor/left').then(res => {
      this.options = res.data.data;
    }).catch(function (error) {
      console.log(error);
    });
  },
}
</script>

<style lang="scss" scoped>
.card_title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
