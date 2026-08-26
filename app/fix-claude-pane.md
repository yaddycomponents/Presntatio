# Fix prompt — Claude Code pane (scene G)

Paste this into Claude Code as-is.

---

The Claude Code pane in the generated frame is off-spec. Fix these, following `handoff/theme.md` + `handoff/theme.css`. Change nothing else.

**1. Font size is far too large.** Chat text is rendering ~40px and wrapping mid-sentence. Set the pane body to exactly `28px` with `line-height: 1.65`, `font-family: 'Fira Code', monospace`. Every line must fit on one line at 1920 wide — if a line wraps, shorten the copy, do not shrink the font. The status footer is `20px`.

**2. Content is bottom-anchored with a huge empty void above it.** The pane is `display: flex; flex-direction: column`, content starts at the **top** under the header (`justify-content: flex-start`), padding `28px 32px`, `gap: 20px` between blocks. The footer is pushed down with `margin-top: auto`. No empty region larger than one line gap.

**3. Chat pane is unthemed.** Apply scene G:
- Pane background `--bg` #11111B; header bar `--surface` #1E1E2E, 56px tall, `1px solid --border` bottom, containing a peach ✳ (#FAB387) + "Claude Code" in `--text`.
- User prompt lines: `❯` and the text both `--green` #A6E3A1. Right now the prompt is mauve — wrong. Mauve is only for git branch and section labels.
- Agent bullets: `●` dot at `0.6em` in `--green`, body copy `--green`, bold emphasis `--bold` #F2F4FF, inline code on `--chip` #313244 with `border-radius: 4px; padding: 2px 8px`.
- Question/confirm lines (`Write the migration plan? (y/n)`): arrow `▸` in `--peach`, the `(y/n)` in `--faint` #6C7086.
- Thin `1px --border` divider above the footer, then `app (git:main)` in `--green` and `▸▸ auto-accept edits on` in `--peach` with `(shift+tab to cycle)` in `--faint`.

**4. The bottom status bar is bright mauve full-bleed.** That reads as a glowing band on video. Make it `--surface` #1E1E2E with a `1px solid --border` top edge, 44px tall, text `20px` in `--muted` #A6ADC8, and accent only the active items (`main*` in `--mauve`, `Go Live` in `--teal`). No saturated fills wider than a pill anywhere in the frame.

**5. The editor pane is empty except the wordmark.** Either show real file content in the editor (use `docs/UPGRADE_ANALYSIS.md` or a diff, per scene B) or drop the editor column entirely and let the chat pane take the full 1920. An empty 1400px column is dead frame.

**6. Remove browser chrome from the render.** The URL bar, bookmarks bar, and OS sidebar are captured in the frame. The stage is only the app: `1920×1080`, nothing above or outside it.

Also drop the `2/12 · ← → · space` navigation overlay and the dot pager at the bottom — those are player UI, not part of the video frame.
