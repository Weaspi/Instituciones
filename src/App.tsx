import {
  useState,
  ChangeEvent,
  FormEvent,
  useMemo,
  useRef,
  useEffect,
} from 'react'
import { PAISES } from './data/paises'
import { ESTADOS_MEXICO } from './data/estados'

// ---------- Tipos ----------
type InstitucionForm = {
  nombreInstitucion: string
  tipoInstitucion: string
  tipoInstitucionNivelUno: string
  tipoInstitucionNivelDos: string
  tipoInstitucionNivelTres: string
  pais: string
  entidad: string
  municipio: string
  localidad: string
  razonSocial: string
  privada: string
  dondeSeCargo: string
  poder: string
  codigoIdentificacion: string
  fecha1: string
  fecha2: string
  nombre: string
  correo: string
  observaciones: string
}

type InstitucionGuardada = InstitucionForm & {
  _id: string // id interno para key
}

const FORM_INICIAL: InstitucionForm = {
  nombreInstitucion: '',
  tipoInstitucion: '',
  tipoInstitucionNivelUno: '',
  tipoInstitucionNivelDos: '',
  tipoInstitucionNivelTres: '',
  pais: '',
  entidad: '',
  municipio: '',
  localidad: '',
  razonSocial: '',
  privada: '',
  dondeSeCargo: '',
  poder: '',
  codigoIdentificacion: '',
  fecha1: '',
  fecha2: '',
  nombre: '',
  correo: '',
  observaciones: '',
}

// ---------- Utilidades ----------
const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const normalizarMayus = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

// ---------- Autocomplete: Entidad ----------
function EntidadAutocomplete({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [abierto, setAbierto] = useState(false)
  const [resaltado, setResaltado] = useState(0)
  const contenedorRef = useRef<HTMLDivElement>(null)

  const filtrados = useMemo(() => {
    const q = normalizar(value)
    if (!q) return ESTADOS_MEXICO
    return ESTADOS_MEXICO.filter((e) => normalizar(e).includes(q))
  }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(e.target as Node)
      ) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!abierto && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setAbierto(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setResaltado((r) => Math.min(r + 1, filtrados.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setResaltado((r) => Math.max(r - 1, 0))
    } else if (e.key === 'Enter') {
      if (abierto && filtrados[resaltado]) {
        e.preventDefault()
        onChange(filtrados[resaltado])
        setAbierto(false)
      }
    } else if (e.key === 'Escape') {
      setAbierto(false)
    }
  }

  return (
    <div ref={contenedorRef} className="relative">
      <input
        id="entidad"
        name="entidad"
        type="text"
        placeholder="Escribe para buscar el estado..."
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setAbierto(true)
          setResaltado(0)
        }}
        onFocus={() => setAbierto(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className="input-style w-full"
      />
      {abierto && filtrados.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {filtrados.slice(0, 50).map((est, i) => (
            <li
              key={est}
              onMouseDown={(e) => {
                e.preventDefault()
                onChange(est)
                setAbierto(false)
              }}
              onMouseEnter={() => setResaltado(i)}
              className={`cursor-pointer px-3 py-2 text-sm ${
                i === resaltado ? 'bg-[#13322e] text-white' : 'text-slate-700'
              }`}
            >
              {est}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ---------- Autocomplete: País ----------
function PaisAutocomplete({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [abierto, setAbierto] = useState(false)
  const [resaltado, setResaltado] = useState(0)
  const contenedorRef = useRef<HTMLDivElement>(null)

  const filtrados = useMemo(() => {
    const q = normalizar(value)
    if (!q) return PAISES
    return PAISES.filter((p) => normalizar(p).includes(q))
  }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(e.target as Node)
      ) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!abierto && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setAbierto(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setResaltado((r) => Math.min(r + 1, filtrados.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setResaltado((r) => Math.max(r - 1, 0))
    } else if (e.key === 'Enter') {
      if (abierto && filtrados[resaltado]) {
        e.preventDefault()
        onChange(filtrados[resaltado])
        setAbierto(false)
      }
    } else if (e.key === 'Escape') {
      setAbierto(false)
    }
  }

  return (
    <div ref={contenedorRef} className="relative">
      <input
        id="pais"
        name="pais"
        type="text"
        placeholder="Escribe para buscar tu país..."
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setAbierto(true)
          setResaltado(0)
        }}
        onFocus={() => setAbierto(true)}
        onKeyDown={handleKeyDown}
        required
        autoComplete="off"
        className="input-style w-full"
      />
      {abierto && filtrados.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {filtrados.slice(0, 50).map((p, i) => (
            <li
              key={p}
              onMouseDown={(e) => {
                e.preventDefault()
                onChange(p)
                setAbierto(false)
              }}
              onMouseEnter={() => setResaltado(i)}
              className={`cursor-pointer px-3 py-2 text-sm ${
                i === resaltado ? 'bg-[#13322e] text-white' : 'text-slate-700'
              }`}
            >
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const OPCIONES_NIVEL = ['Pública', 'Privada', 'Extranjera', 'Otro'] as const
type OpcionNivel = (typeof OPCIONES_NIVEL)[number]

const OPCIONES_NIVEL_UNO = [
  'Pública',
  'Privada',
  'Extranjera',
  'Otro',
] as const

const OPCIONES_NIVEL_DOS = [
  'Estatal',
  'Federal ',
  'Empresa ',
  'Otro',
] as const

const OPCIONES_PODER = ['Estatal', 'Federal', 'Municipal', 'Otro'] as const
function NivelConOpciones<T extends string>({
  form,
  setForm,
  name,
  opciones,
}: {
  form: InstitucionForm
  setForm: React.Dispatch<React.SetStateAction<InstitucionForm>>
  name: 'tipoInstitucionNivelUno' | 'tipoInstitucionNivelDos'
  opciones: readonly T[]
}) {
  const valorActual = form[name]

  const opcionInicial: T | '' = opciones.includes(valorActual as T)
    ? (valorActual as T)
    : valorActual
      ? ('Otro' as T)
      : ''

  const [opcion, setOpcion] = useState<T | ''>(opcionInicial)
  const [otroTexto, setOtroTexto] = useState(
    opcionInicial === 'Otro' ? valorActual : ''
  )

  const aplicar = (op: T, textoOtro: string) => {
    const valorFinal = op === 'Otro' ? textoOtro : op
    setForm((prev) => ({ ...prev, [name]: valorFinal }))
  }

  const handleOpcionClick = (op: T) => {
    setOpcion(op)
    if (op === 'Otro') {
      aplicar('Otro' as T, otroTexto)
    } else {
      setOtroTexto('')
      aplicar(op, '')
    }
  }

  const handleOtroChange = (texto: string) => {
    setOtroTexto(texto)
    aplicar('Otro' as T, texto)
  }

  return (
    <div className="px-4 pb-4 space-y-3">
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left font-medium px-3 py-2">Tipo</th>
              <th className="text-left font-medium px-3 py-2 w-24">
                Selección
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {opciones.map((op) => {
              const activa = opcion === op
              return (
                <tr
                  key={op}
                  onClick={() => handleOpcionClick(op)}
                  className={`cursor-pointer transition-colors ${
                    activa ? 'bg-[#13322e]/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-3 py-2 text-slate-700">{op}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                        activa
                          ? 'border-[#13322e] bg-[#13322e]'
                          : 'border-slate-300'
                      }`}
                    >
                      {activa && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {opcion === 'Otro' && (
        <div className="space-y-1.5">
          <label
            htmlFor={`otro-${name}`}
            className="text-xs font-medium text-slate-600"
          >
            Especifica el tipo
          </label>
          <input
            id={`otro-${name}`}
            type="text"
            placeholder="Escribe el tipo"
            value={otroTexto}
            onChange={(e) => handleOtroChange(e.target.value)}
            autoFocus
            className="input-style w-full"
          />
          <p className="text-xs text-slate-400">
            Este valor se guardará en <code>{name}</code>.
          </p>
        </div>
      )}
    </div>
  )
}
function PoderConOpciones({
  form,
  setForm,
}: {
  form: InstitucionForm
  setForm: React.Dispatch<React.SetStateAction<InstitucionForm>>
}) {
  const valorActual = form.poder

  const opcionInicial: (typeof OPCIONES_PODER)[number] | '' =
    OPCIONES_PODER.includes(valorActual as (typeof OPCIONES_PODER)[number])
      ? (valorActual as (typeof OPCIONES_PODER)[number])
      : valorActual
        ? 'Otro'
        : ''

  const [opcion, setOpcion] = useState<(typeof OPCIONES_PODER)[number] | ''>(
    opcionInicial
  )
  const [otroTexto, setOtroTexto] = useState(
    opcionInicial === 'Otro' ? valorActual : ''
  )

  const aplicar = (
    op: (typeof OPCIONES_PODER)[number],
    textoOtro: string
  ) => {
    const valorFinal = op === 'Otro' ? textoOtro : op
    setForm((prev) => ({ ...prev, poder: valorFinal }))
  }

  const handleOpcionClick = (op: (typeof OPCIONES_PODER)[number]) => {
    setOpcion(op)
    if (op === 'Otro') {
      aplicar('Otro', otroTexto)
    } else {
      setOtroTexto('')
      aplicar(op, '')
    }
  }

  const handleOtroChange = (texto: string) => {
    setOtroTexto(texto)
    aplicar('Otro', texto)
  }

  return (
    <div className="px-4 pb-4 space-y-3">
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left font-medium px-3 py-2">Poder</th>
              <th className="text-left font-medium px-3 py-2 w-24">
                Selección
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {OPCIONES_PODER.map((op) => {
              const activa = opcion === op
              return (
                <tr
                  key={op}
                  onClick={() => handleOpcionClick(op)}
                  className={`cursor-pointer transition-colors ${
                    activa ? 'bg-[#13322e]/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-3 py-2 text-slate-700">{op}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                        activa
                          ? 'border-[#13322e] bg-[#13322e]'
                          : 'border-slate-300'
                      }`}
                    >
                      {activa && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {opcion === 'Otro' && (
        <div className="space-y-1.5">
          <label
            htmlFor="otro-poder"
            className="text-xs font-medium text-slate-600"
          >
            Especifica el poder
          </label>
          <input
            id="otro-poder"
            type="text"
            placeholder="Ej. Organismo autónomo"
            value={otroTexto}
            onChange={(e) => handleOtroChange(e.target.value)}
            autoFocus
            className="input-style w-full"
          />
          <p className="text-xs text-slate-400">
            Este valor se guardará en <code>poder</code>.
          </p>
        </div>
      )}
    </div>
  )
}
// ---------- Acordeón de niveles ----------
type NivelKey =
  | 'tipoInstitucionNivelUno'
  | 'tipoInstitucionNivelDos'
  | 'tipoInstitucionNivelTres'


function NivelesAcordeon({
  form,
  setForm,
}: {
  form: InstitucionForm
  setForm: React.Dispatch<React.SetStateAction<InstitucionForm>>
}) {
  const [abierto, setAbierto] = useState<NivelKey | null>(null)
  
  const toggle = (key: NivelKey) => {
    setAbierto((prev) => (prev === key ? null : key))
  }

  // Helper para renderizar el header de cada nivel
  const HeaderNivel = ({
    nivelKey,
    label,
  }: {
    nivelKey: NivelKey
    label: string
  }) => {
    const activo = abierto === nivelKey
    const tieneValor = form[nivelKey].trim().length > 0
    return (
      <button
        type="button"
        onClick={() => toggle(nivelKey)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
              tieneValor
                ? 'bg-[#13322e] text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {tieneValor ? '✓' : '·'}
          </span>
          <span className="text-sm font-medium text-slate-700">{label}</span>
          {tieneValor && !activo && (
            <span className="text-xs text-slate-400 truncate max-w-[200px]">
              — {form[nivelKey]}
            </span>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-slate-400 transition-transform ${
            activo ? 'rotate-180' : ''
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    )
  }

  return (
    <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50/50">
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-[#13322e]">
          Tipo de institución por nivel
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Nivel 1 y 2 usan la misma tabla. Nivel 3 es texto libre.
        </p>
      </div>

      <ul className="divide-y divide-slate-200">
      {/* NIVEL 1 */}
      <li>
        <HeaderNivel
          nivelKey="tipoInstitucionNivelUno"
          label="Tipo institución nivel uno"
        />
        {abierto === 'tipoInstitucionNivelUno' && (
          <NivelConOpciones
            form={form}
            setForm={setForm}
            name="tipoInstitucionNivelUno"
            opciones={OPCIONES_NIVEL_UNO}
          />
        )}
      </li>

      {/* NIVEL 2 */}
      <li>
        <HeaderNivel
          nivelKey="tipoInstitucionNivelDos"
          label="Tipo institución nivel dos"
        />
        {abierto === 'tipoInstitucionNivelDos' && (
          <NivelConOpciones
            form={form}
            setForm={setForm}
            name="tipoInstitucionNivelDos"
            opciones={OPCIONES_NIVEL_DOS}
          />
        )}
      </li>
        {/* NIVEL 3 (texto libre) */}
        <li>
          <HeaderNivel
            nivelKey="tipoInstitucionNivelTres"
            label="Tipo institución nivel tres"
          />
          {abierto === 'tipoInstitucionNivelTres' && (
            <div className="px-4 pb-4">
              <input
                type="text"
                name="tipoInstitucionNivelTres"
                placeholder="Ej. Pública, Privada, etc."
                value={form.tipoInstitucionNivelTres}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    tipoInstitucionNivelTres: e.target.value,
                  }))
                }
                autoFocus
                className="input-style w-full"
              />
            </div>
          )}
        </li>
      </ul>
    </div>
  )
}

// ---------- Vista: Lista de instituciones ----------
function ListaInstituciones({
  instituciones,
}: {
  instituciones: InstitucionGuardada[]
}) {
  const [busqueda, setBusqueda] = useState('')

  const filtradas = useMemo(() => {
    const q = normalizar(busqueda)
    if (!q) return instituciones
    return instituciones.filter((i) =>
      normalizar(i.nombreInstitucion).includes(q)
    )
  }, [busqueda, instituciones])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#13322e] text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 6h13" />
                  <path d="M8 12h13" />
                  <path d="M8 18h13" />
                  <path d="M3 6h.01" />
                  <path d="M3 12h.01" />
                  <path d="M3 18h.01" />
                </svg>
              </span>
              <div>
                <span className="text-xs font-semibold tracking-wider text-[#9d2449] uppercase">
                  Catálogo
                </span>
                <h2 className="text-2xl font-semibold text-[#13322e] leading-tight">
                  Instituciones registradas
                </h2>
              </div>
            </div>

            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="input-style w-full"
              />
            </div>
          </div>

          {filtradas.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              {instituciones.length === 0
                ? 'Aún no hay instituciones registradas.'
                : 'No se encontraron coincidencias.'}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">
                      Nombre
                    </th>
                    <th className="text-left font-medium px-3 py-2">País</th>
                    <th className="text-left font-medium px-3 py-2">
                      Entidad
                    </th>
                    <th className="text-left font-medium px-3 py-2">
                      Tipo
                    </th>
                    <th className="text-left font-medium px-3 py-2">
                      Responsable
                    </th>
                    <th className="text-left font-medium px-3 py-2">
                      Correo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtradas.map((i) => (
                    <tr key={i._id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-800 font-medium">
                        {i.nombreInstitucion}
                      </td>
                      <td className="px-3 py-2 text-slate-600">{i.pais}</td>
                      <td className="px-3 py-2 text-slate-600">
                        {i.entidad || '—'}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {i.tipoInstitucionNivelUno || '—'}
                      </td>
                      <td className="px-3 py-2 text-slate-600">{i.nombre}</td>
                      <td className="px-3 py-2 text-slate-600">
                        {i.correo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- App ----------
type Vista = 'alta' | 'lista'

function App() {
  const [vista, setVista] = useState<Vista>('alta')
  const [form, setForm] = useState<InstitucionForm>(FORM_INICIAL)
  const [instituciones, setInstituciones] = useState<InstitucionGuardada[]>([])
  const [enviado, setEnviado] = useState(false)
  const [poderAbierto, setPoderAbierto] = useState(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const CAMPOS_EXCLUIDOS = ['correo']

    const formFinal = Object.fromEntries(
      Object.entries(form).map(([key, value]) => {
        if (typeof value !== 'string') return [key, value]
        if (CAMPOS_EXCLUIDOS.includes(key)) return [key, value]
        return [key, normalizarMayus(value)]
      })
    ) as InstitucionForm

    const nueva: InstitucionGuardada = {
      ...formFinal,
      _id: crypto.randomUUID(),
    }

    setInstituciones((prev) => [nueva, ...prev])
    console.log('Institución registrada:', formFinal)
    setEnviado(true)
    setForm(FORM_INICIAL)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="sticky top-0 w-full h-18 shrink-0 bg-[#13322e] text-white border-b border-[#bc955c]/30 z-1020 shadow-md flex flex-col justify-center">
        <div className="max-w-350 h-full w-full mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/5 rounded border border-[#bc955c]/20 hidden md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#bc955c]"
              >
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4 8 4v14" />
                <path d="M17 21v-8.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V21" />
              </svg>
            </div>
            <h1 className="font-patria text-lg sm:text-xl md:text-[1.9rem] font-normal tracking-wide leading-none whitespace-nowrap">
              Instituciones
            </h1>
          </div>

          {/* Menú de vistas */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVista('alta')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                vista === 'alta'
                  ? 'bg-white text-[#13322e]'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              Alta
            </button>
            <button
              type="button"
              onClick={() => setVista('lista')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                vista === 'lista'
                  ? 'bg-white text-[#13322e]'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              Registradas ({instituciones.length})
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full relative z-10 flex flex-col">
        {vista === 'lista' ? (
          <ListaInstituciones instituciones={instituciones} />
        ) : (
          <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#13322e] text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 21h18" />
                        <path d="M5 21V7l8-4 8 4v14" />
                        <path d="M17 21v-8.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V21" />
                      </svg>
                    </span>
                    <div>
                      <span className="text-xs font-semibold tracking-wider text-[#9d2449] uppercase">
                        Registro Institucional
                      </span>
                      <h2 className="text-2xl font-semibold text-[#13322e] leading-tight">
                        Alta de Institución
                      </h2>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-500 mb-6">
                  Datos mínimos para identificar y validar a la institución responsable dentro del catálogo.
                </p>

                <form
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="nombreInstitucion"
                        className="text-sm font-medium text-slate-700"
                      >
                        Nombre de institución{' '}
                        <span className="text-[#9d2449]">*</span>
                      </label>
                      <input
                        id="nombreInstitucion"
                        name="nombreInstitucion"
                        type="text"
                        placeholder="Nombre completo de la institución"
                        value={form.nombreInstitucion}
                        onChange={handleChange}
                        required
                        className="input-style"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="tipoInstitucion"
                        className="text-sm font-medium text-slate-700"
                      >
                        Tipo de institución{' '}
                        <span className="text-[#9d2449]">*</span>
                      </label>
                      <select
                        id="tipoInstitucion"
                        name="tipoInstitucion"
                        value={form.tipoInstitucion}
                        onChange={handleChange}
                        required
                        className="input-style"
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="NACIONAL">NACIONAL</option>
                        <option value="EXTRANJERA">EXTRANJERA</option>
                      </select>
                    </div>

                    <NivelesAcordeon form={form} setForm={setForm} />

                    <div className="space-y-1.5">
                      <label
                        htmlFor="pais"
                        className="text-sm font-medium text-slate-700"
                      >
                        País <span className="text-[#9d2449]">*</span>
                      </label>
                      <PaisAutocomplete
                        value={form.pais}
                        onChange={(v) =>
                          setForm((prev) => ({ ...prev, pais: v }))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="entidad"
                        className="text-sm font-medium text-slate-700"
                      >
                        Entidad
                      </label>
                      {form.pais === 'México' ? (
                        <EntidadAutocomplete
                          value={form.entidad}
                          onChange={(v) =>
                            setForm((prev) => ({ ...prev, entidad: v }))
                          }
                        />
                      ) : (
                        <input
                          id="entidad"
                          name="entidad"
                          type="text"
                          placeholder="Ej. Ciudad de México"
                          value={form.entidad}
                          onChange={handleChange}
                          className="input-style"
                        />
                      )}
                    </div>


                    <div className="space-y-1.5">
                      <label
                        htmlFor="municipio"
                        className="text-sm font-medium text-slate-700"
                      >
                        Municipio{' '}
                        <span className="text-slate-400">(Opcional)</span>
                      </label>
                      <input
                        id="municipio"
                        name="municipio"
                        type="text"
                        placeholder="Ej. Benito Juárez"
                        value={form.municipio}
                        onChange={handleChange}
                        className="input-style"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="localidad"
                        className="text-sm font-medium text-slate-700"
                      >
                        Localidad{' '}
                        <span className="text-slate-400">(Opcional)</span>
                      </label>
                      <input
                        id="localidad"
                        name="localidad"
                        type="text"
                        placeholder="Ej. Lomas de la Selva"
                        value={form.localidad}
                        onChange={handleChange}
                        className="input-style"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="razonSocial"
                        className="text-sm font-medium text-slate-700"
                      >
                        Institucion Padre
                      </label>
                      <input
                        id="razonSocial"
                        name="razonSocial"
                        type="text"
                        placeholder="Ej. Universidad Nacional Autónoma de México"
                        value={form.razonSocial}
                        onChange={handleChange}
                        className="input-style"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="privada"
                        className="text-sm font-medium text-slate-700"
                      >
                        Privada <span className="text-[#9d2449]">*</span>
                      </label>
                      <select
                        id="privada"
                        name="privada"
                        value={form.privada}
                        onChange={handleChange}
                        required
                        className="input-style"
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="SI">SI</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="dondeSeCargo"
                        className="text-sm font-medium text-slate-700"
                      >
                        Donde se cargó los datos
                      </label>
                      <input
                        id="dondeSeCargo"
                        name="dondeSeCargo"
                        type="text"
                        placeholder="Ej. Sistema de información, Oficina de control"
                        value={form.dondeSeCargo}
                        onChange={handleChange}
                        className="input-style"
                      />
                    </div>


                      <div className="space-y-1.5 md:col-span-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50/50">
                        <button
                          type="button"
                          onClick={() => setPoderAbierto((v) => !v)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                                form.poder.trim()
                                  ? 'bg-[#13322e] text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {form.poder.trim() ? '✓' : '·'}
                            </span>
                            <span className="text-sm font-medium text-slate-700">Poder</span>
                            {form.poder.trim() && !poderAbierto && (
                              <span className="text-xs text-slate-400 truncate max-w-[200px]">
                                — {form.poder}
                              </span>
                            )}
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`text-slate-400 transition-transform ${
                              poderAbierto ? 'rotate-180' : ''
                            }`}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>

                        {poderAbierto && <PoderConOpciones form={form} setForm={setForm} />}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="codigoIdentificacion"
                        className="text-sm font-medium text-slate-700"
                      >
                        Código de identificación
                      </label>
                      <input
                        id="codigoIdentificacion"
                        name="codigoIdentificacion"
                        type="text"
                        placeholder="Ej. RFC, clave única, etc."
                        value={form.codigoIdentificacion}
                        onChange={handleChange}
                        className="input-style"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="fecha1"
                        className="text-sm font-medium text-slate-700"
                      >
                        Fecha y hora
                      </label>
                      <input
                        id="fecha1"
                        name="fecha1"
                        type="datetime-local"
                        value={form.fecha1}
                        onChange={handleChange}
                        className="input-style w-full"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="fecha2"
                        className="text-sm font-medium text-slate-700"
                      >
                        Fecha y hora (segunda)
                      </label>
                      <input
                        id="fecha2"
                        name="fecha2"
                        type="datetime-local"
                        value={form.fecha2}
                        onChange={handleChange}
                        className="input-style w-full"
                      />
                    </div>
              

                    <div className="space-y-1.5">
                      <label
                        htmlFor="nombre"
                        className="text-sm font-medium text-slate-700"
                      >
                        Nombre <span className="text-[#9d2449]">*</span>
                      </label>
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Nombre de la persona de contacto/responsable"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        className="input-style"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="correo"
                        className="text-sm font-medium text-slate-700"
                      >
                        Correo <span className="text-[#9d2449]">*</span>
                      </label>
                      <input
                        id="correo"
                        name="correo"
                        type="email"
                        placeholder="contacto@institucion.mx"
                        value={form.correo}
                        onChange={handleChange}
                        required
                        className="input-style"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label
                        htmlFor="observaciones"
                        className="text-sm font-medium text-slate-700"
                      >
                        Observaciones
                      </label>
                      <textarea
                        id="observaciones"
                        name="observaciones"
                        placeholder="Cualquier dato extra que no encaje en los campos anteriores"
                        value={form.observaciones}
                        onChange={handleChange}
                        rows={3}
                        className="input-style"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      Los campos marcados con{' '}
                      <span className="text-[#9d2449]">*</span> son
                      obligatorios.
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449]"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md bg-[#13322e] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#0d2320] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449]"
                      >
                        Guardar institución
                      </button>
                    </div>
                  </div>
                </form>

                {enviado && (
                  <div className="mt-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800 flex items-center justify-between gap-3">
                    <span>Institución registrada correctamente.</span>
                    <button
                      type="button"
                      onClick={() => setVista('lista')}
                      className="text-[#13322e] font-medium underline text-xs"
                    >
                      Ver registradas
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-slate-500">
          Sistema de Registro Institucional · CNICyT
        </div>
      </footer>
    </div>
  )
}

export default App