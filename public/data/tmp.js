var fs = require('fs');
var data = fs.readFileSync('final.txt','utf-8')

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
	var time = date.getFullYear()+"年"+date.getMonth()+"月"+date.getDate()+"日"+date.getHours()+"点"+date.getMinutes()+"分"+date.getSeconds()+"秒";
	return time;
}

function calAvg(priceList){
	return ((priceList[4]*1)+(priceList[5]*1))/2;
}

function getVolume(record){
	return record[10];
}
function getRMB(record){
	return record[11];
}
function getBTC(record){
	return record[12];
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
		volumeData.push([i,volume[i]*1]);
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

	for(var i = 0;i<len;i++){
		var tmp ={};
		tmp.datetime = datetime[i];
		tmp.price = price[i];
		tmp.volume = volume[i]*1;
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
console.log(lines.length);
for(var i=0;i<lines.length;i++){
	var record = mySplit(lines[i]);
	datetime.push(transferTime(record[0]));
	price.push(calAvg(record[1]));
	volume.push(getVolume(record[1]));
	RMBAccount.push(getRMB(record[1]));
	BTCAccount.push(getBTC(record[1]));
	buy.push(getProb(record[1]));
}

var priceData=genPriceData(price);
var volumeData=genVolumeData(volume);
var summaryData=genSummaryData(priceData,100);
var jsonData=genJsonData(datetime,price,volume);
var myData='var priceData = '+JSON.stringify(priceData)+';\n'+'var volumeData = '+JSON.stringify(volumeData)+';\n'+'var summaryData = '+JSON.stringify(summaryData)+';\n'+'var jsonData = '+JSON.stringify(jsonData)+';';
fs.writeFile('bitCoinData.js',myData);



