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
            MimeBodyPart cuerpo = getMimeBodyPart();

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
            throw new RuntimeException("❌ Error al enviar correo con PDF", e);
        }
    }
    private static MimeBodyPart getMimeBodyPart() throws MessagingException {
        MimeBodyPart cuerpo = new MimeBodyPart();
        String texto = """
                ¡Gracias por elegir Velvet Cinema!
                
                Tu compra ha sido confirmada. A continuación, encontrarás el archivo adjunto con tus entradas. \
                Este archivo contiene los detalles de tu reserva, incluyendo la película, la sesión y las butacas seleccionadas.
                
                Si tienes alguna duda o necesitas hacer alguna modificación en tu reserva, no dudes en ponerte en contacto con nosotros.
                
                Agradecemos tu preferencia y esperamos verte pronto en nuestras salas.
                
                Atentamente,
                El equipo de Velvet Cinema
                
                ----------------------------------------------------
                Protección de Datos Personales (LOPD):
                Los datos personales que nos has proporcionado son tratados de acuerdo con la legislación vigente en materia de protección de datos. \
                Solo utilizaremos tus datos para gestionar tu reserva y enviarte información relacionada con ella. En cualquier momento, podrás ejercitar tus derechos de acceso, \
                rectificación, cancelación y oposición, según lo estipulado por la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales.
                Para más información, consulta nuestra Política de Privacidad.
                ----------------------------------------------------""";

        cuerpo.setText(texto);
        return cuerpo;
    }
}
