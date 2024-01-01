export type State =
  | {
      status: 'success';
      message: string;
    }
  | {
      status: 'error';
      message: string;
    };
