import { useState } from "react";

const pasos = [
  {
    id: 1,
    titulo: "Crear el Google Form",
    icono: "📋",
    descripcion: "Este formulario lo llenará tu equipo después de cada llamada de ventas.",
    contenido: "form",
  },
  {
    id: 2,
    titulo: "Vincular con Google Sheets",
    icono: "🔗",
    descripcion: "Google enviará automáticamente cada respuesta a tu hoja de cálculo.",
    contenido: "vincular",
  },
  {
    id: 3,
    titulo: "Hoja de Captura de Leads",
    icono: "📊",
    descripcion: "Una segunda hoja para rastrear el volumen de leads que entran.",
    contenido: "leads",
  },
  {
    id: 4,
    titulo: "Hacer las hojas públicas",
    icono: "🌐",
    descripcion: "El dashboard necesita acceso de lectura a tus hojas.",
    contenido: "publico",
  },
  {
    id: 5,
    titulo: "Obtener los IDs",
    icono: "🔑",
    descripcion: "Copia los IDs de tus hojas para conectarlas al dashboard.",
    contenido: "ids",
  },
];

const camposForm = [
  { num: 1, nombre: "Marca de tiempo", tipo: "Automático", requerido: true, nota: "Google lo genera solo" },
  { num: 2, nombre: "Fecha de cierre", tipo: "Selector de fecha", requerido: true, nota: "" },
  { num: 3, nombre: "Nombre del Closer", tipo: "Texto corto o lista desplegable", requerido: true, nota: "" },
  { num: 4, nombre: "Nombre del Setter", tipo: "Texto corto o lista desplegable", requerido: true, nota: "" },
  { num: 5, nombre: "Nombre del Prospecto", tipo: "Texto corto", requerido: true, nota: "" },
  { num: 6, nombre: "Llamadas Programadas", tipo: "Número", requerido: true, nota: "¿Cuántas llamadas tenía agendadas?" },
  { num: 7, nombre: "Llamadas Cerradas", tipo: "Número (0 o 1)", requerido: true, nota: "" },
  { num: 8, nombre: "Se Presentó", tipo: "Número (0 o 1)", requerido: true, nota: "1 = se presentó, 0 = no show" },
  { num: 9, nombre: "Efectivo Cobrado", tipo: "Número", requerido: true, nota: "Monto recibido realmente" },
  { num: 10, nombre: "Ingreso Generado", tipo: "Número", requerido: true, nota: "Monto total del contrato" },
  { num: 11, nombre: "Notas", tipo: "Texto largo", requerido: false, nota: "Resumen de la llamada" },
  { num: 12, nombre: "Link de grabación", tipo: "URL", requerido: false, nota: "Ej: link de Fathom o Zoom" },
  { num: 13, nombre: "¿Le presentamos oferta?", tipo: "Opción múltiple: Sí / No", requerido: true, nota: "Crucial para calcular tasa de cierre" },
  { num: 14, nombre: "¿Cómo nos conoció?", tipo: "Opción múltiple", requerido: true, nota: "Tus fuentes de leads" },
];

const camposLeads = [
  { col: "A", nombre: "Nombre", nota: "Solo el primer nombre (para deduplicar)" },
  { col: "B", nombre: "Apellido", nota: "Opcional" },
  { col: "C", nombre: "Teléfono / Email", nota: "Opcional" },
  { col: "D", nombre: "Fecha", nota: "⚠ Obligatorio — el dashboard lo usa para filtrar" },
  { col: "E+", nombre: "Otros campos", nota: "Fuente, notas, etc. (opcionales)" },
];

export default function GuiaGoogleForm() {
  const [pasoActivo, setPasoActivo] = useState(1);
  const [completados, setCompletados] = useState([]);
  const [copiadoUrl, setCopiadoUrl] = useState(false);

  const marcarCompleto = (id) => {
    if (!completados.includes(id)) {
      setCompletados((prev) => [...prev, id]);
      if (id < pasos.length) setPasoActivo(id + 1);
    }
  };

  const copiarEjemplo = () => {
    setCopiadoUrl(true);
    setTimeout(() => setCopiadoUrl(false), 2000);
  };

  const paso = pasos.find((p) => p.id === pasoActivo);
  const progreso = Math.round((completados.length / pasos.length) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0b0c14 0%, #111220 100%)",
      fontFamily: "'DM Sans', sans-serif",
      color: "#dde0f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .accent { color: #e53935; }
        .accent-grad {
          background: linear-gradient(90deg, #e53935, #ff6f00);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .glass {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          backdrop-filter: blur(10px);
        }

        .step-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          color: #dde0f0;
        }
        .step-btn:hover { background: rgba(255,255,255,0.04); }
        .step-btn.active {
          background: rgba(229,57,53,0.1);
          border-color: rgba(229,57,53,0.3);
        }
        .step-btn.done { opacity: 0.6; }

        .step-num {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700;
          flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          transition: all 0.2s;
        }
        .step-num.active { background: #e53935; border-color: #e53935; color: white; }
        .step-num.done { background: rgba(76,175,80,0.2); border-color: #4caf50; color: #81c784; }

        .badge {
          font-size: 11px; font-weight: 600;
          padding: 3px 9px;
          border-radius: 999px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .badge-req { background: rgba(229,57,53,0.15); color: #ff8a80; border: 1px solid rgba(229,57,53,0.25); }
        .badge-opt { background: rgba(255,255,255,0.06); color: rgba(200,200,220,0.5); border: 1px solid rgba(255,255,255,0.08); }

        .table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07); }
        table { width: 100%; border-collapse: collapse; min-width: 560px; }
        thead th {
          background: rgba(229,57,53,0.08);
          padding: 11px 16px;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: rgba(229,57,53,0.7);
          text-align: left;
        }
        tbody tr { border-top: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
        tbody tr:hover { background: rgba(255,255,255,0.025); }
        td { padding: 11px 16px; font-size: 13.5px; vertical-align: middle; }
        td.num { font-weight: 700; color: rgba(229,57,53,0.7); width: 36px; }
        td.nota { font-size: 12px; color: rgba(180,180,210,0.5); font-style: italic; }

        .step-card { animation: fadeUp 0.35s ease; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .instruccion {
          display: flex;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .instr-num {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: rgba(229,57,53,0.2);
          border: 1px solid rgba(229,57,53,0.4);
          color: #ff8a80;
          font-size: 12px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .code-box {
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 14px 18px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: #a5d6a7;
          word-break: break-all;
          position: relative;
          margin: 10px 0;
        }
        .code-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(180,180,200,0.4);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }

        .highlight-box {
          background: rgba(255,152,0,0.08);
          border: 1px solid rgba(255,152,0,0.2);
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 13.5px;
          color: #ffcc80;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin: 14px 0;
        }

        .btn-completar {
          background: linear-gradient(135deg, #e53935, #c62828);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 13px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 18px rgba(229,57,53,0.3);
          margin-top: 24px;
          width: 100%;
        }
        .btn-completar:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-completar.done {
          background: rgba(76,175,80,0.2);
          border: 1px solid #4caf50;
          color: #81c784;
          box-shadow: none;
          cursor: default;
          transform: none;
        }

        .progress-bar {
          height: 4px;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
          overflow: hidden;
          margin-bottom: 24px;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #e53935, #ff6f00);
          border-radius: 999px;
          transition: width 0.5s ease;
        }

        .col-tag {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(229,57,53,0.15);
          border: 1px solid rgba(229,57,53,0.3);
          color: #ff8a80;
          font-size: 13px;
          font-weight: 700;
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: "40px 24px 0", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(229,57,53,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
          Paso 2 de 4 — Configuración de datos
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 10 }}>
          Google Form <span className="accent-grad">&amp; Sheets</span>
        </h1>
        <p style={{ fontSize: 15, color: "rgba(180,180,210,0.6)", lineHeight: 1.6, maxWidth: 520 }}>
          Sigue estos 5 pasos para conectar tus datos al dashboard. Cada paso tiene instrucciones exactas.
        </p>
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(180,180,210,0.4)", marginBottom: 6 }}>
            <span>Progreso</span><span>{completados.length}/{pasos.length} completados</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progreso}%` }} />
          </div>
        </div>
      </div>

      {/* Layout */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, marginTop: 24 }}>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {pasos.map((p) => (
            <button
              key={p.id}
              className={`step-btn${pasoActivo === p.id ? " active" : ""}${completados.includes(p.id) ? " done" : ""}`}
              onClick={() => setPasoActivo(p.id)}
            >
              <div className={`step-num${pasoActivo === p.id ? " active" : ""}${completados.includes(p.id) ? " done" : ""}`}>
                {completados.includes(p.id) ? "✓" : p.id}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{p.titulo}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="glass step-card" key={pasoActivo} style={{ padding: "28px 30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>{paso.icono}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(229,57,53,0.6)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Paso {paso.id}</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700 }}>{paso.titulo}</h2>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "rgba(180,180,210,0.6)", marginBottom: 24, lineHeight: 1.6 }}>{paso.descripcion}</p>

          {/* ── PASO 1: Google Form ── */}
          {paso.contenido === "form" && (
            <>
              <div className="instruccion">
                <div className="instr-num">1</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                  Ve a <strong style={{ color: "#e8e8f0" }}>forms.google.com</strong> y crea un formulario nuevo en blanco.
                </div>
              </div>
              <div className="instruccion">
                <div className="instr-num">2</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                  Agrega exactamente estos <strong style={{ color: "#ff8a80" }}>14 campos en este orden</strong>. El orden importa — el dashboard los lee por posición de columna.
                </div>
              </div>

              <div className="table-wrap" style={{ marginTop: 16 }}>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre del campo</th>
                      <th>Tipo</th>
                      <th>¿Requerido?</th>
                      <th>Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {camposForm.map((c) => (
                      <tr key={c.num}>
                        <td className="num">{c.num}</td>
                        <td style={{ fontWeight: 500 }}>{c.nombre}</td>
                        <td style={{ color: "rgba(180,180,210,0.7)", fontSize: 13 }}>{c.tipo}</td>
                        <td>
                          <span className={`badge ${c.requerido ? "badge-req" : "badge-opt"}`}>
                            {c.requerido ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="nota">{c.nota || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="highlight-box" style={{ marginTop: 20 }}>
                <span>⚠️</span>
                <div>
                  <strong>Campo 13 — ¿Le presentamos oferta?</strong> es crítico. Las filas donde digan "No" se excluyen del cálculo de tasa de cierre para que sea precisa.
                </div>
              </div>
            </>
          )}

          {/* ── PASO 2: Vincular ── */}
          {paso.contenido === "vincular" && (
            <>
              <div className="instruccion">
                <div className="instr-num">1</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                  En tu Google Form, haz clic en la pestaña <strong style={{ color: "#e8e8f0" }}>"Respuestas"</strong> (parte superior del formulario).
                </div>
              </div>
              <div className="instruccion">
                <div className="instr-num">2</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                  Haz clic en el ícono de <strong style={{ color: "#e8e8f0" }}>Google Sheets</strong> (el cuadro verde con una hoja). Elige <em>"Crear una nueva hoja de cálculo"</em>.
                </div>
              </div>
              <div className="instruccion">
                <div className="instr-num">3</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                  Google creará automáticamente una hoja llamada <strong style={{ color: "#e8e8f0" }}>"Respuestas de formulario 1"</strong>. Cada vez que alguien llene el form, aparecerá una fila nueva aquí.
                </div>
              </div>
              <div className="instruccion">
                <div className="instr-num">4</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                  Abre esa hoja de cálculo. Esta será tu <strong style={{ color: "#ff8a80" }}>Hoja de Respuestas</strong> — la fuente principal del dashboard.
                </div>
              </div>
              <div className="highlight-box">
                <span>✅</span>
                <div>No necesitas hacer nada más en esta hoja. Google la llena sola con cada respuesta del formulario.</div>
              </div>
            </>
          )}

          {/* ── PASO 3: Leads ── */}
          {paso.contenido === "leads" && (
            <>
              <div className="instruccion">
                <div className="instr-num">1</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                  Ve a <strong style={{ color: "#e8e8f0" }}>sheets.google.com</strong> y crea una hoja de cálculo nueva en blanco. Nómbrala algo como <em>"Leads — [Tu Empresa]"</em>.
                </div>
              </div>
              <div className="instruccion">
                <div className="instr-num">2</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                  Agrega estos encabezados. Las columnas <strong style={{ color: "#ff8a80" }}>A y D son obligatorias</strong> — el dashboard las usa para contar y filtrar leads.
                </div>
              </div>

              <div className="table-wrap" style={{ marginTop: 12 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Columna</th>
                      <th>Nombre</th>
                      <th>Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {camposLeads.map((c) => (
                      <tr key={c.col}>
                        <td><span className="col-tag">{c.col}</span></td>
                        <td style={{ fontWeight: 500 }}>{c.nombre}</td>
                        <td className="nota">{c.nota}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="highlight-box" style={{ marginTop: 20 }}>
                <span>💡</span>
                <div>
                  El dashboard deduplica por <strong>nombre único en columna A</strong>. Si un lead aparece dos veces con el mismo nombre, solo cuenta uno.
                </div>
              </div>

              <div className="instruccion" style={{ marginTop: 14 }}>
                <div className="instr-num">3</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                  Puedes conectar esta hoja a un Google Form de captura de leads, o llenarlo manualmente. Lo importante es que <strong style={{ color: "#e8e8f0" }}>columna A = nombre</strong> y <strong style={{ color: "#e8e8f0" }}>columna D = fecha</strong>.
                </div>
              </div>
            </>
          )}

          {/* ── PASO 4: Público ── */}
          {paso.contenido === "publico" && (
            <>
              <p style={{ fontSize: 14, color: "rgba(180,180,210,0.6)", marginBottom: 18, lineHeight: 1.6 }}>
                Haz esto en <strong style={{ color: "#e8e8f0" }}>ambas hojas</strong>: la de respuestas y la de leads.
              </p>
              {["Hoja de Respuestas del Form", "Hoja de Captura de Leads"].map((nombre, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(229,57,53,0.7)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
                    {nombre}
                  </div>
                  {[
                    'Abre la hoja y haz clic en "Compartir" (botón azul, arriba a la derecha).',
                    'En "Acceso general", cambia de "Restringido" a "Cualquier persona con el enlace".',
                    'Asegúrate de que el rol sea "Lector" (no Editor).',
                    'Haz clic en "Copiar enlace" y guárdalo — lo necesitarás en el siguiente paso.',
                  ].map((texto, j) => (
                    <div key={j} className="instruccion" style={{ marginBottom: 8 }}>
                      <div className="instr-num">{j + 1}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.6 }}>{texto}</div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="highlight-box">
                <span>🔒</span>
                <div>
                  Solo se da acceso de <strong>lectura</strong>. Nadie puede editar tus hojas. El dashboard solo lee los datos, nunca los modifica.
                </div>
              </div>
            </>
          )}

          {/* ── PASO 5: IDs ── */}
          {paso.contenido === "ids" && (
            <>
              <p style={{ fontSize: 14, color: "rgba(180,180,210,0.6)", marginBottom: 18, lineHeight: 1.6 }}>
                El dashboard necesita el <strong style={{ color: "#e8e8f0" }}>Sheet ID</strong> y el <strong style={{ color: "#e8e8f0" }}>GID</strong> de cada hoja. Los encuentras en la URL.
              </p>

              <div className="code-label">Ejemplo de URL de Google Sheets</div>
              <div className="code-box">
                https://docs.google.com/spreadsheets/d/<span style={{ color: "#ff8a80", fontWeight: 700 }}>1U1V0Ez2oMmVl6GgAcDrwe3WYVUl4t43p</span>/edit#gid=<span style={{ color: "#ffcc80", fontWeight: 700 }}>0</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
                <div style={{ padding: "16px", borderRadius: 12, background: "rgba(229,57,53,0.07)", border: "1px solid rgba(229,57,53,0.2)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(229,57,53,0.7)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Sheet ID</div>
                  <div style={{ fontSize: 13, color: "#ff8a80", fontFamily: "monospace", marginBottom: 8 }}>Entre <code style={{ color: "#dde0f0" }}>/d/</code> y <code style={{ color: "#dde0f0" }}>/edit</code></div>
                  <div style={{ fontSize: 12, color: "rgba(180,180,210,0.5)" }}>Es el ID largo. Cópialo completo.</div>
                </div>
                <div style={{ padding: "16px", borderRadius: 12, background: "rgba(255,152,0,0.07)", border: "1px solid rgba(255,152,0,0.2)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,152,0,0.7)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>GID</div>
                  <div style={{ fontSize: 13, color: "#ffcc80", fontFamily: "monospace", marginBottom: 8 }}>Número después de <code style={{ color: "#dde0f0" }}>gid=</code></div>
                  <div style={{ fontSize: 12, color: "rgba(180,180,210,0.5)" }}>Suele ser 0 para la primera hoja.</div>
                </div>
              </div>

              <div style={{ marginTop: 22 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(200,200,220,0.7)", marginBottom: 12 }}>Guarda estos datos aquí:</div>
                {[
                  { label: "Sheet ID — Respuestas del Form", ph: "Pega aquí el Sheet ID..." },
                  { label: "GID — Respuestas del Form", ph: "Ej: 0" },
                  { label: "Sheet ID — Leads", ph: "Pega aquí el Sheet ID..." },
                  { label: "GID — Leads", ph: "Ej: 0" },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(180,180,200,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{item.label}</div>
                    <input
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 9,
                        color: "#dde0f0",
                        fontFamily: "'Courier New', monospace",
                        fontSize: 13,
                        padding: "10px 14px",
                        outline: "none",
                      }}
                      placeholder={item.ph}
                      onFocus={(e) => e.target.style.borderColor = "#e53935"}
                      onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                    />
                  </div>
                ))}
              </div>

              <div className="highlight-box" style={{ marginTop: 16 }}>
                <span>🎉</span>
                <div>Con estos IDs ya puedes conectar el dashboard. ¡Estás listo para el siguiente paso!</div>
              </div>
            </>
          )}

          {/* Botón completar */}
          <button
            className={`btn-completar${completados.includes(paso.id) ? " done" : ""}`}
            onClick={() => marcarCompleto(paso.id)}
          >
            {completados.includes(paso.id) ? "✓ Paso completado" : `Marcar paso ${paso.id} como completado →`}
          </button>
        </div>
      </div>
    </div>
  );
}
