<template>
  <div>
    <el-card v-if="activityList.length > 0" class="res_content">
      <div class="block">
        <el-timeline>
          <el-timeline-item
              :size = "item.size"
              :timestamp="item.startTime"
              placement="top"
              v-for="(item, index) in activityList"
              :key="index"
              :color="item.color"
              :icon="item.icon"
          >
            <el-card class="res_content">
              <h4>{{ item.typeName }}</h4>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>

    <el-empty v-show="activityList.length <= 0" description="暂无活动"></el-empty>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activityList: [],
    };
  },
  mounted() {
    this.$axios.get('/activity/list').then(res => {
      this.activityList = res.data.data;
      console.log(this.activityList);
      var now = new Date().getTime();
      console.log(now);
      var flag = false;
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
        item.size = "normal"
        if(!item.enable && !flag) {
          item.icon = 'el-icon-circle-check';
        }
        if(item.enable) {
          flag = true;
          item.icon = 'el-icon-s-flag';
          item.size = "large";
        }
        item.typeName = typeName;
        item.color = '#3498db';
      })
    }).catch(function (error) {
      console.log(error);
    })
  },
};
</script>

<style scoped lang="scss">
.res_content {
  max-height: calc(80vh);
  overflow: auto;
}
.block {
  .el-card__body {
    h4 {
      font-size: 16px;
    }
    p {
      padding-top: 8px;
      font-size: 15px;
    }
  }
}
</style>
