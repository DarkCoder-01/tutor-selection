<template>
  <div>
    <el-card>
      <div slot="header" class="card_title">
        匹配情况
        <el-button class="el-icon-circle-plus-outline" style="float: right; margin-bottom: 2em" @click="handleAdd">添加学生</el-button>
      </div>
      <el-table
          ref="table"
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
          :total="studentList.length"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      studentList: [],
      currentPage: 1,
      pageSize: 5,
      search: "",
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
