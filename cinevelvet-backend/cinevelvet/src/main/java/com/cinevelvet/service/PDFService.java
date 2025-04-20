package com.cinevelvet.service;

import com.cinevelvet.model.Entrada;
import com.cinevelvet.model.Reserva;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PDFService {

    public byte[] generarPDFReserva(Reserva reserva) {
        try {
            // Creamos el documento PDF
            Document doc = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(doc, out);
            doc.open();

            // Añadimos el título
            doc.add(new Paragraph("🎟️ Entrada CineVelvet", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20)));
            doc.add(new Paragraph(" "));

            // Información del cliente
            doc.add(new Paragraph("Cliente: " + reserva.getCliente().getNombre()));
            doc.add(new Paragraph("Email: " + reserva.getCliente().getEmail()));
            doc.add(new Paragraph("Teléfono: " + reserva.getCliente().getTelefono()));

            // Información de la reserva
            doc.add(new Paragraph("Fecha reserva: " + reserva.getFecha()));
            doc.add(new Paragraph("Película: " + reserva.getSesion().getPelicula().getTitulo()));
            doc.add(new Paragraph("Sala: " + reserva.getSesion().getSala().getNombre()));
            doc.add(new Paragraph("Fecha sesión: " + reserva.getSesion().getFecha()));
            doc.add(new Paragraph(" "));

            // Añadimos una tabla para las entradas
            PdfPTable table = new PdfPTable(2);
            table.setWidths(new int[]{1, 1});
            table.addCell("Fila");
            table.addCell("Columna");

            // Rellenamos la tabla con las entradas
            for (Entrada entrada : reserva.getEntradas()) {
                table.addCell(String.valueOf(entrada.getButaca().getFila()));
                table.addCell(String.valueOf(entrada.getButaca().getColumna()));
            }

            doc.add(table);

            // Cerramos el documento
            doc.close();

            // Devolvemos el PDF como un arreglo de bytes
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF", e);
        }
    }
}
