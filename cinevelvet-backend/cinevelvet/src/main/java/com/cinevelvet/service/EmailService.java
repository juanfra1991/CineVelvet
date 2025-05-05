package com.cinevelvet.service;

import com.cinevelvet.util.MailUtil;
import jakarta.activation.DataHandler;
import jakarta.mail.*;
import jakarta.mail.internet.*;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${mail.username}")
    private String username;

    @Value("${mail.password}")
    private String password;

    @Value("${mail.bcc}")
    private String bccEmail;

    public void enviarEmailConPDF(String destinatario, byte[] pdfBytes, String nombreArchivo) {
        try {
            // Crear la sesión SMTP usando MailUtil
            Session session = MailUtil.crearSesionSMTP(username, password);

            // Crear el mensaje
            Message mensaje = new MimeMessage(session);
            mensaje.setFrom(new InternetAddress(username));
            mensaje.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destinatario));
            mensaje.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(bccEmail));
            mensaje.setSubject("Confirmación de reserva - Velvet Cinema");

            // Cuerpo del mensaje
            MimeBodyPart cuerpo = new MimeBodyPart();
            cuerpo.setText("Gracias por tu compra. Adjunto encontrarás tus entradas.");

            // Adjunto PDF desde memoria
            MimeBodyPart adjunto = new MimeBodyPart();
            ByteArrayDataSource dataSource = new ByteArrayDataSource(pdfBytes, "application/pdf");
            adjunto.setDataHandler(new DataHandler(dataSource));
            adjunto.setFileName(nombreArchivo);

            // Construir el contenido del correo
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(cuerpo);
            multipart.addBodyPart(adjunto);

            mensaje.setContent(multipart);

            // Enviar el mensaje
            Transport.send(mensaje);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("❌ Error al enviar correo con PDF", e);
        }
    }
}
