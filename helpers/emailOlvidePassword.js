import nodemailer from 'nodemailer'

const emailOlvidePassword = async (datos) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const { email, nombre, token } = datos;

      //enviar email

      const info = await transporter.sendMail({
          from: "Garage Session - Administrador de alumnos",
          to: email,
          subject: " Reestablece tu password en Garage Session",
          text: 'Reestablece tu password en Garage Session',
          html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password </p>
                <p>Sigue el siguiente enlace para generar el nuevo password: 
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}"> Reestablecer Password</a></p>

                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
          
          `,
      });

      console.log("Mensaje enviado: %s", info.messageId)



}

export default emailOlvidePassword;