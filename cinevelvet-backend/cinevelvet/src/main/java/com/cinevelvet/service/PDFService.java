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

            String logoPath = Objects.requireNonNull(getClass().getClassLoader().getResource("images/logoCine.jpg")).getPath();
            Image logo = Image.getInstance(logoPath);
            logo.scaleToFit(200, 100);
            logo.setAlignment(Element.ALIGN_RIGHT);
            doc.add(logo);

            SimpleDateFormat sdfReserva = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            SimpleDateFormat sdfSesion = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            doc.add(new Paragraph("🎟️ Entrada Velvet Cinema", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20)));
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Cliente: " + reserva.getCliente().getNombre()));
            doc.add(new Paragraph("Email: " + reserva.getCliente().getEmail()));
            doc.add(new Paragraph("Teléfono: " + reserva.getCliente().getTelefono()));
            doc.add(new Paragraph("Fecha reserva: " + sdfReserva.format(reserva.getFechaReserva())));
            doc.add(new Paragraph("Película: " + reserva.getSesion().getPelicula().getTitulo()));
            doc.add(new Paragraph("Sala: " + reserva.getSesion().getSala().getNombre()));
            doc.add(new Paragraph("Fecha sesión: " + sdfSesion.format(reserva.getSesion().getFecha())));
            doc.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(2);
            table.setWidths(new int[]{1, 1});
            table.addCell("Fila");
            table.addCell("Butaca");

            for (Entrada entrada : reserva.getEntradas()) {
                table.addCell(String.valueOf(entrada.getButaca().getFila()));
                table.addCell(String.valueOf(entrada.getButaca().getButaca()));
            }

            doc.add(table);
            doc.close();

            return out.toByteArray();

        } catch (Exception e) {
            logger.severe("Error al generar y enviar PDF: " + e.getMessage());
            throw new RuntimeException("Error al generar y enviar PDF", e);
        }
    }
}
