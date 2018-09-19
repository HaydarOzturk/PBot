const Telegraf = require('telegraf');
const bot = new Telegraf("Token");
const httprequest = require('./httprequest');
const startHandler = require ('./startHandler.js');

bot.use(Telegraf.log());

bot.command('/start@ROCK2_Price_bot', ctx => startHandler.reply(ctx));
bot.command('usdprice', ctx => httprequest.usdPrice(ctx));
bot.command('ethprice', ctx => httprequest.ethPrice(ctx));
bot.command('ethorders', ctx => httprequest.orderBookEth(ctx));
bot.command('usdorders', ctx => httprequest.orderBookUSD(ctx));
bot.command('/usdprice@ROCK2_Price_bot', ctx => httprequest.usdPrice(ctx));
bot.command('/ethprice@ROCK2_Price_bot', ctx => httprequest.ethPrice(ctx));
bot.command('/ethorders@ROCK2_Price_bot', ctx => httprequest.orderBookEth(ctx));
bot.command('/usdorders@ROCK2_Price_bot', ctx => httprequest.orderBookUSD(ctx));
bot.command('start', ctx => startHandler.reply(ctx));


setInterval(function () {
    httprequest.ethPriceUpdate();
}, 100000);

setInterval(function () {
    httprequest.rock2EthPriceUpdate();
}, 20000);

bot.startPolling();