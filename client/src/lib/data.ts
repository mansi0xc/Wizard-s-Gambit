export type Question = {
    id: number
    text: string
    options: {
      id: string
      text: string
    }[]
  }
  
  export type Patronus = {
    id: number
    name: string
    description: string
    image: string
    ability: string
  }
  
  export const questions: Question[] = [
    {
      id: 1,
      text: "When faced with darkness, what guides you forward?",
      options: [
        { id: "hope", text: "Hope" },
        { id: "memory", text: "Memory of loved ones" },
        { id: "determination", text: "Determination" },
        { id: "adventure", text: "Adventure" },
      ],
    },
    {
      id: 2,
      text: "Which natural element do you feel most connected to?",
      options: [
        { id: "water", text: "Water" },
        { id: "wind", text: "Wind" },
        { id: "fire", text: "Fire" },
        { id: "earth", text: "Earth" },
      ],
    },
    {
      id: 3,
      text: "If you could explore one mysterious place, where would you go?",
      options: [
        { id: "forest", text: "Forest Grove" },
        { id: "mountain", text: "Mountain Peak" },
        { id: "lake", text: "Ancient Lake" },
        { id: "castle", text: "Forgotten Castle" },
      ],
    },
    {
      id: 4,
      text: "What instinct drives you in times of danger?",
      options: [
        { id: "protect", text: "Protecting loved ones" },
        { id: "escape", text: "Finding an escape" },
        { id: "stand", text: "Standing my ground" },
        { id: "peace", text: "Seeking peace" },
      ],
    },
    {
      id: 5,
      text: "Which word resonates with your soul the most?",
      options: [
        { id: "courage", text: "Courage" },
        { id: "wisdom", text: "Wisdom" },
        { id: "freedom", text: "Freedom" },
        { id: "loyalty", text: "Loyalty" },
      ],
    },
    {
      id: 6,
      text: "If your Patronus appeared before you, what would you feel?",
      options: [
        { id: "awe", text: "Awe" },
        { id: "strength", text: "Strength" },
        { id: "comfort", text: "Comfort" },
        { id: "excitement", text: "Excitement" },
      ],
    },
    {
      id: 7,
      text: "What kind of magic do you feel most drawn to?",
      options: [
        { id: "protective", text: "Protective Spells" },
        { id: "transfiguration", text: "Transfiguration" },
        { id: "elemental", text: "Elemental Magic" },
        { id: "charms", text: "Charms" },
      ],
    },
  ]
  
  export const patronuses: Patronus[] = [
    {
      id: 1,
      name: "Stag",
      description: "Noble and protective. Represents pride and purpose.",
      image: "/placeholder.svg?height=150&width=150",
      ability: "Protector: Reduces damage taken by 20% for 2 rounds.",
    },
    {
      id: 2,
      name: "Phoenix",
      description: "Rare and powerful. Represents rebirth and healing.",
      image: "/placeholder.svg?height=150&width=150",
      ability: "Rebirth: Once per duel, restore 30% of your health when below 20%.",
    },
    {
      id: 3,
      name: "Wolf",
      description: "Loyal and fierce. Represents family and instinct.",
      image: "/placeholder.svg?height=150&width=150",
      ability: "Pack Hunter: Increases damage by 15% for 2 rounds.",
    },
    {
      id: 4,
      name: "Otter",
      description: "Playful and intelligent. Represents joy and curiosity.",
      image: "/placeholder.svg?height=150&width=150",
      ability: "Evasive: 25% chance to dodge attacks for 2 rounds.",
    },
  ]
  