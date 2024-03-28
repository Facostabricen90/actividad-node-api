import PDFDocument from 'pdfkit';
import fs from "fs";
import path from "path"; 

export function buildPDF(filePath, dataCallBack, endCallBack) {
  const doc = new PDFDocument();

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const beersData = JSON.parse(data); 

    const beers = beersData.beers;

    beers.forEach(beer => {
      doc.text(`Name: ${beer.name}`);
      doc.text(`Description: ${beer.descripcion}`);
      doc.text(`Alcohol: ${beer.alcohol}`);
      doc.text(`Company: ${beer.company}`);
      doc.text(`Category: ${beer.category}`);
      doc.text(`Availability: ${beer.disponibility ? 'Available' : 'Not Available'}`);
      doc.moveDown(); // Moverse a la siguiente línea
    });

    doc.end();
    doc.on('data', dataCallBack);
    doc.on('end', endCallBack);
  });
}
