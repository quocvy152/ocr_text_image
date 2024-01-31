// Include the SheetJS library
const XLSX = require('xlsx');

const readDataIdentifyCardFromExcel = async (path) => {
    const workbook = XLSX.readFile(path);

    // Assuming there's only one sheet in the Excel file
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Specify the column you want to read (deviceName in this example)
    const columnNameFaceImage = 'E';
    const columnNameDeviceID = 'B';
    const columnNameSessionID = 'AC';

    // Initialize the row index
    let rowIndex = 2;

    // Find the last row index with data in the specified column
    while (sheet[`${columnNameFaceImage}${rowIndex}`] && sheet[`${columnNameFaceImage}${rowIndex}`].v) {
        rowIndex++;
    }

    // Read values of all rows in the specified column
    const listDataCustomerIdentifyCard = [];
    for (let i = 2; i < rowIndex; i++) {
        const faceImages = JSON.parse(sheet[`${columnNameFaceImage}${i}`].v); // parse dữ liệu faceImages thành array

        listDataCustomerIdentifyCard.push({
            faceImage: faceImages[faceImages.length - 1],  // lấy ra dữ liệu cuối cùng
            deviceID: sheet[`${columnNameDeviceID}${i}`].v,
            sessionID: sheet[`${columnNameSessionID}${i}`].v,
        });
    }

    return listDataCustomerIdentifyCard;
}

module.exports = { readDataIdentifyCardFromExcel }