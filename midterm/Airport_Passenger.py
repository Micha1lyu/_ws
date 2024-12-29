from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import matplotlib.pyplot as plt
import sqlite3
import os

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

service = Service('D:/Michael/113-1python/chromedriver-win64/chromedriver.exe')
driver = webdriver.Chrome(service=service, options=chrome_options)

driver.get('https://www.kma.gov.tw/BulletinBoard/StatPassenger.aspx?1=1&MenuID=423')
html = driver.page_source
soup = BeautifulSoup(html, 'lxml')

# 5年淡旺季
all_trs = soup.find_all('tr')

data_dict = {
    '108 年': [],
    '107 年': [],
    '106 年': [],
    '105 年': [],
    '104 年': [],
}

target_trs = []

for year in ['108 年', '107 年', '106 年', '105 年', '104 年']:
    for tr in all_trs:
        if tr.find('td', string=year) and not tr.find('td', string='113 年'):
            target_trs.append(tr)

    for target_tr in target_trs:
        tds = target_tr.find_all('td')
        numbers = [td.text for td in tds if td.text != year]
        if numbers:
            data_dict[year] = numbers 

    target_trs.clear()

totals = {}
for year in data_dict.keys():
    totals[year] = float(data_dict[year].pop())

# 畫圖區
for year in ['108 年', '107 年', '106 年', '105 年', '104 年']:
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    sizes = [(float(data_dict[year][i]) * 100 / totals[year]) for i in range(12)]
    colors = ["#B3CDE0", "#FBB4AE", "#CCEBC5", "#FED9A6", "#FFFFCC", "#D9F0A3", "#A6D96A", "#FFED6F", "#F4A582", "#E78AC3", "#BC80BD", "#C2A5CF"]

    plt.figure(figsize=(5, 4))
    plt.pie(sizes, labels=labels, colors=colors, autopct='%1.2f%%', shadow=True, startangle=90, counterclock=False)
    plt.title(f'Kinmen Airport Passenger Analysis in {year[:-1]}')
    plt.axis('equal')
    plt.show()

driver.quit()

db_path = 'passenger_data.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS passengers
                  (year TEXT, month TEXT, count INTEGER)''')

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

for year, data in data_dict.items():
    for i, count in enumerate(data):
        cursor.execute('INSERT INTO passengers (year, month, count) VALUES (?, ?, ?)',
                       (year, months[i], int(count)))
conn.commit()
conn.close()

print(f"資料已儲存至 SQLite 資料庫：{os.path.abspath(db_path)}")
