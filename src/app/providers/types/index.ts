export interface IUser {
  firstname: string
  lastname: string
  surname: string
  phone: string
  email: string
  password: string
  photo?: string
  languge?: Language
}
export interface Language {
  title: string
  name: string
  isAvialable: boolean
}

export interface IUserDto {
  email: string
  password?: string
}

export interface IUserEmailCode {
  email: string
  code: string
}

export interface IUserRecoveryPassword {
  password: string
  recoveryPassword: string
}

// Profile
export interface IProfile {
  first_name: string
  last_name: string
  middle_name: string
  phone: string
  email: string
  photo?: string
  languge?: Language
  current_password?: string
  new_password?: string
  repeat_password?: string
}
