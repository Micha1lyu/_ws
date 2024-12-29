import requests
import matplotlib
import matplotlib.pyplot as plt
import sqlite3
import os
from bs4 import BeautifulSoup
from matplotlib import font_manager
matplotlib.rc('font', family='Microsoft JhengHei')

url2 = 'https://www.uniair.com.tw/rwd/CMS/service/ticket_price'
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
}

response = requests.get(url2, headers=headers)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'lxml')

    all_rows = soup.find_all('tr', class_=['row0', 'row1'])
    
    data_dict = {'地點': [], '票價': []}

    for row in all_rows:
        tds = row.find_all('td')
        if len(tds) >= 3: 
            location = tds[0].text.strip()  
            price_full_tax = tds[1].text.strip() 
            price_no_tax = tds[2].text.strip()  

            data_dict['地點'].append(location) 
            data_dict['票價'].append(price_full_tax)
    font_path = 'C:/Windows/Fonts/simhei.ttf'  
    my_font = font_manager.FontProperties(fname=font_path)


    prices = [int(price.replace(',', '')) for price in data_dict['票價']]
    plt.figure(figsize=(10, 6))
    plt.barh(data_dict['地點'], prices, color='skyblue')
    plt.xlabel('票價(NTD)')
    plt.title('立榮航空國內線票價')
    plt.grid(axis='x')
    plt.show()


    conn = sqlite3.connect('flight_data.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS flight_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location TEXT NOT NULL,
            price INTEGER NOT NULL
        )
    ''')
    
    for loc, price in zip(data_dict['地點'], data_dict['票價']):
        cursor.execute('INSERT INTO flight_prices (location, price) VALUES (?, ?)', (loc, int(price.replace(',', ''))))
    
    conn.commit()
    conn.close()
    
    print("資料已儲存至 SQLite 資料庫")
    print("資料庫儲存位置:", os.path.abspath('flight_data.db'))

else:
    print("請求失敗，狀態碼:", response.status_code)
