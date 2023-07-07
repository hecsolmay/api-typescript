import Mailgen from 'mailgen'

import { webUrl } from '../config'

export const generatePassword = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_=+|<>/¿?'
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('')
}

export const mailGenerator = ({ username = 'UserName', password = '123456' }: { username?: string | null, password?: string }) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'FACSEM',
      link: webUrl,
      copyright: 'Copyright © 2023 FACSEM. All rights reserved.'
      // logo: your app logo url
    }
  })

  const mail = {
    body: {
      greeting: 'Hola',
      signature: false,
      name: username ?? 'usuario',
      intro: `Tu contraseña ha sido restaurada con éxito. <br>La nueva contraseña generada es:<div style="text-align: center;"><strong>${password}</strong></div>`,
      action: {
        instructions: 'Por favor vuelve a intentar el proceso de inicio de sesion con la nueva contraseña',
        button: {
          color: '#9333EA',
          text: 'Iniciar Sesion',
          link: `${webUrl}/login`
        }
      }
    }
  }

  return mailGenerator.generate(mail)
}

export const generateInvitationEmail = ({ email, userName, testId, date = new Date() }:
{ email?: string, userName?: string, testId: string, date: Date | string }) => {
  if (email === undefined) return

  const formatedDate = new Date(date).toLocaleDateString()

  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'FACSEM',
      link: webUrl,
      copyright: 'Copyright © 2023 FACSEM. All rights reserved.'
      // logo: your app logo url
    }
  })

  const mail = {
    body: {
      greeting: 'Hola',
      signature: false,
      name: userName ?? email,
      intro: `Has sido invitado a una prueba. Que se realizara el dia ${formatedDate}`,
      action: {
        instructions: 'Podras entrar a la prueba con el siguiente link en la fecha de asignada',
        button: {
          color: '#9333EA',
          text: 'Link de la Prueba',
          link: `${webUrl}/${testId}`
        }
      }
    }
  }

  return mailGenerator.generate(mail)
}

export const generateReAsignationEmail = ({ email, userName, testId, date = new Date() }:
{ email?: string, userName?: string, testId: string, date: Date | string }) => {
  if (email === undefined) return

  const formatedDate = new Date(date).toLocaleDateString()

  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'FACSEM',
      link: webUrl,
      copyright: 'Copyright © 2023 FACSEM. All rights reserved.'
      // logo: your app logo url
    }
  })

  const mail = {
    body: {
      greeting: 'Hola',
      signature: false,
      name: userName ?? email,
      intro: `La prueba a la que habías sido asignado ha cambiado su fecha de realización. Ahora se realizara el dia ${formatedDate}`,
      action: {
        instructions: 'Podras entrar a la prueba con el siguiente link en la fecha de asignada',
        button: {
          color: '#9333EA',
          text: 'Link de la Prueba',
          link: `${webUrl}/${testId}`
        }
      }
    }
  }

  return mailGenerator.generate(mail)
}
