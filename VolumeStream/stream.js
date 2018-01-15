var streamUrl = "https://streamer.cryptocompare.com/";
var fsym = "BTC";
var tsym = "USD";
var currentSubs;
var currentSubsText = "";
var dataUrl = "https://min-api.cryptocompare.com/data/subs?fsym=" + fsym + "&tsyms=" + tsym;
var socket = io(streamUrl)

$.getJSON(dataUrl, function(data){

	currentSubs = data["USD"]["TRADES"];
	console.log(data);
	for(var i=0;i<currentSubs.length;i++){
		currentSubsText+=currentSubs[i]+", ";
	}
	$("#sub-exchanges").text(currentSubsText);
	socket.emit("SubAdd",{subs: currentSubs});

});

socket.on("m", function(currentData){

	var tradeField = currentData.substr(0,currentData.indexOf("~"));
	if(tradeField == CCC.STATIC.TYPE.TRADE){
		transformData(currentData);
	}
	
});

var transformData = function(data){

	var coinfsym = CCC.STATIC.CURRENCY.getSymbol(fsym);
	var cointsym = CCC.STATIC.CURRENCY.getSymbol(tsym);
	var incomingTrade = CCC.TRADE.unpack(data);
	var newTrade = {
		Market: incomingTrade["M"],
		Type: incomingTrade["T"],
		ID: incomingTrade["ID"],
		Price: CCC.convertValueToDisplay(cointsym,incomingTrade["P"]),
		Quantity: CCC.convertValueToDisplay(coinfsym, incomingTrade["Q"]),
		Total: CCC.convertValueToDisplay(cointsym, incomingTrade["TOTAL"])
	};

	if(incomingTrade["F"] & 1){
		newTrade["Type"] = "SELL";
	}
	else if(incomingTrade["F"] & 2){
		newTrade["Type"] = "BUY";
	}
	else{
		newTrade["Type"] = "UNKNOWN";
	}

	displayData(newTrade,incomingTrade["Q"],data);

};

var displayData = function(dataUnpacked,quantity,rawData){

	var maxTableSize = 30;
	var length = $("table tr").length;
	$("#trades").after("<tr class=" + dataUnpacked.Type + "><th>" + dataUnpacked.Market + "</th><th>" + dataUnpacked.Type + "</th><th>" + dataUnpacked.ID + "</th><th>" + dataUnpacked.Price + "</th><th>" + dataUnpacked.Quantity + "</th><th>" + dataUnpacked.Total + "</th></tr>");

	calcVol(quantity,rawData);

	if(length >= maxTableSize){
		//$("table tr:last").remove();
	}

};

var exchangeVolumes = {"TotalVolume":0.0};

var exchangeList = [];
var flag = true;

var calcVol = function(data,rawData){
	var quant = parseFloat(data)

	var exchangeInds = rawData.split("~");
	var exchange = exchangeInds[1];

	if (exchange in exchangeVolumes){

	}
	else{
		exchangeList.push(exchange);
	}

	exchangeVolumes[exchange] = exchangeVolumes[exchange]+quant;
	exchangeVolumes["TotalVolume"] = exchangeVolumes["TotalVolume"]+quant;

	console.log("exchangeVolumes: "+exchangeVolumes["Cryptsy"]);
	console.log("exchangeList: "+exchangeList);
	

	
};

/* ----------------------------------------- */
var exchangeVolList = [];




setInterval(function(){ 
	console.log(Date());
	
	for(var ex in exchangeList){
		exchangeVolList.push(exchangeVolumes[ex]);
	}

	//console.log(exchangeVolumes);
	//console.log(exchangeVolList);
	setChart();

	for (var exchanges in exchangeVolumes){
		exchangeVolumes[exchanges] = 0;
	}

	
	exchangeVolList = [];
	exchangeVolumes = [];
	
}, 10000);


/* ------------------------------------------ */



$('#unsubscribe').click(function() {
	console.log('Unsubscribing to streamers');
	$('#subscribe').removeClass('subon');
	$(this).addClass('subon');
	$('#stream-text').text('Stream stopped');
	socket.emit('SubRemove', { subs: currentSubs });
	$('#sub-exchanges').text("");
});

$('#subscribe').click(function() {
	console.log('Subscribing to streamers')
	$('#unsubscribe').removeClass('subon');
	$(this).addClass('subon');
	$('#stream-text').text("Streaming...");
	socket.emit('SubAdd', { subs: currentSubs });
	$('#sub-exchanges').text(currentSubsText);
});
























