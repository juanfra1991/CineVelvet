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

            // Crear PdfWriter UNA SOLA VEZ y registrar el evento antes de abrir el doc
            PdfWriter writer = PdfWriter.getInstance(doc, out);
            writer.setPageEvent(new FooterEvent());

            doc.open();

            // Añadir el logo
            String logoPath = Objects.requireNonNull(getClass().getClassLoader().getResource("images/cabecera_pdf.png")).getPath();
            Image logo = Image.getInstance(logoPath);
            float maxWidth = doc.getPageSize().getWidth() - doc.leftMargin() - doc.rightMargin();
            logo.scaleToFit(maxWidth, 150);
            logo.setAlignment(Image.ALIGN_CENTER);
            doc.add(logo);

            // Formato de fecha
            SimpleDateFormat sdfReserva = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            SimpleDateFormat sdfSesion = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            doc.add(new Paragraph("Entrada Velvet Cinema", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20)));
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

            // Crear tabla con estilo
            PdfPTable table = new PdfPTable(2);
            table.setWidths(new int[]{1, 1});
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);
            table.setWidthPercentage(100);

            BaseColor headerColor = new BaseColor(230, 230, 250);
            BaseColor borderColor = new BaseColor(180, 180, 180);
            Font cabeceraFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);
            Font filaFont = FontFactory.getFont(FontFactory.HELVETICA, 11, BaseColor.DARK_GRAY);

            PdfPCell cell = new PdfPCell(new Phrase("Fila", cabeceraFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(headerColor);
            cell.setBorderColor(borderColor);
            cell.setPadding(10f);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Butaca", cabeceraFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(headerColor);
            cell.setBorderColor(borderColor);
            cell.setPadding(10f);
            table.addCell(cell);

            for (Entrada entrada : reserva.getEntradas()) {
                PdfPCell filaCell = new PdfPCell(new Phrase(String.valueOf(entrada.getButaca().getFila()), filaFont));
                filaCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                filaCell.setBorderColor(borderColor);
                filaCell.setPadding(8f);
                table.addCell(filaCell);

                PdfPCell butacaCell = new PdfPCell(new Phrase(String.valueOf(entrada.getButaca().getButaca()), filaFont));
                butacaCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                butacaCell.setBorderColor(borderColor);
                butacaCell.setPadding(8f);
                table.addCell(butacaCell);
            }

            doc.add(table);

            // Precio total
            final double PRECIO_ENTRADA = 5.0;
            double precioTotal = reserva.getEntradas().size() * PRECIO_ENTRADA;
            Font precioFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);
            Paragraph total = new Paragraph("💶 Precio total: " + String.format("%.2f", precioTotal) + " €", precioFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            total.setSpacingBefore(10f);
            doc.add(total);

            // Añadir QR
            BarcodeQRCode qrCode = new BarcodeQRCode("https://cine.entradas.com/cine/aguilas/mult-el-hornillo/informacion", 100, 100, null);
            Image qrImage = qrCode.getImage();
            qrImage.scalePercent(50);
            qrImage.setAlignment(Image.ALIGN_RIGHT);

            PdfPTable qrTable = new PdfPTable(1);
            qrTable.setWidthPercentage(100);
            PdfPCell qrCell = new PdfPCell(qrImage);
            qrCell.setBorder(Rectangle.NO_BORDER);
            qrCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            qrTable.addCell(qrCell);

            doc.add(new Paragraph(" "));
            doc.add(qrTable);

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

    private static class FooterEvent extends PdfPageEventHelper {
        private final Font contactoFont = FontFactory.getFont(FontFactory.HELVETICA, 9, BaseColor.DARK_GRAY);
        private final Font lopdFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, BaseColor.DARK_GRAY);

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfPTable footer = new PdfPTable(1);
            footer.setTotalWidth(520);
            footer.setWidthPercentage(100);

            PdfPCell contactoCell = new PdfPCell(new Phrase("¿Tienes alguna duda o sugerencia? Escríbenos a: cinemavelvet2025@gmail.com", contactoFont));
            contactoCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            contactoCell.setBorder(Rectangle.NO_BORDER);
            contactoCell.setPaddingBottom(5f);
            footer.addCell(contactoCell);

            PdfPCell lopdCell = new PdfPCell(new Phrase(
                    "En cumplimiento de la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales, "
                            + "le informamos que sus datos han sido utilizados únicamente para la gestión de su reserva y no serán cedidos a terceros.",
                    lopdFont));
            lopdCell.setHorizontalAlignment(Element.ALIGN_JUSTIFIED);
            lopdCell.setBorder(Rectangle.NO_BORDER);
            lopdCell.setPaddingLeft(20f);
            lopdCell.setPaddingRight(20f);
            footer.addCell(lopdCell);

            // Posición desde abajo
            footer.writeSelectedRows(0, -1, 36, 60, writer.getDirectContent());
        }
    }
}
