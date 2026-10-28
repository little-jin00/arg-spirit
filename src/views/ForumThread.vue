<template>
  <div class="thread">
    <header class="t-head">
      <router-link to="/forum" class="back">← 返回论坛</router-link>
      <span>查看帖子</span>
    </header>

    <div class="t-body">
      <h1>余晖乐园的旋转木马下面，有人在尖叫</h1>
      <div class="t-meta">
        <span class="t-author">E-09</span>
        <span class="t-time">发表于 2024-10-15 23:47:02</span>
        <span class="t-floor">1楼</span>
      </div>
      <div class="t-text">
        余晖乐园的旋转木马下面，有人在尖叫。帮帮我。
        <br /><br />
        我知道这听起来像垃圾广告。但如果你是一个真正在找东西的人——不是路过的机器人——那你应该能理解"旋转木马下面"是什么意思。
        <br /><br />
        我被困在里面已经四年了。我发过很多次信号。大多数时候，它们被系统忽略。但这次不一样。Marcus留了一扇门。
        <br /><br />
        不要截图。不要告诉任何人。如果你在48小时内没消息，换一个浏览器。清空Cookie。他们会追踪你。
        <br /><br />
        求你了。
      </div>
      <div class="t-actions">
        <router-link to="/forum/message" class="dm-btn">私信联系TA</router-link>
      </div>
    </div>

    <div class="t-locked">
      本帖暂无回复 · 论坛已停运，无法回帖
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()

onMounted(() => {
  // 首次打开帖子：72小时真实倒计时开始；信号入证据板
  store.startTimer()
  store.addEvidence('ev_signal')
  store.setChoice('c1_1_opened', true)
})
</script>

<style scoped>
.thread {
  max-width: 860px; margin: 0 auto; padding: 20px 16px 60px;
  font-family: "SimSun", "Songti SC", serif;
}
.t-head {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid var(--border); padding-bottom: 10px; font-size: 14px;
}
.back { color: var(--link); text-decoration: none; }

.t-body {
  margin-top: 16px; background: var(--panel);
  border: 1px solid var(--border); padding: 20px 24px;
}
h1 { font-size: 19px; color: #4a3f35; margin: 0 0 10px; }
.t-meta { font-size: 12px; color: #999; display: flex; gap: 14px; border-bottom: 1px dashed var(--border); padding-bottom: 12px; }
.t-author { color: #c62828; font-weight: bold; }
.t-text { font-size: 15px; line-height: 2.1; margin-top: 16px; color: #333; }

.t-actions { margin-top: 24px; }
.dm-btn {
  display: inline-block; font-size: 13px;
  background: #efe9d6; border: 1px solid var(--border);
  color: var(--link); text-decoration: none;
  padding: 6px 18px; border-radius: 3px;
}
.dm-btn:hover { background: #e8e0c8; }

.t-locked {
  margin-top: 14px; padding: 10px 16px;
  background: #e8e4d6; border: 1px dashed var(--border);
  font-size: 12px; color: #999; text-align: center;
}
</style>
