import xlwt
import pandas as pd
import xlsxwriter

def output(filename, sheet, exchanges,x,coinList):
    l1 = [1,2,3,4]
    l2 = [1,2,3,4]

    df = pd.DataFrame(coinList)
    df2 = pd.DataFrame(exchanges)

    writer = pd.ExcelWriter(filename, engine="xlsxwriter")
    df.to_excel(writer, sheet_name=sheet,index=False,startcol=1)
    df2.to_excel(writer, sheet_name=sheet,index=False, startcol=0)

    workbook  = writer.book
    worksheet = writer.sheets[sheet]


