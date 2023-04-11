"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDTOadd = exports.parseDTO = exports.toDTO = void 0;
const toDTO = (movie) => {
    return {
        id: movie._id,
        title: movie.title,
        descr: movie.descr,
        year: movie.year || "N/A"
    };
};
exports.toDTO = toDTO;
const parseDTO = (movieDto) => {
    return {
        _id: movieDto.id,
        title: movieDto.title,
        descr: movieDto.descr,
        year: movieDto.year
    };
};
exports.parseDTO = parseDTO;
const parseDTOadd = (movieDto) => {
    return {
        title: movieDto.title,
        descr: movieDto.descr,
        year: movieDto.year
    };
};
exports.parseDTOadd = parseDTOadd;
