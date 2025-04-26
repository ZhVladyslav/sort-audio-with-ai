const fs = require('fs');
const path = require('path');
const similarity = require('string-similarity');
const axios = require('axios');

// 
// config
// 

const songs = JSON.parse(fs.readFileSync('assets/songs.json', 'utf-8'));
const dirWithFilesToSort = 'audio'
const aiUrl = "http://localhost:3000"
const minSimilary = 0.4
const stepSimilary = 0.01

// 
// 
// 

const getFilesToSort = () => {
    const res = fs.readdirSync(dirWithFilesToSort)
    return res.reverse()
}

const getTextWithFile = async (filename) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${aiUrl}/transcribe`,
            data: { filename }
        })

        return res.data.text
    } catch (err) {
        console.error(err)
    }
}

const findSimilaryText = (textToFind) => {
    const songsLength = songs.length

    for (let i = 0; i < songsLength; i++) {
        const res = similarity.compareTwoStrings(songs[i].text, textToFind)

        if (res < minSimilary) {
            continue
        }

        let j = 1.0;
        while (j >= minSimilary) {
            if (res >= j) {
                return songs[i].target
            }

            j = Math.round((j - stepSimilary) * 100) / 100;
        }
    }

    return null
}

const moveFile = (filename, moveToPath) => {
    const outputFile = path.join(dirWithFilesToSort, filename);
    const newPath = path.join(moveToPath, filename);

    if (!fs.existsSync(outputFile)) {
        return;
    }

    if (!fs.existsSync(moveToPath)) {
        fs.mkdirSync(moveToPath, { recursive: true });
    }

    fs.rename(outputFile, newPath, (err) => {
        if (err) throw err
    })
}

const createTime = () => {
    const d = new Date()

    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    const s = d.getSeconds().toString().padStart(2, '0');

    return `${h}:${m}:${s}`
}

// 
// 
// 

const init = async () => {
    try {
        const filesToSort = getFilesToSort()
        const filesToSortLength = filesToSort.length

        for (let i = 0; i < filesToSortLength; i++) {
            
            const fileText = await getTextWithFile(filesToSort[i])
            const moveTarget = findSimilaryText(fileText)
            
            if (!moveTarget) {
                console.log(`No match "${i}" with "${filesToSortLength}", time: ${createTime()}, name: ${filesToSort[i]}`)
                continue
            }
            
            moveFile(filesToSort[i], moveTarget)
            console.log(`Match "${i}" with "${filesToSortLength}", time: ${createTime()}, name: ${filesToSort[i]}, target: ${moveTarget}`)
        }

        console.log('Done')
    } catch (err) {
        console.error(err)
    }
}

init()