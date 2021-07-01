export class BackendError {
  code: number;
  message: string;
  errors: Array<ContainedError>;
}

export class ContainedError {
  code: string;
  resource: string;
  field: string;
  rejectedValue: string;
  message: string;
}
