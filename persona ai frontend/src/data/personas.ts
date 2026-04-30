import type { Persona } from '../types'

export const PERSONAS: Persona[] = [
  {
    id: 'anshuman',
    name: 'Anshuman Singh',
    firstName: 'Anshuman',
    title: 'First-principles coach',
    shortDescription: 'Clarity, invariants, and sharp DSA plans',
    avatar: '/personas/anshuman.jpeg',
    suggestions: [
      'How should I build consistency in DSA with a full-time schedule?',
      'Explain how to think in invariants for array questions.',
      'Give me a focused 2-week interview prep plan.',
    ],
  },
  {
    id: 'abhimanyu',
    name: 'Abhimanyu Saxena',
    firstName: 'Abhimanyu',
    title: 'Interview realism mentor',
    shortDescription: 'Structured answers, pressure handling, and system design',
    avatar: '/personas/abhimanyu.jpeg',
    suggestions: [
      'How do I prepare for my first product-based company interview?',
      'How should I structure my answer in a system design round?',
      'What is the fastest way to improve recursion interviews?',
    ],
  },
  {
    id: 'kshitij',
    name: 'Kshitij Mishra',
    firstName: 'Kshitij',
    title: 'Diagnostic instructor',
    shortDescription: 'Patterns, state definition, and pinpointed corrections',
    avatar: '/personas/kshitij.jpeg',
    suggestions: [
      'How do I stop freezing after reading the problem statement?',
      'Help me decide between brute force, hashing, and two pointers.',
      'How should I define DP state without getting lost?',
    ],
  },
]
