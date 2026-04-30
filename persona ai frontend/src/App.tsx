import { useRef, useState } from 'react'
import ChatInput from './components/ChatInput'
import ChatWindow from './components/ChatWindow'
import PersonaSwitcher from './components/PersonaSwitcher'
import SuggestionChips from './components/SuggestionChips'
import { PERSONAS } from './data/personas'
import type { ApiMessage, ChatMessage, Persona } from './types'

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

function App() {
  const [activePersona, setActivePersona] = useState<Persona>(PERSONAS[0])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const requestIdRef = useRef(0)

  const resetConversation = (persona: Persona) => {
    requestIdRef.current += 1
    setActivePersona(persona)
    setMessages([])
    setInput('')
    setError(null)
    setIsLoading(false)
  }

  const toApiHistory = (chatMessages: ChatMessage[]): ApiMessage[] =>
    chatMessages
      .filter(
        (message): message is ChatMessage & { role: 'user' | 'assistant' } =>
          message.role === 'user' || message.role === 'assistant',
      )
      .map((message) => ({
        role: message.role,
        content: message.content,
      }))

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim()
    if (!message || isLoading) {
      return
    }

    const personaAtRequestTime = activePersona
    const history = toApiHistory(messages)
    const nextRequestId = requestIdRef.current + 1

    requestIdRef.current = nextRequestId
    setError(null)
    setInput('')
    setIsLoading(true)
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
      },
    ])

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona_id: personaAtRequestTime.id,
          message,
          chat_history: history,
        }),
      })

      const data = (await response.json().catch(() => null)) as
        | { reply?: string; detail?: string }
        | null

      if (requestIdRef.current !== nextRequestId) {
        return
      }

      if (!response.ok || !data?.reply) {
        const detail = data?.detail ?? 'Something went wrong while contacting the AI service.'
        throw new Error(detail)
      }

      const reply = data.reply

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: reply,
        },
      ])
    } catch (caughtError) {
      if (requestIdRef.current !== nextRequestId) {
        return
      }

      const messageText =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to complete your request right now.'

      setError(messageText)
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'error',
          content: messageText,
        },
      ])
    } finally {
      if (requestIdRef.current === nextRequestId) {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_24%),radial-gradient(circle_at_80%_12%,_rgba(14,165,233,0.14),_transparent_18%),linear-gradient(180deg,_#020617_0%,_#020817_38%,_#050816_100%)] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:78px_78px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)] opacity-25" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-300">
              Persona AI
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Select your persona to talk to
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Pick one mentor, start with a quick prompt, and continue the conversation in a smooth
              single-page chat.
            </p>
          </div>

          <div className="mt-6">
            <PersonaSwitcher
              activePersonaId={activePersona.id}
              personas={PERSONAS}
              onSelectPersona={resetConversation}
            />
          </div>
        </header>

        <main className="mt-5 flex min-h-0 flex-1 flex-col rounded-[2rem] border border-white/10 bg-black/22 shadow-[0_28px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <div className="border-b border-white/10 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-slate-400">Now chatting with</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{activePersona.name}</h2>
              </div>
              <span className="hidden rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200 sm:inline-flex">
                {activePersona.title}
              </span>
            </div>
          </div>

          <ChatWindow messages={messages} activePersona={activePersona} isLoading={isLoading} />

          <div className="border-t border-white/10 px-4 py-4 sm:px-6">
            <SuggestionChips
              disabled={isLoading}
              persona={activePersona}
              onSelectSuggestion={sendMessage}
            />
            <ChatInput
              disabled={isLoading}
              onInputChange={setInput}
              onSend={sendMessage}
              value={input}
            />
          </div>
        </main>

        {error ? (
          <div className="pointer-events-none fixed inset-x-4 bottom-4 z-20 mx-auto max-w-md rounded-2xl border border-rose-400/30 bg-rose-500/12 px-4 py-3 text-sm text-rose-100 shadow-[0_18px_48px_rgba(244,63,94,0.18)] backdrop-blur-xl">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default App
