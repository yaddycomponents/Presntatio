import { Composition } from 'remotion'
import { Film, totalFrames } from './Film.jsx'
import './fonts.js'

export const RemotionRoot = () => (
  <Composition
    id="ai-autoreply"
    component={Film}
    durationInFrames={totalFrames}
    fps={30}
    width={1920}
    height={1080}
  />
)
