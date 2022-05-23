<template>
  <div>
    <div class="left">
      <el-card>
        <el-table
            class="noticeTable"
            :data="noticeList"
            stripe
            style="width: 100%"
        >
          <el-table-column prop="noticeName" label="通知公告" width="700px">
            <template slot-scope="scope">
              <a :href="'/notification/'+scope.row.id" target="_self">{{ scope.row.title  }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="createTime">
            <template slot="header" class="moreClick">
              <div @click="moreClick" style="cursor: pointer">More >></div>
            </template>
          </el-table-column>
          <template slot="empty">
            <el-empty description="暂无公告"></el-empty>
          </template>
        </el-table>
      </el-card>
    </div>
    <div class="right">
      <div class="selectProgress">
        <el-card>
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
              {{ item.typeName }}
            </el-timeline-item>
          </el-timeline>

          <el-empty v-show="activityList.length <= 0" description="暂无活动"></el-empty>
        </el-card>
      </div>
      <div class="calendar_content">
        <el-card>
          <el-calendar v-model="nowDate">
          </el-calendar>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      noticeList: [],
      activityList: [],
      nowDate: new Date()
    };
  },
  created() {},
  mounted() {
    this.$axios.get('/notice/list').then(res => {
      this.noticeList = res.data.data;
      console.log(this.noticeList);
    }).catch(function (error) {
      console.log(error);
    });
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
  methods: {
    moreClick() {},
    asideRouter(ways) {
      this.$router.push({
        path: ways,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.left {
  width: 74%;
  height: 500px;
  float: left;
  margin-bottom: 20px;

}

.right {
  width: 25%;
  //border: 2px solid black;
  float: right;
  margin-bottom: 20px;
}

.calendar_content {
  margin-top: 15px;
}
</style>

<style>
.el-calendar__button-group {
  display: none;
}
.el-calendar-table .el-calendar-day {
  height: 30px;
}
.el-card {
  margin: 0;
  padding: 0;
}
</style>
