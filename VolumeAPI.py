import json
import requests
import time
import Excelout
import collections
from datetime import datetime
from pprint import pprint

def getVols(coins,outSym,exchanges):
	# inSym --> List
	# outSym --> String
	# exchanges --> List
	# Returns coinList --> JSON style dictionary

	coinList = {}

	for coin in coins:
		for exchange in exchanges:
			src = "https://min-api.cryptocompare.com/data/histominute?fsym=" + coin + "&tsym=" + outSym + "&limit=1&aggregate=5&e=" + exchange
			request = requests.get(src)
			priceind = request.json()
			if(priceind["Response"] == "Error"):
				if coin in coinList:
					coinList[coin][exchange] = "No Data"
				else:
					coinList[coin] = {}
					coinList[coin][exchange] = "No Data"
			else:

				fiveMinuteVol = priceind["Data"][0]["volumefrom"]
				if coin in coinList:
					coinList[coin][exchange] = fiveMinuteVol
				else:
					coinList[coin] = {}
					coinList[coin][exchange] = fiveMinuteVol
	return coinList




# Max 15 coins in coinlist due to api restriction
coins = ["ETH","LTC","RDD"]
outSym = "BTC"
exchanges = ["Bisq","QuadrigaCX","Binance","Kucoin"]


exchangeDict = {"Exchanges":exchanges}
coinList = getVols(coins,outSym,exchanges)
	
pprint(coinList)

Excelout.output("test.xlsx","Sheet1",exchangeDict,"Exchanges",coinList)

