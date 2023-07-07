
import { CONTENT_TYPES, ROLES, TEST_TYPES } from '../enums'
import { ContentTypes, TestTypes, UserTypes } from '../models/Types'

export const checkUserRoles = async () => {
  try {
    const roles = await UserTypes.findAll()

    const ROLES_VALUES = Object.values(ROLES)

    if (roles.length === 0) {
      ROLES_VALUES.forEach(async rol => {
        const newRol = await UserTypes.create({ name: rol })
        await newRol.save()
      })

      console.log('roles created')
    }
  } catch (err) {
    console.error(err)
  }
}

export const createContents = async () => {
  try {
    const contents = await ContentTypes.findAll()
    const CONTENTS_CREATE = Object.values(CONTENT_TYPES)

    if (contents.length === 0) {
      CONTENTS_CREATE.forEach(async content => {
        const newContent = await ContentTypes.create({ name: content })
        await newContent.save()
      })

      console.log('Content Types Created!')
    }
  } catch (err) {
    console.error(err)
  }
}

export const createTestTypes = async () => {
  try {
    const testTypes = await TestTypes.findAll()
    const TYPES_CREATE = Object.values(TEST_TYPES)

    if (testTypes.length === 0) {
      TYPES_CREATE.forEach(async type => {
        const newTestType = await TestTypes.create({ name: type })
        await newTestType.save()
      })
      console.log('Test Types Created!')
    }
  } catch (err) {
    console.error(err)
  }
}
