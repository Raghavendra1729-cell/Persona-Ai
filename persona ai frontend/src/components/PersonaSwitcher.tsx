import type { Persona } from '../types'

type PersonaSwitcherProps = {
  activePersonaId: string
  onSelectPersona: (persona: Persona) => void
  personas: Persona[]
}

function PersonaSwitcher({ activePersonaId, onSelectPersona, personas }: PersonaSwitcherProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-5">
      {personas.map((persona) => {
        const isActive = persona.id === activePersonaId

        return (
          <button
            key={persona.id}
            className={`group rounded-[1.75rem] border px-3 py-4 text-center transition duration-300 sm:px-4 ${
              isActive
                ? 'border-sky-300/30 bg-sky-400/10 shadow-[0_22px_48px_rgba(14,165,233,0.18)]'
                : 'border-white/8 bg-white/5 hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/8'
            }`}
            onClick={() => onSelectPersona(persona)}
            type="button"
          >
            <div
              className={`mx-auto flex size-18 items-center justify-center rounded-full p-1 transition duration-300 sm:size-20 ${
                isActive
                  ? 'scale-105 bg-[linear-gradient(135deg,_#38bdf8,_#1d4ed8)] shadow-lg shadow-sky-500/30'
                  : 'bg-slate-800 group-hover:scale-[1.02]'
              }`}
            >
              <img
                alt={persona.name}
                className="h-full w-full rounded-full object-cover object-top"
                src={persona.avatar}
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-100">{persona.firstName}</p>
            <p className="mt-1 hidden text-xs text-slate-400 sm:block">{persona.shortDescription}</p>
          </button>
        )
      })}
    </div>
  )
}

export default PersonaSwitcher
