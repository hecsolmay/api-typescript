
export enum ROLES {
  User = 'user',
  Admin = 'admin',
  Experimenter = 'experimenter',
}

export enum CONTENT_TYPES {
  Image = 'image',
  Text = 'text',
  Experimenter = 'experimenter',
}

export enum TEST_TYPES {
  Practice = 'practice',
  Test = 'test',
}

export enum TEST_STATUS {
  TOSTART = 'start',
  ONGOING = 'ongoing',
  COMPLETE = 'complete',
}

export enum EMAIL_STATUS {
  SEND = 'send',
  PENDING = 'pending',
  COMPLETE = 'complete',
}

export const IMAGE_EXTENSION = ['.jpg', '.jpeg', '.png', '.gif']

export const FILE_SIZE_NAMES = Object.freeze({
  main: 'main-',
  thumbnail: 'thumbnail-',
  thumbnailPreview: 'thumbnail-preview-'
})
