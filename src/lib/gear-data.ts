import {
    Laptop, Smartphone, Watch, Headphones, Monitor, Keyboard, Mouse,
    Camera, Speaker, Wifi, Lightbulb, Plug, Fan, Home, Battery,
    Tablet, HardDrive, Coffee, Thermometer, Scissors, Shirt,
    Cable, Gamepad, Gift
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type GearCategory =
    | "Core Tech"
    | "Smart Home"
    | "Wearables & Audio"
    | "Accessories"
    | "Other";

export interface GearItem {
    id: string;
    name: string;
    brand: string;
    model?: string;
    category: GearCategory;
    description: string;
    icon: LucideIcon;
    image?: string; // Path to image in public folder (e.g., /gear/phone.png)
    link?: string;
    purchasedDate?: string;
}

export const gearData: GearItem[] = [
    // --- Core Tech (Phones, Laptops, Tablets) ---
    {
        id: "xiaomi-17-pro",
        name: "Xiaomi 17 Pro",
        brand: "Xiaomi",
        model: "12GB+256GB",
        category: "Core Tech",
        description: "主力旗舰手机，性能与影像的巅峰体验。",
        icon: Smartphone,
        image: "/gear/xiaomi-17-pro.png" // Example
    },
    {
        id: "redmi-book-pro-16",
        name: "REDMI Book Pro 16",
        brand: "Xiaomi",
        model: "2025 Edition",
        category: "Core Tech",
        description: "核心生产力工具，强劲性能释放。",
        icon: Laptop,
        image: "/gear/REDMI Book Pro 16.png",
    },
    {
        id: "xiaomi-pad-6",
        name: "Xiaomi Pad 6",
        brand: "Xiaomi",
        model: "8GB+256GB",
        category: "Core Tech",
        description: "移动办公与娱乐的利器，轻薄便携。",
        icon: Tablet,
        image: "/gear/Xiaomi Pad 6.png",
    },
    {
        id: "redmi-k30",
        name: "Redmi K30 4G",
        brand: "Redmi",
        model: "6GB+128GB 紫",
        category: "Core Tech",
        description: "备用机，经典的紫色外观。",
        icon: Smartphone,
        image: "/gear/Redmi K30 4G.png",
    },

    // --- Wearables & Audio ---
    {
        id: "xiaomi-watch-5",
        name: "Xiaomi Watch 5",
        brand: "Xiaomi",
        model: "卡其绿氟胶",
        category: "Wearables & Audio",
        description: "智能穿戴，全天候健康监测。",
        icon: Watch,
        image: "/gear/Xiaomi Watch 5.png",
    },
    {
        id: "redmi-watch-4",
        name: "Redmi Watch 4",
        brand: "Redmi",
        model: "银雪白",
        category: "Wearables & Audio",
        description: "时尚百搭的智能手表。",
        icon: Watch,
        image: "/gear/Redmi Watch 4.png",
    },
    {
        id: "xiaomi-buds-5",
        name: "Xiaomi Buds 5",
        brand: "Xiaomi",
        model: "钛光金",
        category: "Wearables & Audio",
        description: "半入耳式降噪耳机，舒适与音质兼得。",
        icon: Headphones,
        image: "/gear/Xiaomi Buds 5.png",
    },
    {
        id: "xiaomi-speaker-pro",
        name: "Xiaomi 智能音箱 Pro",
        brand: "Xiaomi",
        category: "Wearables & Audio",
        description: "全屋智能的语音入口，音质出色。",
        icon: Speaker,
        image: "/gear/Xiaomi 智能音箱 Pro.png",
    },

    // --- Smart Home (Appliances) ---
    {
        id: "mijia-health-pot",
        name: "米家智能多功能养生壶",
        brand: "Xiaomi",
        model: "P1 白色",
        category: "Smart Home",
        description: "办公室里的养生伴侣，支持远程控制。",
        icon: Coffee,
        image: "/gear/米家智能多功能养生壶.png",
    },
    {
        id: "mijia-water-dispenser",
        name: "米家便携即热饮水机",
        brand: "Xiaomi",
        model: "白色",
        category: "Smart Home",
        description: "想喝热水随时有，出差旅行必备。",
        icon: Coffee,
        image: "/gear/米家便携即热饮水机.png",
    },
    {
        id: "mijia-kettle-1a",
        name: "米家电水壶 1A",
        brand: "Xiaomi",
        model: "白色",
        category: "Smart Home",
        description: "简约设计的电水壶，快速烧水。",
        icon: Coffee,
        image: "/gear/米家电水壶.png",
    },
    {
        id: "mijia-tower-fan",
        name: "米家智能直流变频塔扇2",
        brand: "Xiaomi",
        model: "白色",
        category: "Smart Home",
        description: "安静柔和的自然风，夏季纳凉首选。",
        icon: Fan,
        image: "/gear/米家智能直流变频塔扇2.png",
    },
    {
        id: "mijia-desktop-fan",
        name: "米家桌面移动风扇",
        brand: "Xiaomi",
        model: "白色",
        category: "Smart Home",
        description: "桌面无线小风扇，清凉随行。",
        icon: Fan,
        image: "/gear/米家桌面移动风扇.png",
    },
    {
        id: "mijia-steamer",
        name: "米家手持挂烫机 2",
        brand: "Xiaomi",
        category: "Smart Home",
        description: "衣物护理，快速除皱。",
        icon: Shirt,
        image: "/gear/米家手持挂烫机.png",
    },
    {
        id: "mijia-blanket",
        name: "米家智能电热毯",
        brand: "Xiaomi",
        model: "白色",
        category: "Smart Home",
        description: "冬季睡眠神器，支持分区控温。",
        icon: Home,
        image: "/gear/米家智能电热毯.png",
    },
    {
        id: "mijia-nose-trimmer",
        name: "米家电动鼻毛修剪器",
        brand: "Xiaomi",
        category: "Smart Home",
        description: "个人护理小工具，精致生活。",
        icon: Scissors,
        image: "/gear/米家电动鼻毛修剪器.png",
    },

    // --- Accessories (Mouse, Hub, Cases) ---
    {
        id: "xiaomi-mouse-lite3",
        name: "小米无线鼠标 Lite3",
        brand: "Xiaomi",
        model: "素白灰",
        category: "Accessories",
        description: "轻便办公鼠标。",
        icon: Mouse,
        image: "/gear/小米无线鼠标 Lite3.png",
    },
    {
        id: "xiaomi-hub-4in1",
        name: "小米四合一双头分线器",
        brand: "Xiaomi",
        category: "Accessories",
        description: "扩展连接能力，支持 USB-C 与 USB-A。",
        icon: Cable,
        image: "/gear/小米四合一双头分线器.png",
    },
    {
        id: "xiaomi-pad-keyboard",
        name: "Xiaomi Pad 6 键盘",
        brand: "Xiaomi",
        category: "Accessories",
        description: "平板生产力配件，键盘式双面保护壳。",
        icon: Keyboard,
        image: "/gear/Xiaomi Pad 6 键盘.png",
    },
    {
        id: "xiaomi-selfie-stick",
        name: "小米变焦落地自拍杆",
        brand: "Xiaomi",
        category: "Accessories",
        description: "集自拍杆与三脚架于一体，支持蓝牙变焦。",
        icon: Camera,
        image: "/gear/小米变焦落地自拍杆.png",
    },
    {
        id: "aula-f87-pro",
        name: "狼蛛（AULA）F87 Pro",
        brand: "AULA",
        model: "灰木轴V4",
        category: "Accessories",
        description: "高性价比客制化机械键盘，手感极佳。",
        icon: Keyboard,
        image: "/gear/狼蛛（AULA）F87Pro.png",
    },
    {
        id: "logitech-g402",
        name: "罗技 G402",
        brand: "Logitech",
        model: "黑色",
        category: "Accessories",
        description: "经典游戏鼠标，人体工学设计。",
        icon: Mouse,
        image: "/gear/罗技G402.png",
    },
    {
        id: "xiaomi-17-case",
        name: "Xiaomi 17 Pro 保护壳",
        brand: "Xiaomi",
        category: "Accessories",
        description: "复古掌机风格保护壳。",
        icon: Gamepad,
        image: "/gear/Xiaomi 17 Pro 保护壳.png",
    },

    // --- Other ---
    {
        id: "xiaomi-powerbank-pocket",
        name: "小米自带线充电宝 10000mAh",
        brand: "Xiaomi",
        model: "浅咖色",
        category: "Accessories",
        description: "自带线设计，小巧便携，复古配色。",
        icon: Battery,
        image: "/gear/小米自带线充电宝.png",
    },
    {
        id: "xiaomi-gift-box",
        name: "小米尊享礼盒",
        brand: "Xiaomi",
        model: "黑色",
        category: "Other",
        description: "特殊的纪念礼盒。",
        icon: Gift,
        image: "/gear/小米尊享礼盒.png",
    },
];
