import {
  TRADUCCIONES,
  type Idioma,
  type Traduccion,
} from './i18n/traducciones'
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
import {
  obtenerInstituciones,
  crearInstitucion,
  actualizarInstitucion,
  eliminarInstitucion,
  type InstitucionAPI,
  type CambiosInstitucion,
} from './services/instituciones'
import Layout from './components/Layout'

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
  poder: string
  nombre: string
  correo: string
  observaciones: string
  origenInformacion: string
}

type InstitucionGuardada = InstitucionForm & {
  _id: string
  fechaRegistro: string
  idNumerico: number
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
  poder: '',
  nombre: '',
  correo: '',
  observaciones: '',
  origenInformacion: '',
}

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


const obtenerIdPais = (nombre: string): number | null => {
  if (!nombre) return null
  const index = PAISES.findIndex(
    (p) => normalizar(p) === normalizar(nombre)
  )
  return index >= 0 ? index + 1 : null
}

const obtenerIdEntidad = (nombre: string): number | null => {
  if (!nombre) return null
  const index = ESTADOS_MEXICO.findIndex(
    (p) => normalizar(p) === normalizar(nombre)
  )
  return index >= 0 ? index + 1 : null
}

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

function NivelConOpciones({
  form,
  setForm,
  name,
  opciones,
  t,
}: {
  form: InstitucionForm
  setForm: React.Dispatch<React.SetStateAction<InstitucionForm>>
  name: 'tipoInstitucionNivelUno' | 'tipoInstitucionNivelDos'
  opciones: readonly string[]
  t: Traduccion
}) {
  const valorActual = form[name]
  const otra = t === TRADUCCIONES.en ? 'Other' : 'Otro'

  const opcionInicial = opciones.includes(valorActual)
    ? valorActual
    : valorActual
      ? otra
      : ''

  const [opcion, setOpcion] = useState<string>(opcionInicial)
  const [otroTexto, setOtroTexto] = useState(
    opcionInicial === otra ? valorActual : ''
  )

  const aplicar = (op: string, textoOtro: string) => {
    const valorFinal = op === otra ? textoOtro : op
    setForm((prev) => ({ ...prev, [name]: valorFinal }))
  }

  const handleOpcionClick = (op: string) => {
    setOpcion(op)
    if (op === otra) {
      aplicar(otra, otroTexto)
    } else {
      setOtroTexto('')
      aplicar(op, '')
    }
  }

  const handleOtroChange = (texto: string) => {
    setOtroTexto(texto)
    aplicar(otra, texto)
  }

  return (
    <div className="px-4 pb-4 space-y-3">
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left font-medium px-3 py-2">
                {t.tablaTipo}
              </th>
              <th className="text-left font-medium px-3 py-2 w-24">
                {t.tablaSeleccion}
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

      {opcion === otra && (
        <div className="space-y-1.5">
          <label
            htmlFor={`otro-${name}`}
            className="text-xs font-medium text-slate-600"
          >
            {t.especificaTipo}
          </label>
          <input
            id={`otro-${name}`}
            type="text"
            placeholder={t.phOtroTipo}
            value={otroTexto}
            onChange={(e) => handleOtroChange(e.target.value)}
            autoFocus
            className="input-style w-full"
          />
          <p className="text-xs text-slate-400">
            {t.guardadoEn} <code>{name}</code>.
          </p>
        </div>
      )}
    </div>
  )
}

type NivelKey =
  | 'tipoInstitucionNivelUno'
  | 'tipoInstitucionNivelDos'
  | 'tipoInstitucionNivelTres'

function NivelesAcordeon({
  form,
  setForm,
  t,
}: {
  form: InstitucionForm
  setForm: React.Dispatch<React.SetStateAction<InstitucionForm>>
  t: Traduccion
}) {
  const [abierto, setAbierto] = useState<NivelKey | null>(null)

  const toggle = (key: NivelKey) => {
    setAbierto((prev) => (prev === key ? null : key))
  }

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
            <span className="text-xs text-slate-400 truncate max-w-50">
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
          {t.nivelesTitulo} <span className="text-[#9d2449]">*</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">{t.nivelesSubtitulo}</p>
      </div>

      <ul className="divide-y divide-slate-200">
        <li>
          <HeaderNivel
            nivelKey="tipoInstitucionNivelUno"
            label={t.nivelUno}
          />
          {abierto === 'tipoInstitucionNivelUno' && (
            <NivelConOpciones
              form={form}
              setForm={setForm}
              name="tipoInstitucionNivelUno"
              opciones={t.opcionesNivelUno}
              t={t}
            />
          )}
        </li>

        <li>
          <HeaderNivel
            nivelKey="tipoInstitucionNivelDos"
            label={t.nivelDos}
          />
          {abierto === 'tipoInstitucionNivelDos' && (
            <NivelConOpciones
              form={form}
              setForm={setForm}
              name="tipoInstitucionNivelDos"
              opciones={t.opcionesNivelDos}
              t={t}
            />
          )}
        </li>

        <li>
          <HeaderNivel
            nivelKey="tipoInstitucionNivelTres"
            label={t.nivelTres}
          />
          {abierto === 'tipoInstitucionNivelTres' && (
            <div className="px-4 pb-4">
              <input
                type="text"
                name="tipoInstitucionNivelTres"
                placeholder={t.phOtroTipo}
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

const PAGE_SIZE = 10

function ListaInstituciones({
  institucionesAPI,
  cargando,
  error,
  t,
  idioma,
  paginaActual,
  totalPaginas,
  haySiguiente,
  onCambiarPagina,
  filtros,
  setFiltros,
  onEditar,
}: {
  institucionesAPI: InstitucionAPI[]
  cargando: boolean
  error: string | null
  t: Traduccion
  idioma: 'es' | 'en'
  paginaActual: number
  totalPaginas: number
  haySiguiente: boolean
  onCambiarPagina: (p: number) => void
  filtros: {
    search: string
    id_pais: number | null
    tipo_institucion: string | null
    tipo_poder: string | null
  }
  setFiltros: React.Dispatch<
    React.SetStateAction<{
      search: string
      id_pais: number | null
      tipo_institucion: string | null
      tipo_poder: string | null
    }>
  >
  onEditar: (institucion: InstitucionAPI) => void
}) {
  const filtradas: InstitucionGuardada[] = useMemo(() => {
    return (institucionesAPI ?? []).map((i) => ({
      _id: `api-${i.id_institucion}`,
      idNumerico: i.id_institucion,
      fechaRegistro: '',

      nombreInstitucion: i.desc_institucion,
      tipoInstitucion: i.tipo_institucion_nombre ?? '',

      tipoInstitucionNivelUno: i.nivel_uno_nombre ?? '',
      tipoInstitucionNivelDos: i.nivel_dos_nombre ?? '',
      tipoInstitucionNivelTres: i.nivel_tres_nombre ?? '',

      pais: i.pais_nombre ?? '',
      entidad: i.entidad_nombre ?? '',
      municipio: i.municipio_nombre ?? '',
      localidad: i.localidad_nombre ?? '',

      razonSocial: i.id_institucion_padre
        ? String(i.id_institucion_padre)
        : '',
      privada: i.ind_empresa ?? '',
      poder: i.tipo_poder ?? '',
      nombre: '',
      correo: '',
      observaciones: '',
      origenInformacion: i.origen_informacion ?? '',
    }))
  }, [institucionesAPI])

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-3">     
              <div>
                <span className="text-xs font-semibold tracking-wider text-[#9d2449] uppercase">
                  {t.catalogo}
                </span>
                <h2 className="text-2xl font-semibold text-[#13322e] leading-tight">
                  {t.listaTitulo}
                </h2>
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                {idioma === 'es' ? 'Buscar' : 'Search'}
              </label>
              <input
                type="text"
                placeholder={t.buscar}
                value={filtros.search}
                onChange={(e) => {
                  setFiltros((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }}
                className="input-style w-full"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                {idioma === 'es' ? 'País' : 'Country'}
              </label>
              <select
                value={filtros.id_pais ?? ''}
                onChange={(e) => {
                  setFiltros((prev) => ({
                    ...prev,
                    id_pais: e.target.value
                      ? Number(e.target.value)
                      : null,
                  }))
                  onCambiarPagina(1)
                }}
                className="input-style w-full"
              >
                <option value="">{idioma === 'es' ? 'Todos' : 'All'}</option>
                <option value="56">Otro</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                {idioma === 'es' ? 'Tipo' : 'Type'}
              </label>
              <select
                value={filtros.tipo_institucion ?? ''}
                onChange={(e) => {
                  setFiltros((prev) => ({
                    ...prev,
                    tipo_institucion: e.target.value || null,
                  }))
                  onCambiarPagina(1)
                }}
                className="input-style w-full"
              >
                <option value="">{idioma === 'es' ? 'Todos' : 'All'}</option>
                <option value="NACIONAL">
                  {idioma === 'es' ? 'Nacional' : 'National'}
                </option>
                <option value="EXTRANJERA">
                  {idioma === 'es' ? 'Extranjera' : 'Foreign'}
                </option>
              </select>
            </div>
          </div>

          {cargando && (
            <div className="text-center py-4 text-slate-500 text-sm">
              {idioma === 'es'
                ? 'Cargando instituciones...'
                : 'Loading institutions...'}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {filtradas.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              {filtros.search ||
              filtros.id_pais ||
              filtros.tipo_institucion ||
              filtros.tipo_poder
                ? t.sinCoincidencias
                : t.sinRegistros}
            </div>











          ) : (
            <>
              <div className="overflow-x-auto rounded-md border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left font-medium px-3 py-2">
                        {t.colNombre}
                      </th>
                      <th className="text-left font-medium px-3 py-2">
                        {t.colPais}
                      </th>
                      <th className="text-left font-medium px-3 py-2">
                        {t.colEntidad}
                      </th>
                      <th className="text-left font-medium px-3 py-2">
                        {t.colTipo}
                      </th>
                      <th className="text-left font-medium px-3 py-2">
                        {idioma === 'es' ? 'Acciones' : 'Actions'}
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
                          {i.entidad || t.guion}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {i.tipoInstitucionNivelUno || t.guion}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {i.nombre}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {i.correo}
                        </td>                      
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => {
                              const original = institucionesAPI.find(
                                (x) => x.id_institucion === i.idNumerico
                              )
                              if (original) onEditar(original)
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            
                            {idioma === 'es' ? 'Editar' : 'Edit'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>












              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  disabled={paginaActual <= 1}
                  onClick={() => onCambiarPagina(paginaActual - 1)}
                  className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-md disabled:opacity-40"
                >
                  ← Anterior
                </button>

                <span className="text-sm text-slate-500">
                  Página {paginaActual} de {totalPaginas}
                </span>

                <button
                  type="button"
                  disabled={!haySiguiente}
                  onClick={() => onCambiarPagina(paginaActual + 1)}
                  className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-md disabled:opacity-40"
                >
                  Siguiente →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

type Vista = 'alta' | 'lista'

function ModalEditar({
  institucion,
  t,
  idioma,
  onCerrar,
  onGuardar,
  onEliminar,
}: {
  institucion: InstitucionAPI
  t: Traduccion
  idioma: 'es' | 'en'
  onCerrar: () => void
  onGuardar: (form: InstitucionForm) => void
  onEliminar: () => void
}) {
  const [form, setForm] = useState<InstitucionForm>({
    nombreInstitucion: institucion.desc_institucion,
    tipoInstitucion: institucion.tipo_institucion ?? '',

    tipoInstitucionNivelUno: institucion.nivel_uno_nombre ?? '',
    tipoInstitucionNivelDos: institucion.nivel_dos_nombre ?? '',
    tipoInstitucionNivelTres: institucion.nivel_tres_nombre ?? '',

    pais: institucion.pais_nombre ?? '',
    entidad: institucion.entidad_nombre ?? '',
    municipio: institucion.municipio_nombre ?? '',
    localidad: institucion.localidad_nombre ?? '',

    razonSocial: String(institucion.id_institucion_padre ?? ''),

    privada:
      institucion.ind_empresa === '1' || institucion.ind_empresa === 'S'
        ? 'SI'
        : 'NO',
    poder: institucion.tipo_poder ?? '',
    nombre: '',
    correo: '',
    observaciones: '',
    origenInformacion: institucion.origen_informacion ?? '',
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-[#13322e]">
            {idioma === 'es' ? 'Editar institución' : 'Edit institution'}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="text-slate-400 hover:text-slate-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.nombreInstitucion}
            </label>
            <input
              type="text"
              name="nombreInstitucion"
              value={form.nombreInstitucion}
              onChange={handleChange}
              className="input-style w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.tipoInstitucion}
            </label>
            <select
              name="tipoInstitucion"
              value={form.tipoInstitucion}
              onChange={handleChange}
              className="input-style w-full"
            >
              <option value="">{t.seleccionaOpcion}</option>
              <option value="NACIONAL">{t.opcionNacional}</option>
              <option value="EXTRANJERA">{t.opcionExtranjera}</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.nivelUno}
            </label>
            <input
              type="text"
              name="tipoInstitucionNivelUno"
              value={form.tipoInstitucionNivelUno}
              onChange={handleChange}
              placeholder="Ej. Educación superior"
              className="input-style w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.nivelDos}
            </label>
            <input
              type="text"
              name="tipoInstitucionNivelDos"
              value={form.tipoInstitucionNivelDos}
              onChange={handleChange}
              placeholder="Ej. Universidad"
              className="input-style w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.nivelTres}
            </label>
            <input
              type="text"
              name="tipoInstitucionNivelTres"
              value={form.tipoInstitucionNivelTres}
              onChange={handleChange}
              placeholder="Ej. Pública, Privada, etc."
              className="input-style w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.pais}
            </label>
            <input
              type="text"
              name="pais"
              value={form.pais}
              onChange={handleChange}
              className="input-style w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.entidad}
            </label>
            <input
              type="text"
              name="entidad"
              value={form.entidad}
              onChange={handleChange}
              className="input-style w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.municipio}
            </label>
            <input
              type="text"
              name="municipio"
              value={form.municipio}
              onChange={handleChange}
              className="input-style w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.localidad}
            </label>
            <input
              type="text"
              name="localidad"
              value={form.localidad}
              onChange={handleChange}
              className="input-style w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.institucionPadre}
            </label>
            <input
              type="text"
              name="razonSocial"
              value={form.razonSocial}
              onChange={handleChange}
              className="input-style w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.privada}
            </label>
            <select
              name="privada"
              value={form.privada}
              onChange={handleChange}
              className="input-style w-full"
            >
              <option value="">{t.seleccionaOpcion}</option>
              <option value="SI">{t.opcionSi}</option>
              <option value="NO">{t.opcionNo}</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.poder}
            </label>
            <select
              name="poder"
              value={form.poder}
              onChange={handleChange}
              className="input-style w-full"
            >
              <option value="">{t.seleccionaOpcion}</option>
              {t.opcionesPoder.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.origenInformacion}
            </label>
            <select
              name="origenInformacion"
              value={form.origenInformacion}
              onChange={handleChange}
              className="input-style w-full"
            >
              <option value="">{t.seleccionaOpcion}</option>
              {t.opcionesOrigen.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t.observaciones}
            </label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={3}
              className="input-style w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 p-4 gap-3 sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={onEliminar}
            className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
               
            {idioma === 'es' ? 'Eliminar' : 'Delete'}
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCerrar}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t.cancelar}
            </button>
            <button
              type="button"
              onClick={() => onGuardar(form)}
              className="rounded-md bg-[#13322e] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d2320]"
            >
              {idioma === 'es' ? 'Guardar cambios' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [vista, setVista] = useState<Vista>('alta')
  const [form, setForm] = useState<InstitucionForm>(FORM_INICIAL)
  const [enviado, setEnviado] = useState(false)
  const [idioma, setIdioma] = useState<Idioma>('es')
  const [editando, setEditando] = useState<InstitucionAPI | null>(null)
  const t = TRADUCCIONES[idioma]

  const [institucionesAPI, setInstitucionesAPI] = useState<InstitucionAPI[]>([])
  const [cargandoInstituciones, setCargandoInstituciones] = useState(false)
  const [errorInstituciones, setErrorInstituciones] = useState<string | null>(
    null
  )
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [haySiguiente, setHaySiguiente] = useState(false)
  const [busquedaDebounced, setBusquedaDebounced] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const [filtros, setFiltros] = useState({
    search: '',
    id_pais: null as number | null,
    tipo_institucion: null as string | null,
    tipo_poder: null as string | null,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setBusquedaDebounced(filtros.search)
      setPaginaActual(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [filtros.search])

  useEffect(() => {
    let cancelado = false

    const cargarInstituciones = async () => {
      try {
        setCargandoInstituciones(true)
        setErrorInstituciones(null)

        const data = await obtenerInstituciones({
          page: paginaActual,
          page_size: PAGE_SIZE,
          search: busquedaDebounced,
          id_pais: filtros.id_pais,
          tipo_institucion: filtros.tipo_institucion,
        })

        if (cancelado) return

        setInstitucionesAPI(data.results)
        setTotalRegistros(data.count)
        setTotalPaginas(data.totalPages)
        setHaySiguiente(
          Boolean(data.next) || data.results.length === PAGE_SIZE
        )
      } catch (error) {
        if (cancelado) return
        console.error('Error al cargar instituciones:', error)
        setErrorInstituciones(
          error instanceof Error ? error.message : 'Error al cargar'
        )
      } finally {
        if (!cancelado) setCargandoInstituciones(false)
      }
    }

    cargarInstituciones()

    return () => {
      cancelado = true
    }
  }, [
    paginaActual,
    busquedaDebounced,
    filtros.id_pais,
    filtros.tipo_institucion,
    refreshTrigger,
  ])

  useEffect(() => {
    if (form.tipoInstitucion === 'EXTRANJERA') {
      setForm((prev) => ({
        ...prev,
        entidad: '',
        municipio: '',
        localidad: '',
      }))
    }
  }, [form.tipoInstitucion])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const bloqueado = form.tipoInstitucion === 'EXTRANJERA'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const CAMPOS_EXCLUIDOS = [
      'correo',
      'tipoInstitucionNivelUno',
      'tipoInstitucionNivelDos',
      'tipoInstitucionNivelTres',
    ]
    const formFinal = Object.fromEntries(
      Object.entries(form).map(([key, value]) => {
        if (typeof value !== 'string') return [key, value]
        if (CAMPOS_EXCLUIDOS.includes(key)) return [key, value]
        return [key, normalizarMayus(value)]
      })
    ) as InstitucionForm


    const idPais = obtenerIdPais(formFinal.pais) ?? 1

    const payload = {
      desc_institucion: formFinal.nombreInstitucion,
      cve_institucion: `INST-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '')}`,
      cve_peoplesoft: '',
      tipo_institucion: formFinal.tipoInstitucion || '',
      id_tipo_institucion: formFinal.tipoInstitucion === 'NACIONAL' ? 1 : 2,
      id_pais: idPais,
      id_entidad_ubicacion: null,
      id_entidad: Number(formFinal.entidad) || null,
      id_municipio: Number(formFinal.municipio) || null,
      id_localidad: Number(formFinal.localidad) || null,
      id_institucion_padre: formFinal.razonSocial
        ? Number(formFinal.razonSocial)
        : null,
      id_tipo_inst_nivel_uno: formFinal.tipoInstitucionNivelUno ? 1 : null,
      id_tipo_inst_nivel_dos: formFinal.tipoInstitucionNivelDos ? 1 : null,
      id_tipo_inst_nivel_tres: formFinal.tipoInstitucionNivelTres ? 1 : null,
      ind_empresa: formFinal.privada === 'SI' ? '1' : '0',
      origen_informacion: formFinal.origenInformacion || null,
      observaciones: formFinal.observaciones || '',
      tipo_poder: formFinal.poder || '',
      ind_inst_superior: 'N',
    }

    try {
      setEnviado(true)

      const nuevaAPI = await crearInstitucion(payload)
      console.log('Institución guardada en API:', nuevaAPI)

      setPaginaActual(1)
      setBusquedaDebounced('')
      setFiltros({
        search: '',
        id_pais: null,
        tipo_institucion: null,
        tipo_poder: null,
      })
      setRefreshTrigger((prev) => prev + 1)
      setVista('lista')

      setForm(FORM_INICIAL)
    } catch (error) {
      console.error('Error al guardar en API:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Error al guardar la institución'
      )
      setEnviado(false)
    }
  }

  const handleEditar = (institucion: InstitucionAPI) => {
    setEditando(institucion)
  }

  const handleCerrarModal = () => {
    setEditando(null)
  }

  const handleGuardarEdicion = async (formEdicion: InstitucionForm) => {
    if (!editando) return

    const cambios: CambiosInstitucion = {}

    if (formEdicion.nombreInstitucion !== editando.desc_institucion) {
      cambios.desc_institucion = formEdicion.nombreInstitucion
    }

    if (formEdicion.tipoInstitucion !== (editando.tipo_institucion ?? '')) {
      cambios.tipo_institucion = formEdicion.tipoInstitucion
      cambios.id_tipo_institucion =
        formEdicion.tipoInstitucion === 'NACIONAL' ? 1 : 2
    }










    if (formEdicion.entidad !== (editando.entidad_nombre ?? '')) {
      const idEntidad = obtenerIdEntidad(formEdicion.entidad)
      if (idEntidad === null) {
        alert(
          idioma === 'es'
            ? 'La entidad no es válida.'
            : 'Country is not valid.'
        )
        return
      }
      cambios.id_entidad = idEntidad
    }






    if (formEdicion.pais !== (editando.pais_nombre ?? '')) {
      const idPais = obtenerIdPais(formEdicion.pais)
      if (idPais === null) {
        alert(
          idioma === 'es'
            ? 'El país no es válido.'
            : 'Country is not valid.'
        )
        return
      }
      cambios.id_pais = idPais
    }

    const eraPrivada =
      editando.ind_empresa === '1' || editando.ind_empresa === 'S'
    if ((formEdicion.privada === 'SI') !== eraPrivada) {
      cambios.ind_empresa = formEdicion.privada === 'SI' ? '1' : '0'
    }

    if (formEdicion.poder !== (editando.tipo_poder ?? '')) {
      cambios.tipo_poder = formEdicion.poder || null
    }

    if (
      formEdicion.origenInformacion !==
      (editando.origen_informacion ?? '')
    ) {
      cambios.origen_informacion = formEdicion.origenInformacion || null
    }

    if (Object.keys(cambios).length === 0) {
      setEditando(null)
      return
    }

    try {
      await actualizarInstitucion(editando.id_institucion, cambios)
      setInstitucionesAPI((prev) =>
        prev.map((i) =>
          i.id_institucion === editando.id_institucion
            ? { ...i, ...cambios }
            : i
        )
      )
      setEditando(null)
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      console.error('Error al actualizar:', error)
      alert(error instanceof Error ? error.message : 'Error al actualizar')
    }
  }

  const handleEliminarDesdeModal = async () => {
    if (!editando) return

    const confirmar = window.confirm(
      idioma === 'es'
        ? '¿Estás seguro de que quieres eliminar esta institución?'
        : 'Are you sure you want to delete this institution?'
    )
    if (!confirmar) return

    try {
      await eliminarInstitucion(editando.id_institucion)
      console.log('Institución eliminada')

      setEditando(null)
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      console.error('Error al eliminar:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar')
    }
  }

  return (
    <Layout
      t={t}
      vista={vista}
      totalRegistradas={totalRegistros}
      onCambiarIdioma={() =>
        setIdioma((prev) => (prev === 'es' ? 'en' : 'es'))
      }
      onIrAlta={() => setVista('alta')}
      onIrLista={() => setVista('lista')}
    >
      {vista === 'lista' ? (
        <ListaInstituciones
          institucionesAPI={institucionesAPI}
          cargando={cargandoInstituciones}
          error={errorInstituciones}
          t={t}
          idioma={idioma}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          haySiguiente={haySiguiente}
          onCambiarPagina={setPaginaActual}
          filtros={filtros}
          setFiltros={setFiltros}
          onEditar={handleEditar}
        />
      ) : (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-[#9d2449] uppercase">
                      {t.registroTitulo}
                    </span>
                    <h2 className="text-2xl font-semibold text-[#13322e] leading-tight">
                      {t.altaTitulo}
                    </h2>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-6">
                {t.altaSubtitulo}
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
                      {t.nombreInstitucion}{' '}
                      <span className="text-[#9d2449]">*</span>
                    </label>
                    <input
                      id="nombreInstitucion"
                      name="nombreInstitucion"
                      type="text"
                      placeholder={t.phNombreInstitucion}
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
                      {t.tipoInstitucion}{' '}
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
                      <option value="">{t.seleccionaOpcion}</option>
                      <option value="NACIONAL">{t.opcionNacional}</option>
                      <option value="EXTRANJERA">{t.opcionExtranjera}</option>
                    </select>
                  </div>

                  <NivelesAcordeon form={form} setForm={setForm} t={t} />

                  <div className="space-y-1.5">
                    <label
                      htmlFor="pais"
                      className="text-sm font-medium text-slate-700"
                    >
                      {t.pais} <span className="text-[#9d2449]">*</span>
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
                      {t.entidad}{' '}
                      <span className="text-slate-400">{t.opcional}</span>
                    </label>
                    {bloqueado ? (
                      <input
                        id="entidad"
                        name="entidad"
                        type="text"
                        placeholder={t.phEntidad}
                        value=""
                        disabled
                        className="input-style opacity-50 cursor-not-allowed"
                      />
                    ) : form.pais === 'México' ? (
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
                        placeholder={t.phEntidad}
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
                      {t.municipio}{' '}
                      <span className="text-slate-400">{t.opcional}</span>
                    </label>
                    <input
                      id="municipio"
                      name="municipio"
                      type="text"
                      placeholder={t.phMunicipio}
                      value={bloqueado ? '' : form.municipio}
                      onChange={handleChange}
                      disabled={bloqueado}
                      className={`input-style ${
                        bloqueado ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="localidad"
                      className="text-sm font-medium text-slate-700"
                    >
                      {t.localidad}{' '}
                      <span className="text-slate-400">{t.opcional}</span>
                    </label>
                    <input
                      id="localidad"
                      name="localidad"
                      type="text"
                      placeholder={t.phLocalidad}
                      value={bloqueado ? '' : form.localidad}
                      onChange={handleChange}
                      disabled={bloqueado}
                      className={`input-style ${
                        bloqueado ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="razonSocial"
                      className="text-sm font-medium text-slate-700"
                    >
                      {t.institucionPadre}{' '}
                      <span className="text-slate-400">{t.opcional}</span>
                    </label>
                    <input
                      id="razonSocial"
                      name="razonSocial"
                      type="text"
                      placeholder={t.phInstitucionPadre}
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
                      {t.privada} <span className="text-[#9d2449]">*</span>
                    </label>
                    <select
                      id="privada"
                      name="privada"
                      value={form.privada}
                      onChange={handleChange}
                      required
                      className="input-style"
                    >
                      <option value="">{t.seleccionaOpcion}</option>
                      <option value="SI">{t.opcionSi}</option>
                      <option value="NO">{t.opcionNo}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="nombre"
                      className="text-sm font-medium text-slate-700"
                    >
                      {t.nombre} <span className="text-[#9d2449]">*</span>
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      placeholder={t.phNombre}
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
                      {t.correo} <span className="text-[#9d2449]">*</span>
                    </label>
                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      placeholder={t.phCorreo}
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
                      {t.observaciones}
                      <span className="text-slate-400">{t.opcional}</span>
                    </label>
                    <textarea
                      id="observaciones"
                      name="observaciones"
                      placeholder={t.phObservaciones}
                      value={form.observaciones}
                      onChange={handleChange}
                      rows={3}
                      className="input-style"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="poder"
                      className="text-sm font-medium text-slate-700"
                    >
                      {t.poder} <span className="text-[#9d2449]">*</span>
                    </label>
                    <select
                      id="poder"
                      name="poder"
                      value={
                        t.opcionesPoder.includes(form.poder)
                          ? form.poder
                          : form.poder
                            ? 'Otro'
                            : ''
                      }
                      onChange={handleChange}
                      required
                      className="input-style"
                    >
                      <option value="">{t.seleccionaOpcion}</option>
                      {t.opcionesPoder.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>

                    {(form.poder === 'Otro' ||
                      (!t.opcionesPoder.includes(form.poder) &&
                        form.poder !== '')) && (
                      <input
                        type="text"
                        name="poder"
                        placeholder={
                          idioma === 'es'
                            ? 'Escribe el poder'
                            : 'Write the power'
                        }
                        value={
                          t.opcionesPoder.includes(form.poder)
                            ? ''
                            : form.poder
                        }
                        onChange={handleChange}
                        autoFocus
                        className="input-style w-full mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="origenInformacion"
                      className="text-sm font-medium text-slate-700"
                    >
                      {t.origenInformacion}{' '}
                      <span className="text-[#9d2449]">*</span>
                    </label>
                    <select
                      id="origenInformacion"
                      name="origenInformacion"
                      value={
                        t.opcionesOrigen.includes(form.origenInformacion)
                          ? form.origenInformacion
                          : form.origenInformacion
                            ? 'Otro'
                            : ''
                      }
                      onChange={handleChange}
                      required
                      className="input-style"
                    >
                      <option value="">{t.seleccionaOpcion}</option>
                      {t.opcionesOrigen.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>

                    {(form.origenInformacion === 'Otro' ||
                      (!t.opcionesOrigen.includes(form.origenInformacion) &&
                        form.origenInformacion !== '')) && (
                      <input
                        type="text"
                        name="origenInformacion"
                        placeholder={
                          idioma === 'es'
                            ? 'Escribe el origen de información'
                            : 'Write the information source'
                        }
                        value={
                          t.opcionesOrigen.includes(form.origenInformacion)
                            ? ''
                            : form.origenInformacion
                        }
                        onChange={handleChange}
                        autoFocus
                        className="input-style w-full mt-2"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    {t.obligatorios}{' '}
                    <span className="text-[#9d2449]">*</span>{' '}
                    {t.obligatoriosSufijo}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449]"
                    >
                      {t.cancelar}
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md bg-[#13322e] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#0d2320] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449]"
                    >
                      {t.guardar}
                    </button>
                  </div>
                </div>
              </form>

              {enviado && (
                <div className="mt-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800 flex items-center justify-between gap-3">
                  <span>{t.registradaOk}</span>
                  <button
                    type="button"
                    onClick={() => setVista('lista')}
                    className="text-[#13322e] font-medium underline text-xs"
                  >
                    {t.verRegistradas}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editando && (
        <ModalEditar
          institucion={editando}
          t={t}
          idioma={idioma}
          onCerrar={handleCerrarModal}
          onGuardar={handleGuardarEdicion}
          onEliminar={handleEliminarDesdeModal}
        />
      )}
    </Layout>
  )
}

export default App