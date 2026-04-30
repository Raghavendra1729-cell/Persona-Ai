type TypingIndicatorProps = {
  personaName: string
}

function TypingIndicator({ personaName }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start">
      <div className="rounded-[1.5rem] rounded-bl-md border border-white/10 bg-white/8 px-4 py-3 text-sm text-slate-300 shadow-lg shadow-black/20 animate-[fade-in_180ms_ease-out]">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-100">{personaName} is typing</span>
          <div className="flex items-center gap-1">
            <span className="size-2 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.3s]" />
            <span className="size-2 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.15s]" />
            <span className="size-2 animate-bounce rounded-full bg-sky-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
