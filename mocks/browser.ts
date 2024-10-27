import { handlers } from './handlers';
import { setupWorker } from 'msw/browser';

// https://mswjs.io/docs/integrations/browser
export const worker = setupWorker(...handlers);
