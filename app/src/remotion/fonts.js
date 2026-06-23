// Registers the Google Fonts so the token literals ('Space Grotesk', 'Space Mono')
// resolve, and so Remotion waits for them before rendering frames.
import { loadFont as loadGrotesk } from '@remotion/google-fonts/SpaceGrotesk'
import { loadFont as loadMono } from '@remotion/google-fonts/SpaceMono'

loadGrotesk()
loadMono()
