const https = require('https');
const fs = require('fs');
const ReadDatabase = fs.readFileSync('./datastore.json');
const ReadData = JSON.parse(ReadDatabase);

function ethPriceUpdate () {
    https.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=IW4KRYUKW324PCI92AFHD9QHB36RV92DHM`, res => {
        let body = '';
        res.on('data', data => {
            body += data;
        });

        res.on('error', function (err) {
            console.log('ERROR ', err);
        });

        res.on('end', () => {
            let jsonObject = JSON.parse(body);
            if (jsonObject.message === 'OK') {
                ReadData.ethPrice = jsonObject.result['ethusd'];
                let editedDataBase = JSON.stringify(ReadData, null, 2);
                fs.writeFileSync('./datastore.json', editedDataBase);
            }
        })
    })
}

function rock2EthPriceUpdate () {
    https.get(`https://v1-1.api.token.store/orderbook/ROCK2_ETH?limit=1`, res => {
        let body = '';
        res.on('data', data => {
            body += data;
        });

        res.on('error', function (err) {
            console.log('ERROR ', err);
        });

        res.on('end', () => {
            let jsonObject = JSON.parse(body);
            ReadData.rockEthAsk = jsonObject.asks[0].price.toFixed(6);
            ReadData.rockEthBid = jsonObject.bids[0].price.toFixed(6);
            let editedDataBase = JSON.stringify(ReadData, null, 2);
            fs.writeFileSync('./datastore.json', editedDataBase);
        });
    })
}

function currentRock2Eth () {
        https.get(`https://v1-1.api.token.store/ticker`, res => {
            let body = '';
            res.on('data', data => {
                body += data;
            });

            res.on('error', function (err) {
                console.log('ERROR ', err);
            });


            res.on('end', () => {
                let jsonObject = JSON.parse(body);
                ReadData.percentChange = jsonObject.ETH_ROCK2["percentChange"].toFixed(2);
                ReadData.high = jsonObject.ETH_ROCK2["bid"].toFixed(6);
                ReadData.low = jsonObject.ETH_ROCK2["ask"].toFixed(6);
                ReadData.currentPrice = jsonObject.ETH_ROCK2["last"].toFixed(6);
                let editedDataBase = JSON.stringify(ReadData, null, 2);
                fs.writeFileSync('./datastore.json', editedDataBase);
            });
        })
}

function rock2UsdPrice (ethPrice, rockEthPrice) {
    return ethPrice*rockEthPrice
}

function ethPrice (ctx) {
    currentRock2Eth();
    ctx.reply('Last Ethereum price of ROCK2 is : ' + ReadData.currentPrice + "\n24h High Ethereum price of ROCK2 is : " + ReadData.high + "\n24h low Ethereum price of ROCK2 is : " + ReadData.low + "\nPercentage change in 24h is : " + ReadData.percentChange + "%")
}

function usdPrice (ctx) {
    currentRock2Eth();
    ctx.reply("Last USD price of ROCK2 is : " + rock2UsdPrice(ReadData.ethPrice, ReadData.currentPrice).toFixed(2) + " USD \n24h High USD price of ROCK2 is : " + rock2UsdPrice(ReadData.ethPrice, ReadData.high).toFixed(2) +
    " USD \n24h low USD price of ROCK2 is : " + rock2UsdPrice(ReadData.ethPrice, ReadData.low).toFixed(2) +" USD" + "\nPercentage change in 24h is : " + ReadData.percentChange + "%")
}

function orderBookEth (ctx) {
    ctx.reply('Current last Ethereum ask price of ROCK2 is: ' + ReadData.rockEthAsk + "\nCurrent last Ethereum bid price of ROCK2 is: " + ReadData.rockEthBid)
}

function orderBookUSD (ctx) {
    ctx.reply('Current last USD equivalent ask price of ROCK2 is: ' + rock2UsdPrice(ReadData.ethPrice, ReadData.rockEthAsk).toFixed(2) + " USD \nCurrent last Ethereum bid price of ROCK2 is: " + rock2UsdPrice(ReadData.ethPrice, ReadData.rockEthBid).toFixed(2) +" USD")
}

module.exports = {
    rock2EthPriceUpdate : rock2EthPriceUpdate,
    ethPriceUpdate : ethPriceUpdate,
    ethPrice : ethPrice,
    usdPrice : usdPrice,
    orderBookEth : orderBookEth,
    orderBookUSD : orderBookUSD
};