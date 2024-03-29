export type State =
  | {
      data?: any;
      status: 'success';
      message: string;
    }
  | {
      data?: any;
      status: 'error';
      message: string;
    };
