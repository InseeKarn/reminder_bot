require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates, // Intent สำหรับเช็คสถานะของ voice channel
    ]
});

const channelID = '1294717719219929139'; // ระบุช่องที่ต้องการให้บอทส่งข้อความ
const imagePath = 'img/IMG_0178.jpg'; // ระบุพาธของรูปภาพตารางเรียน

// เมื่อบอทพร้อมใช้งาน
client.once('ready', () => {
    console.log('Reminder Bot is ready!');
});

// ฟังก์ชันตรวจสอบว่ามีคนอยู่ใน voice channel ใดๆ ใน server หรือไม่
async function hasUserInVoiceChannel(guild) {
    const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2); // ใช้ type 2 สำหรับ voice channel
    for (const [_, voiceChannel] of voiceChannels) {
        if (voiceChannel.members.size > 0) { // ถ้ามีผู้ใช้อยู่ใน voice channel อย่างน้อย 1 คน
            return true;
        }
    }
    return false;
}

// ตั้งเวลาให้บอทเตือนทุกวันเวลา 8 PM (20:00) วันจันทร์ถึงวันพฤหัสบดี
cron.schedule('0 20 * * 1-4', async () => {
    const guild = client.guilds.cache.get('589018121009102851'); // ระบุ Guild ID ที่ต้องการให้บอทตรวจสอบ
    const channel = client.channels.cache.get(channelID);

    if (!guild || !channel) {
        console.log('Guild or Channel not found');
        return;
    }

    const hasUserInVoice = await hasUserInVoiceChannel(guild);

    if (hasUserInVoice) {
        // ตรวจสอบวันที่
        const dayOfWeek = new Date().getDay();
        
        let message = '';
        switch (dayOfWeek) {
            case 1:
                message = '8PM already guys. Tuesday schedule have จิระเมศร์(Math2) and พนารัตน์(Thai)!!!';
                break;
            case 2:
                message = '8PM already guys. Wednesday schedule have พนารัตน์(Thai), ปิยภร(Math1) and ชัยศาสตร์(Sci)!!!';
                break;
            case 3:
                message = '8PM already guys. Thursday schedule have จุฑามาศ(PE), จรินพรรณ(Eng??)!!!';
                break;
            case 4:
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
        console.log('ไม่มีคนอยู่ใน voice channel ข้ามการส่งข้อความ');
    }
});

// เข้าสู่ระบบด้วย Token ของคุณ
client.login(process.env.DISCORD_TOKEN);
