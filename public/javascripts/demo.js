var init_num = 200;
var num = init_num;
function redraw(){
    HumbleFinance.append(priceData.slice(num,num+1),volumeData.slice(num,num+1),priceData.slice(num,num+1));
    num=num+1;
}


Event.observe(document, 'dom:loaded', function() {
    
    prettyPrint();
    
    HumbleFinance.trackFormatter = function (obj) {
        
        var x = Math.floor(obj.x);
        var data = jsonData[x];
        var text = data.datetime + " Price: " + data.price + " Vol: " + data.volume;
        
        return text;
    };
    
    HumbleFinance.yTickFormatter = function (n) {
        
        if (n == this.axes.y.max) {
            return false;
        }
        
        return '$'+n;
    };
    
    HumbleFinance.xTickFormatter = function (n) { 
        
        if (n == 0) {
            return false;
        }
        
        var date = jsonData[n].datetime;
        var begin = date.indexOf('年');
        var end = date.indexOf('日');
        date = date.slice(begin+1,end+1);
        return date; 
    }

    // function sleep(numberMillis) {
    // var now = new Date();
    // var exitTime = now.getTime() + numberMillis;
    //     while (true) {
    //         now = new Date();
    //         if (now.getTime() > exitTime)
    //         return;
    //     }
    // }

    HumbleFinance.init('finance', priceData.slice(0,init_num), volumeData.slice(0,init_num), priceData.slice(0,init_num));
    //HumbleFinance.setFlags(flagData); 
    
    var xaxis = HumbleFinance.graphs.summary.axes.x;
    var prevSelection = HumbleFinance.graphs.summary.prevSelection;
    var xmin = xaxis.p2d(prevSelection.first.x);
    var xmax = xaxis.p2d(prevSelection.second.x);

    
    $('dateRange').update(jsonData[xmin].date + ' - ' + jsonData[xmax].date);
   
    Event.observe(HumbleFinance.containers.summary, 'flotr:select', function (e) {
        
        var area = e.memo[0];
        xmin = Math.floor(area.x1);
        xmax = Math.ceil(area.x2);
        
        var date1 = jsonData[xmin].date;
        var date2 = jsonData[xmax].date;
        
        $('dateRange').update(jsonData[xmin].date + ' - ' + jsonData[xmax].date);
    });
});