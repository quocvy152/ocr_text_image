// Include the SheetJS library
const XLSX = require('xlsx');

// Load the Excel file
const workbook = XLSX.readFile('./customer_identity_cards.xlsx');

// Assuming there's only one sheet in the Excel file
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Specify the column you want to read (A in this example)
const column = 'faceInfo.faceImages';

// Parse only the specified column data
const columnData = XLSX.utils.sheet_to_json(sheet, {
  header: 1,
  range: column // specify the range to read only one column
});

console.log(columnData);
