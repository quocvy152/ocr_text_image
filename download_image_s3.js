const fs = require('fs').promises; // Sử dụng fs.promises để có thể sử dụng writeFile với async/await
const fetch = require('node-fetch');
const path = require('path');

const { readDataIdentifyCardFromExcel } = require('./read_excel');

const fetchDataFaceImage = async (s3ImageUrl, deviceID, sessionID) => {
    try {
        const resultFetch = await fetch(s3ImageUrl);

        if (!resultFetch.ok) {
            throw new Error('Network response was not ok');
        }

        // Lấy blob của hình ảnh từ phản hồi
        const imageBlob = await resultFetch.blob();

        // Đọc dữ liệu từ blob dưới dạng ArrayBuffer
        const arrayBuffer = await imageBlob.arrayBuffer();

        // Tạo một Buffer từ ArrayBuffer
        const buffer = Buffer.from(arrayBuffer);

        // Ghi buffer của hình ảnh vào thư mục cục bộ trong dự án
        const filePath = path.join('./image/s3/faceImages/', `${sessionID}___${deviceID}.png`);
        await fs.writeFile(filePath, buffer);
        console.log('Success image' + `${deviceID}`)
        return {
            error: false,
            message: 'Image saved successfully.'
        };
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return {
            error: true,
            message: 'There was a problem with the fetch operation'
        };
    }
};

const runJobDownloadImageS3 = async () => {
    const listDataCustomerIdentifyCard = await readDataIdentifyCardFromExcel('./customer_identity_cards.xlsx');
    const listPromiseDownloadImage = listDataCustomerIdentifyCard.map(elemCustomerIdentifyCard => fetchDataFaceImage(elemCustomerIdentifyCard?.faceImage, elemCustomerIdentifyCard?.deviceID, elemCustomerIdentifyCard?.sessionID));
    const handlePromiseAll = await Promise.all(listPromiseDownloadImage);
    console.log({ handlePromiseAll })
}

runJobDownloadImageS3()

// module.exports = { fetchDataFaceImage };