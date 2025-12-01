import { HttpException } from '@nestjs/common';

export type OkResponse<T = unknown> = {
  ok: true;
  data: T;
};

export type ErrorResponse = {
  ok: false;
  error: string;
  statusCode?: number;
  details?: unknown;
};

export function ok<T = unknown>(data: T): OkResponse<T> {
  return { ok: true, data };
}

export function error(
  messageOrException: string | HttpException,
  details?: unknown,
): ErrorResponse {
  if (messageOrException instanceof HttpException) {
    const response = messageOrException.getResponse() as
      | string
      | { message?: string; error?: string; [key: string]: any };

    const statusCode = messageOrException.getStatus();
    let message: string;
    let extra: any = {};

    if (typeof response === 'string') {
      message = response;
    } else {
      message = (response.message as string) ?? (response.error as string) ?? 'Unexpected error';
      extra = response;
    }

    return {
      ok: false,
      error: message,
      statusCode,
      details: details ?? extra,
    };
  }

  return { ok: false, error: messageOrException, details };
}


