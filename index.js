let { createWorker }  = require('tesseract.js');

(async () => {
    const worker = await createWorker({
        logger: m => console.log(m)
    });

    await worker.loadLanguage('vie');
    await worker.initialize('vie');
    // const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
    // const { data: { text } } = await worker.recognize('./demo_shopee_level_2.jpg');
    // const { data: { text } } = await worker.recognize('./images/shopee/shopee.level2.4.jpg');
    const { data: { text } } = await worker.recognize('./demo_3.jpeg');
    let arrLine = text.split(`\n`);
    console.log({
        arrLine
    })
    let resultList = arrLine.filter(line => {
        const regexOrderNumber = /xxxID/g;
        const foundOrderNumber = line.match(regexOrderNumber);
        if (foundOrderNumber && foundOrderNumber.length)
            return line;
    })

    // danh sách các món
    console.table(resultList)
   
    await worker.terminate();
})();