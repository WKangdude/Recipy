"use client";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CookingPot,
  Leaf,
  LayoutDashboard,
  Moon,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Sun,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import {
  Dish,
  Entry,
  Food,
  foods,
  groups,
  localDate,
  meals,
  seedDishes,
  targets,
  totals,
} from "../lib/data";
const tabs = [
  { name: "Mi día", icon: LayoutDashboard },
  { name: "Mi plan", icon: BookOpen },
  { name: "Mis platillos", icon: CookingPot },
  { name: "Planificador", icon: CalendarDays },
];
function DishArt({ color, small = false }: { color: string; small?: boolean }) {
  return (
    <div
      className={`dish-art ${color} ${small ? "small" : ""}`}
      aria-hidden="true"
    >
      <div className="plate">
        <span className="greens" />
        <span className="grain" />
        <span className="protein" />
        <span className="tomatoes" />
        <span className="avocado" />
      </div>
      <span className="art-leaf">✦</span>
    </div>
  );
}
export default function Home() {
  const [tab, setTab] = useState("Mi día");
  const [dark, setDark] = useState(false);
  const [date, setDate] = useState(localDate());
  const [dishes, setDishes] = useState<Dish[]>(seedDishes);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("Todos");
  const [modal, setModal] = useState<"dish" | "schedule" | null>(null);
  const [selected, setSelected] = useState<Dish | null>(null);
  const [meal, setMeal] = useState("Comida");
  const [toast, setToast] = useState("");
  const [plan, setPlan] = useState(targets);
  const [editing, setEditing] = useState<Dish | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("recipy-v1");
      if (raw) {
        const data = JSON.parse(raw);
        if (
          Array.isArray(data.dishes) &&
          Array.isArray(data.entries) &&
          data.plan
        ) {
          setDishes(data.dishes);
          setEntries(data.entries);
          setPlan(data.plan);
        }
      }
      setDark(localStorage.getItem("recipy-theme") === "dark");
    } catch {
      setToast("No pudimos recuperar los datos locales.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(
          "recipy-v1",
          JSON.stringify({ dishes, entries, plan }),
        );
      } catch {
        setToast("El navegador no pudo guardar los cambios.");
      }
    }
  }, [dishes, entries, plan, ready]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    if (ready) localStorage.setItem("recipy-theme", dark ? "dark" : "light");
  }, [dark, ready]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  useEffect(() => {
    if (!modal && !selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModal(null);
        setSelected(null);
      }
    };
    const previous = document.activeElement as HTMLElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".modal button:not(:disabled), .modal input, .modal select, .modal textarea",
        ),
      );
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", handler);
      document.removeEventListener("keydown", trap);
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, [modal, selected]);
  const todayEntries = entries.filter((e) => e.date === date);
  const total = groups.map((_, i) =>
    todayEntries.reduce((sum, e) => {
      const d = dishes.find((d) => d.id === e.dishId);
      return sum + (d ? totals(d, e.servings)[i] : 0);
    }, 0),
  );
  const daily = groups.map((_, i) => meals.reduce((s, m) => s + plan[m][i], 0));
  const dateLabel = new Date(date + "T12:00:00").toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  function moveDate(n: number) {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() + n);
    setDate(localDate(d));
  }
  function navigate(name: string) {
    setTab(name);
    setQuery("");
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("Mi día");
          }}
        >
          <span className="brand-icon">
            <Leaf size={22} />
          </span>
          recipy<span className="brand-dot">.</span>
        </a>
        <div className="workspace-label">TU ESPACIO PERSONAL</div>
        <nav aria-label="Principal">
          {tabs.map((t) => (
            <button
              key={t.name}
              className={tab === t.name ? "nav-item active" : "nav-item"}
              onClick={() => navigate(t.name)}
            >
              <t.icon size={20} />
              <span>{t.name}</span>
              {tab === t.name && <span className="active-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <div className="note-icon">
            <Leaf size={22} />
          </div>
          <strong>Un día a la vez.</strong>
          <p>
            Comer bien también es
            <br />
            cuidar de ti.
          </p>
          <span className="note-line" />
        </div>
        <div className="sidebar-bottom">
          <button className="theme-button" onClick={() => setDark(!dark)}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{dark ? "Tema claro" : "Tema oscuro"}</span>
          </button>
          <div className="profile">
            <div className="avatar">T</div>
            <div>
              <strong>Tu espacio</strong>
              <small>Plan personal</small>
            </div>
            <Leaf size={16} />
          </div>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <div className="breadcrumb">
            Mi espacio <ChevronRight size={14} />
            <strong>{tab}</strong>
          </div>
          <span className="local-badge">
            <span /> Guardado en este dispositivo
          </span>
          <button
            className="mobile-theme icon-button"
            aria-label={dark ? "Activar tema claro" : "Activar tema oscuro"}
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">TU ALIMENTACIÓN, EN EQUILIBRIO</div>
              <h1>
                {tab === "Mi día"
                  ? "Un buen día empieza contigo."
                  : tab === "Mi plan"
                    ? "Tu plan, a la mano."
                    : tab === "Mis platillos"
                      ? "Hechos por ti, para ti."
                      : "Dale espacio a comer bien."}
              </h1>
              <p>
                {tab === "Mi día"
                  ? "Organiza tus comidas y encuentra tu propio equilibrio."
                  : tab === "Mi plan"
                    ? "Consulta alimentos, equivalencias y porciones por comida."
                    : tab === "Mis platillos"
                      ? "Tus recetas favoritas, con las porciones bien claras."
                      : "Planea con calma. Disfruta cada comida."}
              </p>
            </div>
            <button
              className="button primary"
              onClick={() => {
                setEditing(null);
                setModal(tab === "Mis platillos" ? "dish" : "schedule");
                setMeal("Comida");
              }}
            >
              <Plus size={18} />
              {tab === "Mis platillos" ? "Nuevo platillo" : "Planear comida"}
            </button>
          </div>
          <div className="demo-banner">
            <Sparkles size={17} />
            <span>
              <strong>Un primer vistazo a tu Recipy.</strong> Los alimentos y
              objetivos son de ejemplo. Los cambiaremos por tu plan real cuando
              lo compartas.
            </span>
          </div>
          {(tab === "Mi día" || tab === "Planificador") && (
            <>
              <div className="date-row">
                <div>
                  <CalendarDays size={18} />
                  <strong>{dateLabel}</strong>
                  {date === localDate() && (
                    <span className="today-pill">Hoy</span>
                  )}
                </div>
                <div className="date-controls">
                  <button
                    aria-label="Día anterior"
                    onClick={() => moveDate(-1)}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setDate(localDate())}>Hoy</button>
                  <input
                    aria-label="Elegir fecha"
                    type="date"
                    value={date}
                    onChange={(e) => e.target.value && setDate(e.target.value)}
                  />
                  <button
                    aria-label="Día siguiente"
                    onClick={() => moveDate(1)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="dashboard-grid">
                <section className="day-main">
                  {tab === "Mi día" && (
                    <div className="hero">
                      <div className="hero-copy">
                        <span className="hero-kicker">
                          <span /> PEQUEÑOS PASOS, GRANDES HÁBITOS
                        </span>
                        <h2>
                          Tu plan.
                          <br />A tu manera.
                        </h2>
                        <p>
                          Una comida a la vez, más cerca
                          <br />
                          de tus objetivos.
                        </p>
                        <button onClick={() => navigate("Mi plan")}>
                          Conoce tu plan <ArrowRight size={16} />
                        </button>
                      </div>
                      <div className="hero-art">
                        <DishArt color="green" />
                        <span className="floating-tag">
                          <CheckCheck size={16} /> Hecho para tu equilibrio
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="section-heading">
                    <h2>
                      {tab === "Planificador"
                        ? "Tu agenda de comidas"
                        : "Tus comidas de hoy"}
                    </h2>
                    <span>{todayEntries.length} platillos planeados</span>
                  </div>
                  <div className="meal-list">
                    {meals.map((m, idx) => {
                      const items = todayEntries.filter((e) => e.meal === m);
                      const sum = groups.map((_, i) =>
                        items.reduce((s, e) => {
                          const d = dishes.find((d) => d.id === e.dishId);
                          return s + (d ? totals(d, e.servings)[i] : 0);
                        }, 0),
                      );
                      return (
                        <article className="meal-card" key={m}>
                          <div className={`meal-symbol meal-${idx}`}>
                            <Utensils size={20} />
                          </div>
                          <div className="meal-body">
                            <div className="meal-title">
                              <h3>{m}</h3>
                              <span>
                                <Clock3 size={12} />
                                {items[0]?.time ||
                                  ["08:00", "14:00", "20:00"][idx]}
                              </span>
                            </div>
                            {items.length ? (
                              items.map((e) => (
                                <div className="planned-item" key={e.id}>
                                  <button
                                    onClick={() =>
                                      setSelected(
                                        dishes.find((d) => d.id === e.dishId) ||
                                          null,
                                      )
                                    }
                                  >
                                    {
                                      dishes.find((d) => d.id === e.dishId)
                                        ?.name
                                    }{" "}
                                    <small>· {e.servings} ración(es)</small>
                                  </button>
                                  <button
                                    className="icon-button"
                                    aria-label="Quitar platillo del calendario"
                                    onClick={() =>
                                      setEntries(
                                        entries.filter((x) => x.id !== e.id),
                                      )
                                    }
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p>Aún no tienes platillos para esta comida.</p>
                            )}
                            {items.length > 0 && (
                              <div className="mini-tags">
                                {groups.map((g, i) => (
                                  <span
                                    className={
                                      sum[i] === plan[m][i]
                                        ? "tag ok"
                                        : sum[i] > plan[m][i]
                                          ? "tag over"
                                          : "tag under"
                                    }
                                    key={g}
                                  >
                                    {g}: {sum[i]} / {plan[m][i]}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            className="add-meal"
                            aria-label={`Añadir platillo a ${m}`}
                            onClick={() => {
                              setMeal(m);
                              setModal("schedule");
                            }}
                          >
                            <Plus size={19} />
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>
                <aside className="summary">
                  <div className="section-heading">
                    <h2>Tu equilibrio diario</h2>
                    <span className="circle-icon">
                      <Leaf size={17} />
                    </span>
                  </div>
                  <p className="muted">
                    Porciones planeadas / objetivo del día
                  </p>
                  <div className="portion-list">
                    {groups.map((g, i) => (
                      <div className="portion" key={g}>
                        <div>
                          <span>
                            <i className={`group-dot group-${i}`} />
                            {g}
                          </span>
                          <strong>
                            {Number(total[i].toFixed(2))}
                            <small> / {daily[i]}</small>
                          </strong>
                        </div>
                        <div className={`progress group-${i}`}>
                          <span
                            style={{
                              width: `${daily[i] ? Math.min((total[i] / daily[i]) * 100, 100) : total[i] ? 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="summary-footer">
                    <span className="soft-icon">
                      <Check size={17} />
                    </span>
                    <p>
                      El equilibrio se construye
                      <br />
                      <strong>comida a comida.</strong>
                    </p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => navigate("Mi plan")}
                  >
                    Ver porciones por comida <ArrowRight size={15} />
                  </button>
                </aside>
              </div>
            </>
          )}
          {tab === "Mi plan" && (
            <>
              <div className="section-heading">
                <h2>Porciones por comida</h2>
                <span>
                  <Settings2 size={14} /> Objetivos editables · datos de ejemplo
                </span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Grupo de alimentos</th>
                      {meals.map((m) => (
                        <th key={m}>{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((g, i) => (
                      <tr key={g}>
                        <td>
                          <i className={`group-dot group-${i}`} />
                          {g}
                        </td>
                        {meals.map((m) => (
                          <td key={m}>
                            <input
                              className="target-input"
                              aria-label={`${g} en ${m}`}
                              type="number"
                              min="0"
                              max="100"
                              step="0.25"
                              value={plan[m][i]}
                              onChange={(e) => {
                                const n = Number(e.target.value);
                                if (n >= 0 && n <= 100)
                                  setPlan({
                                    ...plan,
                                    [m]: plan[m].map((v, j) =>
                                      i === j ? n : v,
                                    ),
                                  });
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="section-heading food-heading">
                <h2>Tu guía de alimentos</h2>
                <span>1 equivalencia = 1 porción de su grupo</span>
              </div>
              <div className="filters">
                <label className="search">
                  <Search size={18} />
                  <input
                    placeholder="Buscar un alimento…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <select
                  aria-label="Filtrar por grupo"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                >
                  {["Todos", ...groups].map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="food-grid">
                {foods
                  .filter(
                    (f) =>
                      (group === "Todos" || f.group === group) &&
                      f.name.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((f) => (
                    <article className="food-card" key={f.id}>
                      <span
                        className={`food-group group-bg-${groups.indexOf(f.group)}`}
                      >
                        <Leaf size={18} />
                      </span>
                      <div>
                        <h3>{f.name}</h3>
                        <p>{f.equivalent}</p>
                      </div>
                      <span className="tag neutral">{f.group}</span>
                    </article>
                  ))}
              </div>
              {!foods.some(
                (f) =>
                  (group === "Todos" || f.group === group) &&
                  f.name.toLowerCase().includes(query.toLowerCase()),
              ) && (
                <div className="empty">
                  No encontramos alimentos con ese nombre.
                </div>
              )}
            </>
          )}
          {(tab === "Mi día" || tab === "Mis platillos") && (
            <section className="recipes-section">
              <div className="section-heading">
                <div>
                  <h2>
                    {tab === "Mi día"
                      ? "Ideas de tu recetario"
                      : "Tu recetario"}
                  </h2>
                  {tab === "Mi día" && (
                    <p className="muted">Algo rico, algo tuyo.</p>
                  )}
                </div>
                {tab === "Mi día" ? (
                  <button
                    className="text-button"
                    onClick={() => navigate("Mis platillos")}
                  >
                    Ver todos <ArrowRight size={15} />
                  </button>
                ) : (
                  <label className="search">
                    <Search size={18} />
                    <input
                      placeholder="Buscar un platillo…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                )}
              </div>
              <div className="recipe-grid">
                {dishes
                  .filter((d) =>
                    d.name.toLowerCase().includes(query.toLowerCase()),
                  )
                  .slice(0, tab === "Mi día" ? 3 : undefined)
                  .map((d) => (
                    <button
                      className="recipe-card"
                      key={d.id}
                      onClick={() => {
                        setMeal("Comida");
                        setSelected(d);
                      }}
                    >
                      <DishArt color={d.color} />
                      <div className="recipe-info">
                        <span className="recipe-eyebrow">TU RECETARIO</span>
                        <h3>{d.name}</h3>
                        <p>{d.description}</p>
                        <div className="recipe-meta">
                          <span>
                            <Utensils size={14} />
                            {d.servings} ración(es)
                          </span>
                          <span>
                            {d.ingredients.length} ingredientes{" "}
                            <ArrowRight size={15} />
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
              {!dishes.some((d) =>
                d.name.toLowerCase().includes(query.toLowerCase()),
              ) && (
                <div className="empty">
                  No hay platillos que coincidan con tu búsqueda.
                </div>
              )}
            </section>
          )}
          <footer>
            Hecho para cuidarte, a tu ritmo.
            <Leaf size={13} />
            <span>recipy</span>
          </footer>
        </div>
      </main>
      {toast && (
        <div role="status" className="toast">
          <Check size={18} />
          {toast}
        </div>
      )}
      {(modal || selected) && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModal(null);
              setSelected(null);
            }
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={
              selected
                ? "Detalle del platillo"
                : modal === "dish"
                  ? "Nuevo platillo"
                  : "Planear comida"
            }
          >
            <button
              autoFocus
              className="close-button"
              aria-label="Cerrar"
              onClick={() => {
                setModal(null);
                setSelected(null);
              }}
            >
              <X size={22} />
            </button>
            {selected ? (
              <>
                <span className="eyebrow">TU RECETARIO</span>
                <h2>{selected.name}</h2>
                <p className="muted">{selected.description}</p>
                <h3>Ingredientes · {selected.servings} ración(es)</h3>
                <ul className="ingredient-list">
                  {selected.ingredients.map((i, index) => (
                    <li key={index}>
                      <span>{foods.find((f) => f.id === i.foodId)?.name}</span>
                      <strong>{i.portions} porción(es)</strong>
                    </li>
                  ))}
                </ul>
                <h3>Preparación</h3>
                <p className="steps">{selected.steps}</p>
                <label className="field">
                  Comparar una ración con
                  <select
                    value={meal}
                    onChange={(e) => setMeal(e.target.value)}
                  >
                    {meals.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </label>
                <div className="comparison">
                  {groups.map((g, i) => {
                    const n = totals(selected)[i];
                    const t = plan[meal][i];
                    return (
                      <div key={g}>
                        <span>
                          {g}
                          <small>
                            {Number(n.toFixed(2))} de {t} porciones
                          </small>
                        </span>
                        <span
                          className={`tag ${n === t ? "ok" : n > t ? "over" : "under"}`}
                        >
                          {n === t ? (
                            <Check size={13} />
                          ) : n > t ? (
                            <ArrowUp size={13} />
                          ) : (
                            <ArrowDown size={13} />
                          )}{" "}
                          {n === t
                            ? "Cumple"
                            : n > t
                              ? "Por encima"
                              : "Por debajo"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="detail-actions">
                  <button
                    className="text-button"
                    onClick={() => {
                      setEditing(selected);
                      setSelected(null);
                      setModal("dish");
                    }}
                  >
                    Editar platillo
                  </button>
                  <button
                    className="text-button danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Eliminar este platillo y sus entradas del calendario?",
                        )
                      ) {
                        setDishes(dishes.filter((d) => d.id !== selected.id));
                        setEntries(
                          entries.filter((e) => e.dishId !== selected.id),
                        );
                        setSelected(null);
                      }
                    }}
                  >
                    Eliminar platillo
                  </button>
                </div>
                <button
                  className="button primary full"
                  onClick={() => {
                    setSelected(null);
                    setModal("schedule");
                  }}
                >
                  Añadir al plan <Plus size={17} />
                </button>
              </>
            ) : modal === "dish" ? (
              <DishForm
                initial={editing}
                onSave={(dish) => {
                  setDishes(
                    editing
                      ? dishes.map((d) => (d.id === dish.id ? dish : d))
                      : [...dishes, dish],
                  );
                  setModal(null);
                  setToast("Platillo guardado en tu recetario.");
                }}
              />
            ) : (
              <ScheduleForm
                dishes={dishes}
                initialMeal={meal}
                date={date}
                onSave={(entry) => {
                  setEntries([...entries, entry]);
                  setDate(entry.date);
                  setModal(null);
                  setToast("Comida añadida a tu plan.");
                }}
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
function DishForm({
  onSave,
  initial,
}: {
  onSave: (d: Dish) => void;
  initial: Dish | null;
}) {
  const [ingredients, setIngredients] = useState(
    initial?.ingredients || [{ foodId: foods[0].id, portions: 1 }],
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        onSave({
          id: initial?.id || crypto.randomUUID(),
          name: String(f.get("name")).trim(),
          description: String(f.get("description")).trim(),
          servings: Number(f.get("servings")),
          ingredients,
          steps: String(f.get("steps")).trim(),
          color: ["green", "orange", "pink"][Math.floor(Math.random() * 3)],
        });
      }}
    >
      <span className="eyebrow">ALGO RICO EMPIEZA AQUÍ</span>
      <h2>{initial ? "Editar platillo" : "Nuevo platillo"}</h2>
      <p className="muted">Registra las porciones de la receta completa.</p>
      <label className="field">
        Nombre
        <input
          name="name"
          defaultValue={initial?.name}
          required
          maxLength={80}
          placeholder="Ej. Ensalada de pollo"
          pattern=".*\S.*"
        />
      </label>
      <label className="field">
        Descripción
        <input
          name="description"
          defaultValue={initial?.description}
          maxLength={160}
          placeholder="Lo que hace especial a tu platillo"
        />
      </label>
      <label className="field">
        ¿Cuántas raciones rinde?
        <input
          name="servings"
          type="number"
          min="0.25"
          max="100"
          step="0.25"
          defaultValue={initial?.servings || 1}
          required
        />
      </label>
      <h3>Ingredientes</h3>
      <p className="muted small-text">
        Porciones del grupo según las equivalencias de Mi plan.
      </p>
      {ingredients.map((item, i) => (
        <div className="ingredient-row" key={i}>
          <select
            aria-label={`Alimento ${i + 1}`}
            value={item.foodId}
            onChange={(e) =>
              setIngredients(
                ingredients.map((v, j) =>
                  j === i ? { ...v, foodId: e.target.value } : v,
                ),
              )
            }
          >
            {foods.map((f: Food) => (
              <option value={f.id} key={f.id}>
                {f.name} · {f.equivalent}
              </option>
            ))}
          </select>
          <input
            aria-label={`Porciones del ingrediente ${i + 1}`}
            type="number"
            min="0.25"
            max="100"
            step="0.25"
            required
            value={item.portions}
            onChange={(e) =>
              setIngredients(
                ingredients.map((v, j) =>
                  j === i ? { ...v, portions: Number(e.target.value) } : v,
                ),
              )
            }
          />
          <button
            type="button"
            className="icon-button"
            disabled={ingredients.length === 1}
            aria-label="Quitar ingrediente"
            onClick={() =>
              setIngredients(ingredients.filter((_, j) => j !== i))
            }
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-button"
        onClick={() =>
          setIngredients([...ingredients, { foodId: foods[0].id, portions: 1 }])
        }
      >
        <Plus size={15} />
        Añadir ingrediente
      </button>
      <label className="field">
        Procedimiento
        <textarea
          name="steps"
          defaultValue={initial?.steps}
          rows={4}
          required
          placeholder="1. Prepara los ingredientes…"
        />
      </label>
      <button className="button primary full">
        Guardar platillo <Check size={17} />
      </button>
    </form>
  );
}
function ScheduleForm({
  dishes,
  initialMeal,
  date,
  onSave,
}: {
  dishes: Dish[];
  initialMeal: string;
  date: string;
  onSave: (e: Entry) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        onSave({
          id: crypto.randomUUID(),
          date: String(f.get("date")),
          meal: String(f.get("meal")),
          time: String(f.get("time")),
          dishId: String(f.get("dish")),
          servings: Number(f.get("servings")),
        });
      }}
    >
      <span className="eyebrow">UN ESPACIO PARA COMER BIEN</span>
      <h2>Planea tu comida</h2>
      <p className="muted">
        Elige un platillo y nosotros sumamos las porciones.
      </p>
      <label className="field">
        Platillo
        <select name="dish" required>
          {dishes.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>
      <div className="two-fields">
        <label className="field">
          Fecha
          <input name="date" type="date" defaultValue={date} required />
        </label>
        <label className="field">
          Hora
          <input
            name="time"
            type="time"
            defaultValue={
              initialMeal === "Desayuno"
                ? "08:00"
                : initialMeal === "Cena"
                  ? "20:00"
                  : "14:00"
            }
            required
          />
        </label>
      </div>
      <label className="field">
        Comida
        <select name="meal" defaultValue={initialMeal}>
          {meals.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </label>
      <label className="field">
        Raciones que vas a comer
        <input
          name="servings"
          type="number"
          min="0.25"
          max="100"
          step="0.25"
          defaultValue="1"
          required
        />
      </label>
      <button className="button primary full">
        Añadir al calendario <CalendarDays size={17} />
      </button>
    </form>
  );
}
