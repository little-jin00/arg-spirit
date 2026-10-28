<template>
  <div class="info-page">
    <div class="i-nav">
      <router-link
        to="/park"
        class="i-logo"
      >
        <ShiningSun :size="28" /> 余晖乐园
      </router-link>
      <div class="i-links">
        <router-link to="/park">首页</router-link>
        <router-link to="/news">新闻中心</router-link>
        <router-link to="/park/info/guide">游客指南</router-link>
        <router-link to="/park/info/transport">交通住宿</router-link>
      </div>
    </div>

    <div
      v-if="page"
      class="i-body"
    >
      <router-link
        to="/park"
        class="i-back"
      >← 返回首页</router-link>
      <h1>{{ page.title }}</h1>
      <p
        v-if="page.intro"
        class="i-intro"
      >
        {{ page.intro }}
      </p>

      <div
        v-for="(sec, i) in page.sections"
        :key="i"
        class="i-sec"
      >
        <h2>{{ sec.h }}</h2>
        <p
          v-for="(p, j) in sec.ps"
          :key="j"
        >
          {{ p }}
        </p>
        <ul v-if="sec.list">
          <li
            v-for="(li, k) in sec.list"
            :key="k"
          >
            {{ li }}
          </li>
        </ul>
        <table
          v-if="sec.table"
          class="i-table"
        >
          <thead>
            <tr>
              <th
                v-for="(th, k) in sec.table.head"
                :key="k"
              >
                {{ th }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, k) in sec.table.rows"
              :key="k"
            >
              <td
                v-for="(cell, m) in row"
                :key="m"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-else
      class="i-body"
    >
      <p>页面不存在。</p>
      <router-link to="/park">返回首页</router-link>
    </div>

    <footer class="i-foot">© 2018–2024 科赛雷诺科技 · 余晖乐园</footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ShiningSun from '../components/ShiningSun.vue'

const route = useRoute()

const PAGES = {
  guide: {
    title: '游客指南',
    intro: '为了让您和家人拥有安全愉快的游园体验，请仔细阅读以下入园须知。',
    sections: [
      {
        h: '入园须知',
        list: [
          '开放时间：每日 9:00 – 21:30（特殊活动日以官方公告为准）',
          '入园需出示有效门票或年卡，一人一票',
          '园区实行安全检查，请勿携带易燃易爆物品、管制刀具等危险品',
          '宠物谢绝入园（导盲犬等工作犬除外）',
          '园内部分区域为工作区，标有"员工通道""设备重地"的区域请勿进入'
        ]
      },
      {
        h: '便民服务',
        ps: ['游客服务中心位于正门入口右侧，提供以下服务：'],
        list: [
          '行李寄存：小件¥10/天，大件¥20/天',
          '轮椅、婴儿车免费租赁（押金¥200）',
          '母婴室：位于欢乐时光区、未来之光区',
          '医务点：游客服务中心一层，全天有医护人员值守',
          '失物招领：游园中如遗失物品，请至游客服务中心登记查询；我们同时提供线上认领登记'
        ]
      },
      {
        h: '游园建议',
        list: [
          '节假日客流较大，建议开园后尽早入园',
          '热门设施"雷霆山"建议使用快速通行手环',
          '"梦境穹顶"为预约制，每日名额有限，建议优先取号',
          '夏季游园请注意防晒补水，园内设有12处直饮水点'
        ]
      }
    ]
  },
  'lost-and-found': {
    title: '失物招领',
    intro:
      '以下为近期各区域拾获、尚无人认领的物品。认领请携带有效身份证件至游客服务中心一层办理，或通过线上登记提交物品特征描述，核对无误后我们将通知您领取。',
    sections: [
      {
        h: '待认领物品（2024 年第三季度）',
        table: {
          head: ['编号', '登记日期', '拾获地点', '物品描述'],
          rows: [
            ['LF-2413', '2024-07-02', '正门广场', '折叠伞一把（深蓝色，伞骨完好）'],
            ['LF-2418', '2024-07-05', '欢乐时光区', '儿童水壶一个（恐龙图案，内有半壶水）'],
            ['LF-2426', '2024-07-09', '雷霆山出口', '运动鞋一只（左手，41码）'],
            ['LF-2431', '2024-07-11', '餐饮区 3 号桌', '遮阳帽一顶（米色，帽檐有签名笔迹）'],
            ['LF-2440', '2024-07-16', '旋转木马', '充电宝一个（白色，电量约 60%）'],
            ['LF-2455', '2024-07-23', '游客服务中心', '近视眼镜一副（度数较高，镜片无划痕）'],
            ['LF-2461', '2024-07-28', '惊魂古堡出口', '单肩包一个（内有纸巾、口红、无证件）'],
            ['LF-2470', '2024-08-03', '梦境穹顶', '手环一只（园区发放款，编号已磨淡）'],
            ['LF-2477', '2024-08-06', '停车场 B 区', '车钥匙一把（无车牌信息，遥控器无响应）'],
            ['LF-2483', '2024-08-09', '欢乐时光区', '儿童外套一件（110码，口袋内有糖果纸）'],
            ['LF-2491', '2024-08-13', '旋转木马', '帆布袋一个（内有一本空白笔记本）'],
            ['LF-2498', '2024-08-17', '园区西路', '钥匙串一串（共 11 把，其中 3 把无对应锁具）'],
            ['LF-2504', '2024-08-21', '游客服务中心', '婚戒一枚（内圈刻字已磨损，无法辨认）'],
            ['LF-2512', '2024-08-24', '惊魂古堡', '录音笔一支（内存中有 4 小时无声音频）'],
            ['LF-2519', '2024-08-28', '餐饮区', '手机一部（已锁屏，壁纸为园区合影，通讯录为空）'],
            ['LF-2527', '2024-09-01', '梦想剧场', '助听器一副（电池仍有余电）'],
            ['LF-2533', '2024-09-04', '正门广场', '儿童画一张（画的是太阳，纸背写着"给妈妈"）'],
            ['LF-2541', '2024-09-07', '旋转木马', '毛绒玩具一只（太阳造型，标签缝有手写编号）'],
            ['LF-2550', '2024-09-11', '未来之光区', '日记本一本（仅第一页有字）'],
            ['LF-2556', '2024-09-14', '停车场 A 区', '身份证一张（照片已褪色，姓名栏被刮除）'],
            ['LF-2564', '2024-09-18', '游客服务中心', '拐杖一根（底部橡胶垫几乎磨平）'],
            ['LF-2571', '2024-09-21', '欢乐时光区', '发卡一枚（儿童款，粉色）'],
            ['LF-2578', '2024-09-25', '雷霆山', '保温杯一个（内壁有茶渍，杯身无姓名贴）'],
            ['LF-2586', '2024-09-28', '惊魂古堡出口', '眼镜盒一个（空的，内衬有压痕）']
          ]
        }
      },
      {
        h: '认领须知',
        list: [
          '认领时须提供物品特征描述及有效身份证件，核对一致方可领取',
          '贵重物品（证件、首饰、电子设备）自登记之日起保管 90 日',
          '一般物品自登记之日起保管 30 日，逾期未认领的按《遗失物管理规定》第 12 条移交保管',
          '食品、饮品及易腐物品不予保管',
          '园区不承担物品在保管期间的自然损耗责任'
        ]
      },
      {
        h: '线上登记',
        ps: [
          '您也可以通过线上登记提交认领申请。为便于核对，请尽量详细描述物品特征、遗失时间与地点。',
          '提交后我们将在 3 个工作日内与您联系。如未收到回复，说明所提交的特征描述与登记信息不符，或该物品已超过保管期限。'
        ]
      }
    ]
  },
  transport: {
    title: '交通住宿',
    intro: '余晖乐园交通便利，多种方式可达。',
    sections: [
      {
        h: '公共交通',
        list: [
          '地铁：7号线"余晖乐园站"B出口，步行约300米即达正门',
          '公交：12路、47路、128路至"余晖乐园"站',
          '地铁7号线末班车时间：22:30（往市区方向）'
        ]
      },
      {
        h: '自驾停车',
        ps: ['园区配套停车场共3处，车位2600个：'],
        table: {
          head: ['停车场', '位置', '收费标准'],
          rows: [
            ['P1 正门停车场', '正门东侧', '首小时¥8，之后¥4/小时，封顶¥40/天'],
            ['P2 西侧停车场', '冒险峡谷区外', '¥30/天（一口价）'],
            ['P3 酒店停车场', '度假酒店地下', '住店客人免费']
          ]
        }
      },
      {
        h: '周边住宿',
        list: [
          '余晖度假酒店（园区内）：详情见"主题酒店"页面',
          '周边3公里内有多家连锁酒店，可通过各预订平台查询'
        ]
      }
    ]
  },
  contact: {
    title: '联系我们',
    sections: [
      {
        h: '游客服务',
        list: [
          '客服热线：400-888-2018（每日 8:30 – 22:00）',
          '服务邮箱：service@afterglow-park.com',
          '乐园地址：临江市余晖区落日大道 2018 号'
        ]
      },
      {
        h: '商务合作',
        list: [
          '团体票及企业包场：group@afterglow-park.com',
          '媒体采访：press@afterglow-park.com'
        ]
      },
      {
        h: '加入我们',
        ps: [
          '余晖乐园常年招聘演职人员、设施运维、游客服务等岗位，欢迎热爱欢乐事业的你加入。',
          '简历请投递：hr@ceres-reynold.com（邮件标题请注明应聘岗位）'
        ]
      }
    ]
  },
  schedule: {
    title: '演出时刻表',
    intro: '以下为日常演出时间安排，特殊活动日以现场公告为准。',
    sections: [
      {
        h: '巡游与演出',
        table: {
          head: ['演出', '地点', '时间'],
          rows: [
            ['闪闪欢乐巡游', '中央广场出发', '14:00 / 17:00'],
            ['《余晖》八音盒整点演奏', '旋转木马', '每日整点'],
            ['璀璨余晖烟花秀', '中央广场', '20:30（周五至周日及节假日）'],
            ['闪闪人偶见面会', '中央广场雕像前', '10:30 / 15:30']
          ]
        }
      },
      {
        h: '梦境穹顶场次',
        ps: ['预约制，每场限12名，请提前至"未来之光区"服务台取号。'],
        table: {
          head: ['场次', '时间', '时长'],
          rows: [
            ['第一场', '9:30', '约25分钟'],
            ['第二场', '12:30', '约25分钟'],
            ['第三场', '15:30', '约25分钟'],
            ['第四场', '18:30', '约25分钟'],
            ['第五至八场', '19:30 – 21:30（夜场滚动开放）', '约25分钟']
          ]
        },
        ps2: []
      },
      {
        h: '温馨提示',
        list: [
          '演出时间可能因天气、设备维护临时调整',
          '烟花秀遇恶劣天气取消，请以当日广播为准'
        ]
      }
    ]
  },
  dining: {
    title: '餐饮美食',
    intro: '从主题餐厅到街头小食，让味蕾也来一场游园会。',
    sections: [
      {
        h: '主题餐厅',
        list: [
          '闪闪主题餐厅（中央广场）：招牌"阳光汉堡"、儿童套餐、闪闪造型甜品',
          '落日咖啡馆（未来之光区）：手冲咖啡、季节限定特调"余晖拿铁"',
          '雷霆能量站（冒险峡谷区）：热狗、薯条、能量饮料'
        ]
      },
      {
        h: '小食亭',
        ps: ['园区内分布9处小食亭，供应爆米花、棉花糖、冰淇淋、烤肠等经典游园小食。']
      },
      {
        h: '用餐提示',
        list: [
          '餐厅支持现金、扫码支付及园区储值卡',
          '如需特殊饮食（过敏、清真等），请提前告知服务人员'
        ]
      }
    ]
  },
  express: {
    title: '快速通行',
    intro: '节省排队时间，把更多时间留给欢笑。',
    sections: [
      {
        h: '手环价格',
        table: {
          head: ['类型', '价格', '适用设施'],
          rows: [
            ['单设施手环', '¥80/次', '雷霆山或惊魂古堡（二选一）'],
            ['全日通行手环', '¥260/人', '园内全部快速通道设施'],
            ['家庭手环套装', '¥680/三条', '全日通行×3']
          ]
        }
      },
      {
        h: '使用规则',
        list: [
          '手环限购票当日使用，一人一环，不可转让',
          '"梦境穹顶"为预约制，快速通行手环不适用',
          '手环内置芯片，出园时请在回收点归还',
          '快速通道高峰时段仍需短暂等候，敬请谅解'
        ]
      }
    ]
  },
  map: {
    title: '电子导览图',
    intro: '余晖乐园占地42万平方米，分为五大主题区域。',
    sections: [
      {
        h: '区域导览',
        list: [
          '【中央广场】园区正中心，标志性"闪闪"雕像所在地，巡游与烟花秀主场地',
          '【欢乐时光区】（东侧）：旋转木马、亲子游乐设施、母婴室',
          '【冒险峡谷区】（西侧）：过山车"雷霆山"、峡谷漂流',
          '【惊悚之夜区】（北侧）：鬼屋"惊魂古堡"（夜场限定开放）',
          '【未来之光区】（南侧）：梦境穹顶、落日咖啡馆'
        ]
      },
      {
        h: '其他设施',
        list: [
          '游客服务中心：正门入口右侧（寄存、租赁、医务、失物招领）',
          '员工大楼：园区西北角，非游览区域',
          '余晖度假酒店：园区南门旁'
        ]
      },
      {
        h: '提示',
        ps: ['纸质导览图可在正门及游客服务中心免费领取。']
      }
    ]
  },
  hotel: {
    title: '主题酒店',
    intro: '余晖度假酒店——把乐园的梦，延续到梦乡。',
    sections: [
      {
        h: '酒店简介',
        ps: [
          '余晖度假酒店位于园区南门旁，拥有客房320间，含"闪闪亲子房""星空穹顶房"等特色主题房型。住店客人可享受提前1小时入园特权。',
          '酒店配套全日餐厅、室内恒温泳池及儿童游乐室，是家庭度假的理想之选。'
        ]
      },
      {
        h: '房型价格',
        table: {
          head: ['房型', '面积', '参考价格'],
          rows: [
            ['园景大床房', '32㎡', '¥688/晚起'],
            ['闪闪亲子房', '45㎡', '¥1088/晚起'],
            ['星空穹顶房', '58㎡', '¥1588/晚起']
          ]
        }
      },
      {
        h: '预订方式',
        ps: ['预订热线：400-888-2018 转 2，或通过官方合作平台预订。']
      }
    ]
  }
}

const page = computed(() => PAGES[route.params.slug])
</script>

<style scoped>
.info-page {
  min-height: 100vh;
  background: #fff;
}
.i-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #eee;
}
.i-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 17px;
  color: #1a1a1a;
  text-decoration: none;
  letter-spacing: 0.5px;
}
.i-links {
  display: flex;
  gap: 20px;
}
.i-links a {
  color: #555;
  text-decoration: none;
  font-size: 14px;
}
.i-links a:hover {
  color: var(--accent);
}
.i-body {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 24px 60px;
}
.i-back {
  display: inline-block;
  margin-bottom: 16px;
  color: #888;
  text-decoration: none;
  font-size: 13px;
}
.i-back:hover {
  color: var(--accent);
}
.i-body h1 {
  font-size: 26px;
  color: #1a1a1a;
  padding-bottom: 14px;
  border-bottom: 2px solid var(--accent);
  display: inline-block;
}
.i-intro {
  margin-top: 14px;
  font-size: 14px;
  color: #777;
  line-height: 1.8;
}
.i-sec {
  margin-top: 32px;
}
.i-sec h2 {
  font-size: 17px;
  color: #1a1a1a;
  padding-left: 10px;
  border-left: 3px solid var(--accent);
  margin-bottom: 12px;
}
.i-sec p {
  font-size: 14px;
  color: #444;
  line-height: 1.9;
  margin-bottom: 8px;
}
.i-sec ul {
  padding-left: 20px;
}
.i-sec li {
  font-size: 14px;
  color: #444;
  line-height: 2.1;
}
.i-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 13px;
}
.i-table th {
  background: #fafbfc;
  border: 1px solid #e8e8e8;
  padding: 10px 12px;
  text-align: left;
  color: #333;
  font-weight: 600;
}
.i-table td {
  border: 1px solid #e8e8e8;
  padding: 10px 12px;
  color: #555;
}
.i-foot {
  border-top: 1px solid #eee;
  text-align: center;
  padding: 24px;
  font-size: 12px;
  color: #aaa;
}
</style>
