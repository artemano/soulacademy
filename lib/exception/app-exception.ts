export enum ErrorType {
  NOT_FOUND_ERROR = "no encontrado",
  INVALID_ARGUMENTS_ERROR = "argumentos invalidos",
  NOT_AUTHORIZED_ERROR = "no autorizado",
  NOT_AUTHENTICATED_ERROR = "no autenticado",
  GENERAL_ERROR = "Error en el servidor",
}
export class AppException extends Error {
  name: ErrorType;
  message: string;
  cause: any;

  constructor(type: ErrorType, message: string, cause?: any) {
    super();
    this.name = type;
    this.message = message;
    this.cause = cause;
  }
}
