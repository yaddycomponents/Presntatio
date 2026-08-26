# Fix prompt — round 2

Paste as-is into Claude Code. Re-read `handoff/theme.md` and `handoff/theme.css` first; they changed.

---

Two things are wrong. Fix only these.

**1. Wrong Catppuccin flavour.** My VS Code is **Catppuccin Frappé**, not Mocha. The frame is using Mocha hexes, which is why it reads near-black and colder than my real editor. Re-import `handoff/theme.css` and replace every hardcoded color with its variable. Sweep the output for these and remove them all:

```
#11111B → var(--bg)        #232634   (crust)
#1E1E2E → var(--surface)   #303446   (base)
#181825 → var(--sunken)    #292C3C   (mantle)
#313244 → var(--border)    #414559   (surface0)
#CDD6F4 → var(--text)      #C6D0F5
#A6ADC8 → var(--muted)     #A5ADCE
#6C7086 → var(--faint)     #838BA7
#A6E3A1 → var(--green)     #A6D189
#CBA6F7 → var(--mauve)     #CA9EE6
#94E2D5 → var(--teal)      #81C8BE
#FAB387 → var(--peach)     #EF9F76
#F38BA8 → var(--red)       #E78284
```

Fonts also change: editor and diff text use `var(--font-code)` = **Monaspace Neon** (ligatures on); the terminal and Claude Code panes use `var(--font-term)` = **FiraCode Nerd Font Mono**. Titles/narration stay IBM Plex Sans. Never sans inside a pane.

**2. The Claude Code pane font is much bigger than my real one.** In my editor every pane shares one size — the chat pane is never larger than the editor. Use the tokens, no custom sizes anywhere:

- editor / diff / file tree → `var(--code)` **26px / 39px**
- Claude Code pane → `var(--chat)` **24px / 36px**
- tab bar, sidebar, status bar → `var(--ui)` **20px**

Then: every chat line must fit on one line at 1920 wide — if a line wraps, shorten the copy, do not shrink the font. Content top-aligns under the 56px header with `gap: 20px`; the footer sits at `margin-top: auto`. No empty region taller than two lines — the pane in the last frame had ~500px of dead space under the last bullet.

Also still outstanding from the previous round: the user prompt line (`❯` and its text) is **green**, not mauve — mauve is only for git branch and section labels. And one addition: real shell output in the terminal scene uses my `terminal.foreground` override `--term-green` **#00FD61**, including the cursor. That bright green is terminal-only — never in the chat pane or UI chrome.
~
