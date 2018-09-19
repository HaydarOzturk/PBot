const Telegraf = require('telegraf');
const bot = new Telegraf("Token");

function reply(ctx) {
    if (ctx.message.chat.type === 'private'){
        ctx.reply('/ethprice , /usdprice , /ethorders, /usdorders are the commands of this bot. You can either type or click to these commands. It will give you the live price from Token.store and EtherScan.');
    }
    else if (ctx.message.chat.type === 'supergroup') {
        let messageID = ctx.message.from.id;
        ctx.deleteMessage().then( fullfilled =>
            bot.telegram.sendMessage(messageID, 'Please use this command privately\n\n/ethprice , /usdprice , /ethorders, /usdorders are the commands of this bot. You can either type or click to these commands. It will give you the live price from Token.store and EtherScan.').then(null,null),null
        )
    }
}

module.exports = {
    reply : reply
};
