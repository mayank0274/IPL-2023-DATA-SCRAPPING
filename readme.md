## IPL 2023 Data Scrapping

<b> <i> This is for education/learning purpose only </i> </b>

This repo scraps IPL 2023 data from [Cricbuzz website](https://m.cricbuzz.com)
and store batsman data in files

## Dependencies used

• axios - for getting html

• cheerio - for scraping data

• xlsx - for creating excel files

## Result folder structure

```
ipl/
| -- team1 /  contains excel files of all batsman of that team of all matches played by him with data like name,tean name, opponent team , winning team , four, sixes, runs , venue , date , strike rate
| -- team2 /
|     -
|     -
| -- team n /

```

## Installing
Clone or download this repo , after run these commands

• ``` npm install ``` - for installing all Dependencies

• ``` node ipl2023 ``` - this will start scrapping data 
