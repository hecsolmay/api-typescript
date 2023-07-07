
import { type NextFunction, type Request, type Response } from 'express'
import fs from 'fs'
import multer, { MulterError } from 'multer'
import path from 'path'
import sharp from 'sharp'
import { FILE_SIZE_NAMES, IMAGE_EXTENSION } from '../enums'
import { MulterValidationError, handleError } from '../utils/errors'

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    // Especifica el directorio donde se guardarán los archivos subidos
    const filePath = path.join(__dirname, '../../public/uploads')
    cb(null, filePath)
  },
  filename: function (_req, file, cb) {
    // Genera un nombre de archivo único para evitar conflictos
    const randomNumber = Math.round(Math.random() * 1e9)
    const uniqueSuffix = `${Date.now()}-${randomNumber}`

    const parsedName = path.parse(file.originalname)

    const fileExtension = parsedName.ext

    // Establece el nombre del archivo como la marca de tiempo actual más un sufijo único
    const finalName = uniqueSuffix + fileExtension
    cb(null, finalName)
  }
})

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15mb
  },
  fileFilter: function (_req, file, cb) {
    const fileExtension = path.extname(file.originalname)

    if (IMAGE_EXTENSION.includes(fileExtension)) {
      cb(null, true)
    } else {
      const errorMessage = `Error en extencion del archivo, las extensiones validas son ${IMAGE_EXTENSION.join(', ')}`
      cb(new MulterValidationError(errorMessage))
    }
  }
})

const generateOptimizedImages = async (image: Express.Multer.File) => {
  const { main, thumbnail, thumbnailPreview } = FILE_SIZE_NAMES
  const { filename } = image

  const mainImageName = [main, filename].join('-')
  const thumbnailImageName = [thumbnail, filename].join('-')
  const thumbnailPreviewImageName = [thumbnailPreview, filename].join('-')

  await sharp(image.path)
    .resize(800)
    .toFile(path.join(__dirname, `../../public/uploads/${mainImageName}`))

  await sharp(image.path)
    .resize(200)
    .toFile(path.join(__dirname, `../../public/uploads/${thumbnailImageName}`))

  await sharp(image.path)
    .resize(100)
    .toFile(path.join(__dirname, `../../public/uploads/${thumbnailPreviewImageName}`))
}

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  const uploaded = upload.single('file')

  return uploaded(req, res, async function (err) {
    if (err instanceof MulterError || err instanceof MulterValidationError) {
      return res.status(400).json({ message: 'Error al subir los archivos', error: err.message })
    }

    const image = req.file

    if (image !== undefined) {
      try {
      // Generar imágenes optimizadas
        await generateOptimizedImages(image)

        // Eliminar la imagen original subida
        fs.unlinkSync(image.path)

        // Se ejecuta si no hay errores
        next()
        // eslint-disable-next-line no-useless-return
        return
      } catch (error) {
        return handleError(error, res)
      }
    } else {
      next()
      // eslint-disable-next-line no-useless-return
      return
    }
  })
}
