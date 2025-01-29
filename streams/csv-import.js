import { parse } from 'csv-parse'
import fs from 'node:fs'

const pathCSV = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(pathCSV)

const parseCSV = parse({
    delimiter: ';',
    skipEmptyLines: true,
    fromLine: 2
})

async function run() {
    const linesParse = stream.pipe(parseCSV)

    for await (const line of linesParse) {
        const [title, description] = line


        await fetch('http://localhost:3334/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                title,
                description
            })
        })

        await wait(1000)
    }
}

run()

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}