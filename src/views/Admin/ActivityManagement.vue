<template>
  <div>
    <el-card class="son_active">
      <div slot="header" class="active_title">活动管理</div>
      <el-form
          :model="activityForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="name" required>
          <el-input v-model="activityForm.name" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="name" required>
          <el-select v-model="activityForm.type" placeholder="请选择活动类型">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-form-item prop="startDate">
            <el-date-picker
                type="datetime"
                placeholder="选择开始时间"
                v-model="activityForm.startTime"
                style="width: 100%"
                value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-form-item prop="endDate">
            <el-date-picker
                type="datetime"
                placeholder="选择结束时间"
                v-model="activityForm.endTime"
                style="width: 100%"
                value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item class="btn_group">
          <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%">立即创建</el-button>
        </el-form-item>
      </el-form>

      <el-table
          :data="activityList"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="活动名称" width="200">
        </el-table-column>
        <el-table-column prop="type" label="活动类型">
          <template slot-scope="scope">
            <i>
              {{ scope.row.typeName }}
            </i>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间">
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-switch
                @change="handleEnableChange(scope.row)"
                v-model="scope.row.enable"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="编辑">
          <template slot-scope="scope">
            <el-popconfirm title="是否确定删除活动？" @confirm="confirmDelete(scope.row)">
              <el-button slot="reference" type="plain" size="small">删除</el-button>
            </el-popconfirm>
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
      options: [{
        value: 1,
        label: '信息确认'
      }, {
        value: 2,
        label: '第一轮学生选导师'
      }, {
        value: 3,
        label: '第一轮导师选学生'
      }, {
        value: 4,
        label: '第二轮学生选导师'
      }, {
        value: 5,
        label: '第二轮导师选学生'
      },{
        value: 6,
        label: '协调阶段'
      }],
      activityList: [],
      activityForm: {
        name: "",
        type: "",
        startTime: "",
        endTime: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "请选择活动类型", trigger: "blur" },
        ],
        startTime: [
          {
            type: "datetime",
            required: true,
            message: "请选择开始时间",
            trigger: "change",
          },
        ],
        endTime: [
          {
            type: "datetime",
            required: true,
            message: "请选择结束时间",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.activityForm);
          if (this.activityForm.startTime > this.activityForm.endTime) {
            this.$message.warning("结束时间小于开始时间，请重新选择");
            return;
          } else {
            console.log(this.activityForm);
            this.$axios.post('/activity/add', this.activityForm).then(res => {
              console.log(res);
              this.reload();
            }).catch(function (error) {
              console.log(error);
            })
            this.$message.success("创建成功");
          }
        } else {
          return false;
        }
      });
    },
    confirmDelete(activity) {
      this.$axios.get('/activity/delete?id=' + activity.id).then(res => {
        this.reload();
        this.$message.success("删除成功");
      }).catch(function (error) {
        console.log(error);
      })
    },
    handleEnableChange(activity) {
      this.$axios.get('/activity/toggle?id=' + activity.id + '&enable=' + activity.enable).then(res => {
      }).catch(function (error) {
        console.log(error);
      })
    }
  },
  mounted() {
    this.$axios.get('/activity/list').then(res => {
      this.activityList = res.data.data;
      this.activityList.forEach((item) => {
        var typeName;
        switch (item.type) {
          case 1: typeName = "信息确认"; break;
          case 2: typeName = "第一轮学生选导师"; break;
          case 3: typeName = "第一轮导师选学生"; break;
          case 4: typeName = "第二轮学生选导师"; break;
          case 5: typeName = "第二轮导师选学生"; break;
          case 6: typeName = "协调阶段"; break;
        }
        item.typeName = typeName;
      })
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
  width: 400px;
}
.btn_group {
  margin: 0 auto;
}
</style>
<style lang="scss">
</style>
