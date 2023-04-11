import { Schema, model} from 'mongoose';
//movie model
export interface IMovie {
    title: String,
    descr?: String
    year?: number
}
const movieSchema = new Schema<IMovie>({
    title: {type: String, required: true, unique: true},
    descr: {type: String, required: false},
    year: {type: Number, required: false}
})

export const Movie = model<IMovie>('movie', movieSchema);