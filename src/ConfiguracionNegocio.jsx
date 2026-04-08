import { useState } from "react";

const initialState = {
  empresa: "",
  metaSemanal: "",
  metaMensual: "",
  nombreVendedores: "",
  moneda: "",
  fuentes: [],
};

const monedasOpciones = ["USD", "MXN", "ARS", "COP", "CLP", "PEN", "EUR"];

const fuentesSugeridas = [
  "Instagram", "WhatsApp", "Facebook", "TikTok",
  "YouTube", "Referidos", "LinkedIn", "Google Ads", "Orgánico"
];

const iconos = {
  empresa: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 21v-6h6v6"/>
    </svg>
  ),
  meta: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
    </svg>
  ),
  vendedores: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  moneda: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2m-4-6h8"/>
    </svg>
  ),
  fuentes: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.09 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 10.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 23 18z"/>
    </svg>
  ),
};

export default function ConfiguracionNegocio() {
  const [form, setForm] = useState(initialState);
  const [fuentePersonalizada, setFuentePersonalizada] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
    setGuardado(false);
  };

  const toggleFuente = (fuente) => {
    setForm((prev) => {
      const existe = prev.fuentes.includes(fuente);
      return {
        ...prev,
        fuentes: existe
          ? prev.fuentes.filter((f) => f !== fuente)
          : [...prev.fuentes, fuente],
      };
    });
    setGuardado(false);
  };

  const agregarFuentePersonalizada = () => {
    const val = fuentePersonalizada.trim();
    if (!val) return;
    if (!form.fuentes.includes(val)) {
      setForm((prev) => ({ ...prev, fuentes: [...prev.fuentes, val] }));
    }
    setFuentePersonalizada("");
    setGuardado(false);
  };

  const eliminarFuente = (fuente) => {
    setForm((prev) => ({
      ...prev,
      fuentes: prev.fuentes.filter((f) => f !== fuente),
    }));
    setGuardado(false);
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.empresa.trim()) nuevosErrores.empresa = "Requerido";
    if (!form.metaSemanal || isNaN(form.metaSemanal) || Number(form.metaSemanal) <= 0)
      nuevosErrores.metaSemanal = "Ingresa un número válido";
    if (!form.metaMensual || isNaN(form.metaMensual) || Number(form.metaMensual) <= 0)
      nuevosErrores.metaMensual = "Ingresa un número válido";
    if (!form.nombreVendedores.trim()) nuevosErrores.nombreVendedores = "Requerido";
    if (!form.moneda) nuevosErrores.moneda = "Selecciona una moneda";
    if (form.fuentes.length === 0) nuevosErrores.fuentes = "Agrega al menos una fuente";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = () => {
    if (!validar()) return;
    setGuardado(true);
  };

  const handleReset = () => {
    setForm(initialState);
    setErrores({});
    setGuardado(false);
  };

  const fmt = (val) =>
    val ? `${form.moneda || "$"} ${Number(val).toLocaleString("es-MX")}` : "—";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #12121a 60%, #0d0d14 100%)",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e8e8f0",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .header-accent {
          background: linear-gradient(90deg, #e53935, #ff6f00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          transition: border-color 0.2s;
        }
        .card:focus-within {
          border-color: rgba(229,57,53,0.4);
        }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #e8e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .input-field:focus {
          border-color: #e53935;
          background: rgba(229,57,53,0.06);
        }
        .input-field::placeholder { color: rgba(200,200,220,0.3); }
        .input-field.error { border-color: #ff5252; }

        .select-field {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #e8e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          padding: 12px 16px;
          outline: none;
          cursor: pointer;
          appearance: none;
          transition: border-color 0.2s;
        }
        .select-field:focus { border-color: #e53935; }
        .select-field option { background: #1a1a2e; }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(220,220,240,0.7);
          transition: all 0.18s;
          user-select: none;
        }
        .chip:hover { background: rgba(229,57,53,0.12); border-color: rgba(229,57,53,0.4); color: #f8b4b4; }
        .chip.active { background: rgba(229,57,53,0.2); border-color: #e53935; color: #ff8a80; }

        .chip-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(229,57,53,0.15);
          border: 1px solid rgba(229,57,53,0.35);
          color: #ff8a80;
          font-size: 13px;
          font-weight: 500;
        }
        .chip-tag button {
          background: none;
          border: none;
          color: #ff8a80;
          cursor: pointer;
          font-size: 15px;
          line-height: 1;
          padding: 0;
          opacity: 0.7;
          transition: opacity 0.15s;
        }
        .chip-tag button:hover { opacity: 1; }

        .btn-primary {
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
          box-shadow: 0 4px 20px rgba(229,57,53,0.35);
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        .btn-ghost {
          background: rgba(255,255,255,0.05);
          color: rgba(200,200,220,0.6);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 13px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); color: #e8e8f0; }

        .label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(200,200,220,0.6);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 10px;
        }
        .label svg { color: #e53935; opacity: 0.8; }

        .error-msg { color: #ff5252; font-size: 12px; margin-top: 5px; }

        .prefix-wrap { position: relative; }
        .prefix {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(229,57,53,0.7);
          font-weight: 600;
          font-size: 15px;
          pointer-events: none;
        }
        .prefix-wrap .input-field { padding-left: 32px; }

        .success-banner {
          background: rgba(46,125,50,0.15);
          border: 1px solid rgba(76,175,80,0.3);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: fadeIn 0.4s ease;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }
        .summary-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 12px 14px;
        }
        .summary-item .s-label { font-size: 11px; color: rgba(180,180,200,0.5); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 4px; }
        .summary-item .s-val { font-size: 15px; font-weight: 600; color: #e8e8f0; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        .section-fade { animation: fadeIn 0.35s ease; }

        .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 8px 0; }

        .custom-input-row { display: flex; gap: 8px; }
        .custom-input-row .input-field { flex: 1; }
        .btn-add {
          background: rgba(229,57,53,0.15);
          border: 1px solid rgba(229,57,53,0.3);
          border-radius: 10px;
          color: #ff8a80;
          font-size: 22px;
          width: 46px;
          flex-shrink: 0;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-add:hover { background: rgba(229,57,53,0.25); }
      `}</style>

      {/* Header */}
      <div style={{ padding: "48px 24px 0", maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(229,57,53,0.7)", textTransform: "uppercase" }}>
            Sales Analytics Dashboard
          </span>
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 38px)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>
          Configuración de{" "}
          <span className="header-accent">tu negocio</span>
        </h1>
        <p style={{ fontSize: 15, color: "rgba(180,180,200,0.6)", lineHeight: 1.6 }}>
          Completa los datos de tu empresa para personalizar el dashboard completamente en español.
        </p>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 680, margin: "36px auto 60px", padding: "0 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Empresa */}
        <div className="card section-fade" style={{ padding: "22px 24px" }}>
          <label className="label">
            {iconos.empresa} Nombre de la empresa
          </label>
          <input
            className={`input-field${errores.empresa ? " error" : ""}`}
            name="empresa"
            placeholder="Ej: Agencia Impulso"
            value={form.empresa}
            onChange={handleChange}
          />
          {errores.empresa && <div className="error-msg">⚠ {errores.empresa}</div>}
        </div>

        {/* Metas */}
        <div className="card section-fade" style={{ padding: "22px 24px" }}>
          <label className="label">{iconos.meta} Metas de ingresos</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(180,180,200,0.5)", marginBottom: 8, fontWeight: 500 }}>Meta semanal</div>
              <div className="prefix-wrap">
                <span className="prefix">$</span>
                <input
                  className={`input-field${errores.metaSemanal ? " error" : ""}`}
                  name="metaSemanal"
                  type="number"
                  placeholder="10,000"
                  value={form.metaSemanal}
                  onChange={handleChange}
                />
              </div>
              {errores.metaSemanal && <div className="error-msg">⚠ {errores.metaSemanal}</div>}
            </div>
            <div>
              <div style={{ fontSize: 12, color: "rgba(180,180,200,0.5)", marginBottom: 8, fontWeight: 500 }}>Meta mensual</div>
              <div className="prefix-wrap">
                <span className="prefix">$</span>
                <input
                  className={`input-field${errores.metaMensual ? " error" : ""}`}
                  name="metaMensual"
                  type="number"
                  placeholder="40,000"
                  value={form.metaMensual}
                  onChange={handleChange}
                />
              </div>
              {errores.metaMensual && <div className="error-msg">⚠ {errores.metaMensual}</div>}
            </div>
          </div>
        </div>

        {/* Vendedores */}
        <div className="card section-fade" style={{ padding: "22px 24px" }}>
          <label className="label">{iconos.vendedores} ¿Cómo llamas a tus vendedores?</label>
          <input
            className={`input-field${errores.nombreVendedores ? " error" : ""}`}
            name="nombreVendedores"
            placeholder="Ej: Closers y Setters, Asesores y Captadores..."
            value={form.nombreVendedores}
            onChange={handleChange}
          />
          {errores.nombreVendedores && <div className="error-msg">⚠ {errores.nombreVendedores}</div>}
        </div>

        {/* Moneda */}
        <div className="card section-fade" style={{ padding: "22px 24px" }}>
          <label className="label">{iconos.moneda} Moneda</label>
          <div style={{ position: "relative" }}>
            <select
              className={`select-field${errores.moneda ? " error" : ""}`}
              name="moneda"
              value={form.moneda}
              onChange={handleChange}
            >
              <option value="">Selecciona una moneda...</option>
              {monedasOpciones.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <svg style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.4 }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          {errores.moneda && <div className="error-msg">⚠ {errores.moneda}</div>}
        </div>

        {/* Fuentes de leads */}
        <div className="card section-fade" style={{ padding: "22px 24px" }}>
          <label className="label">{iconos.fuentes} ¿De dónde vienen tus leads?</label>

          {/* Sugeridas */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {fuentesSugeridas.map((f) => (
              <button
                key={f}
                className={`chip${form.fuentes.includes(f) ? " active" : ""}`}
                onClick={() => toggleFuente(f)}
                type="button"
              >
                {form.fuentes.includes(f) && <span>✓</span>}
                {f}
              </button>
            ))}
          </div>

          <div className="divider" />

          {/* Personalizada */}
          <div style={{ marginTop: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "rgba(180,180,200,0.4)", marginBottom: 8, fontWeight: 500 }}>Agregar fuente personalizada</div>
            <div className="custom-input-row">
              <input
                className="input-field"
                placeholder="Ej: Referidos, Email, Podcast..."
                value={fuentePersonalizada}
                onChange={(e) => setFuentePersonalizada(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && agregarFuentePersonalizada()}
              />
              <button className="btn-add" onClick={agregarFuentePersonalizada} type="button" title="Agregar">+</button>
            </div>
          </div>

          {/* Tags seleccionadas */}
          {form.fuentes.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {form.fuentes.map((f) => (
                <span key={f} className="chip-tag">
                  {f}
                  <button onClick={() => eliminarFuente(f)} type="button">×</button>
                </span>
              ))}
            </div>
          )}
          {errores.fuentes && <div className="error-msg" style={{ marginTop: 8 }}>⚠ {errores.fuentes}</div>}
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button className="btn-ghost" onClick={handleReset} type="button">Limpiar</button>
          <button className="btn-primary" onClick={handleGuardar} type="button">
            Guardar configuración →
          </button>
        </div>

        {/* Resumen */}
        {guardado && (
          <div className="section-fade">
            <div className="success-banner">
              <span style={{ fontSize: 22 }}>✅</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#a5d6a7" }}>¡Configuración guardada!</div>
                <div style={{ fontSize: 13, color: "rgba(165,214,167,0.7)", marginTop: 2 }}>Así quedará tu dashboard personalizado.</div>
              </div>
            </div>

            <div className="summary-grid">
              <div className="summary-item">
                <div className="s-label">Empresa</div>
                <div className="s-val">{form.empresa}</div>
              </div>
              <div className="summary-item">
                <div className="s-label">Moneda</div>
                <div className="s-val">{form.moneda}</div>
              </div>
              <div className="summary-item">
                <div className="s-label">Meta semanal</div>
                <div className="s-val">{fmt(form.metaSemanal)}</div>
              </div>
              <div className="summary-item">
                <div className="s-label">Meta mensual</div>
                <div className="s-val">{fmt(form.metaMensual)}</div>
              </div>
              <div className="summary-item" style={{ gridColumn: "span 2" }}>
                <div className="s-label">Vendedores</div>
                <div className="s-val">{form.nombreVendedores}</div>
              </div>
              <div className="summary-item" style={{ gridColumn: "span 2" }}>
                <div className="s-label">Fuentes de leads</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  {form.fuentes.map((f) => (
                    <span key={f} className="chip-tag" style={{ fontSize: 12 }}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
