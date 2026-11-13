import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Timer,
  GraduationCap,
  Trophy,
  UserRound,
  LogOut,
  ArrowUpRight,
  ArrowRight,
  Bell,
  Search,
  Menu,
  X,
  Sprout,
  Coins,
  ChevronDown,
  Settings,
  Check,
  RotateCcw,
  Plus,
  Heart,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Dashboard from "./Dashboard.jsx";
import useDialogFocus from "./useDialogFocus.js";
import Auth from "./Auth.jsx";
import Onboarding from "./Onboarding.jsx";
import Opportunities from "./pages/Opportunities.jsx";
import Calendar from "./pages/Calendar.jsx";
import Olympics from "./pages/Olympics.jsx";
import Focus from "./pages/Focus.jsx";
import Profile from "./pages/Profile.jsx";
import Ranking from "./pages/Ranking.jsx";
import {
  safeLoad,
  newStudent,
  passwordHash,
  makePlan,
  dayKey,
  weekdays,
} from "./lib.js";
const navigation = [
  ["Meu espaço", LayoutDashboard],
  ["Cronograma", CalendarDays],
  ["Área de foco", Timer],
  ["Revisões", BookOpen],
  ["Vestibulares", GraduationCap],
  ["Calendário", CalendarDays],
  ["Olimpíadas", Sprout],
  ["Ranking", Trophy],
  ["Meu perfil", UserRound],
];
export default function App() {
  useDialogFocus();
  const [store, setStore] = useState(safeLoad);
  const [page, setPage] = useState("Meu espaço");
  const [focusTask, setFocusTask] = useState(null);
  const [auth, setAuth] = useState(null);
  const [toast, setToast] = useState("");
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState(false);
  const [large, setLarge] = useState(false);
  const [contrast, setContrast] = useState(false);
  const account = store.accounts.find((a) => a.id === store.current);
  const student = account?.data || store.demo;
  const profile = student.profile;
  const demo = !account;
  useEffect(() => {
    try {
      localStorage.setItem("wizdom.v1", JSON.stringify(store));
    } catch {
      setToast(
        "O armazenamento está cheio. Fotos grandes podem não ser salvas.",
      );
    }
  }, [store]);
  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(""), 5000);
      return () => clearTimeout(id);
    }
  }, [toast]);
  useEffect(() => {
    document.title = `${page} · WIZDOM`;
  }, [page]);
  useEffect(() => {
    const shortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector(".search-wrap input")?.focus();
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  function notify(s) {
    setToast(s);
  }
  function update(key, value) {
    setStore((s) => {
      const apply = (d) => ({
        ...d,
        [key]: typeof value === "function" ? value(d[key]) : value,
      });
      return account
        ? {
            ...s,
            accounts: s.accounts.map((a) =>
              a.id === s.current ? { ...a, data: apply(a.data) } : a,
            ),
          }
        : { ...s, demo: apply(s.demo) };
    });
  }
  function navigate(p, task = null) {
    setFocusTask(task);
    setPage(p);
    setMobile(false);
    setSearch("");
    window.scrollTo(0, 0);
  }
  async function submitAuth({ name, email, password }) {
    email = email.trim().toLowerCase();
    if (auth === "signup") {
      if (store.accounts.some((a) => a.email === email))
        return "Este e-mail já tem cadastro neste navegador. Entre na sua conta.";
      const salt = crypto.randomUUID(),
        hash = await passwordHash(password, salt),
        id = crypto.randomUUID();
      setStore((s) => ({
        ...s,
        current: id,
        accounts: [
          ...s.accounts,
          { id, email, name, salt, hash, data: newStudent() },
        ],
      }));
      setAuth(null);
      navigate("Meu espaço");
      return;
    }
    const a = store.accounts.find((a) => a.email === email);
    if (!a || (await passwordHash(password, a.salt)) !== a.hash)
      return "E-mail ou senha não encontrados neste navegador.";
    setStore((s) => ({ ...s, current: a.id }));
    setAuth(null);
    navigate("Meu espaço");
    notify("Que bom ter você de volta!");
  }
  const shared = {
    profile,
    stats: student.stats,
    setStats: (v) => update("stats", v),
    notify,
  };
  const searchResults = navigation.filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase()),
  );
  if (auth)
    return (
      <>
        <Auth
          mode={auth}
          setMode={setAuth}
          onSubmit={submitAuth}
          onClose={() => setAuth(null)}
        />
      </>
    );
  if (account && !profile?.onboarded)
    return (
      <Onboarding
        name={account.name}
        onComplete={(p) => {
          update("profile", p);
          notify("Seu espaço está pronto. Vamos no seu ritmo!");
        }}
      />
    );
  return (
    <div
      className={`app ${large ? "large-type" : ""} ${contrast ? "high-contrast" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        Ir para o conteúdo
      </a>
      {mobile && (
        <div className="mobile-shade" onClick={() => setMobile(false)} />
      )}
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            navigate("Meu espaço");
          }}
        >
          <span className="brand-symbol">w</span>wizdom
          <span className="brand-period">.</span>
        </a>
        <span className="sidebar-caption">SEU FUTURO, NO SEU RITMO</span>
        <button
          className="mobile-close icon-button"
          aria-label="Fechar menu"
          onClick={() => setMobile(false)}
        >
          <X />
        </button>
        <div className="nav-group-label">SEU DIA A DIA</div>
        <nav aria-label="Navegação principal">
          {navigation.map(([name, Icon], i) => (
            <div key={name}>
              {i === 4 && <div className="nav-group-label">NOVOS CAMINHOS</div>}
              <button
                className={`nav-item ${page === name ? "active" : ""}`}
                aria-current={page === name ? "page" : undefined}
                onClick={() => navigate(name)}
              >
                <Icon size={19} strokeWidth={1.65} />
                {name}
                {name === "Área de foco" && <span className="nav-dot" />}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-encouragement">
            <span>✧</span>
            <p>
              O importante é continuar.
              <br />
              <strong>Mesmo que devagar.</strong>
            </p>
          </div>
          {demo ? (
            <button className="demo-account" onClick={() => setAuth("signup")}>
              <span className="user-avatar">J</span>
              <div>
                <strong>Explorando a WIZDOM</strong>
                <small>
                  Criar minha conta <ArrowUpRight size={12} />
                </small>
              </div>
            </button>
          ) : (
            <button
              className="demo-account"
              onClick={() => {
                setStore((s) => ({ ...s, current: null }));
                notify("Você saiu da conta. Voltou ao modo demonstração.");
              }}
            >
              <span className="user-avatar">{profile.name[0]}</span>
              <div>
                <strong>{profile.name}</strong>
                <small>
                  Sair da conta <LogOut size={12} />
                </small>
              </div>
            </button>
          )}
        </div>
      </aside>
      <div className="app-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button hamburger"
              aria-label="Abrir menu"
              onClick={() => setMobile(true)}
            >
              <Menu />
            </button>
            <span className="breadcrumb">
              Seu cantinho <span>/</span> <strong>{page}</strong>
            </span>
          </div>
          <div className="topbar-actions">
            <div className="search-wrap">
              <Search size={16} />
              <input
                aria-label="Buscar na WIZDOM"
                placeholder="O que vamos explorar?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <kbd>⌘ K</kbd>
              {search && (
                <div className="search-results">
                  {searchResults.length ? (
                    searchResults.map(([name, Icon]) => (
                      <button key={name} onClick={() => navigate(name)}>
                        <Icon size={17} />
                        {name}
                        <ArrowUpRight size={14} />
                      </button>
                    ))
                  ) : (
                    <p>Nenhuma página encontrada.</p>
                  )}
                </div>
              )}
            </div>
            <button
              className="coin-pill"
              onClick={() => navigate("Meu perfil")}
              title="Suas moedas"
            >
              <Coins size={16} />
              {student.stats.coins}
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Ver lembretes"
              onClick={() => {
                navigate("Calendário");
                notify(
                  "Suas inscrições favoritas e seus dias de estudo ficam no calendário.",
                );
              }}
            >
              <Bell size={19} />
              <i />
            </button>
            <button
              className="top-avatar"
              onClick={() => (demo ? setAuth("login") : navigate("Meu perfil"))}
              aria-label={demo ? "Entrar na conta" : "Abrir perfil"}
            >
              {profile.photo ? (
                <img src={profile.photo} alt="" />
              ) : (
                profile.name[0]
              )}
            </button>
          </div>
        </header>
        <main id="main-content" className="main-content">
          <div className="demo-notice" hidden={!demo}>
            <span>
              <span className="tiny-dot" /> Você está conhecendo a WIZDOM. Os
              dados deste espaço são demonstrativos.
            </span>
            <button onClick={() => setAuth("signup")}>
              Criar minha conta <ArrowRight size={13} />
            </button>
          </div>
          {page === "Meu espaço" && (
            <Dashboard
              {...shared}
              checkins={student.checkins}
              setCheckins={(v) => update("checkins", v)}
              completed={student.completed}
              setCompleted={(v) => update("completed", v)}
              favorites={student.favorites}
              navigate={navigate}
            />
          )}
          {page === "Cronograma" && (
            <Schedule
              profile={profile}
              mood={student.checkins[dayKey()]}
              navigate={navigate}
              onEdit={() => {
                if (demo) {
                  notify("Crie uma conta para montar um cronograma só seu.");
                  setAuth("signup");
                } else update("profile", (p) => ({ ...p, onboarded: false }));
              }}
            />
          )}
          {page === "Área de foco" && (
            <Focus {...shared} initialTask={focusTask} />
          )}
          {page === "Vestibulares" && (
            <Opportunities
              {...shared}
              favorites={student.favorites}
              setFavorites={(v) => update("favorites", v)}
            />
          )}
          {page === "Calendário" && (
            <Calendar {...shared} favorites={student.favorites} />
          )}
          {page === "Olimpíadas" && <Olympics {...shared} />}
          {page === "Ranking" && <Ranking {...shared} />}
          {page === "Meu perfil" && (
            <Profile {...shared} setProfile={(v) => update("profile", v)} />
          )}
          {page === "Revisões" && (
            <Reviews
              profile={profile}
              reviews={student.reviews}
              setReviews={(v) => update("reviews", v)}
              notify={notify}
            />
          )}
          <footer className="app-footer">
            <span>
              wizdom. <span>Feito para respeitar seu ritmo.</span>
            </span>
            <button onClick={() => setSettings(true)}>
              <Settings size={13} /> Conforto e privacidade
            </button>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <span>
            <Check size={16} />
          </span>
          {toast}
          <button
            className="icon-button"
            aria-label="Fechar aviso"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {settings && (
        <div className="modal-backdrop" onClick={() => setSettings(false)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-heading">
              <h2 id="settings-title">Seu conforto importa</h2>
              <button
                className="icon-button"
                aria-label="Fechar configurações"
                onClick={() => setSettings(false)}
              >
                <X />
              </button>
            </div>
            <label className="setting-row">
              <span>Texto maior</span>
              <input
                type="checkbox"
                checked={large}
                onChange={(e) => setLarge(e.target.checked)}
              />
            </label>
            <label className="setting-row">
              <span>Contraste reforçado</span>
              <input
                type="checkbox"
                checked={contrast}
                onChange={(e) => setContrast(e.target.checked)}
              />
            </label>
            <div className="privacy-note">
              <ShieldCheck size={22} />
              <div>
                <h3>Um protótipo, no seu navegador</h3>
                <p>
                  Cadastro e dados são locais. Não há autenticação em servidor,
                  envio de e-mails ou sincronização entre dispositivos. Não use
                  sua senha real. As senhas de teste são armazenadas como hash,
                  mas isto não substitui um sistema de autenticação de produção.
                </p>
                <p>
                  O ranking e as informações de inscrições são exemplos. Nenhum
                  dado pessoal é publicado.
                </p>
              </div>
            </div>
            <button
              className="button secondary"
              onClick={() => {
                setSettings(false);
                notify(
                  "Para apagar os dados locais, limpe os dados deste site nas configurações do navegador.",
                );
              }}
            >
              Como apagar meus dados
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
function Schedule({ profile, mood, navigate, onEdit }) {
  const [offset, setOffset] = useState(0);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
  const dates = Array.from({ length: 7 }, (_, i) => {
    let d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ORGANIZAR PARA RESPIRAR</span>
          <h1>Seu plano, seu ritmo.</h1>
          <p className="muted">
            Um caminho possível até {profile.course}. Com espaço para a vida
            acontecer.
          </p>
        </div>
        <button className="button secondary" onClick={onEdit}>
          Ajustar minha rotina
        </button>
      </div>
      <div className="schedule-summary">
        <div className="card">
          <CalendarDays />
          <strong>{profile.days.length} dias</strong>
          <span>de estudo na semana</span>
        </div>
        <div className="card">
          <Timer />
          <strong>{profile.hours}h por dia</strong>
          <span>na sua rotina habitual</span>
        </div>
        <div className="card">
          <Heart />
          <strong>Descansar faz parte</strong>
          <span>Seu check-in adapta o plano de hoje</span>
        </div>
      </div>
      <section className="card week-card">
        <div className="section-heading">
          <h2>
            {dates[0].toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "short",
            })}{" "}
            —{" "}
            {dates[6].toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </h2>
          <div className="inline-actions">
            <button
              className="button secondary"
              onClick={() => setOffset(offset - 1)}
            >
              ← Anterior
            </button>
            <button className="button secondary" onClick={() => setOffset(0)}>
              Hoje
            </button>
            <button
              className="button secondary"
              onClick={() => setOffset(offset + 1)}
            >
              Próxima →
            </button>
          </div>
        </div>
        <div className="week-grid">
          {dates.map((d) => (
            <div
              key={dayKey(d)}
              className={`week-day ${dayKey(d) === dayKey() ? "current-day" : ""}`}
            >
              <div className="week-day-title">
                <span>{weekdays[d.getDay()]}</span>
                <strong>{d.getDate()}</strong>
              </div>
              {profile.days.includes(d.getDay()) ? (
                makePlan(profile, dayKey(d) === dayKey() ? mood : "okay").map(
                  (t) => (
                    <button
                      key={t.id}
                      className={`schedule-block ${t.tone}`}
                      onClick={() => navigate("Área de foco")}
                    >
                      <span>{t.kind}</span>
                      <strong>{t.subject}</strong>
                      <small>
                        {t.minutes} min <ArrowUpRight size={12} />
                      </small>
                    </button>
                  ),
                )
              ) : (
                <div className="rest-day">
                  <Sprout size={24} />
                  <span>
                    Espaço para
                    <br />
                    descansar
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <div className="soft-info">
        <Heart size={20} />
        <p>
          Não existe atraso no seu próprio caminho. Você pode ajustar sua rotina
          sempre que precisar.
        </p>
      </div>
    </>
  );
}
const flashcards = [
  {
    id: "bio1",
    subject: "Biologia",
    front: "Qual é a principal função das mitocôndrias?",
    back: "Produzir ATP por meio da respiração celular, fornecendo energia para as atividades da célula.",
  },
  {
    id: "mat1",
    subject: "Matemática",
    front: "Como calcular a área de um triângulo?",
    back: "Multiplique a base pela altura e divida por 2: A = (b × h) / 2.",
  },
  {
    id: "his1",
    subject: "História",
    front: "O que marcou o início da Era Vargas?",
    back: "A Revolução de 1930, que levou Getúlio Vargas ao poder e encerrou a Primeira República.",
  },
];
function Reviews({ reviews, setReviews, notify }) {
  const [index, setIndex] = useState(0),
    [flipped, setFlipped] = useState(false);
  const card = flashcards[index];
  const record = reviews.find((r) => r.id === card.id);
  function grade(easy) {
    const next = new Date();
    next.setDate(next.getDate() + (easy ? 3 : 1));
    setReviews((v) => [
      ...v.filter((r) => r.id !== card.id),
      { id: card.id, due: dayKey(next), easy },
    ]);
    notify(`Revisão agendada para ${next.toLocaleDateString("pt-BR")}.`);
    setIndex((index + 1) % flashcards.length);
    setFlipped(false);
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">APRENDER, RELEMBRAR, FLORESCER</span>
          <h1>Um pouquinho fica.</h1>
          <p className="muted">
            Flashcards para transformar revisões em pequenos momentos de
            descoberta.
          </p>
        </div>
        <span className="badge lavender">3 cartões de exemplo</span>
      </div>
      <div className="review-layout">
        <section className="card flashcard-area">
          <div className="section-heading">
            <span className="badge lavender">{card.subject}</span>
            <span className="muted">
              {index + 1} / {flashcards.length}
            </span>
          </div>
          <button
            className={`flashcard ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
          >
            <BookOpen size={32} />
            <small>{flipped ? "RESPOSTA" : "TENTE LEMBRAR"}</small>
            <h2>{flipped ? card.back : card.front}</h2>
            <span>
              <RotateCcw size={14} />{" "}
              {flipped ? "Ver pergunta" : "Toque para revelar"}
            </span>
          </button>
          {flipped ? (
            <div className="review-actions">
              <button className="button secondary" onClick={() => grade(false)}>
                Quero revisar amanhã
              </button>
              <button className="button primary" onClick={() => grade(true)}>
                Lembrei! Rever em 3 dias <Check size={16} />
              </button>
            </div>
          ) : (
            <p className="muted review-tip">
              Sem pressa. Tentar lembrar também é aprender.
            </p>
          )}
          {record && (
            <p className="muted">
              Próxima revisão:{" "}
              {new Date(record.due + "T12:00:00").toLocaleDateString("pt-BR")}
            </p>
          )}
        </section>
        <aside className="card review-queue">
          <h2>No seu radar</h2>
          <p className="muted">Suas próximas revisões</p>
          {reviews.length ? (
            reviews.map((r) => (
              <div className="review-queue-item" key={r.id}>
                <BookOpen size={18} />
                <div>
                  <strong>
                    {flashcards.find((c) => c.id === r.id)?.subject}
                  </strong>
                  <p>
                    {new Date(r.due + "T12:00:00").toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Sprout />
              <p>Responda um cartão para começar sua rotina de revisão.</p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
