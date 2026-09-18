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
}

type InstitucionGuardada = InstitucionForm & {
  _id: string
  fechaRegistro: string 
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


type Idioma = 'es' | 'en'

const TRADUCCIONES = {
  es: {
    appTitulo: 'Instituciones',
    navAlta: 'Alta',
    navRegistradas: 'Registradas',
    btnIdioma: 'ES',

    registroTitulo: 'Registro Institucional',
    altaTitulo: 'Alta de Institución',
    altaSubtitulo:
      'Datos mínimos para identificar y validar a la institución responsable dentro del catálogo.',

  
    nombreInstitucion: 'Nombre de institución',
    tipoInstitucion: 'Tipo de institución',
    seleccionaOpcion: 'Selecciona una opción',
    opcionNacional: 'NACIONAL',
    opcionExtranjera: 'EXTRANJERA',
    pais: 'País',
    entidad: 'Entidad',
    municipio: 'Municipio',
    localidad: 'Localidad',
    institucionPadre: 'Institución Padre',
    privada: 'Privada',
    opcionSi: 'SI',
    opcionNo: 'NO',
    poder: 'Poder',
    nombre: 'Nombre',
    correo: 'Correo',
    observaciones: 'Observaciones',
    opcional: '(Opcional)',

    nivelesTitulo: 'Tipo de institución por nivel',
    nivelesSubtitulo:
      'Selecciona 1 de las 3 opciones   ',
    nivelUno: 'Tipo institución nivel uno',
    nivelDos: 'Tipo institución nivel dos',
    nivelTres: 'Tipo institución nivel tres',
    tablaTipo: 'Tipo',
    tablaSeleccion: 'Selección',
    tablaPoder: 'Poder',
    especificaTipo: 'Especifica el tipo',
    especificaPoder: 'Especifica el poder',
    phOtroTipo: 'Escribe el tipo',
    phOtroPoder: 'Ej. Organismo autónomo',
    guardadoEn: 'Este valor se guardará en',

    cancelar: 'Cancelar',
    guardar: 'Guardar institución',
    obligatorios: 'Los campos marcados con',
    obligatoriosSufijo: 'son obligatorios.',
    registradaOk: 'Institución registrada correctamente.',
    verRegistradas: 'Ver registradas',


    catalogo: 'Catálogo',
    listaTitulo: 'Instituciones registradas',
    buscar: 'Buscar por nombre...',
    sinRegistros: 'Aún no hay instituciones registradas.',
    sinCoincidencias: 'No se encontraron coincidencias.',
    colNombre: 'Nombre',
    colPais: 'País',
    colEntidad: 'Entidad',
    colTipo: 'Tipo',
    colResponsable: 'Responsable',
    colCorreo: 'Correo',
    colFechaRegistro: 'Registrado el',
    guion: '—',

    footer: 'Sistema de Registro Institucional',

    phNombreInstitucion: 'Nombre completo de la institución',
    phEntidad: 'Ej. Ciudad de México',
    phMunicipio: 'Ej. Benito Juárez',
    phLocalidad: 'Ej. Lomas de la Selva',
    phInstitucionPadre: 'Ej. Universidad Nacional Autónoma de México',
    phDondeSeCargo: 'Ej. Sistema de información, Oficina de control',
    phCodigo: 'Ej. RFC, clave única, etc.',
    phNombre: 'Nombre de la persona de contacto/responsable',
    phCorreo: 'contacto@institucion.mx',
    phObservaciones: 'Notas u observaciones adicionales',

    opcionesNivelUno: ['Pública', 'Privada', 'Extranjera', 'Otro'],
    opcionesNivelDos: ['Estatal', 'Federal', 'Empresa', 'Otro'],
    opcionesPoder: ['Estatal', 'Federal', 'Municipal', 'Otro'],
  },
  en: {
    appTitulo: 'Institutions',
    navAlta: 'Register',
    navRegistradas: 'Registered',
    btnIdioma: 'EN',

    registroTitulo: 'Institutional Registry',
    altaTitulo: 'Register Institution',
    altaSubtitulo:
      'Minimum data to identify and validate the responsible institution in the catalog.',

    nombreInstitucion: 'Institution name',
    tipoInstitucion: 'Institution type',
    seleccionaOpcion: 'Select an option',
    opcionNacional: 'NATIONAL',
    opcionExtranjera: 'FOREIGN',
    pais: 'Country',
    entidad: 'State',
    municipio: 'Municipality',
    localidad: 'Locality',
    institucionPadre: 'Parent Institution',
    privada: 'Private',
    opcionSi: 'YES',
    opcionNo: 'NO',
    poder: 'Branch',
    nombre: 'Name',
    correo: 'Email',
    observaciones: 'Notes',
    opcional: '(Optional)',

    nivelesTitulo: 'Institution type by level',
    nivelesSubtitulo:
      'Select 1 of the 3 options.',
    nivelUno: 'Institution type level one',
    nivelDos: 'Institution type level two',
    nivelTres: 'Institution type level three',
    tablaTipo: 'Type',
    tablaSeleccion: 'Selection',
    tablaPoder: 'Branch',
    especificaTipo: 'Specify the type',
    especificaPoder: 'Specify the branch',
    phOtroTipo: 'Write the type',
    phOtroPoder: 'E.g. Autonomous body',
    guardadoEn: 'This value will be saved in',

    cancelar: 'Cancel',
    guardar: 'Save institution',
    obligatorios: 'Fields marked with',
    obligatoriosSufijo: 'are required.',
    registradaOk: 'Institution successfully registered.',
    verRegistradas: 'View registered',

    catalogo: 'Catalog',
    listaTitulo: 'Registered institutions',
    buscar: 'Search by name...',
    sinRegistros: 'No institutions registered yet.',
    sinCoincidencias: 'No matches found.',
    colNombre: 'Name',
    colPais: 'Country',
    colEntidad: 'State',
    colTipo: 'Type',
    colResponsable: 'Contact',
    colCorreo: 'Email',
    colFechaRegistro: 'Registered on',
    guion: '—',

    footer: 'Institutional Registry System',

    phNombreInstitucion: 'Full institution name',
    phEntidad: 'E.g. Mexico City',
    phMunicipio: 'E.g. Benito Juárez',
    phLocalidad: 'E.g. Lomas de la Selva',
    phInstitucionPadre: 'E.g. National University',
    phDondeSeCargo: 'E.g. Information system, Control office',
    phCodigo: 'E.g. RFC, unique key, etc.',
    phNombre: 'Contact/responsible person name',
    phCorreo: 'contact@institution.mx',
    phObservaciones: 'Additional notes or observations',

    opcionesNivelUno: ['Public', 'Private', 'Foreign', 'Other'],
    opcionesNivelDos: ['State', 'Federal', 'Company', 'Other'],
    opcionesPoder: ['State', 'Federal', 'Municipal', 'Other'],
  },
} as const

type Traduccion = typeof TRADUCCIONES['es'] | typeof TRADUCCIONES['en']


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

// Poder 
function PoderConOpciones({
  form,
  setForm,
  t,
}: {
  form: InstitucionForm
  setForm: React.Dispatch<React.SetStateAction<InstitucionForm>>
  t: Traduccion
}) {
  const valorActual = form.poder
  const otra = t === TRADUCCIONES.en ? 'Other' : 'Otro'

  const opcionInicial = t.opcionesPoder.includes(valorActual)
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
    setForm((prev) => ({ ...prev, poder: valorFinal }))
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
                {t.tablaPoder}
              </th>
              <th className="text-left font-medium px-3 py-2 w-24">
                {t.tablaSeleccion}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {t.opcionesPoder.map((op) => {
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
            htmlFor="otro-poder"
            className="text-xs font-medium text-slate-600"
          >
            {t.especificaPoder}
          </label>
          <input
            id="otro-poder"
            type="text"
            placeholder={t.phOtroPoder}
            value={otroTexto}
            onChange={(e) => handleOtroChange(e.target.value)}
            autoFocus
            className="input-style w-full"
          />
          <p className="text-xs text-slate-400">
            {t.guardadoEn} <code>poder</code>.
          </p>
        </div>
      )}
    </div>
  )
}

// Acordeón 
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
          {t.nivelesTitulo}
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

// Lista
function ListaInstituciones({
  instituciones,
  t,
  idioma,
}: {
  instituciones: InstitucionGuardada[]
  t: Traduccion
  idioma: 'es' | 'en'
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
                  {t.catalogo}
                </span>
                <h2 className="text-2xl font-semibold text-[#13322e] leading-tight">
                  {t.listaTitulo}
                </h2>
              </div>
            </div>

            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder={t.buscar}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="input-style w-full"
              />
            </div>
          </div>

          {filtradas.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              {instituciones.length === 0
                ? t.sinRegistros
                : t.sinCoincidencias}
            </div>
          ) : (
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
                      {t.colResponsable}
                    </th>
                    <th className="text-left font-medium px-3 py-2">
                      {t.colCorreo}
                    </th>
                    <th className="text-left font-medium px-3 py-2">
                      {t.colFechaRegistro}
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
                      <td className="px-3 py-2 text-slate-600">{i.nombre}</td>
                      <td className="px-3 py-2 text-slate-600">{i.correo}</td>
                      <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                      {new Date(i.fechaRegistro).toLocaleString(idioma === 'es' ? 'es-MX' : 'en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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

//  App 
type Vista = 'alta' | 'lista'

function App() {
  const [vista, setVista] = useState<Vista>('alta')
  const [form, setForm] = useState<InstitucionForm>(FORM_INICIAL)
  const [instituciones, setInstituciones] = useState<InstitucionGuardada[]>([])
  const [enviado, setEnviado] = useState(false)
  const [poderAbierto, setPoderAbierto] = useState(false)
  const [idioma, setIdioma] = useState<Idioma>('es')
  const t = TRADUCCIONES[idioma]
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
  fechaRegistro: new Date().toISOString(),
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
              {t.appTitulo}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setIdioma((prev) => (prev === 'es' ? 'en' : 'es'))
              }
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-white/80 hover:bg-white/10 border border-white/20"
            >
              {t.btnIdioma}
            </button>
            <button
              type="button"
              onClick={() => setVista('alta')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                vista === 'alta'
                  ? 'bg-white text-[#13322e]'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {t.navAlta}
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
              {t.navRegistradas} ({instituciones.length})
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full relative z-10 flex flex-col">
        {vista === 'lista' ? (
          <ListaInstituciones instituciones={instituciones} t={t} idioma={idioma} />
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
                        <option value="NACIONAL">
                          {t.opcionNacional}
                        </option>
                        <option value="EXTRANJERA">
                          {t.opcionExtranjera}
                        </option>
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
                        {t.entidad}
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
                        className={`input-style ${bloqueado ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      className={`input-style ${bloqueado ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        {t.privada}{' '}
                        <span className="text-[#9d2449]">*</span>
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
                            <span className="text-sm font-medium text-slate-700">
                              {t.poder}
                            </span>
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

                        {poderAbierto && (
                          <PoderConOpciones
                            form={form}
                            setForm={setForm}
                            t={t}
                          />
                        )}
                      </div>
                    </div>


                    <div className="space-y-1.5">
                      <label
                        htmlFor="nombre"
                        className="text-sm font-medium text-slate-700"
                      >
                        {t.nombre}{' '}
                        <span className="text-[#9d2449]">*</span>
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
                        {t.correo}{' '}
                        <span className="text-[#9d2449]">*</span>
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
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-slate-500">
          {t.footer}
        </div>
      </footer>
    </div>
  )
}

export default App