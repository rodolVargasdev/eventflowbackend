const PDFDocument = require('pdfkit');
const Evento = require('../models/Evento');

const generarReporteEventos = async (req, res) => {
    try {
        const eventos = await Evento.find().populate('user', 'name'); 

        const doc = new PDFDocument({ margin: 30 });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="reporte-eventos.pdf"');
            res.send(pdfData);
        });

        // Encabezado
        doc.fontSize(20).fillColor('#4a4a4a').text('Reporte de Eventos', { align: 'center' }).moveDown(0.5);
        doc.moveTo(30, 50).lineTo(570, 50).strokeColor('#4a4a4a').stroke();

        eventos.forEach((evento, index) => {
            doc.moveDown(1.5);

            // Título del evento
            doc.fontSize(16).fillColor('#007bff').text(`Evento ${index + 1}`, { underline: true });
            
            // Detalles del evento
            doc.fontSize(14).fillColor('#000000').text(`Título: ${evento.title}`, { continued: true });
            doc.fontSize(12).fillColor('#6c757d').text((`Usuario: ${evento.user.name}`));
            doc.fontSize(12).fillColor('#000000').text(`Notas: ${evento.notes || 'N/A'}`);
            doc.fontSize(12).fillColor('#000000').text(`Inicio: ${new Date(evento.start).toLocaleString()}`);
            doc.fontSize(12).fillColor('#000000').text(`Fin: ${new Date(evento.end).toLocaleString()}`);
            
            // Línea separadora
            doc.moveDown(0.5);
            doc.moveTo(30, doc.y).lineTo(570, doc.y).strokeColor('#dddddd').stroke();
        });

        // Pie de página
        doc.on('pageAdded', () => {
            doc.moveTo(30, doc.page.height - 50).lineTo(570, doc.page.height - 50).strokeColor('#4a4a4a').stroke();
            doc.fontSize(10).fillColor('#4a4a4a').text('Reporte de Eventos - Página ' + doc.page.number, { align: 'center' });
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