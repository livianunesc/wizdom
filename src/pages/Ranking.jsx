import { useState } from "react";
import {
  Award,
  BookOpen,
  Heart,
  Leaf,
  Medal,
  Sparkles,
  Trophy,
} from "lucide-react";
import "./focus-profile.css";

const students = [
  {
    name: "Marina Costa",
    course: "Psicologia",
    xp: 860,
    initials: "MC",
    color: "#e3f1f8",
  },
  {
    name: "Lucas Almeida",
    course: "Engenharia",
    xp: 740,
    initials: "LA",
    color: "#f8ece3",
  },
  {
    name: "Julia Santos",
    course: "Medicina",
    xp: 620,
    initials: "JS",
    color: "#e6e3f8",
  },
  {
    name: "Pedro Lima",
    course: "Direito",
    xp: 480,
    initials: "PL",
    color: "#e3f8ee",
  },
  {
    name: "Ana Beatriz",
    course: "Arquitetura",
    xp: 320,
    initials: "AB",
    color: "#f8e3e3",
  },
];
export default function Ranking({ profile = {}, stats = {} }) {
  const [participating, setParticipating] = useState(() => {
    try {
      return localStorage.getItem("wizdom-ranking-optin") !== "false";
    } catch {
      return true;
    }
  });
  const people = [
    ...students,
    ...(participating
      ? [
          {
            name: profile.name || "Você",
            course: profile.course || "Meu próximo passo",
            xp: stats.xp || 0,
            initials: (profile.name || "Você")
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0])
              .join(""),
            color: "#e6e3f8",
            self: true,
          },
        ]
      : []),
  ].sort((a, b) => b.xp - a.xp);
  const position = people.findIndex((item) => item.self) + 1;
  function toggle() {
    setParticipating(!participating);
    try {
      localStorage.setItem("wizdom-ranking-optin", String(!participating));
    } catch {}
  }
  return (
    <div className="fp-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">JUNTOS, A GENTE VAI MAIS LONGE</p>
          <h1>Uma comunidade que cresce</h1>
          <p className="muted">
            Inspire-se em outras jornadas, sem perder de vista a sua.
          </p>
        </div>
        <span className="badge">
          <Leaf size={15} /> Cada pessoa tem seu ritmo
        </span>
      </div>
      <div className="ranking-hero">
        <div>
          <span className="ranking-icon">
            <Trophy size={30} />
          </span>
          <h2>Seu esforço merece ser celebrado.</h2>
          <p>
            Aqui, os pontos vêm do tempo dedicado aos estudos.
            <br />O importante é continuar, um pouquinho a cada dia.
          </p>
        </div>
        <div className="ranking-your-position">
          <span>Seu lugar nesta comunidade</span>
          <strong>{participating ? `${position}º` : "—"}</strong>
          <small>{stats.xp || 0} XP de dedicação</small>
        </div>
      </div>
      <div className="ranking-note">
        <BookOpen size={18} />
        <p>
          <strong>Ranking demonstrativo.</strong> Os outros estudantes são
          fictícios. Seus pontos refletem seu uso deste protótipo; não há
          comparação com pessoas reais.
        </p>
      </div>
      <div className="ranking-layout">
        <section className="card ranking-board">
          <div className="section-heading">
            <div>
              <h2>Pequenos passos, grandes conquistas</h2>
              <p className="muted">Classificação por XP acumulado</p>
            </div>
            <Award size={23} />
          </div>
          <div
            className="ranking-table"
            role="table"
            aria-label="Ranking demonstrativo de estudantes"
          >
            <div className="ranking-table-head" role="row">
              <span role="columnheader">Posição</span>
              <span role="columnheader">Estudante</span>
              <span role="columnheader">Dedicação</span>
            </div>
            {people.map((person, index) => (
              <div
                className={`ranking-row ${person.self ? "ranking-self" : ""}`}
                role="row"
                key={person.name}
              >
                <span className="ranking-place" role="cell">
                  {index < 3 ? (
                    <Medal size={23} className={`medal-${index}`} />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <div className="ranking-student" role="cell">
                  <span
                    className="student-initials"
                    style={{ background: person.color }}
                  >
                    {person.initials}
                  </span>
                  <div>
                    <strong>
                      {person.name}
                      {person.self && <span className="you-tag">Você</span>}
                    </strong>
                    <small>{person.course}</small>
                  </div>
                </div>
                <strong className="ranking-points" role="cell">
                  {person.xp} <small>XP</small>
                </strong>
              </div>
            ))}
          </div>
        </section>
        <aside>
          <div className="card ranking-kind-card">
            <Heart size={26} />
            <h3>Seu maior progresso é com você.</h3>
            <p className="muted">
              Estudar 15 minutos em um dia difícil também é uma conquista. O
              ranking é um convite, nunca uma cobrança.
            </p>
          </div>
          <div className="card ranking-opt-in">
            <Sparkles size={23} />
            <h3>Você escolhe participar</h3>
            <p className="muted">
              Seu progresso continua sendo salvo, mesmo fora da classificação.
            </p>
            <label className="ranking-toggle">
              <input
                type="checkbox"
                checked={participating}
                onChange={toggle}
              />
              <span>Mostrar meu perfil no ranking</span>
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
}
