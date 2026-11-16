<template>
  <div v-if="store.alert" class="modal-mask" @click.self="store.closeAlert()">
    <div class="email-card">
      <div class="email-head">
        <div><b>发件人：</b>{{ store.alert.from }}</div>
        <div><b>标题：</b>{{ store.alert.subject }}</div>
        <div><b>时间：</b>{{ store.alert.time }}</div>
      </div>
      <hr />
      <pre class="email-body">{{ store.alert.body }}</pre>

      <template v-if="store.alert.replyable">
        <div v-if="!replying" class="email-foot">
          <button class="ghost" @click="replying = true">回复</button>
          <button @click="store.closeAlert()">关闭</button>
        </div>
        <div v-else class="reply-box">
          <textarea v-model="text" rows="3" placeholder=""></textarea>
          <div class="email-foot">
            <span v-if="err" class="err">{{ err }}</span>
            <button class="ghost" @click="cancel">取消</button>
            <button @click="send">发送</button>
          </div>
        </div>
      </template>
      <div v-else class="email-foot">
        <button @click="store.closeAlert()">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
const store = useGameStore()

const replying = ref(false)
const text = ref('')
const err = ref('')

function cancel () {
  replying.value = false
  text.value = ''
  err.value = ''
}

function send () {
  if (!text.value.trim()) {
    err.value = '写点什么。'
    return
  }
  const to = store.alert.addr || 'ceo@ceres-reynold.com'
  const subject = store.alert.subject || ''
  store.sendMail({
    to,
    subject: /^re:/i.test(subject) ? subject : 'Re: ' + subject,
    body: text.value
  })
  cancel()
}
</script>

<style scoped>
.modal-mask {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(0, 0, 0, 0.55);
  display: flex; align-items: center; justify-content: center;
}
.email-card {
  width: 480px; max-width: 92vw;
  background: #f7f7f7; color: #222;
  border-radius: 6px; padding: 18px 22px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}
.email-head { font-size: 13px; line-height: 1.9; color: #444; }
.email-head b { color: #111; }
hr { border: none; border-top: 1px solid #ddd; margin: 10px 0; }
.email-body {
  font-family: inherit; white-space: pre-wrap;
  font-size: 14px; line-height: 1.8; margin: 0;
  color: #333;
}
.email-foot { text-align: right; margin-top: 14px; }
.email-foot button {
  background: #37474f; color: #fff; border: none;
  padding: 7px 22px; border-radius: 4px; cursor: pointer; font-size: 13px;
  margin-left: 8px;
}
.email-foot button:hover { background: #455a64; }
.email-foot button.ghost {
  background: transparent; color: #455a64;
  border: 1px solid #c6ccd2;
}
.email-foot button.ghost:hover { background: #eef1f4; }
.reply-box textarea {
  width: 100%; box-sizing: border-box; margin-top: 8px;
  padding: 8px 10px; border: 1px solid #ccc; border-radius: 4px;
  font-family: inherit; font-size: 13.5px; line-height: 1.7;
  color: #333; resize: vertical;
}
.reply-box textarea:focus { outline: none; border-color: #8fa6b8; }
.err { float: left; font-size: 12px; color: #b4534b; line-height: 32px; }
</style>
