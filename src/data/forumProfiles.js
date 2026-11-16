// 论坛用户主页：只给 E-09 做完整资料，其余作者使用空壳
export const PROFILES = {
  e09: {
    slug: 'e09',
    name: 'E-09',
    avatar: 'E',
    registered: '2018-11-03',
    lastVisit: '2019-08-01 22:41',
    posts: 3,
    bio: '不常来。别在帖子里找我。',
    signature: '邮局还开着。',
    signatureEdited: '2019-08-01',
    signatureHistory: [
      { date: '2018-11-03', text: '急事：e09.relay' },
      { date: '2019-08-01', text: '（已清空）' }
    ],
    emailMasked: 'e09****',
    emailDomain: 'postbox.com',
    favorites: [
      {
        title: '如果哪天突然不在了，你们会留什么话？',
        date: '2018-11-20',
        excerpt: '……有人回，我用 postbox 的定时信，设了一年后的。真出事，至少有人能收到。'
      }
    ],
    guestbook: [
      {
        name: '等妈妈回家',
        date: '2019-08-10',
        text: '谢谢你之前回我的帖子。'
      },
      {
        name: '考据癖',
        date: '2019-08-10',
        text: '你的签名改过。原来的那半句呢？'
      }
    ],
    visitors: [
      { name: '陈默', date: '2024-09-28 23:12' },
      { name: '等妈妈回家', date: '2019-08-10 19:03' }
    ]
  }
}
