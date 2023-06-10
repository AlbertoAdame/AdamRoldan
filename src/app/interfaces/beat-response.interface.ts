import { Genre } from './genre.interface';
import { Mood } from './mood.interface';
export interface BeatInterface {
    id_beat: number,
    title: String,
    price: number,
    time: number,
    bpm: number,
    img: FormData,
    audio: FormData,
    date: Date,
    genreList: Genre[], //En caso de que haya cualquier problema, cambiar genreList por genre
    mood: Mood
}

