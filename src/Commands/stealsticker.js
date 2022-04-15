const Command = require('../Base/Command');
const Discord = require('discord.js');
//@ts-check
module.exports = class extends Command {
    constructor() {
        super({
            name: 'sc',
            isSlash: false,
            isMessage: true,
        });
    }
    /**
     * 
     * @param {{message:Discord.Message}}  
     * @returns 
     */
    messageRun( {message} ) {
        if (!message.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            return message.reply("Bu Komutu Kullanmak İçin \`MANAGE_EMOJIS_AND_STICKERS\` Yetkisine Sahip Olmalısın!");
        }
        else if (!message.guild.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            return message.reply("Yetkim Yok")
        }
        message.reply("Çalmak istediğin stickeri sohbete at").then(async () => {

        const result = await message.channel.awaitMessages({filter: m => m.author.id === message.author.id, max: 1, time: 60000});
        if (!result.first()) {
            return message.reply("Çalmak İçin 60 Saniye İçinde Bir Sticker Atman Gerek!");
        }
        const resultmsg = result.first();
        if (!resultmsg.stickers.first()) {
            return message.reply("Sticker Atman Gerek!");
        }
        const resultsticker = await resultmsg.stickers.first().fetch();
        if (!resultsticker.guildId) {
            return message.reply("Bu zaten herkesin kullanabileceği bir sticker!");
        }
        message.guild.stickers.create(resultsticker.url,resultsticker.name,resultsticker.tags.pop())
        .then(() => {
            message.reply("Çalma işlemi tamamlandı :)")
        })
        .catch(err => {
            message.reply("Sticker Oluşturulamadı!");
            console.error(err)
        })
    })
    }
};
