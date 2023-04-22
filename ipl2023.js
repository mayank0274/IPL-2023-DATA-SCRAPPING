const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const {createDir,createExcelFile,readExcelFile} = require("./utilityFunctions");

// ipl folder path 
const iplFolderPath = path.join(__dirname,"ipl");
createDir(iplFolderPath);

// get html from link
const getHTML = async (url)=>{
  try{
    const { data } = await axios.get(url);
    return data;
  }catch(err){
    console.log(err.message);
  }
}

// get all matches links
const getAllMatchesLink = async ()=>{
  const url = "https://m.cricbuzz.com/cricket-series/5945/indian-premier-league-2023/matches";
  
  const htmlData = await getHTML(url);
  const $ = cheerio.load(htmlData);
  const linksHTML = $("a.list-group-item.cb-list-group-item.cb-match-list-group-item");
  for(let i=0;i<linksHTML.length;i++){
   
    const link = $(linksHTML[i]).attr("href");
    const matchFullLink = `https://m.cricbuzz.com${link}`;
  await getScorecard(matchFullLink);
   
  }
}

// get scorcard page link from specific match page
async function getScorecard(url){
  const htmlData = await getHTML(url);
   const $ = cheerio.load(htmlData);
   const btnGroup = $("div.cbz-btn-group .btn-default");
   const scorecard = $(btnGroup[0]).attr("href");
  const scorecardLink = `https://m.cricbuzz.com${scorecard}`;
  if(!scorecardLink.includes("scorecard")){
    console.log(" \n => data not found   or matches yet to be played\n");
    process.exit(0);
  }
  
 await getMatchDetalis(scorecardLink);
}

// get innings details and save them into directory
function getInningsDetails($,inning,commonDetails,team){
    const data = $(`${inning} div:nth-of-type(1) .table-responsive`);
    //getting batsman details and saving it
    console.log("************************************");
    for(let i=1;i<data.length;i++){
     const playerInfo = $(data[i]).find(".active td");
   
     const playerName = $(playerInfo[0]).text();
     const runs = $(playerInfo[1]).text()
     const fours = $(playerInfo[2]).text()
     const sixes = $(playerInfo[3]).text()
     const strikeRate = $(playerInfo[4]).text()
   const [team1,team2Opponent,winningTeam,date,venue] = commonDetails;
   const teamPath = path.join(__dirname,`ipl/${team.trim()}`);
   
   // creating team folder
   createDir(teamPath);
   
   // batsman file
   const filepath = path.join(teamPath,`${playerName}.xlsx`);
   
   // batsman details json
   const details = {
     team,
     playerName,
     "Runs(B)":runs,
     fours,
     sixes,
     strikeRate,
     venue,
     date,
     "opponent":(team==team1) ? team2Opponent : team1,
     winningTeam
   };
   
   // read batsman file if exist otherwise return empty array
   const content = readExcelFile(filepath,playerName);
   
   // add new record to batsman file
   content.push(details);
   
   // if batsman file not exist in particular team folder create it otherwise new record add
   createExcelFile(content,filepath,playerName);
 
console.log(`\n ${playerName} | ${runs} | ${fours} | ${sixes} | ${strikeRate}`);
    } 
    
}

// get match details
async function getMatchDetalis(url){
  const htmlData = await getHTML(url);
   const $ = cheerio.load(htmlData);
   const winningTeam = $(".cbz-ui-status").text().split("won")[0];
   const date = $("#top > div.cb-container.container-fluid > div.row.cb-list-item > div.list-group > div:nth-child(2) > div > div > div").text();
   const venue = $("#top > div.cb-container.container-fluid > div.row.cb-list-item > div.list-group > div:nth-child(5) > div > div > div").text();
 
   const team1 = $("#top > div.cb-container.container-fluid > div.btn-group.cbz-btn-group > a:nth-child(1)").attr("title").split("-")[0];
   
   
   const team2Opponent = $("#top > div.cb-container.container-fluid > div.btn-group.cbz-btn-group > a:nth-child(2)").attr("title").split("-")[0];
   
  console.log("*****************************************");
  
  console.log(`\n ${winningTeam} | ${date} | ${venue} | ${team1} vs ${team2Opponent}`);
  
   const commonDetails = [team1,team2Opponent,winningTeam,date,venue];
   getInningsDetails($,"#inn_1",commonDetails,team1);
   getInningsDetails($,"#inn_2",commonDetails,team2Opponent);
}

// calling matches detail function other necessary functions are called after this => result all match details
getAllMatchesLink();

