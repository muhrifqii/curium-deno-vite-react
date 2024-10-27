// deno-lint-ignore-file

export const isDev = process.env.NODE_ENV === 'development';

// better to use dotenv instead of hardcoded values
export const BASE_URL = 'http://localhost:9999';
