interface ParamsUser {
  q?: string
  getDeleted?: boolean
}

export const getParamsUser = (object: ParamsUser) => {
  const { q = '', getDeleted = false } = object

  return {
    q,
    getDeleted
  }
}

export const getParamsTest = (object: any) => {
  const { experimenter = null } = object

  const params = {
    experimenterId: undefined
  }

  if (experimenter !== null) { params.experimenterId = experimenter }

  return params
}

export const getParamsObjectives = (object: any) => {
  const { label = '' } = object

  return {
    label: label.trim().toUpperCase()
  }
}
