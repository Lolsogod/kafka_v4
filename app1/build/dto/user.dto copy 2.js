"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDTO = void 0;
const toDTO = (user) => {
    let res = {
        login: user.login,
        mail: user.mail
    };
    return res;
};
exports.toDTO = toDTO;
