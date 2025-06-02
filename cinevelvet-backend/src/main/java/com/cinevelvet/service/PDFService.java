package com.cinevelvet.service;

import com.cinevelvet.model.Entrada;
import com.cinevelvet.model.Reserva;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Objects;
import java.util.logging.Logger;

@Service
public class PDFService {

    private static final Logger logger = Logger.getLogger(PDFService.class.getName());

    public byte[] generarPDFReserva(Reserva reserva) {
        try {
            logger.info("Generando el contenido PDF para la reserva con ID: " + reserva.getId());

            Document doc = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(doc, out);
            doc.open();

            // Añadir el logo
            String logoPath = Objects.requireNonNull(getClass().getClassLoader().getResource("images/logoCine.jpg")).getPath();
            Image logo = Image.getInstance(logoPath);
            logo.scaleToFit(200, 100);
            logo.setAlignment(Element.ALIGN_RIGHT);
            doc.add(logo);

            // Formato de fecha
            SimpleDateFormat sdfReserva = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            SimpleDateFormat sdfSesion = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            // Título y detalles del cliente
            doc.add(new Paragraph("🎟️ Entrada Velvet Cinema", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20)));
            doc.add(new Paragraph(" "));

            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            doc.add(formattedLine("Cliente: ", reserva.getCliente().getNombre(), boldFont, normalFont));
            doc.add(formattedLine("Email: ", reserva.getCliente().getEmail(), boldFont, normalFont));
            doc.add(formattedLine("Teléfono: ", reserva.getCliente().getTelefono(), boldFont, normalFont));
            doc.add(formattedLine("Fecha reserva: ", sdfReserva.format(reserva.getFechaReserva()), boldFont, normalFont));
            doc.add(formattedLine("Película: ", reserva.getSesion().getPelicula().getTitulo(), boldFont, normalFont));
            doc.add(formattedLine("Sala: ", reserva.getSesion().getSala().getNombre(), boldFont, normalFont));
            doc.add(formattedLine("Fecha sesión: ", sdfSesion.format(reserva.getSesion().getFecha()), boldFont, normalFont));
            doc.add(new Paragraph(" "));

            // Crear la tabla con estilo
            PdfPTable table = new PdfPTable(2);
            table.setWidths(new int[]{1, 1});
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);
            table.setWidthPercentage(100);

            // Cabeceras
            Font cabeceraFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            PdfPCell cell = new PdfPCell(new Phrase("Fila", cabeceraFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(8f);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Butaca", cabeceraFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(8f);
            table.addCell(cell);

            // Datos
            Font filaFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
            for (Entrada entrada : reserva.getEntradas()) {
                table.addCell(new PdfPCell(new Phrase(String.valueOf(entrada.getButaca().getFila()), filaFont)));
                table.addCell(new PdfPCell(new Phrase(String.valueOf(entrada.getButaca().getButaca()), filaFont)));
            }

            doc.add(table);

            // Añadir QR
            BarcodeQRCode qrCode = new BarcodeQRCode("https://cine.entradas.com/cine/aguilas/mult-el-hornillo/informacion", 100, 100, null);
            Image qrImage = qrCode.getImage();
            qrImage.setAlignment(Element.ALIGN_CENTER);
            qrImage.scalePercent(125);
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Código QR", boldFont));
            doc.add(qrImage);

            // Añadir cláusula LOPD
            doc.add(new Paragraph(" "));
            Font lopdFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, BaseColor.DARK_GRAY);
            Paragraph lopd = new Paragraph("En cumplimiento de la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales, le informamos que sus datos han sido utilizados únicamente para la gestión de su reserva y no serán cedidos a terceros.", lopdFont);
            lopd.setAlignment(Element.ALIGN_JUSTIFIED);
            doc.add(lopd);

            doc.close();
            return out.toByteArray();

        } catch (Exception e) {
            logger.severe("Error al generar y enviar PDF: " + e.getMessage());
            throw new RuntimeException("Error al generar y enviar PDF", e);
        }
    }

    private Paragraph formattedLine(String label, String value, Font labelFont, Font valueFont) {
        Chunk labelChunk = new Chunk(label, labelFont);
        Chunk valueChunk = new Chunk(value, valueFont);
        Paragraph paragraph = new Paragraph();
        paragraph.add(labelChunk);
        paragraph.add(valueChunk);
        return paragraph;
    }
}
