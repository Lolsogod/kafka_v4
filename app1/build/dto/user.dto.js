"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDTOadd = exports.parseDTO = exports.toDTO = void 0;
const toDTO = (user) => {
    return {
        id: user._id,
        login: user.login,
        mail: user.mail
    };
};
exports.toDTO = toDTO;
const parseDTO = (userDto) => {
    return {
        _id: userDto.id,
        login: userDto.login,
        mail: userDto.mail
    };
};
exports.parseDTO = parseDTO;
const parseDTOadd = (userDto) => {
    return {
        login: userDto.login,
        password: userDto.password,
        mail: userDto.mail
    };
};
exports.parseDTOadd = parseDTOadd;
