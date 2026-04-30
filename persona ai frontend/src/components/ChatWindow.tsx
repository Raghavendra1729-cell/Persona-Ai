import { useEffect, useRef } from 'react'
import type { ChatMessage, Persona } from '../types'
import TypingIndicator from './TypingIndicator'

type ChatWindowProps = {
  activePersona: Persona
  isLoading: boolean
  messages: ChatMessage[]
}

function ChatWindow({ activePersona, isLoading, messages }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, activePersona.id])

  return (
    <section className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
      {messages.length === 0 ? (
        <div className="flex h-full min-h-[320px] items-center justify-center">
          <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 text-center shadow-[0_20px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl animate-[fade-in_240ms_ease-out]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
              Smooth chatting starts here
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              {activePersona.name} is ready.
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Click a suggestion below or type your own question. Switching personas will clear the
              current chat instantly.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const isUser = message.role === 'user'
            const isError = message.role === 'error'

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-[fade-in_180ms_ease-out]`}
              >
                <div
                  className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-lg sm:max-w-[70%] ${
                    isUser
                      ? 'rounded-br-md border border-sky-300/10 bg-[linear-gradient(135deg,_#0f172a,_#1e293b)] text-slate-50 shadow-sky-950/40'
                      : isError
                        ? 'rounded-bl-md border border-rose-400/30 bg-rose-500/12 text-rose-100'
                        : 'rounded-bl-md border border-white/10 bg-white/8 text-slate-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            )
          })}
          {isLoading ? <TypingIndicator personaName={activePersona.firstName} /> : null}
        </div>
      )}
      <div ref={bottomRef} />
    </section>
  )
}

export default ChatWindow
