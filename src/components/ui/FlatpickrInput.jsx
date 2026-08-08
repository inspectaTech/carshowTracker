import { useRef, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { X } from 'lucide-react'
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
  // Keep the latest onChange in a ref so the picker never calls a stale closure
  // if the parent re-renders with a new handler.
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  // Create (or rebuild) the picker whenever its configuration changes.
  useEffect(() => {
    if (!inputRef.current) return
    if (fpRef.current) {
      fpRef.current.destroy()
      fpRef.current = null
    }

    const fp = flatpickr(inputRef.current, {
      enableTime,
      noCalendar,
      dateFormat,
      time_24hr,
      defaultDate: value || undefined,
      allowInput: true,
      disableMobile: true,
      closeOnSelect: true,
      onChange: (selectedDates) => {
        // Always emit a STRING, never a raw Date — a Date in form state can
        // render as "[object Date] is not valid as a React child". Also emit ''
        // when the field is cleared so the form state is actually emptied
        // (previously a cleared field kept its stale value).
        if (onChangeRef.current) {
          onChangeRef.current(selectedDates.length > 0 ? formatDate(selectedDates[0], dateFormat) : '')
        }
      },
      onClose: (selectedDates) => {
        // Reflect the picker's state back into the visible input, including
        // clearing it when the user empties the field.
        if (inputRef.current) {
          inputRef.current.value = selectedDates.length > 0 ? formatDate(selectedDates[0], dateFormat) : ''
        }
      },
    })

    fpRef.current = fp

    return () => {
      fp.destroy()
      fpRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableTime, noCalendar, dateFormat, time_24hr])

  // Sync external value changes (prefill / reset / programmatic clear)
  useEffect(() => {
    if (!fpRef.current) return
    if (value) {
      try {
        // Let flatpickr parse using its configured dateFormat (handles our
        // display strings AND ISO values).
        fpRef.current.setDate(value, false)
      } catch {
        try {
          const date = new Date(value)
          if (!isNaN(date.getTime())) fpRef.current.setDate(date, false)
        } catch {
          // ignore invalid dates
        }
      }
    } else {
      // External clear — reset the picker so a cleared form doesn't keep a
      // stale selected date.
      fpRef.current.clear()
      if (inputRef.current) inputRef.current.value = ''
    }
  }, [value])

  const formatDate = (date, fmt) => {
    const pad = (n) => String(n).padStart(2, '0')
    const map = {
      'Y': String(date.getFullYear()),
      'm': pad(date.getMonth() + 1),
      'd': pad(date.getDate()),
      'H': pad(date.getHours()),
      'i': pad(date.getMinutes()),
      'K': date.getHours() >= 12 ? 'PM' : 'AM',
      'h': pad(date.getHours() % 12 || 12),
      'G': String(date.getHours() % 12 || 12),
      'g': String(date.getHours() % 12 || 12),
      'M': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()],
      'F': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()],
      'D': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
      'l': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
    }
    // Single-pass regex replacement — all tokens replaced simultaneously
    // so intermediate results (e.g. 'l' inside 'Jul') never get re-matched
    return fmt.replace(/[YmMKhdHiglFD]/g, (match) => map[match])
  }

  const displayValue = value ? (typeof value === 'string' ? value : formatDate(new Date(value), dateFormat)) : ''

  // Reliable clear: keyboard-deleting a React-controlled flatpickr input never
  // reports an empty selection (the field snaps back to the stale value), so
  // give users an explicit × that empties BOTH the picker and the form state.
  const handleClear = () => {
    if (fpRef.current) fpRef.current.clear()
    if (inputRef.current) inputRef.current.value = ''
    if (onChangeRef.current) onChangeRef.current('')
  }

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
      slotProps={{
        input: {
          readOnly: false,
          endAdornment: displayValue ? (
            <InputAdornment position="end">
              <IconButton
                type="button"
                tabIndex={-1}
                size="small"
                edge="end"
                aria-label={`Clear ${label || 'field'}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClear}
                sx={{ color: '#888888', '&:hover': { color: '#ffffff' } }}
              >
                <X size={15} />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
      {...rest}
    />
  )
}
