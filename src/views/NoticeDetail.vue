<template>
<div>
  <el-card>
    <div slot="header">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/notification' }">通知列表</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="notice_body">
      <h1>{{ notice.title }}</h1>
      <p>{{ notice.content }}</p>
      <p class="footer">
        <a>发布者：{{ notice.author }}</a>
        <a style="float: right">发布时间：{{ notice.createTime }}</a>
      </p>
    </div>
  </el-card>
</div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      notice: {}
    }
  },
  mounted() {
    this.$axios.get('/notice/detail?id='+this.$route.params.id).then(res => {
      this.notice = res.data.data;
    }).catch(function (error) {
      console.log(error);
    });
  }
}
</script>

<style lang="scss" scoped>
.notice_body {
  h1 {
    text-align: center;
    font-size: 22px;
    margin-bottom: 15px;
  }
  p {
    font-size: 15px;
    line-height: 25px;
  }

  .footer {
    margin-top: 15px;
    a {
      font-size: 17px;
    }
  }
}
</style>
