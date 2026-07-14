import { format } from 'date-fns';

export const formatDateValue = (value?: Date, valueFormat = 'dd/MM/yyyy'): string =>
  value ? format(value, valueFormat) : '';
