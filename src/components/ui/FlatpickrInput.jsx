import { useRef, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/themes/dark.css'

/**
 * FlatpickrInput — MUI TextField with Flatpickr date/time picker attached.
 *
 * Props:
 *  - value, onChange: form state (string)
 *  - label: MUI TextField label
 *  - enableTime: boolean — show time picker
 *  - noCalendar: boolean — time-only mode (requires enableTime)
 *  - dateFormat: flatpickr format string (default 'Y-m-d')
 *  - placeholder, size, fullWidth, error, helperText, disabled: standard MUI TextField props
 *  - time_24hr: boolean — 24hr clock (default false = AM/PM)
 */
export default function FlatpickrInput({
  value = '',
  onChange,
  label,
  enableTime = false,
  noCalendar = false,
  dateFormat = 'Y-m-d',
  placeholder,
  size = 'small',
  fullWidth = true,
  error,
  helperText,
  disabled,
  time_24hr = false,
  className,
  ...rest
}) {
  const inputRef = useRef(null)
  const fpRef = useRef(null)

  useEffect(() => {
    if (!inputRef.current) return

    const fp = flatpickr(inputRef.current, {
      enableTime,
      noCalendar,
      dateFormat,
      time_24hr,
      defaultDate: value || undefined,
      allowInput: true,
      disableMobile: true,
      onChange: (selectedDates) => {
        if (onChange && selectedDates.length > 0) {
          onChange(selectedDates[0])
        }
      },
      onClose: (selectedDates) => {
        if (selectedDates.length > 0) {
          const formatted = formatDate(selectedDates[0], dateFormat)
          if (inputRef.current) {
            inputRef.current.value = formatted
          }
        }
      },
    })

    fpRef.current = fp

    return () => {
      fp.destroy()
      fpRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external value changes
  useEffect(() => {
    if (fpRef.current && value) {
      try {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          fpRef.current.setDate(date, false)
        }
      } catch {
        // ignore invalid dates
      }
    }
  }, [value])

  const formatDate = (date, fmt) => {
    const pad = (n) => String(n).padStart(2, '0')
    const map = {
      'Y': date.getFullYear(),
      'm': pad(date.getMonth() + 1),
      'd': pad(date.getDate()),
      'H': pad(date.getHours()),
      'i': pad(date.getMinutes()),
      'K': date.getHours() >= 12 ? 'PM' : 'AM',
      'h': pad(date.getHours() % 12 || 12),
      'G': date.getHours() % 12 || 12,
      'g': date.getHours() % 12 || 12,
      'M': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()],
      'F': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()],
      'D': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
      'l': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
    }
    let result = fmt
    for (const [key, val] of Object.entries(map)) {
      result = result.replace(key, val)
    }
    return result
  }

  const displayValue = value ? (typeof value === 'string' ? value : formatDate(new Date(value), dateFormat)) : ''

  return (
    <TextField
      inputRef={inputRef}
      label={label}
      value={displayValue}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      error={error}
      helperText={helperText}
      disabled={disabled}
      autoComplete="off"
      className={className}
      InputProps={{
        readOnly: false,
      }}
      {...rest}
    />
  )
}
