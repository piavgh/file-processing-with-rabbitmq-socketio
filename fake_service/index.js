require('dotenv').config();
const fs = require('fs');
const path = require('path');
const inputPath = path.resolve(__dirname, '..', process.env.INPUT_FOLDER);
const outputPath = path.resolve(__dirname, '..', process.env.OUTPUT_FOLDER);

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

sleep = (sec) => {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
};

let processRunning = true;

if (!fs.existsSync(inputPath)) {
    fs.mkdirSync(inputPath);
}

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

const main = async () => {
    while (processRunning) {
        const files = fs.readdirSync(inputPath);

        if (files.length > 0) {
            // processRunning = false;
            const content = Math.floor(new Date() / 1000);
            const filePath = path.resolve(outputPath, 'Thinking.txt');

            try {
                console.log('Create file Thinking.txt');
                fs.writeFileSync(filePath, content);
            } catch (e) {
                console.log('Cannot write file ', e);
            }

            const sec = getRandomNumber(7, 10);
            console.log(`Will remove file Thinking.txt after ${sec} seconds`);
            await sleep(sec);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            console.log('Moving file from Input folder to Output folder');
            fs.renameSync(path.resolve(inputPath, files[0]), path.resolve(outputPath, files[0]));
            console.log('File moved');
        }
    }
};

main();
