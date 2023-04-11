export const toDTO = (user: any) => {
  return {
    id: user._id,
    login: user.login,
    mail: user.mail
  }
}
export const parseDTO = (userDto: any) => {
  return {
    _id: userDto.id,
    login: userDto.login,
    mail: userDto.mail
  }
}
export const parseDTOadd = (userDto: any) => {
  return {
    login: userDto.login,
    password: userDto.password,
    mail: userDto.mail
  }
}