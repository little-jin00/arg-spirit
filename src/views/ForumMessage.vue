<template>
  <div class="inbox">
    <header class="i-head">
      <router-link to="/forum/thread/e09" class="back">← 返回帖子</router-link>
      <span>私信 · 与 E-09 对话</span>
    </header>

    <div class="i-body">
      <div class="msg-meta">
        <b>发件人：</b>E-09<br />
        <b>时间：</b>2024-10-15 23:48:11
      </div>
      <div class="msg-text">
        你看到了。谢谢你看到了。
        <br /><br />
        我不能在帖子里放链接——系统会抓。但私信里可以。
        <br /><br />
        点击下面的链接。它会带你回到他们的网站。不是首页。是"里面"。
        <br /><br />
        <router-link to="/inside" class="target-link">
          https://ceres-reynold.com/inside/
        </router-link>
        <br /><br />
        找到旋转木马。找到Marcus。找到我。
      </div>
    </div>
  </div>
</template>

<script setup>
// 倒计时与证据归档已在帖子页（ForumThread）完成，此页仅承接跳转
</script>

<style scoped>
.inbox {
  max-width: 860px; margin: 0 auto; padding: 20px 16px 60px;
  font-family: "SimSun", "Songti SC", serif;
}
.i-head {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid var(--border); padding-bottom: 10px; font-size: 14px;
}
.back { font-size: 13px; color: var(--link); text-decoration: none; }

.i-body {
  margin-top: 16px; background: var(--panel);
  border: 1px solid var(--border); padding: 18px 22px;
}
.msg-meta { font-size: 12px; color: #777; line-height: 1.9; border-bottom: 1px dashed var(--border); padding-bottom: 10px; }
.msg-text { font-size: 15px; line-height: 2.1; margin-top: 14px; color: #333; }
.target-link {
  font-family: Consolas, monospace; font-size: 14px;
  color: var(--link); word-break: break-all;
}
</style>
