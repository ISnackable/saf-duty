interface ErrorResponse {
  status: number;
  message: string;
}

export class HTTPError extends Error {
  data: ErrorResponse;
  status: number;
  constructor(message: string, data: ErrorResponse, status: number) {
    super(message);
    this.data = data;
    this.status = status;
  }
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
  });

  const data = res.headers.get('Content-Type')?.includes('application/json')
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    if (typeof data === 'object' && 'message' in data)
      throw new HTTPError(data.message, data, res.status);
    else throw new Error('An error occurred while fetching the data.');
  }

  return data as T;
}
