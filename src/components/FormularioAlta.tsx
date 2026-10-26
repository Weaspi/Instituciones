import { useState, useMemo, useEffect, useRef, ChangeEvent } from 'react'
import { PAISES } from '../data/paises'
import { ESTADOS_MEXICO } from '../data/estados'
import { TRADUCCIONES, type Traduccion } from '../i18n/traducciones'

export type InstitucionForm = {
  nombreInstitucion: string
  tipoInstitucion: string
  tipoInstitucionNivelUno: string
  tipoInstitucionNivelDos: string
  pais: string
  entidad: string
  municipio: string
  localidad: string
  razonSocial: string
  privada: string
  nombre: string
  correo: string
  observaciones: string
  origenInformacion: string
}

export const FORM_INICIAL: InstitucionForm = {
  nombreInstitucion: '', 
  tipoInstitucion: '', 
  tipoInstitucionNivelUno: '', 
  tipoInstitucionNivelDos: '',
  pais: '', 
  entidad: '', 
  municipio: '', 
  localidad: '', 
  razonSocial: '', 
  privada: '', 
  nombre: '', 
  correo: '', 
  observaciones: '', 
  origenInformacion: '',
}

export const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

function EntidadAutocomplete({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [abierto, setAbierto] = useState(false)
  const [resaltado, setResaltado] = useState(0)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const filtrados = useMemo(() => { const q = normalizar(value); if (!q) return ESTADOS_MEXICO; return ESTADOS_MEXICO.filter((e) => normalizar(e).includes(q)) }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) setAbierto(false) }
    document.addEventListener('mousedown', handler); return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!abierto && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { setAbierto(true); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setResaltado((r) => Math.min(r + 1, filtrados.length - 1)) } 
    else if (e.key === 'ArrowUp') { e.preventDefault(); setResaltado((r) => Math.max(r - 1, 0)) } 
    else if (e.key === 'Enter') { if (abierto && filtrados[resaltado]) { e.preventDefault(); onChange(filtrados[resaltado]); setAbierto(false) } } 
    else if (e.key === 'Escape') setAbierto(false)
  }

  return (
    <div ref={contenedorRef} className="relative">
      <input id="entidad" name="entidad" type="text" placeholder="Escribe para buscar el estado..." value={value} onChange={(e) => { onChange(e.target.value); setAbierto(true); setResaltado(0) }} onFocus={() => setAbierto(true)} onKeyDown={handleKeyDown} autoComplete="off" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#5c0a2e] focus:ring-[#5c0a2e]" />
      {abierto && filtrados.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {filtrados.slice(0, 50).map((est, i) => (
            <li key={est} onMouseDown={(e) => { e.preventDefault(); onChange(est); setAbierto(false) }} onMouseEnter={() => setResaltado(i)} className={`cursor-pointer px-3 py-2 text-sm ${i === resaltado ? 'bg-[#5c0a2e] text-white' : 'text-gray-700'}`}>{est}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
function PaisAutocomplete({ value, onChange, bloqueado }: { value: string, onChange: (v: string) => void, bloqueado?: boolean }) {
  const [abierto, setAbierto] = useState(false) 
  const [resaltado, setResaltado] = useState(0)
  const [texto, setTexto] = useState(value)
  const contenedorRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setTexto(value)
  }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => { 
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) setAbierto(false) 
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtrados = useMemo(() => { 
    const q = normalizar(texto); 
    if (!q) return PAISES; 
    return PAISES.filter((p) => normalizar(p).includes(q)) 
  }, [texto])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!abierto && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { setAbierto(true); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setResaltado((r) => Math.min(r + 1, filtrados.length - 1)) } 
    else if (e.key === 'ArrowUp') { e.preventDefault(); setResaltado((r) => Math.max(r - 1, 0)) } 
    else if (e.key === 'Enter') { 
      if (abierto && filtrados[resaltado]) { 
        e.preventDefault(); 
        onChange(filtrados[resaltado]); 
        setTexto(filtrados[resaltado]); 
        setAbierto(false)
      } 
    } 
    else if (e.key === 'Escape') setAbierto(false)
  }

  return (
    <div ref={contenedorRef} className="relative">
      <input 
      id="pais" 
      name="pais" 
      type="text" 
      placeholder="Escribe para buscar tu país..." 
      value={texto} 
      onChange={(e) => { 
        setTexto(e.target.value); 
        onChange(e.target.value); 
        setAbierto(true); 
        setResaltado(0) }} 

      onFocus={() => setAbierto(true)} 
      onKeyDown={handleKeyDown} 
      required 
      autoComplete="off" 
      disabled={bloqueado} 
        className={`w-full rounded-md shadow-sm p-2 border focus:border-[#5c0a2e] focus:ring-[#5c0a2e] ${
          bloqueado ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300'
        }`} 
      />
     {abierto && filtrados.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {filtrados.slice(0, 50).map((p, i) => (
            <li key={p} onMouseDown={(e) => { 
              e.preventDefault(); 
              setTexto(p);
              onChange(p); 
              setAbierto(false) 
            }} onMouseEnter={() => setResaltado(i)} className={`cursor-pointer px-3 py-2 text-sm ${i === resaltado ? 'bg-[#5c0a2e] text-white' : 'text-gray-700'}`}>{p}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function NivelConOpciones({ form, setForm, name, opciones, t }: { form: InstitucionForm, setForm: any, name: 'tipoInstitucionNivelUno' | 'tipoInstitucionNivelDos', opciones: readonly string[], t: Traduccion }) {
  const valorActual = form[name]
  const otra = t === TRADUCCIONES.en ? 'Other' : 'Otro'
  const opcionInicial = opciones.includes(valorActual) ? valorActual : valorActual ? otra : ''
  const [opcion, setOpcion] = useState<string>(opcionInicial)
  const [otroTexto, setOtroTexto] = useState(opcionInicial === otra ? valorActual : '')

  const aplicar = (op: string, textoOtro: string) => { setForm((prev: any) => ({ ...prev, [name]: op === otra ? textoOtro : op })) }
  const handleOpcionClick = (op: string) => { setOpcion(op); if (op === otra) aplicar(otra, otroTexto); else { setOtroTexto(''); aplicar(op, '') } }
  const handleOtroChange = (texto: string) => { setOtroTexto(texto); aplicar(otra, texto) }

  return (
    <div className="px-4 pb-4 space-y-3">
      <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr><th className="text-left font-medium px-3 py-2">{t.tablaTipo}</th><th className="text-left font-medium px-3 py-2 w-24">{t.tablaSeleccion}</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {opciones.map((op) => {
              const activa = opcion === op
              return (
                <tr key={op} onClick={() => handleOpcionClick(op)} className={`cursor-pointer transition-colors ${activa ? 'bg-[#5c0a2e]/5' : 'hover:bg-gray-50'}`}>
                  <td className="px-3 py-2 text-gray-700">{op}</td>
                  <td className="px-3 py-2"><span className={`inline-flex items-center justify-center w-5 h-5 rounded-full border-2 ${activa ? 'border-[#5c0a2e] bg-[#5c0a2e]' : 'border-gray-300'}`}>{activa && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {opcion === otra && (
        <div className="space-y-1.5 pt-2">
          <label htmlFor={`otro-${name}`} className="text-xs font-medium text-gray-600">{t.especificaTipo}</label>
          <input id={`otro-${name}`} type="text" placeholder={t.phOtroTipo} value={otroTexto} onChange={(e) => handleOtroChange(e.target.value)} autoFocus className="w-full border-gray-300 rounded-md p-2 border" />
        </div>
      )}
    </div>
  )
}

function NivelesAcordeon({ form, setForm, t }: { form: InstitucionForm, setForm: any, t: Traduccion }) {
  const [abierto, setAbierto] = useState<string | null>(null)
  const toggle = (key: string) => setAbierto((prev) => (prev === key ? null : key))

  const HeaderNivel = ({ nivelKey, label }: { nivelKey: string, label: string }) => {
    const activo = abierto === nivelKey
    const tieneValor = (form as any)[nivelKey].trim().length > 0
    return (
      <button type="button" onClick={() => toggle(nivelKey)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${tieneValor ? 'bg-[#5c0a2e] text-white' : 'bg-gray-200 text-gray-600'}`}>{tieneValor ? '✓' : '·'}</span>
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {tieneValor && !activo && <span className="text-xs text-gray-400 truncate max-w-50">— {(form as any)[nivelKey]}</span>}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform ${activo ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
      </button>
    )
  }

  return (
    <div className="md:col-span-3 rounded-lg border border-gray-200 bg-gray-50/50 mt-2">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-[#5c0a2e]">{t.nivelesTitulo} <span className="text-[#9d2449]">*</span></h3>
        <p className="text-xs text-gray-500 mt-0.5">{t.nivelesSubtitulo}</p>
      </div>
      <ul className="divide-y divide-gray-200">
        <li>
          <HeaderNivel nivelKey="tipoInstitucionNivelUno" label={t.nivelUno} />
          {abierto === 'tipoInstitucionNivelUno' && <NivelConOpciones form={form} setForm={setForm} name="tipoInstitucionNivelUno" opciones={t.opcionesNivelUno} t={t} />}
        </li>
        <li>
          <HeaderNivel nivelKey="tipoInstitucionNivelDos" label={t.nivelDos} />
          {abierto === 'tipoInstitucionNivelDos' && <NivelConOpciones form={form} setForm={setForm} name="tipoInstitucionNivelDos" opciones={t.opcionesNivelDos} t={t} />}
        </li>
      </ul>
    </div>
  )
}

export function FormularioAlta(
  { form, 
  setForm, 
  handleSubmit, 
  handleChange, 
  bloqueado, 
  enviado, 
  setVista, 
  t }: any) {
  const [paso, setPaso] = useState(1)

  return (
    <div className="w-full bg-white flex flex-col md:flex-row min-h-screen">
      
     <aside className="w-full md:w-64 bg-[var(--pverde700)] text-white p-6 hidden md:flex flex-col">
        <nav className="space-y-4">
          <button type="button" onClick={() => setPaso(1)} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${paso === 1 ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`}>1. Datos generales</button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 bg-white">
           
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t.altaTitulo}
          </h1>
          <button onClick={() => setVista('lista')} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2">
            ← Guardar y salir
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-8">{t.altaSubtitulo}</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          

          {paso === 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Datos de la institución</h3>
                <p className="text-sm text-gray-500">Información principal para identificar la institución.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">{t.nombreInstitucion} <span className="text-red-500">*</span></label>
                  <input name="nombreInstitucion" type="text" placeholder={t.phNombreInstitucion} value={form.nombreInstitucion} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#5c0a2e] focus:ring-[#5c0a2e]" />
                </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">{t.tipoInstitucion} <span className="text-red-500">*</span></label>
                <select 
                  name="tipoInstitucion" 
                  value={form.tipoInstitucion} 
                  onChange={handleChange} 
                  required 
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#5c0a2e] focus:ring-[#5c0a2e]"
                >
                  <option value="">{t.seleccionaOpcion}</option>
                  <option value="NACIONAL">{t.opcionNacional}</option>
                  <option value="EXTRANJERA">{t.opcionExtranjera}</option>
                </select>
              </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">{t.privada} <span className="text-red-500">*</span></label>
                  <select name="privada" value={form.privada} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#5c0a2e] focus:ring-[#5c0a2e]">
                    <option value="">{t.seleccionaOpcion}</option>
                    <option value="SI">{t.opcionSi}</option>
                    <option value="NO">{t.opcionNo}</option>
                  </select>
                </div>
                

                <div className="space-y-1.5 md:col-span-3">
                  <NivelesAcordeon form={form} setForm={setForm} t={t} />
                </div>
              </div>
            </div>
          )}

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
               <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Ubicación</h3>
                <p className="text-sm text-gray-500">Domicilio de la institución.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">{t.pais} <span className="text-red-500">*</span></label>
                  <PaisAutocomplete 
                    value={form.pais} 
                    onChange={(v) => setForm((prev: any) => ({ ...prev, pais: v }))} 
                    bloqueado={form.tipoInstitucion === 'NACIONAL'}
                  />
                </div>


            {/* ENTIDAD_BLOQUEO */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">{t.entidad} <span className="text-gray-400">(Opcional)</span></label>
                <input 
                  name="entidad" 
                  type="text" 
                  placeholder={t.phEntidad} 
                  value={bloqueado ? '' : form.entidad} 
                  onChange={handleChange} 
                  disabled={bloqueado} 
                  className={`w-full rounded-md p-2 border focus:border-[#5c0a2e] ${
                    bloqueado ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300'
                  }`} 
                />
              </div>


              {/* MUNICIPIO_BLOQUEO */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">{t.municipio} <span className="text-gray-400">(Opcional)</span></label>
                <input 
                  name="municipio" 
                  type="text" 
                  placeholder={t.phMunicipio} 
                  value={bloqueado ? '' : form.municipio} 
                  onChange={handleChange} 
                  disabled={bloqueado} 
                  className={`w-full rounded-md p-2 border focus:border-[#5c0a2e] ${
                    bloqueado ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300'
                  }`} 
                />
              </div>

              {/* LOCALIDAD_BLOQUEO */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">{t.localidad} <span className="text-gray-400">(Opcional)</span></label>
                <input 
                  name="localidad" 
                  type="text" 
                  placeholder={t.phLocalidad} 
                  value={bloqueado ? '' : form.localidad} 
                  onChange={handleChange} 
                  disabled={bloqueado} 
                  className={`w-full rounded-md p-2 border focus:border-[#5c0a2e] ${
                    bloqueado ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300'
                  }`} 
                />
              </div>
              </div>
            </div>
          

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
               <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Contacto y detalles</h3>
                <p className="text-sm text-gray-500">Información del responsable y clasificación.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">{t.institucionPadre} <span className="text-gray-400">(Opcional)</span></label>
                  <input name="razonSocial" type="text" placeholder={t.phInstitucionPadre} value={form.razonSocial} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2 border focus:border-[#5c0a2e]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">{t.nombre} <span className="text-red-500">*</span></label>
                  <input name="nombre" type="text" placeholder={t.phNombre} value={form.nombre} onChange={handleChange} required className="w-full border-gray-300 rounded-md p-2 border focus:border-[#5c0a2e]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">{t.correo} <span className="text-red-500">*</span></label>
                  <input name="correo" type="email" placeholder={t.phCorreo} value={form.correo} onChange={handleChange} required className="w-full border-gray-300 rounded-md p-2 border focus:border-[#5c0a2e]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    {t.origenInformacion} <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="origenInformacion" 
                    value={form.origenInformacion}
                    onChange={handleChange} 
                    required 
                    className="w-full border-gray-300 rounded-md p-2 border focus:border-[#5c0a2e] focus:ring-[#5c0a2e]"
                  >
                    <option value="">{t.seleccionaOpcion}</option>
                    {t.opcionesOrigen.map((op: string) => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">{t.observaciones} <span className="text-gray-400">(Opcional)</span></label>
                  <textarea name="observaciones" placeholder={t.phObservaciones} value={form.observaciones} onChange={handleChange} rows={3} className="w-full border-gray-300 rounded-md p-2 border focus:border-[#5c0a2e]" />
                </div>
              </div>
            </div>
          

          {/* BOTONES DE NAVEGACIÓN */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-200">
            <div>
              {paso > 1 && (
                <button type="button" onClick={() => setPaso(paso - 1)} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">
                  ← Volver
                </button>
              )}
            </div>
            <div>
                <button type="submit" className="px-6 py-2 bg-[#5c0a2e] text-white rounded-md font-medium hover:bg-[#4a0825] flex items-center gap-2">
                  {t.guardar}
                </button>
              
            </div>
          </div>

        </form>

        {enviado && (
          <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-md text-green-800 flex justify-between items-center">
            <span>{t.registradaOk}</span>
            <button type="button" onClick={() => setVista('lista')} className="font-semibold underline text-sm">Ver registradas</button>
          </div>
        )}
      </main>
    </div>
  )
}

export function ModalEditar({ institucion, t, idioma, onCerrar, onGuardar, onEliminar }: any) {
  const [form, setForm] = useState<InstitucionForm>({
    nombreInstitucion: institucion.desc_institucion,
    tipoInstitucion: institucion.tipo_institucion ?? '',
    tipoInstitucionNivelUno: institucion.nivel_uno_nombre ?? '',
    tipoInstitucionNivelDos: institucion.nivel_dos_nombre ?? '',
    pais: institucion.pais_nombre ?? '',
    entidad: institucion.entidad_nombre ?? '',
    municipio: institucion.municipio_nombre ?? '',
    localidad: institucion.localidad_nombre ?? '',
    razonSocial: String(institucion.id_institucion_padre ?? ''),
    privada: institucion.ind_empresa === '1' || institucion.ind_empresa === 'S' ? 'SI' : 'NO',

    nombre: '', correo: '', observaciones: '', origenInformacion: institucion.origen_informacion ?? '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-[#13322e]">{idioma === 'es' ? 'Editar institución' : 'Edit institution'}</h2>
          <button onClick={onCerrar} className="text-slate-400 text-2xl">×</button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t.nombreInstitucion}</label>
            <input type="text" name="nombreInstitucion" value={form.nombreInstitucion} onChange={handleChange} className="input-style w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t.tipoInstitucion}</label>
            <select name="tipoInstitucion" value={form.tipoInstitucion} onChange={handleChange} className="input-style w-full">
              <option value="">{t.seleccionaOpcion}</option>
              <option value="NACIONAL">{t.opcionNacional}</option>
              <option value="EXTRANJERA">{t.opcionExtranjera}</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t.nivelUno}</label>
            <input type="text" name="tipoInstitucionNivelUno" value={form.tipoInstitucionNivelUno} onChange={handleChange} className="input-style w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t.nivelDos}</label>
            <input type="text" name="tipoInstitucionNivelDos" value={form.tipoInstitucionNivelDos} onChange={handleChange} className="input-style w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t.pais}</label>
            <input type="text" name="pais" value={form.pais} onChange={handleChange} className="input-style w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t.entidad}</label>
            <input type="text" name="entidad" value={form.entidad} onChange={handleChange} className="input-style w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t.municipio}</label>
            <input type="text" name="municipio" value={form.municipio} onChange={handleChange} className="input-style w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t.localidad}</label>
            <input type="text" name="localidad" value={form.localidad} onChange={handleChange} className="input-style w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t.institucionPadre}</label>
            <input type="text" name="razonSocial" value={form.razonSocial} onChange={handleChange} className="input-style w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t.privada}</label>
            <select name="privada" value={form.privada} onChange={handleChange} className="input-style w-full">
              <option value="">{t.seleccionaOpcion}</option>
              <option value="SI">{t.opcionSi}</option>
              <option value="NO">{t.opcionNo}</option>
            </select>
          </div>
          
<div className="space-y-1.5">
  <label className="text-sm font-medium text-gray-700">{t.origenInformacion} <span className="text-red-500">*</span></label>
  <select 
    name="origenInformacion" 
    value={form.origenInformacion} 
    onChange={handleChange} 
    
    required 
    className="w-full border-gray-300 rounded-md p-2 border focus:border-[#5c0a2e]"
  >
    <option value="">{t.seleccionaOpcion}</option>
    {t.opcionesOrigen.map((op: string) => <option key={op} value={op}>{op}</option>)}
  </select>
</div>


          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t.observaciones}</label>
            <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={3} className="input-style w-full" />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 p-4 sticky bottom-0 bg-white">
          <button type="button" onClick={onEliminar} className="text-red-600 text-sm font-medium hover:text-red-800">
            {idioma === 'es' ? 'Eliminar' : 'Delete'}
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={onCerrar} className="border border-slate-300 text-slate-700 px-4 py-2 rounded-md font-medium hover:bg-slate-50">{t.cancelar}</button>
            <button type="button" onClick={() => onGuardar(form)} className="bg-[#13322e] text-white px-4 py-2 rounded-md font-medium hover:bg-[#0d2320]">{idioma === 'es' ? 'Guardar' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}