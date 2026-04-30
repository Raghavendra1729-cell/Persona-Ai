export type Persona = {
  avatar: string
  firstName: string
  id: string
  name: string
  shortDescription: string
  suggestions: string[]
  title: string
}

export type ChatMessage = {
  content: string
  id: string
  role: 'user' | 'assistant' | 'error'
}

export type ApiMessage = {
  content: string
  role: 'user' | 'assistant'
}
