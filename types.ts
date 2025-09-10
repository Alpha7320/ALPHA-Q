// Fix: Import ReactElement to resolve JSX namespace issue.
import type { ReactElement } from 'react';

export interface Quote {
  quote: string;
  author: string;
}

export interface Category {
  name: string;
  icon: ReactElement;
}
