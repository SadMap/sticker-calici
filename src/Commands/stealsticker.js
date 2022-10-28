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
            return message.reply("Bu komutu kullanmak için \`MANAGE_EMOJIS_AND_STICKERS\` yetkisine sahip olmalısın!");
        }
        else if (!message.guild.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            return message.reply("Yetkim bulunmamakta!")
        }
        message.reply("Çalmak istediğin stickeri sohbete gönder.").then(async () => {

        const result = await message.channel.awaitMessages({filter: m => m.author.id === message.author.id, max: 1, time: 60000});
        if (!result.first()) {
            return message.reply("Çalmak için 60 saniye içinde bir sticker atman gerek!");
        }
        const resultmsg = result.first();
        if (!resultmsg.stickers.first()) {
            return message.reply("Sticker atman gerek!");
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
            message.reply("Sticker oluşturulamadı!");
            console.error(err)
        })
    })
    }
};
