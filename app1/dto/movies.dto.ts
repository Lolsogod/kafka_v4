export const toDTO = (movie: any) => {
  return {
      id: movie._id,
      title: movie.title,
      descr: movie.descr,
      year: movie.year || "N/A"
  }
}
export const parseDTO = (movieDto: any) => {
  return {
      _id: movieDto.id,
      title: movieDto.title,
      descr: movieDto.descr,
      year: movieDto.year
  }
}
export const parseDTOadd = (movieDto: any) => {
  return {
      title: movieDto.title,
      descr: movieDto.descr,
      year: movieDto.year
  }
}
