import { createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e10908',
      light: '#ff3d3d',
      dark: '#c00807',
      contrastText: '#ffffff',
    },
    background: {
      default: '#04080b',
      paper: '#0a0d12',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
      disabled: '#555555',
    },
    divider: '#333333',
    action: {
      active: '#ffffff',
      hover: 'rgba(225, 9, 8, 0.08)',
      selected: 'rgba(225, 9, 8, 0.16)',
      disabled: '#555555',
      disabledBackground: '#1a1d22',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.43 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#04080b',
          color: '#ffffff',
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#333333',
            borderWidth: 1,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#555555',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e10908',
            borderWidth: 2,
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1a1d22',
            },
          },
          '& input::placeholder': {
            color: '#555555',
            opacity: 1,
          },
          '& textarea::placeholder': {
            color: '#555555',
            opacity: 1,
          },
        },
        input: {
          padding: '12px 14px',
          '&::placeholder': {
            color: '#555555',
            opacity: 1,
          },
        },
        multiline: {
          padding: 0,
        },
        notchedOutline: {},
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&.Mui-focused': {
            color: '#e10908',
          },
          '&.Mui-error': {
            color: '#ef4444',
          },
          '&.Mui-disabled': {
            color: '#555555',
          },
          '&.MuiInputLabel-shrink': {
            color: '#888888',
          },
        },
        outlined: {
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
            backgroundColor: '#0a0d12',
            padding: '0 4px',
            color: '#888888',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
        icon: {
          color: '#888888',
        },
        select: {
          padding: '12px 14px',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0a0d12',
          border: '1px solid #333333',
          borderRadius: 8,
          marginTop: 4,
        },
        list: {
          padding: 4,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          borderRadius: 6,
          padding: '8px 12px',
          margin: '2px 0',
          '&:hover': {
            backgroundColor: 'rgba(225, 9, 8, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(225, 9, 8, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(225, 9, 8, 0.24)',
            },
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#888888',
          marginLeft: 0,
          marginRight: 0,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0a0d12',
          border: '1px solid #333333',
          borderRadius: 8,
          marginTop: 4,
        },
        option: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(225, 9, 8, 0.08)',
          },
          '&[aria-selected="true"]': {
            backgroundColor: 'rgba(225, 9, 8, 0.16)',
          },
        },
        inputRoot: {
          paddingTop: '4px !important',
          paddingBottom: '4px !important',
        },
      },
    },
  },
})

export default muiTheme
