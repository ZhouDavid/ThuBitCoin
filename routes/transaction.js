var express = require('express');
var router = express.Router();
var fs = require('fs');
var data = fs.readFileSync('./public/data/final.txt','utf-8')

var lines = data.split('\n')
function mySplit(line){
	tmp = line.split(' ');
	time = tmp[0];
	rest = tmp[1];
	rest = rest.split(',');
	return [time,rest];
}

function transferTime(timeStamp){
	var date = new Date(timeStamp*1000000);
	var time = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+"-"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	return time;
}

function calAvg(priceList){
	var avg = ((priceList[4]*1)+(priceList[5]*1))/2;
	return avg.toFixed(2);
}

function getVolume(record){
	return record[10];
}
function getRMB(record){
	return (record[11]*1).toFixed(2);
}
function getBTC(record){
	return (record[12]*1).toFixed(2);
}
function getProb(record){
	var len = record[13].length;
	if(record[13][len-1]=='\r'){
		record[13]=record[13].slice(0,len-1);
	}

	if(record[13]*1>=0.7){
		return 1;
	}
	else return 0;
}

function genPriceData(price){
	var priceData=[];
	for(var i = 0;i<price.length;i++){
		priceData.push([i,price[i]]);
	}
	return priceData;
}

function genVolumeData(volume){
	var volumeData=[];
	for(var i = 0;i<volume.length;i++){
		volumeData.push([i,volume[i]]);
	}
	return volumeData;
}

function genSummaryData(data,num){
	var summary=[];
	var delta = Math.floor(data.length/num);
	if(delta==0)delta=1;
	var j = 0;
	for(var i=0;i<data.length;i+=delta){
		summary.push(data[i]);
		j++;
	}
	return summary;
}

function genJsonData(datetime,price,volume){
	var jsonData = [];
	var len = datetime.length;
	var tmp ={};
	for(var i = 0;i<len;i++){
		tmp.datetime = datetime[i];
		tmp.price = price[i];
		tmp.volume = volume[i];
		jsonData.push(tmp);
	}
	return jsonData;
}
/* GET users listing. */
datetime = [];
price = [];		
RMBAccount = [];
BTCAccount = [];
volume = [];
buy = [];

for(var i=0;i<lines.length;i++){
	var record = mySplit(lines[i]);
	datetime.push(transferTime(record[0]));
	price.push(calAvg(record[1]));
	volume.push(getVolume(record[1]));
	RMBAccount.push(getRMB(record[1]));
	BTCAccount.push(getBTC(record[1]));
	buy.push(getProb(record[1]));
}

// var priceData=genPriceData(price);
// var volumeData=genVolumeData(volume);
// var summaryData=genSummaryData(priceData,100);
// var jsonData=genJsonData(datetime,price,volume);
// var myData=JSON.stringify(priceData)+'\n'+JSON.stringify(volumeData)+'\n'+JSON.stringify(summaryData)+'\n'+JSON.stringify(jsonData);
// fs.writeFile('bitCoinData.js',myData);
router.get('/', function(req, res, next) {
	res.render('transaction',{datetime:datetime,price:price,buy:buy,RMBAccount:RMBAccount,BTCAccount:BTCAccount});
});



module.exports = router;
