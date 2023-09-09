
export const toPascalCase = (string: string) => {
  const trimedString = string.trim()
  const cleanString = trimedString.replace(/\s+/g, ' ')
  const arrayString = cleanString.split(' ')

  const pascalArray = arrayString.map(s => s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase())
  return pascalArray.join(' ')
}

export const updateObjectiveFormat = (object: any) => {
  const { label = undefined, content = undefined } = object

  let newStimulus = {}

  if (label !== undefined) newStimulus = { ...newStimulus, label: label.toUpperCase().trim() }
  if (content !== undefined) newStimulus = { ...newStimulus, content }

  return newStimulus
}
