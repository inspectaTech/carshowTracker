# Debug Mode

Diagnostic bars and logging are hidden by default. To show them:

## Via URL (temporary)
Add `?debug=true` to any page URL:
```
https://cst.sunzao.win/my-events?debug=true
https://cst.sunzao.win/dashboard?debug=true
```

## Via localStorage (persists across tabs/sessions)
```js
localStorage.setItem('cst_debug', 'true')
```
Then reload the page. To disable:
```js
localStorage.removeItem('cst_debug')
// or
localStorage.setItem('cst_debug', 'false')
```

## What it shows
- **Orange DIAG bars** — Entry module loaded, `$_TSR` state, hydration status, error count (2s/5s/10s/20s polls)
- **Red debug bar** — "waiting..." / "got result: OK" — tracks `getDashboardData` fetch status
- **Red JS Errors bar** — Bottom of page, shows any caught runtime errors
- **Console logs** — `[CST] ENTRY_MODULE_LOADED`, `[DEBUG] GLOBAL ERROR`, `[DEBUG] UNHANDLED REJECTION`
