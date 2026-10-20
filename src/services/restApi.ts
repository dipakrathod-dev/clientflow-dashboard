export class RestApiError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'RestApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Fetch and decode a JSON REST response while preserving the response status
 * in a typed error for consumers that need to render a useful failure state.
 */
export async function getJson<Data>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Data> {
  const response = await fetch(input, init);

  if (!response.ok) {
    let message = `Request failed with ${response.status} ${response.statusText}`.trim();

    try {
      const body = (await response.json()) as { message?: unknown };
      if (typeof body.message === 'string' && body.message.trim()) {
        message = body.message;
      }
    } catch {
      // Keep the status-based message when the server does not return JSON.
    }

    throw new RestApiError(message, response.status, response.statusText);
  }

  if (response.status === 204) {
    return undefined as Data;
  }

  return (await response.json()) as Data;
}
