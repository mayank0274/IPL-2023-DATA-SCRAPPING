const fs = require("fs");
const xlsx = require("xlsx");

const createDir = (Path)=>{
  if(!fs.existsSync(Path)){
    fs.mkdirSync(Path);
  }
}

const createExcelFile = (data,filepath,sheetName)=>{
  const workbook = xlsx.utils.book_new();
  const sheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook,sheet,sheetName);
  xlsx.writeFile(workbook,filepath);
}

const readExcelFile = (filepath,sheetName)=>{
  if(!fs.existsSync(filepath)){
    return [];
  }
  const workbook = xlsx.readFile(filepath);
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  return data;
}

const utilityFunctions = {createDir,createExcelFile,readExcelFile};

module.exports = utilityFunctions;