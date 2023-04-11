import { ObjectId, Schema, Types, model} from 'mongoose';
import { IUser } from './User';
import { IMovie } from './Movie';
//review model
interface IReview {
    author: string | ObjectId | IUser,
    movie: string | ObjectId | IMovie,
    rating: number,
    text?: string,
    likes?: number
}
const reviewSchema = new Schema<IReview>({
    author: {type: Types.ObjectId, ref: 'user', required: true},
    movie: {type: Types.ObjectId, ref: 'movie', required: true},
    rating: {type: Number, required: true},
    text: {type: String, required: false},
    likes: {type: Number, required: false}
})
reviewSchema.index({ author: 1, movie: 1}, { unique: true });

export const Review = model<IReview>('review', reviewSchema);