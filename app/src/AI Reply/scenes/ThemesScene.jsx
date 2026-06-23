import { motion } from 'framer-motion'
import { ReceiptText, FileText, FileSpreadsheet, Landmark, Files, MessagesSquare } from 'lucide-react'
import { t, type } from '../tokens'
import { Sparkle, Toggle, Eyebrow, Mask, IconChip, rise } from '../fx'

const themes = [
  { Icon: ReceiptText, title: 'Remittance acknowledgments', desc: 'Thank-you when a customer confirms they paid.' },
  { Icon: FileText, title: 'Invoice copy requests', desc: 'Sends the invoice PDF on request.' },
  { Icon: FileSpreadsheet, title: 'Statement of account', desc: 'Generates and sends the SOA.' },
  { Icon: Landmark, title: 'Payment instructions', desc: 'Shares remit-to / wire details (in attachment).' },
  { Icon: Files, title: 'Stored documents', desc: 'Sends W-9, COI, MSA and more.' },
  { Icon: MessagesSquare, title: 'FAQ responses', desc: 'Answers from your FAQ library.' },
]

function ThemeCard({ Icon, title, desc, delay, toggleAt }) {
  return (
    <motion.div {...rise({ delay, y: 18 })}
      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: t.panel, border: `1px solid ${t.border}`, borderRadius: 14, boxShadow: t.shadowSoft }}>
      <IconChip delay={delay + 0.05} tone="primary"><Icon size={19} color={t.primary} strokeWidth={1.8} /></IconChip>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16.5, fontWeight: 600, color: t.ink, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 13.5, color: t.muted, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <Toggle on delay={toggleAt} />
    </motion.div>
  )
}

export default function ThemesScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2vh' }}>
        <Eyebrow delay={0.2}><Sparkle size={14} delay={0.25} /> The scope</Eyebrow>
        <div style={{ fontSize: type.h2, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em' }}>
          <Mask delay={0.35}>Six themes it can send</Mask>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, width: 'min(960px, 92vw)' }}>
        {themes.map((th, i) => (
          <ThemeCard key={th.title} {...th} delay={0.7 + i * 0.12} toggleAt={1.7 + i * 0.13} />
        ))}
      </div>

      <motion.div {...rise({ delay: 2.8, y: 12 })}
        style={{ fontSize: type.label, color: t.muted, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.good }} />
        Pure retrieval-and-merge work — <span style={{ color: t.ink, fontWeight: 600 }}>everything else routes to a human.</span>
      </motion.div>
    </div>
  )
}
