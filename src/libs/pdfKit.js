import PDFDocument from 'pdfkit';
import fs from "fs";
import path from "path"; // Importamos la librería path para trabajar con rutas de archivos

export function buildPDF(filePath, dataCallBack, endCallBack) {
  const doc = new PDFDocument();

  // Leemos el archivo db.json
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const beersData = JSON.parse(data); // Analizamos el contenido JSON

    // Aquí puedes acceder a los datos y pintarlos en el PDF
    // Por ejemplo, para acceder a la lista de cervezas:
    const beers = beersData.beers;

    // Pintamos los datos de las cervezas en el PDF
    beers.forEach(beer => {
      doc.text(`Name: ${beer.name}`);
      doc.text(`Description: ${beer.descripcion}`);
      doc.text(`Alcohol: ${beer.alcohol}`);
      doc.text(`Company: ${beer.company}`);
      doc.text(`Category: ${beer.category}`);
      doc.text(`Availability: ${beer.disponibility ? 'Available' : 'Not Available'}`);
      doc.moveDown(); // Moverse a la siguiente línea
    });

    // Cuando terminamos de escribir en el PDF, llamamos a los callbacks
    doc.end();
    doc.on('data', dataCallBack);
    doc.on('end', endCallBack);
  });
}
