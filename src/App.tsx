import { useState, ChangeEvent, FormEvent } from 'react'

type InstitucionForm = {
  nombreInstitucion: string
  tipoInstitucion: string
  tipoInstitucionNivelUno: string
  tipoInstitucionNivelDos: string
  tipoInstitucionNivelTres: string
  pais: string
  entidad: string
  id: string
  municipio: string
  localidad: string
  razonSocial: string
  privada: string
  dondeSeCargo: string
  clasificacionEntidad: string
  poder: string
  codigoIdentificacion: string
  fecha1: string
  fecha2: string
  activo: string
  nombre: string
  correo: string
  observaciones: string
}

function App() {
  const [form, setForm] = useState<InstitucionForm>({
    nombreInstitucion: '',
    tipoInstitucion: '',
    tipoInstitucionNivelUno: '',
    tipoInstitucionNivelDos: '',
    tipoInstitucionNivelTres: '',
    pais: '',
    entidad: '',
    id: '',
    municipio: '',
    localidad: '',
    razonSocial: '',
    privada: '',
    dondeSeCargo: '',
    clasificacionEntidad: '',
    poder: '',
    codigoIdentificacion: '',
    fecha1: '',
    fecha2: '',
    activo: '',
    nombre: '',
    correo: '',
    observaciones: ''
  })
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEnviado(true)
    console.log('Institución registrada:', form)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="sticky top-0 w-full h-18 shrink-0 bg-[#13322e] text-white border-b border-[#bc955c]/30 z-1020 shadow-md flex flex-col justify-center">
        <div className="max-w-350 h-full w-full mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/5 rounded border border-[#bc955c]/20 hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#bc955c]"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M17 21v-8.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V21"/></svg>
            </div>
            <h1 className="font-patria text-lg sm:text-xl md:text-[1.9rem] font-normal tracking-wide leading-none whitespace-nowrap">
              Alta de Institución
            </h1>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full relative z-10 flex flex-col">
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#13322e] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M17 21v-8.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V21"/></svg>
                  </span>
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-[#9d2449] uppercase">Registro Institucional</span>
                    <h2 className="text-2xl font-semibold text-[#13322e] leading-tight">Alta de Institución</h2>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-6">
                Datos mínimos para identificar y validar a la institución responsable dentro del catálogo.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="nombreInstitucion" className="text-sm font-medium text-slate-700">
                      Nombre de institución <span className="text-[#9d2449]">*</span>
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
                    <label htmlFor="tipoInstitucion" className="text-sm font-medium text-slate-700">
                      Tipo de institución <span className="text-[#9d2449]">*</span>
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
                      <option value="id_1NACIONAL">id_1NACIONAL</option>
                      <option value="id_2EXTRANJERA">id_2EXTRANJERA</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="tipoInstitucionNivelUno" className="text-sm font-medium text-slate-700">
                      Tipo institución nivel uno
                    </label>
                    <input
                      id="tipoInstitucionNivelUno"
                      name="tipoInstitucionNivelUno"
                      type="text"
                      placeholder="Ej. Educación superior"
                      value={form.tipoInstitucionNivelUno}
                      onChange={handleChange}
                      className="input-style"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="tipoInstitucionNivelDos" className="text-sm font-medium text-slate-700">
                      Tipo institución nivel dos
                    </label>
                    <input
                      id="tipoInstitucionNivelDos"
                      name="tipoInstitucionNivelDos"
                      type="text"
                      placeholder="Ej. Universidad"
                      value={form.tipoInstitucionNivelDos}
                      onChange={handleChange}
                      className="input-style"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="tipoInstitucionNivelTres" className="text-sm font-medium text-slate-700">
                      Tipo institución nivel tres
                    </label>
                    <input
                      id="tipoInstitucionNivelTres"
                      name="tipoInstitucionNivelTres"
                      type="text"
                      placeholder="Ej. Pública, Privada, etc."
                      value={form.tipoInstitucionNivelTres}
                      onChange={handleChange}
                      className="input-style"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="pais" className="text-sm font-medium text-slate-700">
                      País <span className="text-[#9d2449]">*</span>
                    </label>
                    <input
                      id="pais"
                      name="pais"
                      type="text"
                      placeholder="Ej. México"
                      value={form.pais}
                      onChange={handleChange}
                      required
                      className="input-style"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="entidad" className="text-sm font-medium text-slate-700">
                      Entidad
                    </label>
                    <input
                      id="entidad"
                      name="entidad"
                      type="text"
                      placeholder="Ej. Ciudad de México"
                      value={form.entidad}
                      onChange={handleChange}
                      className="input-style"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="id" className="text-sm font-medium text-slate-700">
                      id
                    </label>
                    <input
                      id="id"
                      name="id"
                      type="text"
                      placeholder="Generar o dejar vacío"
                      value={form.id}
                      onChange={handleChange}
                      className="input-style"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="municipio" className="text-sm font-medium text-slate-700">
                      Municipio <span className="text-[#9d2449]">*</span>
                    </label>
                    <input
                      id="municipio"
                      name="municipio"
                      type="text"
                      placeholder="Ej. Benito Juárez"
                      value={form.municipio}
                      onChange={handleChange}
                      required
                      className="input-style"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="localidad" className="text-sm font-medium text-slate-700">
                      Localidad <span className="text-slate-400">(Opcional)</span>
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
                    <label htmlFor="razonSocial" className="text-sm font-medium text-slate-700">
                      Razón social
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
                    <label htmlFor="privada" className="text-sm font-medium text-slate-700">
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
                      <option value="1_si">1_si</option>
                      <option value="0_no">0_no</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="dondeSeCargo" className="text-sm font-medium text-slate-700">
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

                  <div className="space-y-1.5">
                    <label htmlFor="clasificacionEntidad" className="text-sm font-medium text-slate-700">
                      Clasificación de entidad
                    </label>
                    <input
                      id="clasificacionEntidad"
                      name="clasificacionEntidad"
                      type="text"
                      placeholder="Ej. Pública, Privada, Descentralizada"
                      value={form.clasificacionEntidad}
                      onChange={handleChange}
                      className="input-style"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="poder" className="text-sm font-medium text-slate-700">
                      Poder
                    </label>
                    <select
                      id="poder"
                      name="poder"
                      value={form.poder}
                      onChange={handleChange}
                      className="input-style"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Ejecutivo">Ejecutivo</option>
                      <option value="Legislativo">Legislativo</option>
                      <option value="Judicial">Judicial</option>
                      <option value="No aplica">No aplica</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="codigoIdentificacion" className="text-sm font-medium text-slate-700">
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
                    <label htmlFor="fecha1" className="text-sm font-medium text-slate-700">
                      Fecha
                    </label>
                    <input
                      id="fecha1"
                      name="fecha1"
                      type="text"
                      placeholder="Formato numérico o fecha provista"
                      value={form.fecha1}
                      onChange={handleChange}
                      className="input-style"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="fecha2" className="text-sm font-medium text-slate-700">
                      Fecha (segunda)
                    </label>
                    <input
                      id="fecha2"
                      name="fecha2"
                      type="text"
                      placeholder="Formato numérico o fecha provista"
                      value={form.fecha2}
                      onChange={handleChange}
                      className="input-style"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="activo" className="text-sm font-medium text-slate-700">
                      Activo <span className="text-[#9d2449]">*</span>
                    </label>
                    <select
                      id="activo"
                      name="activo"
                      value={form.activo}
                      onChange={handleChange}
                      required
                      className="input-style"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
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
                    <label htmlFor="correo" className="text-sm font-medium text-slate-700">
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
                    <label htmlFor="observaciones" className="text-sm font-medium text-slate-700">
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
                    Los campos marcados con <span className="text-[#9d2449]">*</span> son obligatorios.
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
                <div className="mt-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                  Institución registrada correctamente.
                </div>
              )}
            </div>
          </div>
        </div>
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
