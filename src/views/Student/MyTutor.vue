<template>
  <div>
    <el-card v-for="(item, index) in tutorList">
      <el-descriptions class="margin-top" title="我的导师" :column="2" border>
        <template slot="extra">
          <el-button type="text" class="el-icon-connection">已双向绑定</el-button>
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
    </el-card>

    <el-card v-show="tutorList.length == 0" style="min-height: 70vh">
      <el-result icon="info" title="信息提示" subTitle="没有匹配导师" style="margin-top: 70px">
      </el-result>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tutorList: [],
    };
  },
  methods: {

  },
  mounted: function() {
    this.$axios.get('/myTutor?studentId=' + this.$store.state.userInfo.username).then(res => {
      if(res.data.data.length > 0) {
        this.tutorList = res.data.data;
      }
    });
  },
};
</script>

<style>

</style>
