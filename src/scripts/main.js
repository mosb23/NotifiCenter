const { Worker } = require('worker_threads');
const path = require('path');
const { readExcelRows } = require('./excel');

const BATCH_SIZE = 1000;

async function runWorker(batch) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, '../workers/worker.js'));
    worker.postMessage(batch);

    worker.on('message', (msg) => {
      if (msg.success) {
        resolve(msg.count);
      } else {
        reject(new Error(msg.error));
      }
      worker.terminate();
    });

    worker.on('error', reject);
  });
}

async function importExcel(filePath) {
  let batch = [];
  for await (const row of readExcelRows(filePath)) {
    batch.push(row);

    if (batch.length === BATCH_SIZE) {
      await runWorker(batch);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await runWorker(batch);
  }

  console.log('Import finished!');
}

const filePath = "C:\\Users\\mosb2\\OneDrive\\Desktop\\test_users_100k.xlsx";    //file path
importExcel(filePath)
  .then(() => console.log("Import complete!"))
  .catch((err) => console.error("Import failed:", err));
