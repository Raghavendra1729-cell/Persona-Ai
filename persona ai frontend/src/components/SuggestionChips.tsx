import type { Persona } from '../types'

type SuggestionChipsProps = {
  disabled: boolean
  onSelectSuggestion: (value: string) => void
  persona: Persona
}

function SuggestionChips({ disabled, onSelectSuggestion, persona }: SuggestionChipsProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Quick start
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {persona.suggestions.map((suggestion) => (
          <button
            key={suggestion}
            className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-sky-400/10 hover:text-sky-100 focus:outline-none focus:ring-4 focus:ring-sky-400/10 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
            onClick={() => onSelectSuggestion(suggestion)}
            type="button"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SuggestionChips
