export const subjects = [
  "Biologia",
  "Matemática",
  "Português",
  "Redação",
  "Química",
  "Física",
  "História",
  "Geografia",
  "Inglês",
];
export const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export const initialProfile = {
  name: "Júlia",
  course: "Medicina",
  favorite: "Biologia",
  difficulty: "Matemática",
  frequency: "3 a 4 dias por semana",
  hours: 2,
  days: [1, 2, 3, 4, 5],
  goal: "Construir uma rotina mais leve",
  year: "2027",
  school: "Ensino médio",
  routine: "Estudo na escola pela manhã",
  bio: "Um passo de cada vez em direção ao meu sonho.",
  onboarded: true,
};
export const emptyStats = {
  xp: 0,
  coins: 0,
  sessions: [],
  owned: ["lavanda"],
  outfit: "lavanda",
};
export function studentType(profile) {
  return Number(profile.hours) <= 1
    ? "Pequenos passos"
    : profile.frequency === "Estou começando"
      ? "Explorando meu ritmo"
      : "Construindo constância";
}
export function makePlan(profile, mood = "okay") {
  const minutes = Math.max(
    15,
    Math.min(480, Math.round((Number(profile.hours) || 1) * 60)),
  );
  const light = mood === "tired" || mood === "overwhelmed";
  if (light)
    return [
      {
        id: "gentle",
        subject: profile.favorite,
        title: "Uma revisão leve, no seu ritmo",
        minutes: Math.min(25, Math.max(10, Math.round(minutes * 0.4))),
        kind: "Revisão",
        tone: "lavender",
      },
    ];
  const blocks = Math.min(4, Math.max(1, Math.ceil(minutes / 40)));
  const list = [
    {
      subject: profile.difficulty,
      title: "Vamos descomplicar esse assunto",
      kind: "Exercícios",
      tone: "blue",
    },
    {
      subject: profile.favorite,
      title: "Aprender também pode ser gostoso",
      kind: "Conteúdo",
      tone: "mint",
    },
    {
      subject: "Redação",
      title: "Uma ideia, um parágrafo de cada vez",
      kind: "Prática",
      tone: "pink",
    },
    {
      subject: profile.difficulty,
      title: "Revisar para guardar na memória",
      kind: "Revisão",
      tone: "lavender",
    },
  ];
  return list
    .slice(0, blocks)
    .map((x, i) => ({
      ...x,
      id: `task-${i}`,
      minutes: Math.floor(minutes / blocks) + (i < minutes % blocks ? 1 : 0),
    }));
}
export function newStudent(profile = null) {
  return {
    profile,
    stats: structuredClone(emptyStats),
    favorites: [],
    checkins: {},
    completed: {},
    reviews: [],
  };
}
export function safeLoad() {
  try {
    const d = JSON.parse(localStorage.getItem("wizdom.v1"));
    if (d?.version === 1 && d.demo && Array.isArray(d.accounts)) return d;
  } catch {}
  return {
    version: 1,
    accounts: [],
    current: null,
    demo: newStudent(initialProfile),
  };
}
export async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (x) =>
    x.toString(16).padStart(2, "0"),
  ).join("");
}
