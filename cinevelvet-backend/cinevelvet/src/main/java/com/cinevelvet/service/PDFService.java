package com.cinevelvet.service;

import com.cinevelvet.model.Entrada;
import com.cinevelvet.model.Reserva;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;
import java.util.logging.Logger;

@Service
public class PDFService {

    private static final Logger logger = Logger.getLogger(PDFService.class.getName());

    public void guardarPDF(Reserva reserva, String directorio) {
        try {
            logger.info("Iniciando la generación del PDF para la reserva con ID: " + reserva.getId());

            byte[] pdfBytes = generarPDFReserva(reserva);

            Path ruta = Path.of(directorio);
            Files.createDirectories(ruta);
            logger.info("Directorio creado o ya existente: " + ruta.toAbsolutePath());

            // Formato para el nombre del archivo usando la fecha y hora actuales
            SimpleDateFormat sdfNombreArchivo = new SimpleDateFormat("yyyyMMddHHmmss");
            String nombreArchivo = "entradas_velvetcinema_" + sdfNombreArchivo.format(new Date()) + ".pdf"; // Usamos la fecha actual
            logger.info("Nombre del archivo generado: " + nombreArchivo);

            Path archivoPDF = ruta.resolve(nombreArchivo);

            try (FileOutputStream fos = new FileOutputStream(archivoPDF.toFile())) {
                fos.write(pdfBytes);
                logger.info("PDF guardado exitosamente en: " + archivoPDF.toAbsolutePath());
            }

        } catch (IOException e) {
            logger.severe("Error al guardar el PDF en disco: " + e.getMessage());
            throw new RuntimeException("❌ Error al guardar el PDF en disco", e);
        }
    }

    public byte[] generarPDFReserva(Reserva reserva) {
        try {
            logger.info("Generando el contenido PDF para la reserva con ID: " + reserva.getId());

            // Creamos el documento PDF
            Document doc = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(doc, out);
            doc.open();

            // Cargamos el logo desde los recursos (carpeta src/main/resources/images)
            String logoPath = Objects.requireNonNull(getClass().getClassLoader().getResource("images/cinema.jpg")).getPath();
            Image logo = Image.getInstance(logoPath);
            logo.scaleToFit(200, 100);
            logo.setAlignment(Element.ALIGN_RIGHT);
            doc.add(logo);

            // Creamos un formato para las fechas con segundos (para la fecha de reserva)
            SimpleDateFormat sdfReserva = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            // Creamos un formato para las fechas sin segundos (para la fecha de sesión)
            SimpleDateFormat sdfSesion = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            // Añadimos el título
            doc.add(new Paragraph("🎟️ Entrada Velvet Cinema", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20)));
            doc.add(new Paragraph(" "));

            // Información del cliente
            doc.add(new Paragraph("Cliente: " + reserva.getCliente().getNombre()));
            doc.add(new Paragraph("Email: " + reserva.getCliente().getEmail()));
            doc.add(new Paragraph("Teléfono: " + reserva.getCliente().getTelefono()));

            // Información de la reserva
            doc.add(new Paragraph("Fecha reserva: " + sdfReserva.format(reserva.getFechaReserva())));
            doc.add(new Paragraph("Película: " + reserva.getSesion().getPelicula().getTitulo()));
            doc.add(new Paragraph("Sala: " + reserva.getSesion().getSala().getNombre()));
            doc.add(new Paragraph("Fecha sesión: " + sdfSesion.format(reserva.getSesion().getFecha())));
            doc.add(new Paragraph(" "));

            // Añadimos una tabla para las entradas
            PdfPTable table = new PdfPTable(2);
            table.setWidths(new int[]{1, 1});
            table.addCell("Fila");
            table.addCell("Butaca");

            // Rellenamos la tabla con las entradas
            for (Entrada entrada : reserva.getEntradas()) {
                table.addCell(String.valueOf(entrada.getButaca().getFila()));
                table.addCell(String.valueOf(entrada.getButaca().getButaca()));
            }

            doc.add(table);

            // Cerramos el documento
            doc.close();

            logger.info("PDF generado correctamente para la reserva con ID: " + reserva.getId());

            // Devolvemos el PDF como un arreglo de bytes
            return out.toByteArray();
        } catch (Exception e) {
            logger.severe("Error al generar PDF para la reserva con ID: " + reserva.getId() + " - " + e.getMessage());
            throw new RuntimeException("Error al generar PDF", e);
        }
    }
}
