import { type Response } from 'express'
import nodemailer from 'nodemailer'
import { mailerEmail, mailerPassword } from '../config'
import { EMAIL_STATUS } from '../enums'
import { TestUsers } from '../models/UnionTables'
import { cancelTask, scheduleTask } from '../utils/schedule'

export const sendMail = (res: Response, emailToSend: string, mail: any, subject: string) => {
  const mailOptions = {
    from: mailerEmail,
    to: emailToSend,
    subject,
    html: mail
  }

  getTransporter().then(transporter => {
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

interface ScheduleMail {
  to: string
  mail: any
  taskId: string
  date: Date
}

export const sendScheduledMail = async ({ to, mail, taskId, date }: ScheduleMail) => {
  const currentDate = new Date()
  const scheduleDate = new Date(date)
  scheduleDate.setDate(scheduleDate.getDate() - 1)

  const mailOptions = {
    from: mailerEmail,
    to,
    subject: 'Invitacion a Prueba',
    html: mail
  }

  const transporter = await getTransporter()

  const sendMail = () => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error != null) {
        console.error(error)
        return
      }

      const hasMessage = nodemailer.getTestMessageUrl(info)

      if (hasMessage !== false) {
        console.log(`MAILS SEND: 📧 --> ${hasMessage}`)
      }
      TestUsers.update({ emailStatus: EMAIL_STATUS.SEND }, { where: { testUserId: taskId } })
        .then(() => { console.log('Estatus cambiado') })
        .catch(err => { console.error(err) })
        .finally(() => { cancelTask(taskId) })
    })
  }

  if (currentDate < scheduleDate) {
    scheduleTask({
      taskId,
      date,
      fn: sendMail
    })
  } else {
    sendMail()
  }
}

export const sendReasignationEmail = async ({ to, mail, taskId }: Omit<ScheduleMail, 'date'>) => {
  const transporter = await getTransporter()
  const mailOptions = {
    from: mailerEmail,
    to,
    subject: 'Reasignación de fecha de la Prueba',
    html: mail
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error != null) {
      console.error(error)
      return
    }

    const hasMessage = nodemailer.getTestMessageUrl(info)

    if (hasMessage !== false) {
      console.log(`MAILS SEND: 📧 --> ${hasMessage}`)
    }
    TestUsers.update({ emailStatus: EMAIL_STATUS.SEND }, { where: { testUserId: taskId } })
      .then(() => { console.log('Estatus cambiado') })
      .catch(err => { console.error(err) })
      .finally(() => { cancelTask(taskId) })
  })
}

export const getTransporter = async () => {
  let transporter

  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      host: 'smtp.ionos.com',
      port: 587,
      secure: false,
      auth: {
        user: mailerEmail,
        pass: mailerPassword
      }
    })

    // const transporter = nodemailer.createTransport({
    //   host: mailerHost,
    //   port: mailerPort,
    //   secure: mailerSecure,
    //   auth: {
    //     user: mailerEmail,
    //     pass: mailerPassword
    //   }
    // })

    return transporter
  }

  try {
    const account = await nodemailer.createTestAccount()

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass
      }
    })
  } catch (err) {
    console.error('Error obtaining test account:', err)
    throw err
  }

  return transporter
}
