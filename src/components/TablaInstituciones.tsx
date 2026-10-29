import { useMemo } from 'react'
import { type InstitucionAPI } from '../services/instituciones'
import { type Traduccion, type Idioma } from '../i18n/traducciones'
import { type InstitucionForm } from './FormularioAlta'

type InstitucionGuardada = InstitucionForm & {
  _id: string
  fechaRegistro: string
  idNumerico: number
}

export function TablaInstituciones({
  institucionesAPI, 
  cargando, 
  error, 
  t, 
  idioma, 
  paginaActual, 
  totalPaginas, 
  totalRegistros, 
  haySiguiente, 
  onCambiarPagina, 
  filtros, 
  setFiltros, 
  onEditar, 
  pageSize, 
  setPageSize
}: {
  institucionesAPI: InstitucionAPI[]
  cargando: boolean
  error: string | null
  t: Traduccion
  idioma: Idioma
  paginaActual: number
  totalPaginas: number
  totalRegistros: number
  haySiguiente: boolean
  onCambiarPagina: (p: number) => void
  filtros: {
    search: string
    id_pais: number | null
    tipo_institucion: string | null
  }
  setFiltros: React.Dispatch<
    React.SetStateAction<{
      search: string
      id_pais: number | null
      tipo_institucion: string | null
    }>
  >
  onEditar: (institucion: InstitucionAPI) => void
  pageSize: number
  setPageSize: (size: number) => void
}) {
  const filtradas: InstitucionGuardada[] = useMemo(() => {
    return (institucionesAPI ?? []).map((i) => ({
      _id: `api-${i.id_institucion}`,
      idNumerico: i.id_institucion,
      fechaRegistro: '',

      nombreInstitucion: i.desc_institucion,
      tipoInstitucion: i.tipo_institucion ?? '',
      tipoInstitucionNivelUno: i.nivel_uno_nombre ?? '',
      tipoInstitucionNivelDos: i.nivel_dos_nombre ?? '',
      tipoInstitucionNivelTres: i.nivel_tres_nombre ?? '',

      pais: i.pais_nombre ?? '',
      entidad: i.entidad_nombre ?? '',
      municipio: i.municipio_nombre ?? '',
      localidad: i.localidad_nombre ?? '',

      razonSocial: i.id_institucion_padre ? String(i.id_institucion_padre) : '',
      privada: i.ind_empresa ?? '',
      nombre: '',
      correo: '',
      observaciones: '',
      origenInformacion: i.origen_informacion ?? '',
    }))
  }, [institucionesAPI])

  return (
    <div className="w-full bg-[#ffffff] min-h-screen pb-12 pt-8">
      <div className="max-w-[1700px] mx-auto px-4 md:px-8">
        
        <div className="mb-6">
          <span className="text-xs font-semibold tracking-wider text-[#9d2449] uppercase">
            {t.catalogo}
          </span>
          <h2 className="text-[28px] font-semibold text-gray-900 leading-tight font-[var(--font-patria)]">
            {t.listaTitulo}
          </h2>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            
            <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-800 mb-1.5 block">
                  {idioma === 'es' ? 'Buscar institución' : 'Search institution'}
                </label>
                <input
                  type="text"
                  placeholder={t.buscar}
                  value={filtros.search}
                  onChange={(e) => {
                    setFiltros((prev) => ({ ...prev, search: e.target.value }))
                  }}
                  className="w-full border-gray-300 rounded-md p-2.5 border focus:border-[#9d2449] focus:ring-1 focus:ring-[#9d2449] text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800 mb-1.5 block">
                  {idioma === 'es' ? 'País' : 'Country'}
                </label>
                <select
                  value={filtros.id_pais ?? ''}
                  onChange={(e) => {
                    setFiltros((prev) => ({
                      ...prev,
                      id_pais: e.target.value ? Number(e.target.value) : null,
                    }))
                    onCambiarPagina(1)
                  }}
                  className="w-full border-gray-300 rounded-md p-2.5 border focus:border-[#9d2449] focus:ring-1 focus:ring-[#9d2449] text-sm"
                >
                  <option value="">{idioma === 'es' ? 'Todos' : 'All'}</option>T
                  <option value="56">Otro</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800 mb-1.5 block">
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
                  className="w-full border-gray-300 rounded-md p-2.5 border focus:border-[#9d2449] focus:ring-1 focus:ring-[#9d2449] text-sm"
                >
                  <option value="">{idioma === 'es' ? 'Todos' : 'All'}</option>
                  <option value="NACIONAL">{idioma === 'es' ? 'Nacional' : 'National'}</option>
                  <option value="EXTRANJERA">{idioma === 'es' ? 'Extranjera' : 'Foreign'}</option>
                </select>
              </div>
            </div>

            {cargando && (
              <div className="text-center py-12 text-gray-500 text-sm">
                {idioma === 'es' ? 'Cargando instituciones...' : 'Loading institutions...'}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            {filtradas.length === 0 && !cargando ? (
              <div className="text-center py-16 text-gray-500 text-sm">
                {filtros.search || filtros.id_pais || filtros.tipo_institucion
                  ? t.sinCoincidencias
                  : t.sinRegistros}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                      <tr>
                    
                        <th className="px-4 py-3 font-semibold font-[var(--font-patria)]">{t.colNombre}</th>
                        <th className="px-4 py-3 font-semibold font-[var(--font-patria)]">{t.colTipoInstitucion || 'Tipo de Inst.'}</th>
                        <th className="px-4 py-3 font-semibold font-[var(--font-patria)]">{t.colPais}</th>
                        <th className="px-4 py-3 font-semibold font-[var(--font-patria)]">{t.colEntidad}</th>
                        <th className="px-4 py-3 font-semibold font-[var(--font-patria)]">{t.colMunicipio}</th>
                        <th className="px-4 py-3 font-semibold font-[var(--font-patria)]">{t.colInstitucion1 || 'Nivel 1'}</th>
                        <th className="px-4 py-3 font-semibold font-[var(--font-patria)]">{t.colInstitucion2 || 'Nivel 2'}</th>
                        <th className="px-4 py-3 font-semibold text-center font-[var(--font-patria)]">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtradas.map((i) => (
                        <tr key={i._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-medium">{i.nombreInstitucion}</td>
                          <td className="px-4 py-3 text-gray-600">{i.tipoInstitucion || t.guion}</td>
                          <td className="px-4 py-3 text-gray-600">{i.pais}</td>
                          <td className="px-4 py-3 text-gray-600">{i.entidad || t.guion}</td>
                          <td className="px-4 py-3 text-gray-600">{i.municipio || t.guion}</td>
                          <td className="px-4 py-3 text-gray-600">{i.tipoInstitucionNivelUno || t.guion}</td>
                          <td className="px-4 py-3 text-gray-600">{i.tipoInstitucionNivelDos || t.guion}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const original = institucionesAPI.find(
                                  (x) => x.id_institucion === i.idNumerico
                                )
                                if (original) onEditar(original)
                              }}
                              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-[#9d2449] transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#9d2449]"
                            >
                              {idioma === 'es' ? 'Editar' : 'Edit'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      <strong>Total:</strong> {totalRegistros} resultados
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Registros por página:</label>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="border-gray-300 rounded-md p-1 border text-sm focus:border-[#9d2449]"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      disabled={paginaActual <= 1}
                      onClick={() => onCambiarPagina(paginaActual - 1)}
                      className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                    >
                      ← Anterior
                    </button>

                    <span className="text-sm font-medium text-gray-700">
                      Página {paginaActual} 
                    </span>

                    <button
                      type="button"
                      disabled={haySiguiente}
                      onClick={() => onCambiarPagina(paginaActual + 1)}
                      className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}