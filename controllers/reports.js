const PDFDocument = require('pdfkit');
const Evento = require('../models/Evento');

const generarReporteEventos = async (req, res) => {
    try {
        const eventos = await Evento.find().populate('user', 'name'); 

        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="reporte-eventos.pdf"');
            res.send(pdfData);
        });

        doc.fontSize(20).text('Reporte de Eventos', { align: 'center' }).moveDown();

        eventos.forEach((evento, index) => {
            doc.fontSize(16).text(`Evento ${index + 1}`, { underline: true });
            doc.fontSize(14).text(`Título: ${evento.title}`);
            doc.fontSize(12).text(`Notas: ${evento.notes || 'N/A'}`);
            doc.fontSize(12).text(`Inicio: ${evento.start}`);
            doc.fontSize(12).text(`Fin: ${evento.end}`);
            doc.fontSize(12).text(`Usuario: ${evento.user.name}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Error al generar el reporte de eventos:', error);
        res.status(500).json({ msg: 'Error al generar el reporte de eventos' });
    }
};

module.exports = {
    generarReporteEventos,
};
