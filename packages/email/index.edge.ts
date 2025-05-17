import type {
  CreateEmailOptions,
  CreateEmailRequestOptions,
  CreateEmailResponse,
} from 'resend';
import { keys } from './keys';

declare class Resend {
  readonly key?: string | undefined;
  private readonly headers;
  readonly emails: Emails;
  constructor(key?: string | undefined);
}

class Emails {
  private readonly resend: Resend;

  constructor(resend: Resend) {
    this.resend = resend;
  }

  async send(
    payload: CreateEmailOptions,
    _options?: CreateEmailRequestOptions
  ): Promise<CreateEmailResponse> {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.resend.key}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();

      return {
        data: {
          id: data.id,
        },
        error: null,
      };
    }

    return {
      data: null,
      error: { message: 'TEST', name: 'application_error' },
    };
  }
}

export const resend = new Resend(keys().RESEND_TOKEN);
