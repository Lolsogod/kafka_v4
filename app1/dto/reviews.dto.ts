import * as UserDto from '../dto/user.dto'
import * as MovieDto from '../dto/movies.dto'
export const toDTO = (review: any) => {
  return {
    id: review._id,
    author: UserDto.toDTO(review.author),
    movie: MovieDto.toDTO(review.movie),
    rating: review.rating,
    text: review.text || "",
    likes: review.likes || "0"
  }
}

export const parseDTO = (reviewDto: any) => {
  return {
    _id: reviewDto.id,
    author:reviewDto.author,
    movie: reviewDto.movie,
    rating: reviewDto.rating,
    text: reviewDto.text,
    likes: reviewDto.likes
  }
}
export const parseDTOadd = (reviewDto: any) => {
  return {
    author:reviewDto.author,
    movie: reviewDto.movie,
    rating: reviewDto.rating,
    text: reviewDto.text,
    likes: reviewDto.likes
  }
}