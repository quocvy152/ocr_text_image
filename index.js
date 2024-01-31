const { createWorker }  = require('tesseract.js');
const fs  = require('fs');

function getSecurityUUID(uuid) {
    // Lấy ra 3 kí tự cuối ở đoạn đầu trước dấu '-'
    let firstPart = uuid.split('-')[0].slice(-3);
  
    // Lấy ra 2 kí tự trước kí tự cuối cùng của chuỗi
    let lastPart = uuid.slice(-3, -1);
  
    // Kết hợp 2 chuỗi này lại với nhau
    let result = firstPart + lastPart;
  
    return result;
}

(async () => {
    const worker = await createWorker({
        // logger: m => console.log(m)
    });

    await worker.loadLanguage('vie');
    await worker.initialize('vie');

    fs.readdir('./image/s3/faceImages', async (err, files) => {
        if (err) {
          console.error('Error reading folder:', err);
          return;
        }

        for(const file of files) {
            const { data: { text } } = await worker.recognize('./image/s3/faceImages/' + file);
            
            let arrLine = text.split(`\n`);

            const arrSplitFileName = file.split('___');

            let resultList = arrLine.filter(line => {
                const regexOrderNumber = /(xxxID|yyyID|yyylD|yyVID|yyyIlD)/g;
                const foundOrderNumber = line.match(regexOrderNumber);

                if (foundOrderNumber && foundOrderNumber.length)
                    return line;
            })

            const sessionID = arrSplitFileName[0];
            const deviceID = arrSplitFileName[1]?.substring(0, arrSplitFileName[1]?.indexOf('.png'));

            const sessionIDSecurityInImage = resultList[0]?.substring(resultList[0]?.indexOf(' ') + 1);
            const deviceIDInImage = resultList[1]?.substring(resultList[1]?.indexOf(' ') + 1);

            if(getSecurityUUID(sessionID) == sessionIDSecurityInImage || deviceID == deviceIDInImage) {
                console.table({
                    sessionID,
                    isRealData: true  
                })
            } else {
                console.table({
                    sessionID,
                    isRealData: false  
                })
            }
            // console.table({
            //     sessionID_Image: sessionIDSecurityInImage,
            //     sessionID,
            //     deviceID_Image: deviceIDInImage,
            //     deviceID,
            //     isMatchedSessionID: getSecurityUUID(sessionID) == sessionIDSecurityInImage,
            //     isMatchedDeviceID: deviceID == deviceIDInImage
            // })
        }

        await worker.terminate();
    });
})();