import { List } from 'react-window'
import EventCard from '#/components/events/EventCard'
import UserCard from './UserCard'
import ErrorBoundary from '#/components/ui/ErrorBoundary'

// Row heights (EventCard date badge drives the height; UserCard is shorter).
const EVENT_ROW = 118
const USER_ROW = 96
const ROW_GAP = 12 // matches the space between cards in the non-virtual list

/**
 * Virtualized explore list — renders only visible EventCard/UserCard rows so long
 * lists scroll smoothly. Uses react-window v2 `List`, which measures its own height
 * (ResizeObserver) and supports variable row heights via `rowHeight(index)`.
 * Place it inside a flex-1 min-h-0 container.
 */
export default function VirtualizedEventList({ events = [], users = [], gap = ROW_GAP }) {
  const rows = []
  events.forEach((e) => rows.push({ kind: 'event', item: e, key: e.slugId || e.title }))
  users.forEach((u) => rows.push({ kind: 'user', item: u, key: u.id || u.handle || u.name }))

  if (rows.length === 0) return null

  const rowHeight = (index) => (rows[index].kind === 'event' ? EVENT_ROW : USER_ROW)

  const RowComponent = ({ index, style, rows: r, gap: g }) => {
    const row = r[index]
    const node =
      row.kind === 'event' ? <EventCard event={row.item} /> : <UserCard user={row.item} />
    return (
      <div style={{ ...style, paddingBottom: g }}>
        <ErrorBoundary key={row.key} resetKey={row.key}>
          {node}
        </ErrorBoundary>
      </div>
    )
  }

  return (
    <List
      className="w-full"
      style={{ height: '100%' }}
      rowCount={rows.length}
      rowHeight={rowHeight}
      rowComponent={RowComponent}
      rowProps={{ rows, gap }}
      rowKey={(index) => rows[index].key}
      overscanCount={6}
      defaultHeight={600}
    />
  )
}
