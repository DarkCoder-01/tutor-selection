<template>
  <div class="choose_table_content">
    <el-card>
      <div slot="header" class="active_title" v-if="currentStage == 2">第一轮双选（期间你可以多次修改提交志愿）</div>
      <div slot="header" class="active_title" v-if="currentStage == 4">第二轮双选（期间你可以多次修改提交志愿）</div>
<!--      <div slot="header" class="active_title" v-if="currentStage != 2 && currentStage != 4">-->
<!--        <el-alert-->
<!--            title="选择导师通道未开启或已关闭！您仅可以查看导师信息，无法提交志愿！"-->
<!--            type="info"-->
<!--            show-icon-->
<!--            center-->
<!--            :closable="false"-->
<!--        >-->
<!--        </el-alert>-->
<!--      </div>-->
      <el-result icon="success" title="信息提示" subTitle="恭喜您双选匹配成功！" v-if="currentStage > 2 && myTutor.length == 1">

      </el-result>

      <el-descriptions title="已提交志愿导师" :column="3" border v-for="(item, index) in volunteerListSubmited" :key="index" v-show="currentStage > 1">
        <template slot="extra">
          <el-button type="text" icon="el-icon-connection" v-show="myTutor.length == 1">双向选择成功</el-button>
          <el-button type="text" icon="el-icon-warning" v-show="myTutor.length == 0">等待导师确认</el-button>
          <el-button type="danger" icon="el-icon-warning" v-show="myTutor.length == 0 && currentStage == 4">第一轮导师未接受</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-info"></i>
            导师号
          </template>
          {{ item.tutorId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ item.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-medal"></i>
            职称
          </template>
          {{ item.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            研究方向
          </template>
          <el-tag size="small">
            {{ item.researchDirection }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            办公室
          </template>
          {{ item.office }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            联系方式
          </template>
          {{ item.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-paperclip"></i>
            邮箱
          </template>
          {{ item.mail }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-comment"></i>
            个人简介
          </template>
          {{ item.personalDescription }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-collection-tag"></i>
            研究成果
          </template>
          {{ item.researchResult }}
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="当前选择导师" :column="3" border v-for="(item, index) in volunteerListCurrent" :key="index" v-show="currentStage == 2 || currentStage == 4" style="margin-top: 20px">
        <template slot="extra">
          <el-button type="primary" @click="submitVolunteer" icon="el-icon-s-promotion" v-show="currentStage == 2 || currentStage == 4">提交志愿</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-info"></i>
            导师号
          </template>
          {{ item.tutorId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ item.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-medal"></i>
            职称
          </template>
          {{ item.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            研究方向
          </template>
          <el-tag size="small">
            {{ item.researchDirection }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            办公室
          </template>
          {{ item.office }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            联系方式
          </template>
          {{ item.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-paperclip"></i>
            邮箱
          </template>
          {{ item.mail }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-comment"></i>
            个人简介
          </template>
          {{ item.personalDescription }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-collection-tag"></i>
            研究成果
          </template>
          {{ item.researchResult }}
        </el-descriptions-item>
      </el-descriptions>

      <el-table
          :row-key="getRowKeys"
          ref="singleTable"
          :data="
          tableData
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
          @selection-change="handleSelectionChange"
          @select-all="hangleSelectAll"
          @cell-click="handleCellClick"
          style="width: 100%"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
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

        <el-table-column prop="title" label="职称" :filters="titleFilter" :filter-method="filterTitleHandler"></el-table-column>

        <el-table-column prop="researchDirection" label="研究方向" :filters="researchDirectionFilter" :filter-method="filterResearchDirectionHandler"></el-table-column>

        <el-table-column label="已选学生/预带人数" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.currentChoose >= scope.row.studentMax ? 'danger' : 'plain'">
              {{ scope.row.currentChoose }} / {{ scope.row.studentMax }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column type="selection" :reserve-selection="true" :selectable="selectable" fixed></el-table-column>

        <el-table-column align="center">
          <template slot="header">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
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
          :total="tableData.length"
      >
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data() {
    return {
      tableData: [],
      titleList: [],
      titleFilterList: [],
      reasearchDirectionList: [],
      reasearchDirectionFilterList: [],
      search: "",
      loading: true,
      currentPage: 1,
      pageSize: 5,
      dialogFormVisible: false,
      currentActivity: null,
      currentStage: 0,
      volunteerListSubmited: [],
      volunteerListCurrent: [],
      myTutor: [],
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
    this.$axios.get('/myVolunteerTutor?studentId=' + this.$store.state.userInfo.username).then(res => {
      this.volunteerListSubmited = res.data.data;
    });
    this.$axios.get('/myTutor?studentId=' + this.$store.state.userInfo.username).then(res => {
      this.myTutor = res.data.data;
      console.log(res.data.data);
    });
    this.$axios.get('/tutorList?currentPage=' + this.currentPage + '&pageSize=' + this.pageSize).then(res => {
      const data = res.data.data;
      this.tableData = data.records;
      this.loading = false;
      this.tableData.forEach((item) => {
        if (this.titleList.indexOf(item.title) < 0) {
          this.titleList.push(item.title);
        }
        if (this.reasearchDirectionList.indexOf(item.researchDirection) < 0) {
          this.reasearchDirectionList.push(item.researchDirection);
        }
      });
    }).catch(function (error) {
      console.log(error);
    });
  },
  methods: {
    //仅有2，4阶段表格可选
    selectable() {
      if(this.currentStage == 2 || this.currentStage == 4) {
        if(this.myTutor.length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSelectionChange(selection) {
      if (selection.length > 1) {
        const del_row = selection.shift();
        this.$refs.singleTable.toggleRowSelection(del_row, false);
      }
      this.volunteerListCurrent = selection;
    },
    hangleSelectAll(selection) {
      // this.tutorList = selection[0];
    },
    handleCellClick(item) {
      this.$refs.singleTable.toggleRowExpansion(item);
    },
    filterTitleHandler(value, row) {
      return row.title === value;
    },
    filterResearchDirectionHandler(value, row) {
      return row.researchDirection === value;
    },
    getRowKeys(row) {
      return row.tutorId;
    },
    submitVolunteer() {
      this.$confirm("确定提交志愿?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          let chooseForm = {
            studentId: this.$store.state.userInfo.username,
            volunteerList: [],
          }
          chooseForm.volunteerList.push(this.volunteerListCurrent[0].tutorId)
          this.$axios.post('/volunteer/submit', chooseForm).then((res) => {
          }).catch(function (error) {
            console.log(error);
          });
          this.$message({
            type: "info",
            message: "提交成功！",
          });
          this.reload();
        }).catch(() => {
          this.$message({
            type: "info",
            message: "取消提交！",
          });
        });
    },
  },
  computed: {
    titleFilter() {
      this.titleList.forEach((item) => {
        this.titleFilterList.push({ text: item, value: item });
      });
      return this.titleFilterList;
    },
    researchDirectionFilter() {
      this.reasearchDirectionList.forEach((item) => {
        this.reasearchDirectionFilterList.push({ text: item, value: item });
      });
      return this.reasearchDirectionFilterList;
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
.choose_table_content {
  .active_title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  .el-table {
    margin: 0 auto;
    margin-top: 20px;
    .el-tag--plain,
    .el-tag.el-tag--danger {
      font-size: 10px;
    }
  }
  .table_title {
    display: flex;
    justify-content: space-between;
    letter-spacing: 0.3em;
    margin-top: 1em;
    font-size: 20px;
    font-weight: bold;
    color: #2A3F54;
    .el-tag {
      float: right;
      position: relative;
      letter-spacing: 0;
    }
    .title_content {
      padding-left: 5em;
    }
  }
  .btn_group {
    float: right;
    overflow: hidden;
    margin-bottom: 1em;
  }
  .el-pagination {
    height: 30px;
    margin-top: 1em;
  }
}
</style>
