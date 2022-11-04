import dateFnsFormat from 'date-fns/format'
import { formatDistanceToNow } from '../../../lib/date'

const INPUT_FORMAT = 'PPP'
const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000

export const formatEventDate = (updatedAt: number) => {
  const newUpdatedAt = new Date(updatedAt)
  return Date.now() - newUpdatedAt.getTime() > WEEK_IN_MILLISECONDS
    ? dateFnsFormat(newUpdatedAt, INPUT_FORMAT)
    : formatDistanceToNow(newUpdatedAt, { addSuffix: true })
}

export const formatDateTitle = (updatedAt: number) => {
  return new Date(updatedAt).toLocaleString()
}
