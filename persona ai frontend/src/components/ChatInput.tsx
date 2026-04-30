import type { FormEvent } from 'react'

type ChatInputProps = {
  disabled: boolean
  onInputChange: (value: string) => void
  onSend: (value: string) => void
  value: string
}

function ChatInput({ disabled, onInputChange, onSend, value }: ChatInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSend(value)
  }

  return (
    <form className="mt-4 flex items-end gap-3" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="chat-message">
        Ask your question
      </label>
      <textarea
        id="chat-message"
        className="min-h-14 flex-1 resize-none rounded-[1.5rem] border border-white/10 bg-black/25 px-4 py-4 text-sm text-slate-100 shadow-inner shadow-black/30 outline-none transition placeholder:text-slate-500 focus:border-sky-400/60 focus:bg-slate-950/80 focus:ring-4 focus:ring-sky-400/10 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        onChange={(event) => onInputChange(event.target.value)}
        placeholder="Ask about DSA, interviews, consistency, or system design..."
        rows={1}
        value={value}
      />
      <button
        className="inline-flex h-14 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,_#38bdf8,_#2563eb)] px-5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(37,99,235,0.34)] transition hover:scale-[1.01] hover:shadow-[0_18px_44px_rgba(56,189,248,0.34)] focus:outline-none focus:ring-4 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:shadow-none"
        disabled={disabled || !value.trim()}
        type="submit"
      >
        Send
      </button>
    </form>
  )
}

export default ChatInput
