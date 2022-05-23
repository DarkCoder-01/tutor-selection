<template>
<div>
  <router-view></router-view>
</div>
</template>

<script>
import Notification from "./Notification";

export default {
  name: "NotificationNavagation",
  components: {
    Notification,
  }
}
</script>

<style scoped>

</style>
