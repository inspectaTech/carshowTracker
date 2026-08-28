import { useState, useCallback } from 'react'
import { Link2, Plus, X } from 'lucide-react'
import { LinkifyIt } from 'linkify-it'
import { SocialIcon, getNetworks } from 'react-social-icons'
import TextField from '@mui/material/TextField'

const linkify = new LinkifyIt()

// Detect which social platform a URL belongs to (replicates react-social-icons'
// internal matching, but returns null for unrecognized/generic links instead of
// falling back to the 'sharethis' default key).
function detectNetwork(url) {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('mailto:')) return 'mailto'
  const socials = getNetworks()
  const regex = new RegExp(
    '(?:[/.]|^)(' +
      socials.map((s) => s.replace(/\./g, '\\.')).sort((a, b) => b.length - a.length).join('|') +
      ')([.]|$|/)',
    'u'
  )
  return trimmed.match(regex)?.[1] || null
}

// Prepend a protocol if the user omitted one, so linkify + anchors work.
function normalizeUrl(input) {
  const trimmed = (input || '').trim()
  if (!trimmed) return ''
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function isValidUrl(input) {
  const normalized = normalizeUrl(input)
  if (!normalized) return false
  try {
    return linkify.test(normalized)
  } catch {
    return false
  }
}

/**
 * Reusable Links section.
 *
 * mode="edit":
 *   - A single link input with the detected platform icon (generic link-chain
 *     icon when no designated platform is recognized), followed by a + icon to
 *     create more inputs. Each row can be removed.
 *   - props: value (array of link strings), onChange(array)
 *
 * mode="display":
 *   - Renders DB link data: recognized social platforms as a horizontal row of
 *     platform icons; all other links as a <ul> of blue hyperlinks below.
 *   - props: value (array of link strings)
 */
export default function LinksSection({ mode = 'display', value = [], onChange }) {
  const links = Array.isArray(value) ? value : []

  const addLink = useCallback(() => {
    if (onChange) onChange([...links, ''])
  }, [links, onChange])

  const updateLink = useCallback(
    (idx, val) => {
      if (!onChange) return
      onChange(links.map((l, i) => (i === idx ? val : l)))
    },
    [links, onChange]
  )

  const removeLink = useCallback(
    (idx) => {
      if (!onChange) return
      onChange(links.filter((_, i) => i !== idx))
    },
    [links, onChange]
  )

  // ---------- Display mode ----------
  if (mode === 'display') {
    const present = links.filter((l) => l && l.trim())
    if (present.length === 0) return null

    const socialLinks = present.filter((l) => detectNetwork(l))
    const otherLinks = present.filter((l) => !detectNetwork(l))

    return (
      <div data-component="LinksSection" className="space-y-4">
        {socialLinks.length > 0 && (
          <div data-part="social-icons" className="flex items-center justify-center gap-3 flex-wrap">
            {socialLinks.map((link, i) => (
              <span
                key={`${link}-${i}`}
                data-part="social-icon-link"
                title={link}
                className="inline-block leading-none opacity-90 hover:opacity-100 hover:scale-105 transition-transform"
              >
                <SocialIcon
                  url={normalizeUrl(link)}
                  style={{ width: 44, height: 44 }}
                  bgColor="transparent"
                  fgColor="#e6e6e6"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </span>
            ))}
          </div>
        )}

        {otherLinks.length > 0 && (
          <ul data-part="link-list" className="space-y-2">
            {otherLinks.map((link, i) => (
              <li key={`${link}-${i}`} data-part="link-row" className="flex items-start gap-2.5 min-w-0">
                <Link2 size={21} className="text-[#888888] mt-0.5 shrink-0" />
                <a
                  href={normalizeUrl(link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4da3ff] hover:underline break-all min-w-0"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  // ---------- Edit mode ----------
  return (
    <div data-component="LinksSection" className="space-y-2">
      {links.length === 0 ? (
        <button
          type="button"
          data-part="add-first-link"
          onClick={addLink}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1d22] hover:bg-[#2a2d32] text-white text-[14px] transition-colors"
        >
          <Plus size={16} /> Add link
        </button>
      ) : (
        links.map((link, i) => {
          const network = detectNetwork(link)
          const invalid = !!link.trim() && !isValidUrl(link)
          return (
            <div key={i} data-part="link-input-row" className="flex items-center gap-2">
              {/* Detected platform icon (or generic link-chain icon) */}
              <div
                data-part="link-icon"
                className="w-8 h-8 shrink-0 flex items-center justify-center overflow-hidden"
                title={network || 'Link'}
              >
                {network ? (
                  <SocialIcon
                    url={normalizeUrl(link)}
                    style={{ width: 36, height: 36 }}
                    bgColor="transparent"
                    fgColor="#e6e6e6"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ) : (
                  <Link2 size={18} className={invalid ? 'text-[#e10908]' : 'text-[#888888]'} />
                )}
              </div>

              <TextField
                data-part="link-input"
                value={link}
                onChange={(e) => updateLink(i, e.target.value)}
                placeholder="https://..."
                size="small"
                fullWidth
                error={invalid}
                helperText={invalid ? 'Not a valid URL' : undefined}
                sx={{ '& .MuiInputBase-root': { color: '#fff' } }}
              />

              {/* + icon to create more inputs */}
              <button
                type="button"
                data-part="add-link"
                onClick={addLink}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-[#1a1d22] hover:bg-[#2a2d32] text-white transition-colors"
                title="Add another link"
              >
                <Plus size={16} />
              </button>

              {/* Remove this row */}
              <button
                type="button"
                data-part="remove-link"
                onClick={() => removeLink(i)}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-[#1a1d22] hover:bg-[#e10908] text-white transition-colors"
                title="Remove link"
              >
                <X size={16} />
              </button>
            </div>
          )
        })
      )}
    </div>
  )
}
