var CCC = CCC || {};

CCC.STATIC = CCC.STATIC || {};

CCC.STATIC.TYPE = {
	"TRADE"                  : "0"
  , "FEEDNEWS"               : "1"
  , "CURRENT"                : "2"
  , "LOADCOMPLATE"           : "3"
  , "COINPAIRS"              : "4"
  , "CURRENTAGG"             : "5"
  , "TOPLIST"                : "6"
  , "TOPLISTCHANGE"          : "7"
  , "ORDERBOOK"              : "8"
  , "FULLORDERBOOK"          : "9"
  , "ACTIVATION"             : "10"

  , "TRADECATCHUP"           : "100"
  , "NEWSCATCHUP"            : "101"
  
  , "TRADECATCHUPCOMPLETE"   : "300"
  , "NEWSCATCHUPCOMPLETE"    : "301"
};

CCC.STATIC.CURRENCY = CCC.STATIC.CURRENCY || {};

CCC.STATIC.CURRENCY.SYMBOL = {

	'BTC'  : 'Ƀ'
  , 'LTC'  : 'Ł'
  , 'DAO'  : 'Ð'
  , 'USD'  : '$'
  , 'CNY'  : '¥'
  , 'EUR'  : '€'
  , 'GBP'  : '£'
  , 'JPY'  : '¥'
  , 'PLN'  : 'zł'
  , 'RUB'  : '₽'
  , 'ETH'  : 'Ξ'
  , 'GOLD' : 'Gold g'
  , 'INR'  : '₹'
  , 'BRL'  : 'R$'

};

CCC.STATIC.CURRENCY.getSymbol = function(symbol){
	return CCC.STATIC.CURRENCY.SYMBOL[symbol] || symbol;
}

CCC.TRADE = CCC.TRADE || {};

CCC.TRADE.FIELDS = {

    'T'          : 0x0  // hex for binary 0, it is a special case of fields that are always there TYPE
  , 'M'          : 0x0  // hex for binary 0, it is a special case of fields that are always there MARKET
  , 'FSYM'       : 0x0  // hex for binary 0, it is a special case of fields that are always there FROM SYMBOL
  , 'TSYM'       : 0x0  // hex for binary 0, it is a special case of fields that are always there TO SYMBOL
  , 'F'          : 0x0  // hex for binary 0, it is a special case of fields that are always there FLAGS
  , 'ID'         : 0x1  // hex for binary 1                                                       ID
  , 'TS'         : 0x2  // hex for binary 10                                                      TIMESTAMP
  , 'Q'          : 0x4  // hex for binary 100                                                     QUANTITY
  , 'P'          : 0x8  // hex for binary 1000                                                    PRICE
  , 'TOTAL'      : 0x10 // hex for binary 10000                                                   TOTAL

};

CCC.TRADE.DISPLAY = CCC.TRADE.DISPLAY || {};
CCC.TRADE.DISPLAY.FIELDS = {

    'T'          : {"Show":false}
  , 'M'          : {"Show":true, 'Filter':'Market'}
  , 'FSYM'       : {"Show":true, 'Filter':'CurrencySymbol'}
  , 'TSYM'       : {"Show":true, 'Filter':'CurrencySymbol'}
  , 'F'          : {"Show":true, 'Filter':'TradeFlag'}
  , 'ID'         : {"Show":true, 'Filter':'Text'}
  , 'TS'         : {'Show':true, 'Filter':'Date'  , 'Format':'yyyy MMMM dd HH:mm:ss'}
  , 'Q'          : {'Show':true, 'Filter':'Number', 'Symbol':'FSYM'}
  , 'P'          : {'Show':true, 'Filter':'Number', 'Symbol':'TSYM'}
  , 'TOTAL'      : {'Show':true, 'Filter':'Number', 'Symbol':'TSYM'}

};

CCC.TRADE.unpack = function(tradeString){

	var valuesArray = tradeString.split("~");
	var valuesArrayLength = valuesArray.length;
	var mask = valuesArray[valuesArrayLength-1];
	var maskInt = parseInt(mask,16);
	var unpackedTrade = {};
	var currentField = 0;
	for (var property in this.FIELDS){
		if(this.FIELDS[property] === 0){
			unpackedTrade[property] = valuesArray[currentField];
			currentField++;
		}
		else if(maskInt&this.FIELDS[property]){
			unpackedTrade[property] = valuesArray[currentField];
			currentField++;
		}
	}
	return unpackedTrade;

}

CCC.convertValueToDisplay =  function(symbol,value,type,fullNumbers){
    var prefix = '';
    var valueSign=1;
    value = parseFloat(value);
    var valueAbs=Math.abs(value);
    var decimalsOnBigNumbers = 2;
    var decimalsOnNormalNumbers = 2;
    var decimalsOnSmallNumbers = 4;
    if(fullNumbers===true){
      decimalsOnBigNumbers =2;
      decimalsOnNormalNumbers = 0;
      decimalsOnSmallNumbers= 4;
    }
    if(symbol!=''){
      prefix = symbol+' ';
    }
    if(value<0){
      valueSign = -1;
    }
    
    if(value==0){
      return prefix+'0';
    }
    
    if(value<0.00001000 && value>=0.00000100 && decimalsOnSmallNumbers>3){
      decimalsOnSmallNumbers=3;
    }
    if(value<0.00000100 && value>=0.00000010 && decimalsOnSmallNumbers>2){
      decimalsOnSmallNumbers=2;
    }
    if(value<0.00000010 && value>=0.00000001 && decimalsOnSmallNumbers>1){
      decimalsOnSmallNumbers=1;
    }
    
    if(type=="short"){
      if(valueAbs>10000000000){
        valueAbs=valueAbs/1000000000;
        return prefix+CCC.filterNumberFunctionPolyfill(valueSign*valueAbs,decimalsOnBigNumbers)+' B';
      }
      if(valueAbs>10000000){
        valueAbs=valueAbs/1000000;
        return prefix+CCC.filterNumberFunctionPolyfill(valueSign*valueAbs,decimalsOnBigNumbers)+' M';
      }
      if(valueAbs>10000){
        valueAbs=valueAbs/1000;
        return prefix+CCC.filterNumberFunctionPolyfill(valueSign*valueAbs,decimalsOnBigNumbers)+' K';
      }
      if(valueAbs>=1){
        return prefix+CCC.filterNumberFunctionPolyfill(valueSign*valueAbs,decimalsOnNormalNumbers);
      }
      return prefix+(valueSign*valueAbs).toPrecision(decimalsOnSmallNumbers);
    }else{
      if(valueAbs>=1){
        return prefix+CCC.filterNumberFunctionPolyfill(valueSign*valueAbs,decimalsOnNormalNumbers);
      }
      
      return prefix+CCC.noExponents((valueSign*valueAbs).toPrecision(decimalsOnSmallNumbers));
    }
  };











