require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

// ใช้ intents ที่จำเป็น
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // ถ้าคุณต้องการอ่านข้อความ
    ]
});

const channelID = '589018121009102851'; // ระบุช่องที่ต้องการให้บอทส่งข้อความ
const imagePath = 'img/IMG_0178.jpg'; // ระบุพาธของรูปภาพตารางเรียน

// เมื่อบอทพร้อมใช้งาน
client.once('ready', () => {
    console.log('Reminder Bot is ready!');
});

// ตั้งเวลาให้บอทเตือนทุกวันเวลา 8 PM (20:00)
cron.schedule('0 20 * * 1-4', () => {
    const channel = client.channels.cache.get(channelID);
    if (channel) {
        // ตรวจสอบวันที่
        const dayOfWeek = new Date().getDay(); // คืนค่าจาก 0 (Sunday) ถึง 6 (Saturday)

        // กำหนดข้อความที่แตกต่างกันตามวัน
        let message = '';
        switch (dayOfWeek) {
            case 1: // Monday
                message = '8PM already guys. Tuesday schedule have จิระเมศร์(Math2) and พนารัตน์(Thai)!!!';
                break;
            case 2: // Tuesday
                message = '8PM already guys. Wednesday schedule have พนารัตน์(Thai), ปิยภร(Math1) and ชัยศาสตร์(Sci)!!!';
                break;
            case 3: // Wednesday
                message = '8PM already guys. Thursday schedule have จุฑามาศ(PE), จรินพรรณ(Eng??)!!!';
                break;
            case 4: // Thursday
                message = '8PM already guys. Friday schedule have สุรวยพร(Eng??), จิระเมศร์(Math2), จรินพรรณ(Eng??), ชัยศาสตร์(Sci)!!!';
                break;
            default:
                message = 'Reminder: You have school tomorrow!';
                break;
        }

        // ส่งข้อความและรูปภาพ
        channel.send(message);
        channel.send({ files: [imagePath] });
    } else {
        console.log('Channel not found');
    }
});

// เข้าสู่ระบบด้วย Token ของคุณ
client.login(process.env.DISCORD_TOKEN);

