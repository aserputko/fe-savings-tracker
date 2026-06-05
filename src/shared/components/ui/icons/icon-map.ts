import arrowDown from '@/assets/images/icon-arrow-down.svg'
import calendar from '@/assets/images/icon-calendar.svg'
import checkmark from '@/assets/images/icon-checkmark.svg'
import chevronLeft from '@/assets/images/icon-chevron-left.svg'
import cross from '@/assets/images/icon-cross.svg'
import dollar from '@/assets/images/icon-dollar.svg'
import error from '@/assets/images/icon-error.svg'
import filter from '@/assets/images/icon-filter.svg'
import plus from '@/assets/images/icon-plus.svg'
import sort from '@/assets/images/icon-sort.svg'

export type IconName =
  | 'arrow-down'
  | 'calendar'
  | 'checkmark'
  | 'chevron-left'
  | 'cross'
  | 'dollar'
  | 'error'
  | 'filter'
  | 'plus'
  | 'sort'

export const ICON_MAP: Record<IconName, string> = {
  'arrow-down': arrowDown,
  'calendar': calendar,
  'checkmark': checkmark,
  'chevron-left': chevronLeft,
  'cross': cross,
  'dollar': dollar,
  'error': error,
  'filter': filter,
  'plus': plus,
  'sort': sort,
}
