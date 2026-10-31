<template>
  <div class="forum">
    <header class="f-head">
      <div class="f-logo">暮色论坛 · 都市怪谈讨论区</div>
      <div class="f-user">
        <span class="f-dim">游客</span>
      </div>
    </header>

    <div class="f-banner">
      <!-- 2018年的置顶广告：点击永远404 -->
      <router-link
        to="/2018-ad"
        class="ad-link"
      >
        <ShiningSun :size="56" />
        <div class="ad-text">
          <b>余晖乐园 · 2018盛大开园</b>
          <span>家庭套票优惠中 → 让笑容照亮每一天</span>
        </div>
      </router-link>
    </div>

    <div class="f-stats">
      今日新帖 <b class="stat-red">1</b> · 总帖数 3847 · 在线 12 人 · 数据归档于 2019-08-11
    </div>

    <div class="f-sort">
      <span
        :class="['sort-tab', { active: sortMode === 'reply' }]"
        @click="sortMode = 'reply'"
      >按回复数</span>
      <span
        :class="['sort-tab', { active: sortMode === 'time' }]"
        @click="sortMode = 'time'"
      >按发布时间</span>
    </div>

    <table class="f-table">
      <thead>
        <tr>
          <th class="col-topic">主题</th>
          <th class="col-author">作者</th>
          <th class="col-reply">回复</th>
          <th class="col-last">发布时间</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="t in sortedThreads"
          :key="t.slug"
          class="row-old row-click"
          @click="$router.push(`/forum/thread/${t.slug}`)"
        >
          <td class="col-topic">
            <span
              class="tag"
              :class="t.tagClass"
            >{{ t.tag }}</span> {{ t.title }}
          </td>
          <td class="col-author">{{ t.author }}</td>
          <td class="col-reply">{{ t.replies }}</td>
          <td class="col-last">{{ t.last }}</td>
        </tr>
      </tbody>
    </table>

    <div class="f-pages">‹ 上一页 · 1 2 3 … 214 · 下一页 ›</div>

    <footer class="f-foot">
      本论坛已于 2019-08-11 停止运营 · 数据只读归档
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ShiningSun from '../components/ShiningSun.vue'

const sortMode = ref('reply')

const threads = [
  { slug: 'shutdown', tag: '公告', tagClass: 'tag-notice', title: '本论坛即将停止运营，感谢各位八年陪伴', author: '管理员', replies: 12, last: '2019-08-11' },
  { slug: 'sunset-park-close', tag: '讨论', title: '日落乐园当年为什么关门？有人知道内幕吗', author: '旧客', replies: 47, last: '2019-08-11' },
  { slug: 'marble-sound', tag: '怪谈', title: '半夜听到楼上传来弹珠声，科学解释是什么', author: '夜半钟声', replies: 23, last: '2019-07-30' },
  { slug: 'found-tapes', tag: '求助', title: '租房里发现前租客留的一箱磁带，能听吗', author: '搬家中', replies: 9, last: '2019-07-22' },
  { slug: 'recurring-dream', tag: '怪谈', title: '你们有没有做过重复的梦？连续一周同一个场景', author: '梦游中', replies: 31, last: '2019-07-15' },
  { slug: 'missing-cousin', tag: '求助', title: '寻人：表哥说去邻市出差，失联快三个月了', author: '风往北吹', replies: 14, last: '2019-07-08' },
  { slug: 'konbini-oden', tag: '闲聊', title: '凌晨三点便利店的关东煮，为什么总是刚煮的', author: '夜班出租车司机', replies: 15, last: '2019-06-28' },
  { slug: 'lost-cartoon', tag: '求助', title: '小时候电视上那个动画片，怎么全网都搜不到了', author: '旧时光', replies: 27, last: '2019-06-19' },
  { slug: 'carousel-music', tag: '游记', title: '带娃去了余晖乐园，旋转木马的音乐有点瘆人', author: '糖果妈妈', replies: 33, last: '2019-06-02' },
  { slug: 'delivery-guy', tag: '怪谈', title: '深夜外卖员说我家楼道里站着人，可我家没人', author: '一个人住', replies: 41, last: '2019-05-30' },
  { slug: 'park-staff', tag: '闲聊', title: '有人注意到乐园员工都不怎么笑吗', author: '夜行者', replies: 21, last: '2019-05-17' },
  { slug: 'mandela-effect', tag: '讨论', title: '大家有没有记忆和现实对不上的经历', author: '庄周', replies: 56, last: '2019-05-12' },
  { slug: 'cat-corner', tag: '闲聊', title: '猫为什么总盯着墙角看', author: '有猫人士', replies: 38, last: '2019-04-26' },
  { slug: 'subway-cry', tag: '树洞', title: '连续加班一个月，今天在地铁上哭了', author: '匿名', replies: 64, last: '2019-04-18' },
  { slug: 'missing-mom', tag: '求助', title: '寻人：妈妈去余晖乐园后失联了，求7月19日当天的游客', author: '等妈妈回家', replies: 9, last: '2019-08-02' },
  { slug: 'old-house', tag: '树洞', title: '老房子拆掉的最后一天，我回去看了一眼', author: '城南旧事', replies: 18, last: '2019-03-22' },
  { slug: 'park-salary', tag: '求证', title: '余晖乐园招聘启事里的薪资是真的假的', author: '打工魂', replies: 8, last: '2019-03-04' },
  { slug: 'mom-call', tag: '怪谈', title: '凌晨接到妈妈的电话，可妈妈三年前就去世了', author: '不想长大', replies: 52, last: '2019-02-14' },
  { slug: 'live-alone', tag: '讨论', title: '独居的女孩子一定要看这个（经验分享）', author: '平安是福', replies: 73, last: '2019-01-30' },
  { slug: 'elevator-mirror', tag: '怪谈', title: '电梯里的镜子，总觉得照出来的不是自己', author: '镜子里的我', replies: 19, last: '2018-12-15' },
  { slug: 'mascot-nightmare', tag: '讨论', title: '余晖乐园那个太阳吉祥物，我家小孩看了做噩梦', author: '奶爸日记', replies: 6, last: '2018-12-03' },
  { slug: 'red-raincoat', tag: '考据', title: '本市到底有没有发生过"红雨衣"事件', author: '考据癖', replies: 44, last: '2018-11-02' },
  { slug: 'elevator-button', tag: '求助', title: '新搬的小区，电梯按钮总有一层按不亮', author: '新住户', replies: 11, last: '2018-09-27' },
  { slug: 'bookstore-24h', tag: '闲聊', title: '有人记得城南那家24小时书店吗', author: '夜读者', replies: 26, last: '2018-08-14' }
]

// E-09的帖子混进普通数据里：按回复数排序时0回复沉底，按发布时间排序时2024年置顶
const allThreads = [
  ...threads,
  { slug: 'e09', tag: '怪谈', title: '余晖乐园的旋转木马下面，有人在尖叫', author: 'E-09', replies: 0, last: '2024-10-15' }
]

const sortedThreads = computed(() => {
  const list = [...allThreads]
  if (sortMode.value === 'reply') {
    // 回复数降序，同数按时间新→旧
    list.sort((a, b) => b.replies - a.replies || b.last.localeCompare(a.last))
  } else {
    // 发布时间新→旧
    list.sort((a, b) => b.last.localeCompare(a.last))
  }
  return list
})
</script>

<style scoped>
.forum {
  max-width: 860px;
  margin: 0 auto;
  padding: 20px 16px 60px;
  font-family: "SimSun", "Songti SC", serif;
}
.f-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--border);
  padding-bottom: 10px;
}
.f-logo {
  font-size: 20px;
  font-weight: bold;
  color: var(--accent);
}
.f-user {
  font-size: 13px;
}
.f-dim {
  color: #888;
}

.f-banner {
  margin: 14px 0;
}
.ad-link {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 12px 16px;
  text-decoration: none;
  color: var(--text);
}
.ad-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ad-text b {
  font-size: 16px;
  color: #e67e22;
}
.ad-text span {
  font-size: 13px;
  color: #666;
}

.f-stats {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  padding-left: 4px;
}
.stat-red {
  color: #c62828;
}

.f-sort {
  display: flex;
  gap: 0;
  margin-bottom: 6px;
  padding-left: 4px;
  font-size: 12px;
}
.sort-tab {
  padding: 3px 12px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: #999;
  cursor: pointer;
}
.sort-tab:first-child {
  border-radius: 3px 0 0 3px;
}
.sort-tab:last-child {
  border-radius: 0 3px 3px 0;
  border-left: none;
}
.sort-tab.active {
  background: #eae6d8;
  color: #6a5f4a;
  font-weight: bold;
}

.f-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--panel);
  font-size: 14px;
}
.f-table th {
  background: #eae6d8;
  text-align: left;
  padding: 8px 10px;
  border-bottom: 2px solid var(--border);
  font-weight: normal;
  color: #666;
}
.f-table td {
  padding: 9px 10px;
  border-bottom: 1px solid var(--border);
}
.col-topic {
  width: 52%;
}
.col-author {
  width: 14%;
}
.col-reply {
  width: 10%;
}
.col-last {
  width: 24%;
}
.tag {
  display: inline-block;
  font-size: 11px;
  background: #9a8f7a;
  color: #fff;
  padding: 1px 6px;
  border-radius: 2px;
  margin-right: 6px;
}
.tag-notice {
  background: #8a2be2;
}

.row-old {
  color: #777;
}
.row-click {
  cursor: pointer;
}
.row-click:hover {
  background: #f2eee2;
}

.f-pages {
  margin-top: 12px;
  text-align: center;
  font-size: 12px;
  color: #aaa;
  letter-spacing: 1px;
}

.f-foot {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
