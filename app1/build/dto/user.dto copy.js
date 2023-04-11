"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDTO = void 0;
const toDTO = (user) => {
    return {
        login: user.login,
        mail: user.mail
    };
};
exports.toDTO = toDTO;
