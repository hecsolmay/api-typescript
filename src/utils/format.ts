
export const toPascalCase = (string: string) => {
  const trimedString = string.trim()
  const cleanString = trimedString.replace(/\s+/g, ' ')
  const arrayString = cleanString.split(' ')

  const pascalArray = arrayString.map(s => s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase())
  return pascalArray.join(' ')
}

export const updateUserFormat = (object: any) => {
  const { name = undefined, lastname = undefined, email = undefined, typeId = undefined, phoneNumber = undefined, password = undefined } = object

  let newObj = {}

  if (name !== undefined) newObj = { ...newObj, name: toPascalCase(name) }
  if (lastname !== undefined) newObj = { ...newObj, lastname: toPascalCase(lastname) }
  if (email !== undefined) newObj = { ...newObj, email: email.toLowerCase().trim() }
  if (typeId !== undefined) newObj = { ...newObj, typeId }
  if (phoneNumber !== undefined) newObj = { ...newObj, phoneNumber }
  if (password !== undefined) newObj = { ...newObj, password }

  return newObj
}

export const updateObjectiveFormat = (object: any) => {
  const { label = undefined, content = undefined } = object

  let newStimulus = {}

  if (label !== undefined) newStimulus = { ...newStimulus, label: label.toUpperCase().trim() }
  if (content !== undefined) newStimulus = { ...newStimulus, content }

  return newStimulus
}
