const ExcelJS = require('exceljs');

async function* readExcelRows(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1); // or by name

  for (let i = 2; i <= worksheet.rowCount; i++) { // Start from row 2 to skip header
    const row = worksheet.getRow(i);
    yield {
      username: row.getCell(1).text,
      password: row.getCell(2).text,
    };
  }
}

module.exports = { readExcelRows };
