export type Role = "student" | "rural-teacher" | "urban-teacher"

export const mockUsers = [
  { id: "u1", name: "Asha", role: "student" as Role, grade: 7, language: "Hindi" },
  { id: "u2", name: "Ravi", role: "rural-teacher" as Role, language: "Hindi" },
  { id: "u3", name: "Meera", role: "urban-teacher" as Role, language: "English" },
]

export const mockNotes = [
  {
    id: "n1",
    title: "Fractions Basics",
    subject: "Math",
    grade: 6,
    authorRole: "urban-teacher" as Role,
    authorName: "Meera",
    content: "Introduction to fractions with halves and quarters.",
    language: "English",
  },
  {
    id: "n2",
    title: "Water Cycle",
    subject: "Science",
    grade: 7,
    authorRole: "rural-teacher" as Role,
    authorName: "Ravi",
    content: "Stages of the water cycle: evaporation, condensation, precipitation.",
    language: "English",
  },
]

export const mockShifts = [
  {
    id: "s1",
    subject: "English",
    date: new Date().toISOString().slice(0, 10),
    grade: 6,
    requestedBy: "Ravi",
    status: "open" as const,
  },
  {
    id: "s2",
    subject: "Math",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    grade: 7,
    requestedBy: "Ravi",
    status: "open" as const,
  },
]

export const mockClasses = [
  {
    id: "c1",
    topic: "Decimals vs Fractions",
    grade: 7,
    summary: "Slides covering conversion between decimals and fractions.",
    teacherName: "Meera",
  },
  {
    id: "c2",
    topic: "Plant Photosynthesis",
    grade: 6,
    summary: "Short lesson with diagrams on photosynthesis steps.",
    teacherName: "Ravi",
  },
]

export const mockThreads = [
  {
    id: "t1",
    title: "Joint plan: Grade 6 Fractions",
    description: "Share tips, sample problems, and pacing for rural settings.",
    createdBy: "Meera",
    comments: [
      { id: "c1", author: "Ravi", text: "I can cover practice for word problems." },
      { id: "c2", author: "Meera", text: "I’ll draft a worksheet with visuals." },
    ],
  },
]
