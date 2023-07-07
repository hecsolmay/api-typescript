
export const getLimitOffSet = (object: any) => {
  const { limit = 10, page = 1 } = object

  const finalLimit = limit > 0 ? limit : 1
  const finalPage = page > 0 ? page : 1
  const offset = finalLimit * (finalPage - 1)

  return {
    limit: Number(finalLimit),
    page: Number(finalPage),
    offset
  }
}

export const getInfoPage = ({ limit = 10, count = 0, currentPage = 1 }) => {
  const totalPages = Math.ceil(count / limit)
  const page = currentPage > 0 && currentPage <= totalPages ? currentPage : 1
  const nextPage = page < totalPages ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null

  return {
    currentPage: page,
    limit,
    totalResults: count,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    nextPage,
    prevPage
  }
}
