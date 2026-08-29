import { useState, useCallback } from 'react'
import { Link2, Plus, X, ChevronDown, Instagram, Youtube, Music2, Facebook, Twitter, Linkedin, Github, Mail } from 'lucide-react'
import { LinkifyIt } from 'linkify-it'
import { SocialIcon, getNetworks } from 'react-social-icons'
import TextField from '@mui/material/TextField'

const linkify = new LinkifyIt()

// Detect which social platform a URL (or plain network name) belongs to.
// Replicates react-social-icons' internal matching for URLs, but also matches
// bare names like "Instagram" / "YouTube" (legacy profile data stored names,
// not URLs). Returns null for unrecognized/generic links.
function detectNetwork(url) {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('mailto:')) return 'mailto'

  // Bare network name (legacy profile data: "Instagram", "YouTube", "TikTok")
  const socials = getNetworks()
  const lower = trimmed.toLowerCase()
  const exact = socials.find((s) => s.toLowerCase() === lower)
  if (exact) return exact

  // URL matching (react-social-icons style)
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

// Pretty display name for a detected network (e.g. "instagram" -> "Instagram").
// Falls back to the raw network key if unknown.
function networkDisplayName(network) {
  if (!network) return ''
  const map = {
    instagram: 'Instagram',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    twitter: 'Twitter',
    x: 'X',
    xcom: 'X',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    snapchat: 'Snapchat',
    pinterest: 'Pinterest',
    reddit: 'Reddit',
    twitch: 'Twitch',
    discord: 'Discord',
    telegram: 'Telegram',
    whatsapp: 'WhatsApp',
    threads: 'Threads',
    spotify: 'Spotify',
    soundcloud: 'SoundCloud',
    mailto: 'Email',
  }
  return map[network] || network.charAt(0).toUpperCase() + network.slice(1)
}

// White-outline lucide icon for a network (matches the original ProfileCard
// style — line icons, not brand-colored). Falls back to a generic link icon.
function networkOutlineIcon(network) {
  const map = {
    instagram: Instagram,
    youtube: Youtube,
    tiktok: Music2,
    facebook: Facebook,
    twitter: Twitter,
    x: Twitter,
    xcom: Twitter,
    linkedin: Linkedin,
    github: Github,
    mailto: Mail,
  }
  return map[network] || Link2
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
 *   - Renders DB link data. Recognized social platforms render as a horizontal
 *     row; all other links render as a list below.
 *   - props:
 *       value (array of link strings)
 *       socialStyle: 'icons' (default) | 'icon-name' — how the social row renders
 *       listTitle: string — heading for the "other links" list (default "Other links")
 *       collapsible: boolean — wrap the other-links list in a collapsible
 *       listHeight: number | 'auto' — fixed px height (scrollable) or auto (show all)
 */
export default function LinksSection({
  mode = 'display',
  value = [],
  onChange,
  socialStyle = 'icons',
  listTitle = 'Other links',
  collapsible = false,
  listHeight = 'auto',
}) {
  const links = Array.isArray(value) ? value : []
  // Collapsible open state (only meaningful in display mode with collapsible).
  // Defaults to closed (collapsed) so the list is hidden until toggled.
  const [open, setOpen] = useState(false)

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

    const renderSocialRow = () => {
      if (socialLinks.length === 0) return null
      if (socialStyle === 'icon-name') {
        // Icon + name chips (matches original ProfileCard style — white outline
        // lucide icons, not brand-colored)
        return (
          <div data-part="social-icons" className="flex items-center justify-start gap-4 flex-wrap">
            {socialLinks.map((link, i) => {
              const network = detectNetwork(link)
              const Icon = networkOutlineIcon(network)
              return (
                <a
                  key={`${link}-${i}`}
                  data-part="social-icon-link"
                  href={normalizeUrl(link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link}
                  className="flex items-center gap-1.5 text-[#888888] hover:text-white transition-colors"
                >
                  <Icon size={16} strokeWidth={1.5} />
                  <span className="text-xs lg:text-[14px]">{networkDisplayName(network)}</span>
                </a>
              )
            })}
          </div>
        )
      }
      // icons only (default)
      return (
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
      )
    }

    const renderOtherList = () => {
      if (otherLinks.length === 0) return null
      const list = (
        <ul
          data-part="link-list"
          className="space-y-2"
          style={listHeight !== 'auto' ? { maxHeight: listHeight, overflowY: 'auto' } : undefined}
        >
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
      )

      if (!collapsible) {
        return (
          <div data-part="other-links">
            <h4 data-part="other-links-title" className="text-[#888888] text-[13px] font-medium mb-2">
              {listTitle}
            </h4>
            {list}
          </div>
        )
      }

      // Collapsible wrapper
      return (
        <div data-part="other-links" className="border border-[#2a2d32] rounded-lg overflow-hidden">
          <button
            type="button"
            data-part="other-links-toggle"
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center justify-between px-3 py-2 text-left text-[#888888] hover:text-white hover:bg-[#1a1d22] transition-colors cursor-pointer"
          >
            <span className="text-[13px] font-medium">{listTitle}</span>
            <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && <div className="px-3 pb-3">{list}</div>}
        </div>
      )
    }

    return (
      <div data-component="LinksSection" className="space-y-4">
        {renderSocialRow()}
        {renderOtherList()}
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
