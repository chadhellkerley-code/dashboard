import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from "recharts";

const STORAGE_KEY = "sales-dashboard-config";
const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const DEFAULT_CFG = {
  open: true,
  empresa: "",
  moneda: "USD",
  metaSemanal: 10000,
  metaMensual: 40000,
  closers: [],
  setters: [],
  fuentes: [],
  sheetRespuestas: "",
  sheetLeads: "",
};

const EMPTY_DATA = [];

// ─── ESTILOS ────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#090b12; --bg2:#0e1018; --card:rgba(255,255,255,0.035);
  --border:rgba(255,255,255,0.07); --red:#e53935; --orange:#ff6f00;
  --text:#dde0f0; --muted:rgba(180,180,210,0.55);
  --green:#4caf50; --yellow:#ffc107;
}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;}
.grad{background:linear-gradient(90deg,var(--red),var(--orange));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.glass{background:var(--card);border:1px solid var(--border);border-radius:16px;backdrop-filter:blur(12px);}
.nav{display:flex;gap:4px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:12px;padding:4px;}
.nav-btn{padding:9px 18px;border-radius:9px;border:none;background:transparent;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;}
.nav-btn.active{background:rgba(229,57,53,0.15);color:var(--red);}
.nav-btn:hover:not(.active){background:rgba(255,255,255,0.04);color:var(--text);}
.kpi{padding:22px 24px;display:flex;flex-direction:column;gap:6px;position:relative;overflow:hidden;}
.kpi::before{content:'';position:absolute;top:-30px;right:-30px;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,rgba(229,57,53,0.12),transparent 70%);}
.kpi-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);}
.kpi-val{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;line-height:1;}
.kpi-sub{font-size:12px;color:var(--muted);}
.input-f{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:9px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;padding:10px 14px;outline:none;transition:border-color .2s;}
.input-f:focus{border-color:var(--red);}
.input-f::placeholder{color:rgba(180,180,210,0.28);}
.tag{display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:999px;background:rgba(229,57,53,0.12);border:1px solid rgba(229,57,53,0.28);color:#ff8a80;font-size:12px;font-weight:500;}
.tag button{background:none;border:none;color:#ff8a80;cursor:pointer;font-size:14px;line-height:1;padding:0;}
.chip{display:inline-flex;align-items:center;padding:5px 13px;border-radius:999px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:var(--muted);transition:all .18s;user-select:none;}
.chip:hover{border-color:rgba(229,57,53,0.35);color:#ff8a80;}
.chip.on{background:rgba(229,57,53,0.15);border-color:var(--red);color:#ff8a80;}
.btn{padding:10px 22px;border-radius:9px;border:none;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .18s;}
.btn-red{background:linear-gradient(135deg,var(--red),#c62828);color:#fff;box-shadow:0 4px 16px rgba(229,57,53,0.3);}
.btn-red:hover{opacity:.88;transform:translateY(-1px);}
.btn-ghost{background:rgba(255,255,255,0.05);color:var(--muted);border:1px solid var(--border);}
.btn-ghost:hover{background:rgba(255,255,255,0.09);color:var(--text);}
.tbl{width:100%;border-collapse:collapse;}
.tbl th{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:rgba(229,57,53,0.6);padding:10px 14px;text-align:left;border-bottom:1px solid var(--border);}
.tbl td{padding:11px 14px;font-size:13.5px;border-bottom:1px solid rgba(255,255,255,0.04);}
.tbl tr:hover td{background:rgba(255,255,255,0.02);}
.badge{font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;}
.badge-won{background:rgba(76,175,80,0.15);color:#81c784;border:1px solid rgba(76,175,80,0.25);}
.badge-lost{background:rgba(229,57,53,0.12);color:#ef9a9a;border:1px solid rgba(229,57,53,0.2);}
.badge-pend{background:rgba(255,193,7,0.12);color:#ffe082;border:1px solid rgba(255,193,7,0.2);}
.tab-bar{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:24px;}
.tab{padding:11px 20px;border:none;background:transparent;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;margin-bottom:-1px;}
.tab.active{color:var(--red);border-bottom-color:var(--red);}
.tab:hover:not(.active){color:var(--text);}
.progress-bg{height:10px;border-radius:999px;background:rgba(255,255,255,0.07);overflow:hidden;}
.progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--red),var(--orange));transition:width .6s ease;}
.diag-card{padding:18px 20px;border-radius:14px;border:1px solid;}
.section-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-bottom:16px;}
.label-sm{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:6px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fade{animation:fadeUp .35s ease;}
@keyframes countUp{from{opacity:0}to{opacity:1}}
.tooltip-custom{background:#1a1d2e;border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px 14px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--text);}
`;

// ─── HELPERS ────────────────────────────────────────────────────────
const fmt = (n, sym = "$") => `${sym}${Number(n).toLocaleString("es-MX")}`;
const pct = (n) => `${Math.round(n)}%`;
const normalizeHeader = (value = "") => String(value)
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const extractSheetInfo = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return null;

  try {
    const url = new URL(trimmed);
    return {
      spreadsheetId: match[1],
      gid: url.searchParams.get("gid") || "0",
    };
  } catch {
    return { spreadsheetId: match[1], gid: "0" };
  }
};

const buildSheetQueryUrl = ({ spreadsheetId, gid }) =>
  `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${gid}`;

const parseSheetDate = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    const gvizDate = trimmed.match(/^Date\((.+)\)$/);
    if (gvizDate) {
      const [year, month = "0", day = "1"] = gvizDate[1].split(",").map((part) => Number(part.trim()));
      const parsed = new Date(year, month, day);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const isoParsed = new Date(trimmed);
    if (!Number.isNaN(isoParsed.getTime())) return isoParsed;

    const localMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (localMatch) {
      const [, day, month, year] = localMatch;
      const normalizedYear = year.length === 2 ? `20${year}` : year;
      const parsed = new Date(Number(normalizedYear), Number(month) - 1, Number(day));
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
  }

  return null;
};

const parseNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;

  const cleaned = value.replace(/[^\d,.-]/g, "").trim();
  if (!cleaned) return 0;

  if (cleaned.includes(",") && cleaned.includes(".")) {
    const normalized = cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")
      ? cleaned.replace(/\./g, "").replace(",", ".")
      : cleaned.replace(/,/g, "");
    return Number(normalized) || 0;
  }

  if (cleaned.includes(",")) {
    const parts = cleaned.split(",");
    const normalized = parts[parts.length - 1].length <= 2
      ? cleaned.replace(/\./g, "").replace(",", ".")
      : cleaned.replace(/,/g, "");
    return Number(normalized) || 0;
  }

  return Number(cleaned) || 0;
};

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value !== "string") return false;

  const normalized = normalizeHeader(value);
  return ["1", "si", "s", "yes", "true", "presentada", "presentado", "cerrada", "cerrado"].includes(normalized);
};

const findColumnIndex = (headers, aliases, fallbackIndex) => {
  const normalizedHeaders = headers.map((header) => normalizeHeader(header));
  const foundIndex = normalizedHeaders.findIndex((header) => aliases.some((alias) => header.includes(alias)));
  return foundIndex >= 0 ? foundIndex : fallbackIndex;
};

const parseSheetPayload = (text) => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("La respuesta de Google Sheets no tuvo el formato esperado.");

  const safeJson = text
    .slice(start, end + 1)
    .replace(/Date\(([^)]+)\)/g, '"Date($1)"');
  const payload = JSON.parse(safeJson);
  const headers = payload.table.cols.map((col, index) => col.label || `col_${index + 1}`);
  const rows = payload.table.rows.map((row) =>
    headers.map((_, index) => {
      const cell = row.c?.[index];
      if (!cell) return "";
      return cell.f ?? cell.v ?? "";
    })
  );

  return { headers, rows };
};

const normalizeSalesRows = ({ headers, rows }) => {
  const fechaIdx = findColumnIndex(headers, ["fecha de cierre", "fecha cierre", "fecha"], 1);
  const closerIdx = findColumnIndex(headers, ["nombre del closer", "closer"], 2);
  const setterIdx = findColumnIndex(headers, ["nombre del setter", "setter"], 3);
  const prospectoIdx = findColumnIndex(headers, ["nombre del prospecto", "prospecto"], 4);
  const closedIdx = findColumnIndex(headers, ["llamadas cerradas", "cerradas"], 6);
  const showIdx = findColumnIndex(headers, ["se presento", "show"], 7);
  const cashIdx = findColumnIndex(headers, ["efectivo cobrado", "cobrado"], 8);
  const revIdx = findColumnIndex(headers, ["ingreso generado", "ingresos", "revenue"], 9);
  const notasIdx = findColumnIndex(headers, ["notas"], 10);
  const pitchedIdx = findColumnIndex(headers, ["le presentamos oferta", "presentamos oferta", "oferta"], 12);
  const fuenteIdx = findColumnIndex(headers, ["como nos conocio", "fuente", "lead source"], 13);

  return rows
    .map((row) => {
      const rawCloser = String(row[closerIdx] || "").trim();
      const rawSetter = String(row[setterIdx] || "").trim();
      const rawProspecto = String(row[prospectoIdx] || "").trim();
      const rawFuente = String(row[fuenteIdx] || "").trim();
      const fecha = parseSheetDate(row[fechaIdx]);
      const rev = parseNumber(row[revIdx]);
      const cash = parseNumber(row[cashIdx]);
      const closedCount = parseNumber(row[closedIdx]);
      const closed = closedCount > 0 || rev > 0;
      const pitched = parseBoolean(row[pitchedIdx]) || closed;
      const show = parseBoolean(row[showIdx]) || pitched || cash > 0;
      const hasContent = rawCloser || rawSetter || rawProspecto || rawFuente || rev || cash || fecha;
      if (!hasContent) return null;
      const notas = String(row[notasIdx] || "").trim() || (closed
        ? "Cerró sin objeciones."
        : show
          ? "Seguimiento pendiente."
          : "No se presentó. Requiere seguimiento.");
      const mesIdx = fecha ? fecha.getMonth() : 0;
      const dia = fecha ? fecha.getDate() : 1;

      return {
        mes: MONTHS[mesIdx],
        semana: Math.min(4, Math.max(1, Math.ceil(dia / 7))),
        mesIdx,
        closer: rawCloser || "Sin closer",
        setter: rawSetter || "Sin setter",
        prospecto: rawProspecto || "Prospecto sin nombre",
        fuente: rawFuente || "Sin fuente",
        show,
        pitched,
        closed,
        rev,
        cash,
        notas,
      };
    })
    .filter(Boolean);
};

const normalizeLeadRows = ({ headers, rows }) => {
  const nombreIdx = findColumnIndex(headers, ["nombre"], 0);
  const fechaIdx = findColumnIndex(headers, ["fecha"], 3);

  return rows
    .map((row) => {
      const fecha = parseSheetDate(row[fechaIdx]);
      if (!fecha) return null;

      const mesIdx = fecha.getMonth();
      return {
        nombre: String(row[nombreIdx] || "").trim(),
        mes: MONTHS[mesIdx],
        mesIdx,
      };
    })
    .filter(Boolean);
};

const loadGoogleSheet = async (inputUrl) => {
  const info = extractSheetInfo(inputUrl);
  if (!info) throw new Error("Pega una URL válida de Google Sheets.");

  const response = await fetch(buildSheetQueryUrl(info));
  if (!response.ok) {
    throw new Error("Google Sheets no devolvió datos. Revisa que la hoja sea pública.");
  }

  const text = await response.text();
  return parseSheetPayload(text);
};

const getInitialConfig = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_CFG;
    return { ...DEFAULT_CFG, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_CFG;
  }
};

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0; const step = target / (duration / 16);
    const t = setInterval(() => { start += step; if (start >= target) { setVal(target); clearInterval(t); } else setVal(Math.floor(start)); }, 16);
    return () => clearInterval(t);
  }, [target]);
  return val;
}

// ─── CONFIG PANEL ───────────────────────────────────────────────────
function ConfigPanel({ cfg, setCfg, onApply, onSheetFieldChange, syncState }) {
  const [local, setLocal] = useState(cfg);
  const [closerInput, setCloserInput] = useState("");
  const [setterInput, setSetterInput] = useState("");
  const [fuenteInput, setFuenteInput] = useState("");

  const addTag = (field, input, setInput) => {
    const v = input.trim();
    if (!v || local[field].includes(v)) return;
    setLocal(p => ({ ...p, [field]: [...p[field], v] }));
    setInput("");
  };
  const removeTag = (field, val) => setLocal(p => ({ ...p, [field]: p[field].filter(x => x !== val) }));
  const statusColor = syncState.status === "error"
    ? "#ef9a9a"
    : syncState.status === "success"
      ? "#81c784"
      : syncState.status === "loading"
        ? "#ffe082"
        : "var(--muted)";

  return (
    <div className="glass fade" style={{ padding: 28, marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700 }}>⚙️ Configuración del Dashboard</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>Personaliza todos los datos — el dashboard se actualiza en tiempo real</div>
        </div>
        <button className="btn btn-ghost" onClick={() => setCfg(p => ({ ...p, open: false }))}>✕ Cerrar</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Empresa */}
        <div>
          <div className="label-sm">Nombre de la empresa</div>
          <input className="input-f" value={local.empresa} onChange={e => setLocal(p => ({ ...p, empresa: e.target.value }))} placeholder="Ej: Agencia Impulso" />
        </div>
        {/* Moneda */}
        <div>
          <div className="label-sm">Moneda</div>
          <select className="input-f" value={local.moneda} onChange={e => setLocal(p => ({ ...p, moneda: e.target.value }))} style={{ cursor: "pointer" }}>
            {["USD","MXN","ARS","COP","CLP","PEN","EUR"].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        {/* Metas */}
        <div>
          <div className="label-sm">Meta semanal</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--red)", fontWeight: 700, fontSize: 14 }}>$</span>
            <input className="input-f" style={{ paddingLeft: 28 }} type="number" value={local.metaSemanal} onChange={e => setLocal(p => ({ ...p, metaSemanal: Number(e.target.value) }))} placeholder="10000" />
          </div>
        </div>
        <div>
          <div className="label-sm">Meta mensual</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--red)", fontWeight: 700, fontSize: 14 }}>$</span>
            <input className="input-f" style={{ paddingLeft: 28 }} type="number" value={local.metaMensual} onChange={e => setLocal(p => ({ ...p, metaMensual: Number(e.target.value) }))} placeholder="40000" />
          </div>
        </div>
        {/* Sheet URLs */}
        <div>
          <div className="label-sm">URL — Hoja de Respuestas</div>
          <input
            className="input-f"
            value={local.sheetRespuestas}
            onChange={e => {
              const value = e.target.value;
              setLocal(p => ({ ...p, sheetRespuestas: value }));
              onSheetFieldChange("sheetRespuestas", value);
            }}
            placeholder="https://docs.google.com/spreadsheets/d/..."
          />
        </div>
        <div>
          <div className="label-sm">URL — Hoja de Leads</div>
          <input
            className="input-f"
            value={local.sheetLeads}
            onChange={e => {
              const value = e.target.value;
              setLocal(p => ({ ...p, sheetLeads: value }));
              onSheetFieldChange("sheetLeads", value);
            }}
            placeholder="https://docs.google.com/spreadsheets/d/..."
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
          color: statusColor,
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {syncState.message}
      </div>

      {/* Tags fields */}
      {[
        { label: "Closers (vendedores)", field: "closers", input: closerInput, setInput: setCloserInput, ph: "Ej: Carlos" },
        { label: "Setters (captadores)", field: "setters", input: setterInput, setInput: setSetterInput, ph: "Ej: Ana" },
        { label: "Fuentes de leads", field: "fuentes", input: fuenteInput, setInput: setFuenteInput, ph: "Ej: Instagram" },
      ].map(({ label, field, input, setInput, ph }) => (
        <div key={field} style={{ marginTop: 18 }}>
          <div className="label-sm">{label}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input className="input-f" style={{ flex: 1 }} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTag(field, input, setInput)} placeholder={ph} />
            <button className="btn btn-red" style={{ padding: "10px 16px", flexShrink: 0 }} onClick={() => addTag(field, input, setInput)}>+</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {local[field].map(v => (
              <span key={v} className="tag">{v}<button onClick={() => removeTag(field, v)}>×</button></span>
            ))}
            {local[field].length === 0 && <span style={{ fontSize: 12, color: "var(--muted)" }}>Sin agregar aún</span>}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
        <button className="btn btn-ghost" onClick={() => setLocal(cfg)}>Descartar</button>
        <button className="btn btn-red" onClick={() => { setCfg({ ...local, open: false }); onApply(local); }}>
          Guardar y cerrar →
        </button>
      </div>
    </div>
  );
}

// ─── KPI CARD ───────────────────────────────────────────────────────
function KpiCard({ label, value, sub, prefix = "", suffix = "" }) {
  const num = useCountUp(typeof value === "number" ? value : 0);
  const display = typeof value === "number"
    ? `${prefix}${num.toLocaleString("es-MX")}${suffix}`
    : value;
  return (
    <div className="glass kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-val">{display}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

// ─── CUSTOM TOOLTIP ─────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = "$" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-custom">
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {prefix}{p.value?.toLocaleString("es-MX")}</div>
      ))}
    </div>
  );
};

// ─── PÁGINA 1: PRINCIPAL ────────────────────────────────────────────
function PaginaPrincipal({ datos, cfg, leadsData }) {
  const [filtros, setFiltros] = useState({ closer: "", setter: "", prospecto: "", desde: "", hasta: "" });
  const [expandido, setExpandido] = useState(null);
  const hasSalesData = datos.length > 0;
  const hasAnyData = hasSalesData || leadsData.length > 0;

  const filtrados = datos.filter(r => {
    if (filtros.closer && r.closer !== filtros.closer) return false;
    if (filtros.setter && r.setter !== filtros.setter) return false;
    if (filtros.prospecto && !r.prospecto.toLowerCase().includes(filtros.prospecto.toLowerCase())) return false;
    return true;
  });

  const usandoLeadsSheet = leadsData.length > 0 && !filtros.closer && !filtros.setter && !filtros.prospecto;
  const totalLeads = usandoLeadsSheet ? leadsData.length : filtrados.length;
  const showRate = filtrados.length ? (filtrados.filter(r => r.show).length / filtrados.length) * 100 : 0;
  const pitched = filtrados.filter(r => r.pitched && r.show);
  const closeRate = pitched.length ? (pitched.filter(r => r.closed).length / pitched.length) * 100 : 0;
  const revTotal = filtrados.reduce((s, r) => s + r.rev, 0);
  const cashTotal = filtrados.reduce((s, r) => s + r.cash, 0);
  const llamadasDue = filtrados.length;

  // Leads por mes
  const leadsPorMes = MONTHS.map((mes, mesIdx) => ({
    mes,
    leads: usandoLeadsSheet
      ? leadsData.filter((lead) => lead.mesIdx === mesIdx).length
      : filtrados.filter((r) => r.mesIdx === mesIdx).length,
  }));

  const closers = [...new Set(datos.map(r => r.closer))];
  const setters = [...new Set(datos.map(r => r.setter))];

  const getInsight = (r) => {
    if (r.closed) return { estado: "Ganado", color: "#81c784", badge: "badge-won", resumen: `${r.prospecto} cerró por ${fmt(r.rev, cfg.moneda === "MXN" ? "$" : "$")}. Cobrado: ${fmt(r.cash, "$")}.`, tags: ["✅ Cerrado exitosamente"] };
    if (!r.show) return { estado: "No Show", color: "#ef9a9a", badge: "badge-lost", resumen: `${r.prospecto} no se presentó. Requiere seguimiento.`, tags: ["📵 No show", "🔔 Follow-up necesario"] };
    return { estado: "Pendiente", color: "#ffe082", badge: "badge-pend", resumen: `${r.prospecto} se presentó pero no cerró.`, tags: r.notas.includes("precio") ? ["💰 Objeción de precio"] : r.notas.includes("pareja") ? ["👥 Decisión en pareja"] : ["🔔 Follow-up necesario"] };
  };

  return (
    <div className="fade">
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        <KpiCard label="Total Leads" value={totalLeads} sub="registrados" />
        <KpiCard label="Llamadas Programadas" value={llamadasDue} sub="en período" />
        <KpiCard label="Tasa de Show" value={Math.round(showRate)} suffix="%" sub="se presentaron" />
        <KpiCard label="Tasa de Cierre" value={Math.round(closeRate)} suffix="%" sub="de los que se presentaron" />
        <KpiCard label="Ingresos Generados" value={revTotal} prefix={cfg.moneda === "MXN" ? "$" : "$"} sub={cfg.moneda} />
        <KpiCard label="Efectivo Cobrado" value={cashTotal} prefix="$" sub={`${Math.round(cashTotal / (revTotal || 1) * 100)}% cobrado`} />
      </div>

      {/* Gráfica leads */}
      <div className="glass" style={{ padding: "22px 24px", marginBottom: 24 }}>
        <div className="section-title">📈 Leads por Mes</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={leadsPorMes} barCategoryGap="30%">
            <XAxis dataKey="mes" tick={{ fill: "rgba(180,180,210,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(180,180,210,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip prefix="" />} />
            <Bar dataKey="leads" name="Leads" fill="url(#redGrad)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e53935" />
                <stop offset="100%" stopColor="#c62828" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filtros */}
      <div className="glass" style={{ padding: "18px 22px", marginBottom: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          <div>
            <div className="label-sm">Closer</div>
            <select className="input-f" value={filtros.closer} onChange={e => setFiltros(p => ({ ...p, closer: e.target.value }))} style={{ cursor: "pointer" }}>
              <option value="">Todos</option>
              {closers.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div className="label-sm">Setter</div>
            <select className="input-f" value={filtros.setter} onChange={e => setFiltros(p => ({ ...p, setter: e.target.value }))} style={{ cursor: "pointer" }}>
              <option value="">Todos</option>
              {setters.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <div className="label-sm">Buscar prospecto</div>
            <input className="input-f" placeholder="Nombre..." value={filtros.prospecto} onChange={e => setFiltros(p => ({ ...p, prospecto: e.target.value }))} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => setFiltros({ closer: "", setter: "", prospecto: "", desde: "", hasta: "" })}>Limpiar filtros</button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="glass" style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Registros ({filtrados.length})</div>
        </div>
        <div style={{ overflowX: "auto", maxHeight: 420, overflowY: "auto" }}>
          {filtrados.length === 0 ? (
            <div style={{ padding: "28px 22px", color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
              {hasAnyData
                ? "Todavía no hay registros de ventas reales que coincidan con los filtros actuales."
                : "Conecta una hoja de respuestas o una hoja de leads para empezar a ver datos reales."}
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Prospecto</th><th>Closer</th><th>Setter</th><th>Fuente</th><th>Estado</th><th>Ingresos</th><th>Cobrado</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.slice(0, 50).map((r, i) => {
                  const ins = getInsight(r);
                  return (
                    <>
                      <tr key={i} style={{ cursor: "pointer" }} onClick={() => setExpandido(expandido === i ? null : i)}>
                        <td style={{ fontWeight: 500 }}>{r.prospecto}</td>
                        <td>{r.closer}</td>
                        <td>{r.setter}</td>
                        <td style={{ color: "var(--muted)", fontSize: 13 }}>{r.fuente}</td>
                        <td><span className={`badge ${ins.badge}`}>{ins.estado}</span></td>
                        <td style={{ fontWeight: 600, color: r.rev > 0 ? "#81c784" : "var(--muted)" }}>{r.rev > 0 ? fmt(r.rev, "$") : "—"}</td>
                        <td style={{ color: "var(--muted)", fontSize: 13 }}>{r.cash > 0 ? fmt(r.cash, "$") : "—"}</td>
                        <td style={{ color: "var(--muted)", fontSize: 18 }}>{expandido === i ? "▲" : "▼"}</td>
                      </tr>
                      {expandido === i && (
                        <tr key={`exp-${i}`}>
                          <td colSpan={8} style={{ padding: "14px 20px", background: "rgba(229,57,53,0.04)", borderLeft: "3px solid var(--red)" }}>
                            <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>🤖 <strong>Insight de llamada:</strong> {ins.resumen}</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                              {ins.tags.map(t => <span key={t} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--muted)" }}>{t}</span>)}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>📝 {r.notas}</div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PÁGINA 2: DIAGNÓSTICO ──────────────────────────────────────────
function PaginaDiagnostico({ datos, cfg }) {
  const semanas = [];
  for (let m = 0; m < MONTHS.length; m++) {
    for (let w = 1; w <= 4; w++) {
      const rows = datos.filter(r => r.mesIdx === m && r.semana === w);
      const rev = rows.reduce((s, r) => s + r.rev, 0);
      const shows = rows.filter(r => r.show).length;
      const pitched = rows.filter(r => r.pitched && r.show);
      const closed = pitched.filter(r => r.closed).length;
      const showRate = rows.length ? (shows / rows.length) * 100 : 0;
      const closeRate = pitched.length ? (closed / pitched.length) * 100 : 0;
      const avgDeal = closed ? rev / closed : 0;
      const issues = [];
      if (rows.length > 0) {
        if (rows.length < 8) issues.push({ tipo: "Leads", sev: rows.length < 4 ? "crítico" : "advertencia", txt: `Solo ${rows.length} llamadas (mín. 8)` });
        if (closeRate < 45) issues.push({ tipo: "Cierre", sev: closeRate < 30 ? "crítico" : "advertencia", txt: `Tasa de cierre ${pct(closeRate)} (mín. 45%)` });
        if (showRate < 80) issues.push({ tipo: "Show Rate", sev: showRate < 60 ? "crítico" : "advertencia", txt: `Show rate ${pct(showRate)} (mín. 80%)` });
        if (avgDeal < 1000 && closed > 0) issues.push({ tipo: "Deal Size", sev: avgDeal < 500 ? "crítico" : "advertencia", txt: `Ticket promedio $${Math.round(avgDeal)} (mín. $1,000)` });
      }
      semanas.push({ label: `S${w} ${MONTHS[m]}`, rev, issues, rows: rows.length });
    }
  }

  const chartData = semanas.map(s => ({ ...s, meta: cfg.metaSemanal }));

  return (
    <div className="fade">
      <div style={{ marginBottom: 24 }}>
        <div className="section-title">🔍 Diagnóstico Semanal de Ingresos</div>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Meta semanal: <strong style={{ color: "var(--text)" }}>{fmt(cfg.metaSemanal, "$")}</strong> — Se identifican los cuellos de botella por semana</p>
        {!datos.length && (
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>
            Todavía no hay ventas registradas. La vista se mantiene visible con métricas en cero.
          </p>
        )}
      </div>

      {/* Gráfica */}
      <div className="glass" style={{ padding: "22px 24px", marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barCategoryGap="25%">
            <XAxis dataKey="label" tick={{ fill: "rgba(180,180,210,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(180,180,210,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+"k" : v}`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={cfg.metaSemanal} stroke="#e53935" strokeDasharray="4 4" label={{ value: "Meta", fill: "#e53935", fontSize: 11 }} />
            <Bar dataKey="rev" name="Ingresos" fill="url(#barGrad)" radius={[5, 5, 0, 0]} />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e53935" />
                <stop offset="100%" stopColor="#c62828" stopOpacity={0.5} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tarjetas semanales */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {semanas.map((s, i) => {
          const gap = cfg.metaSemanal - s.rev;
          const ok = gap <= 0;
          const hasCrit = s.issues.some(x => x.sev === "crítico");
          const hasRows = s.rows > 0;
          const borderCol = !hasRows ? "rgba(255,255,255,0.12)" : ok ? "rgba(76,175,80,0.3)" : hasCrit ? "rgba(229,57,53,0.3)" : "rgba(255,193,7,0.3)";
          const bgCol = !hasRows ? "rgba(255,255,255,0.03)" : ok ? "rgba(76,175,80,0.06)" : hasCrit ? "rgba(229,57,53,0.06)" : "rgba(255,193,7,0.06)";
          return (
            <div key={i} className="diag-card" style={{ borderColor: borderCol, background: bgCol }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: !hasRows ? "rgba(255,255,255,0.06)" : ok ? "rgba(76,175,80,0.15)" : "rgba(229,57,53,0.15)", color: !hasRows ? "var(--muted)" : ok ? "#81c784" : "#ef9a9a" }}>
                  {!hasRows ? "Sin datos" : ok ? "✓ Meta" : `−${fmt(gap, "$")}`}
                </span>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{fmt(s.rev, "$")}</div>
              {!hasRows
                ? <div style={{ fontSize: 12, color: "var(--muted)" }}>Sin registros cargados en esta semana</div>
                : s.issues.length === 0
                ? <div style={{ fontSize: 12, color: "#81c784" }}>✅ Sin problemas detectados</div>
                : s.issues.map((iss, j) => (
                  <div key={j} style={{ fontSize: 12, color: iss.sev === "crítico" ? "#ef9a9a" : "#ffe082", marginBottom: 3 }}>
                    {iss.sev === "crítico" ? "🔴" : "🟡"} <strong>{iss.tipo}:</strong> {iss.txt}
                  </div>
                ))
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PÁGINA 3: ANALYTICS ────────────────────────────────────────────
function PaginaAnalytics({ datos, cfg }) {
  const [tab, setTab] = useState(0);
  const meses = MONTHS;

  // Tab 1: Equipo
  const closers = [...new Set(datos.map(r => r.closer))];
  const setters = [...new Set(datos.map(r => r.setter))];
  const closerStats = closers.map(c => {
    const rows = datos.filter(r => r.closer === c);
    const pitched = rows.filter(r => r.pitched && r.show);
    const closed = pitched.filter(r => r.closed);
    const rev = closed.reduce((s, r) => s + r.rev, 0);
    const cash = closed.reduce((s, r) => s + r.cash, 0);
    const closeRate = pitched.length ? (closed.length / pitched.length) * 100 : 0;
    const avgDeal = closed.length ? rev / closed.length : 0;
    return { nombre: c, closeRate, avgDeal, rev, cash, shows: rows.filter(r => r.show).length, closed: closed.length };
  }).sort((a, b) => b.rev - a.rev);

  const setterStats = setters.map(s => {
    const rows = datos.filter(r => r.setter === s);
    const showRate = rows.length ? (rows.filter(r => r.show).length / rows.length) * 100 : 0;
    const rev = rows.reduce((s2, r) => s2 + r.rev, 0);
    const pitched = rows.filter(r => r.pitched && r.show);
    const closed = pitched.filter(r => r.closed);
    const closeRate = pitched.length ? (closed.length / pitched.length) * 100 : 0;
    return { nombre: s, leads: rows.length, showRate, closeRate, rev };
  }).sort((a, b) => b.rev - a.rev);

  const fuenteMap = {};
  datos.forEach(r => { fuenteMap[r.fuente] = (fuenteMap[r.fuente] || 0) + 1; });
  const fuenteData = Object.entries(fuenteMap).map(([name, value]) => ({ name, value }));
  const fuenteChartData = fuenteData.length ? fuenteData : [{ name: "Sin datos", value: 1 }];
  const COLORS = ["#e53935", "#ff6f00", "#ffc107", "#4caf50", "#2196f3", "#9c27b0"];

  // Tab 2: Metas
  const revMes = meses.map(m => ({ mes: m, rev: datos.filter(r => r.mes === m).reduce((s, r) => s + r.rev, 0) }));
  const totalRev = datos.reduce((s, r) => s + r.rev, 0);
  const progreso = Math.min((totalRev / cfg.metaMensual) * 100, 100);
  const cashPorMes = meses.map(m => ({ mes: m, pct: Math.round((datos.filter(r => r.mes === m).reduce((s, r) => s + r.cash, 0) / (datos.filter(r => r.mes === m).reduce((s, r) => s + r.rev, 0) || 1)) * 100) }));

  // Tab 3: Insights
  const outcomes = [
    { name: "Ganados", value: datos.filter(r => r.closed).length },
    { name: "Perdidos", value: datos.filter(r => !r.closed && r.show && r.pitched).length },
    { name: "No Show", value: datos.filter(r => !r.show).length },
  ];
  const patrones = [
    { tag: "💰 Objeción de precio", count: datos.filter(r => r.notas?.includes("precio")).length },
    { tag: "👥 Decisión en pareja", count: datos.filter(r => r.notas?.includes("pareja")).length },
    { tag: "🔔 Follow-up necesario", count: datos.filter(r => r.notas?.includes("seguimiento") || r.notas?.includes("Follow")).length },
    { tag: "📵 No show", count: datos.filter(r => !r.show).length },
    { tag: "✅ Cerrado exitosamente", count: datos.filter(r => r.closed).length },
  ].sort((a, b) => b.count - a.count);
  const patternDenominator = Math.max(datos.length, 1);

  const recapMeses = meses.map(m => {
    const rows = datos.filter(r => r.mes === m);
    const rev = rows.reduce((s, r) => s + r.rev, 0);
    const cash = rows.reduce((s, r) => s + r.cash, 0);
    const pitched = rows.filter(r => r.pitched && r.show);
    const closed = pitched.filter(r => r.closed);
    const closeRate = pitched.length ? (closed.length / pitched.length) * 100 : 0;
    const avgDeal = closed.length ? rev / closed.length : 0;
    const bestCloser = closers.map(c => ({ c, r: rows.filter(x => x.closer === c).reduce((s, x) => s + x.rev, 0) })).sort((a, b) => b.r - a.r)[0]?.c || "—";
    return { mes: m, rev, cash, closeRate, avgDeal, bestCloser };
  });

  return (
    <div className="fade">
      <div className="tab-bar">
        {["👥 Equipo", "💰 Metas & Ingresos", "🔎 Insights"].map((t, i) => (
          <button key={i} className={`tab${tab === i ? " active" : ""}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {!datos.length && (
        <div className="glass" style={{ padding: "18px 22px", marginBottom: 24, color: "var(--muted)", fontSize: 14 }}>
          No hay ventas cargadas todavía. Analytics sigue visible con métricas en cero.
        </div>
      )}

      {/* TAB 1 */}
      {tab === 0 && (
        <div>
          <div className="section-title">Scorecard de Closers</div>
          <div className="glass" style={{ marginBottom: 24, overflow: "hidden" }}>
            <table className="tbl">
              <thead><tr><th>#</th><th>Closer</th><th>Tasa Cierre</th><th>Ticket Prom.</th><th>Ingresos</th><th>Cobrado</th><th>Shows</th><th>Cerrados</th></tr></thead>
              <tbody>
                {closerStats.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ color: "var(--muted)", textAlign: "center", padding: "18px 14px" }}>Sin datos todavía</td>
                  </tr>
                )}
                {closerStats.map((c, i) => (
                  <tr key={c.nombre}>
                    <td style={{ fontWeight: 800, color: i === 0 ? "#ffc107" : "var(--muted)" }}>{i === 0 ? "🥇" : i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{c.nombre}</td>
                    <td><span style={{ color: c.closeRate >= 45 ? "#81c784" : "#ef9a9a", fontWeight: 700 }}>{pct(c.closeRate)}</span></td>
                    <td>{fmt(c.avgDeal, "$")}</td>
                    <td style={{ fontWeight: 700, color: "#81c784" }}>{fmt(c.rev, "$")}</td>
                    <td style={{ color: "var(--muted)" }}>{fmt(c.cash, "$")}</td>
                    <td>{c.shows}</td>
                    <td>{c.closed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div className="section-title">Leaderboard de Setters</div>
              <div className="glass" style={{ overflow: "hidden" }}>
                <table className="tbl">
                  <thead><tr><th>#</th><th>Setter</th><th>Leads</th><th>Show Rate</th><th>Ingresos</th></tr></thead>
                  <tbody>
                    {setterStats.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ color: "var(--muted)", textAlign: "center", padding: "18px 14px" }}>Sin datos todavía</td>
                      </tr>
                    )}
                    {setterStats.map((s, i) => (
                      <tr key={s.nombre}>
                        <td style={{ fontWeight: 800, color: i === 0 ? "#ffc107" : "var(--muted)" }}>{i === 0 ? "🥇" : i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{s.nombre}</td>
                        <td>{s.leads}</td>
                        <td><span style={{ color: s.showRate >= 80 ? "#81c784" : "#ef9a9a", fontWeight: 700 }}>{pct(s.showRate)}</span></td>
                        <td style={{ fontWeight: 700, color: "#81c784" }}>{fmt(s.rev, "$")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="section-title">Fuentes de Leads</div>
              <div className="glass" style={{ padding: "20px 24px" }}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={fuenteChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {fuenteChartData.map((_, i) => <Cell key={i} fill={fuenteData.length ? COLORS[i % COLORS.length] : "rgba(255,255,255,0.18)"} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontFamily: "'DM Sans',sans-serif" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {fuenteData.length === 0 && <span style={{ fontSize: 12, color: "var(--muted)" }}>Sin datos todavía</span>}
                  {fuenteData.map((f, i) => (
                    <span key={f.name} style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 5, color: "var(--muted)" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], display: "inline-block" }} />
                      {f.name} ({f.value})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 */}
      {tab === 1 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div className="glass" style={{ padding: "24px" }}>
              <div className="label-sm">Meta Mensual</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 6 }}>{fmt(totalRev, "$")}</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 14 }}>de {fmt(cfg.metaMensual, "$")} — {pct(progreso)} completado</div>
              <div className="progress-bg"><div className="progress-fill" style={{ width: `${progreso}%` }} /></div>
              <div style={{ marginTop: 12, fontSize: 13, color: "var(--muted)" }}>
                Faltan <strong style={{ color: "var(--text)" }}>{fmt(Math.max(0, cfg.metaMensual - totalRev), "$")}</strong>
              </div>
            </div>
            <div className="glass" style={{ padding: "24px" }}>
              <div className="label-sm">Pronóstico</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: totalRev >= cfg.metaMensual ? "#81c784" : "#ef9a9a", marginBottom: 6 }}>
                {totalRev >= cfg.metaMensual ? "✅ En camino" : "⚠️ Por debajo"}
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
                Ritmo actual: <strong style={{ color: "var(--text)" }}>{fmt(Math.round(totalRev / 6), "$")}</strong>/mes<br />
                Proyección anual: <strong style={{ color: "var(--text)" }}>{fmt(Math.round(totalRev / 6 * 12), "$")}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div className="glass" style={{ padding: "22px 24px" }}>
              <div className="section-title">Ingresos por Mes</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={revMes}>
                  <XAxis dataKey="mes" tick={{ fill: "rgba(180,180,210,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(180,180,210,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+"k" : v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="rev" name="Ingresos" stroke="#e53935" strokeWidth={2.5} dot={{ fill: "#e53935", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="glass" style={{ padding: "22px 24px" }}>
              <div className="section-title">% Cobrado por Mes</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={cashPorMes} barCategoryGap="30%">
                  <XAxis dataKey="mes" tick={{ fill: "rgba(180,180,210,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(180,180,210,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip prefix="" />} />
                  <ReferenceLine y={80} stroke="#4caf50" strokeDasharray="3 3" />
                  <Bar dataKey="pct" name="% Cobrado" fill="url(#greenGrad)" radius={[5, 5, 0, 0]} />
                  <defs>
                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4caf50" />
                      <stop offset="100%" stopColor="#2e7d32" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 */}
      {tab === 2 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div className="glass" style={{ padding: "22px 24px" }}>
              <div className="section-title">Análisis Win/Loss</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={outcomes} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" paddingAngle={3}>
                    <Cell fill="#4caf50" /><Cell fill="#e53935" /><Cell fill="#ff6f00" />
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontFamily: "'DM Sans',sans-serif" }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                {outcomes.map((o, i) => (
                  <span key={o.name} style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 5, color: "var(--muted)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: ["#4caf50","#e53935","#ff6f00"][i], display: "inline-block" }} />
                    {o.name}: {o.value}
                  </span>
                ))}
              </div>
            </div>
            <div className="glass" style={{ padding: "22px 24px" }}>
              <div className="section-title">Patrones detectados</div>
              {patrones.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13 }}>{p.tag}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 80, height: 6, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(p.count / patternDenominator) * 100}%`, background: "linear-gradient(90deg,#e53935,#ff6f00)", borderRadius: 999 }} />
                    </div>
                    <span style={{ fontSize: 12, color: "var(--muted)", minWidth: 24, textAlign: "right" }}>{p.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-title">Recap Mensual</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {recapMeses.map((m, i) => (
              <div key={i} className="glass" style={{ padding: "18px 20px" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, marginBottom: 12 }}>{m.mes}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    ["Ingresos", fmt(m.rev, "$")],
                    ["Cobrado", fmt(m.cash, "$")],
                    ["Tasa Cierre", pct(m.closeRate)],
                    ["Ticket Prom.", fmt(m.avgDeal, "$")],
                    ["Mejor Closer", m.bestCloser],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--muted)", marginBottom: 2 }}>{l}</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP PRINCIPAL ──────────────────────────────────────────────────
export default function App() {
  const [pagina, setPagina] = useState("principal");
  const [cfg, setCfg] = useState(getInitialConfig);
  const [datos, setDatos] = useState(EMPTY_DATA);
  const [leadsData, setLeadsData] = useState([]);
  const [syncState, setSyncState] = useState({
    status: "idle",
    message: "Pega una o dos URLs públicas de Google Sheets y el dashboard mostrará solo datos reales.",
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  }, [cfg]);

  useEffect(() => {
    const respuestasUrl = cfg.sheetRespuestas.trim();
    const leadsUrl = cfg.sheetLeads.trim();

    if (!respuestasUrl && !leadsUrl) {
      setDatos(EMPTY_DATA);
      setLeadsData([]);
      setSyncState({
        status: "idle",
        message: "Sin hojas conectadas. El dashboard queda vacío hasta que cargues datos reales.",
      });
      return;
    }

    if ((respuestasUrl && !extractSheetInfo(respuestasUrl)) || (leadsUrl && !extractSheetInfo(leadsUrl))) {
      setDatos(EMPTY_DATA);
      setLeadsData([]);
      setSyncState({
        status: "idle",
        message: "Pega una URL completa de Google Sheets para activar la lectura automática.",
      });
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setSyncState({
        status: "loading",
        message: "Leyendo Google Sheets...",
      });

      try {
        const [respuestasSheet, leadsSheet] = await Promise.all([
          respuestasUrl ? loadGoogleSheet(respuestasUrl) : Promise.resolve(null),
          leadsUrl ? loadGoogleSheet(leadsUrl) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        const ventas = respuestasSheet ? normalizeSalesRows(respuestasSheet) : [];
        const leads = leadsSheet ? normalizeLeadRows(leadsSheet) : [];

        setDatos(ventas);
        setLeadsData(leads);
        const message = respuestasUrl && leadsUrl
          ? `Hojas conectadas. ${ventas.length} registros de ventas y ${leads.length} leads cargados.`
          : respuestasUrl
            ? ventas.length
              ? `Hoja de respuestas conectada. ${ventas.length} registros de ventas cargados.`
              : "Hoja de respuestas conectada, pero todavía no tiene filas utilizables."
            : `Hoja de leads conectada. ${leads.length} leads cargados. Agrega la hoja de respuestas para ver ventas, cierres e ingresos.`;

        setSyncState({
          status: "success",
          message,
        });
      } catch (error) {
        if (cancelled) return;

        setDatos(EMPTY_DATA);
        setLeadsData([]);
        setSyncState({
          status: "error",
          message: `${error.message} Verifica que ambas hojas sean públicas o estén publicadas en la web.`,
        });
      }
    }, 700);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [cfg.sheetRespuestas, cfg.sheetLeads]);

  const handleSheetFieldChange = (field, value) => {
    setCfg((prev) => ({ ...prev, [field]: value }));
  };

  const aplicarConfig = () => {};

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{S}</style>

      {/* TOPBAR */}
      <div style={{ background: "rgba(9,11,18,0.95)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#e53935,#c62828)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📊</div>
            <div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15 }} className="grad">
                {cfg.empresa || "Sales Dashboard"}
              </span>
              {cfg.empresa && <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>Analytics</span>}
            </div>
          </div>

          <nav className="nav">
            {[["principal","🏠 Principal"],["diagnostico","🔍 Diagnóstico"],["analytics","📊 Analytics"]].map(([id, label]) => (
              <button key={id} className={`nav-btn${pagina === id ? " active" : ""}`} onClick={() => setPagina(id)}>{label}</button>
            ))}
          </nav>

          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setCfg(p => ({ ...p, open: !p.open }))}>
            ⚙️ Configurar
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {cfg.open && (
          <ConfigPanel
            cfg={cfg}
            setCfg={setCfg}
            onApply={aplicarConfig}
            onSheetFieldChange={handleSheetFieldChange}
            syncState={syncState}
          />
        )}

        {!cfg.open && (
          <>
            {pagina === "principal" && <PaginaPrincipal datos={datos} cfg={cfg} leadsData={leadsData} />}
            {pagina === "diagnostico" && <PaginaDiagnostico datos={datos} cfg={cfg} />}
            {pagina === "analytics" && <PaginaAnalytics datos={datos} cfg={cfg} />}
          </>
        )}

        {cfg.open && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)", fontSize: 14 }}>
            👆 Completa la configuración arriba y guarda las URLs para ver únicamente datos reales
          </div>
        )}
      </div>
    </div>
  );
}
