export interface FriendLink {
    name: string;
    description: string;
    url: string;
    avatar: string;
    tags?: string[];
}

export const friendLinks: FriendLink[] = [
    {
        name: "阮一峰的网络日志",
        description: "科技、人文、资讯，互联网资深博主，周刊影响无数人。",
        url: "https://www.ruanyifeng.com/blog/",
        avatar: "https://www.ruanyifeng.com/favicon.ico",
        tags: ["技术", "科技"],
    },
    {
        name: "张鑫旭的个人主页",
        description: "CSS 领域深度专家，分享大量前端实战经验与技巧。",
        url: "https://www.zhangxinxu.com/",
        avatar: "https://www.zhangxinxu.com/favicon.ico",
        tags: ["前端", "CSS"],
    },
    {
        name: "少数派",
        description: "专注数字效率与生活方式，发现更好用的 App 和工具。",
        url: "https://sspai.com",
        avatar: "https://cdn-static.sspai.com/favicon/sspai.ico",
        tags: ["效率", "工具"],
    },
    {
        name: "V2EX",
        description: "创意工作者们分享自己的产品和经历，技术与分享社区。",
        url: "https://v2ex.com",
        avatar: "https://v2ex.com/favicon.ico",
        tags: ["社区", "技术"],
    },
    {
        name: "即刻 App",
        description: "聚集有趣有态度的年轻人，发现感兴趣的人和事。",
        url: "https://web.okjike.com",
        avatar: "https://web.okjike.com/favicon.ico",
        tags: ["社交", "生活"],
    },
];
