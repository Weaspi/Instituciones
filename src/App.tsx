import { useState, ChangeEvent, FormEvent } from 'react'

type InstitucionForm = {
  nombreOficial: string
  siglas: string
  tipoInstitucion: string
  rfc: string
  entidadFederativa: string
  sitioWeb: string
  nombreResponsable: string
  correoContacto: string
  telefonoContacto: string
  descripcionCapacidades: string
}

function App() {
  const [form, setForm] = useState<InstitucionForm>({
    nombreOficial: '',
    siglas: '',
    tipoInstitucion: '',
    rfc: '',
    entidadFederativa: '',
    sitioWeb: '',
    nombreResponsable: '',
    correoContacto: '',
    telefonoContacto: '',
    descripcionCapacidades: ''
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
      <nav className="sticky top-0 w-full h-[72px] shrink-0 bg-[#13322e] text-white border-b border-[#bc955c]/30 z-[1020] shadow-md flex flex-col justify-center">
        <div className="max-w-[1400px] h-full w-full mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/5 rounded border border-[#bc955c]/20 hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#bc955c]"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M17 21v-8.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V21"/></svg>
            </div>
            <h1 className="font-patria text-lg sm:text-xl md:text-[1.9rem] font-normal tracking-wide leading-none whitespace-nowrap">
              Ciencia y Tecnología
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
                    <label htmlFor="nombreOficial" className="text-sm font-medium text-slate-700">
                      Nombre oficial de la institución <span className="text-[#9d2449]">*</span>
                    </label>
                    <input
                      id="nombreOficial"
                      name="nombreOficial"
                      type="text"
                      placeholder="Universidad, centro público o dependencia"
                      value={form.nombreOficial}
                      onChange={handleChange}
                      required
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="siglas" className="text-sm font-medium text-slate-700">
                      Siglas
                    </label>
                    <input
                      id="siglas"
                      name="siglas"
                      type="text"
                      placeholder="UNAM, IPN, CIATEQ"
                      value={form.siglas}
                      onChange={handleChange}
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="publica">Pública</option>
                      <option value="privada">Privada</option>
                      <option value="ong">ONG</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="rfc" className="text-sm font-medium text-slate-700">
                      RFC o identificador institucional
                    </label>
                    <input
                      id="rfc"
                      name="rfc"
                      type="text"
                      placeholder="Opcional para demo"
                      value={form.rfc}
                      onChange={handleChange}
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="entidadFederativa" className="text-sm font-medium text-slate-700">
                      Entidad federativa <span className="text-[#9d2449]">*</span>
                    </label>
                    <input
                      id="entidadFederativa"
                      name="entidadFederativa"
                      type="text"
                      placeholder="Ciudad de México"
                      value={form.entidadFederativa}
                      onChange={handleChange}
                      required
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="sitioWeb" className="text-sm font-medium text-slate-700">
                      Sitio web institucional
                    </label>
                    <input
                      id="sitioWeb"
                      name="sitioWeb"
                      type="url"
                      placeholder="https://..."
                      value={form.sitioWeb}
                      onChange={handleChange}
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="nombreResponsable" className="text-sm font-medium text-slate-700">
                      Nombre de la persona responsable <span className="text-[#9d2449]">*</span>
                    </label>
                    <input
                      id="nombreResponsable"
                      name="nombreResponsable"
                      type="text"
                      placeholder="Nombre completo"
                      value={form.nombreResponsable}
                      onChange={handleChange}
                      required
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="correoContacto" className="text-sm font-medium text-slate-700">
                      Correo de contacto <span className="text-[#9d2449]">*</span>
                    </label>
                    <input
                      id="correoContacto"
                      name="correoContacto"
                      type="email"
                      placeholder="contacto@institucion.mx"
                      value={form.correoContacto}
                      onChange={handleChange}
                      required
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="telefonoContacto" className="text-sm font-medium text-slate-700">
                      Teléfono de contacto
                    </label>
                    <input
                      id="telefonoContacto"
                      name="telefonoContacto"
                      type="tel"
                      placeholder="55 0000 0000"
                      value={form.telefonoContacto}
                      onChange={handleChange}
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="descripcionCapacidades" className="text-sm font-medium text-slate-700">
                    Descripción breve de capacidades
                  </label>
                  <textarea
                    id="descripcionCapacidades"
                    name="descripcionCapacidades"
                    value={form.descripcionCapacidades}
                    onChange={handleChange}
                    rows={3}
                    className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2449] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
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
