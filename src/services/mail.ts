import { type Response } from 'express'
import nodemailer from 'nodemailer'
import { mailerEmail, mailerPassword } from '../config'

export const sendMail = (res: Response, emailToSend: string, mail: any, subject: string) => {
  const mailOptions = {
    from: mailerEmail,
    to: emailToSend,
    subject,
    html: mail
  }

  if (process.env.NODE_ENV === 'production') {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ionos.com',
      port: 587,
      secure: false,
      auth: {
        user: mailerEmail,
        pass: mailerPassword
      }
    })

    transporter.sendMail(mailOptions, (error, info) => {
      if (error != null) {
        console.error(error)
        return res.status(500).json({ message: 'Error al enviar el correo electrónico', error: error.message })
      } else {
        return res.json({ message: 'Correo electrónico enviado: ', info: info.response })
      }
    })
  } else {
    nodemailer.createTestAccount((_err, account) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: account.user, // generated ethereal user
          pass: account.pass // generated ethereal password
        }
      })

      transporter.sendMail(mailOptions, (error, info) => {
        if (error != null) {
          console.error(error)
          return res.status(500).json({ message: 'Error al enviar el correo electrónico', error: error.message })
        } else {
          const hasMessage = nodemailer.getTestMessageUrl(info)

          if (hasMessage !== false) {
            console.log(`MAILS SEND: 📧 --> ${hasMessage}`)
          }
          return res.json({ message: 'Correo electrónico enviado: ', info: info.response })
        }
      })
    })
  }
}
