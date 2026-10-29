const API_BASE_URL = 'http://172.16.11.17:8000'

export type InstitucionAPI = {
  id_institucion: number
  desc_institucion: string
  id_tipo_institucion: number | null
  tipo_institucion_nombre: string | null
  id_pais: number | null
  pais_nombre: string | null
  id_entidad: number | null
  entidad_nombre: string | null
  id_municipio: number | null
  municipio_nombre: string | null
  id_localidad: number | null
  localidad_nombre: string | null   
  nivel_uno_nombre: string | null
  nivel_dos_nombre: string | null
  nivel_tres_nombre: string | null  
  id_institucion_padre: number | null
  id_entidad_ubicacion: number | null
  cve_institucion: string | null
  ind_empresa: string | null
  origen_informacion: string | null
  tipo_institucion: string | null

  cve_peoplesoft?: string | null
  ind_inst_superior?: string | null
  id_tipo_inst_nivel_uno?: number | null
  id_tipo_inst_nivel_dos?: number | null
  id_tipo_inst_nivel_tres?: number | null
}

export type FiltrosInstituciones = {
  page?: number
  size?: number
  page_size?: number
  search?: string
  id_pais?: number | null
  tipo_institucion?: string | null
}

export type CambiosInstitucion = Partial<{
  desc_institucion: string
  tipo_institucion: string
  id_tipo_institucion: number
  id_pais: number
  id_entidad: number | null
  id_municipio: number | null
  id_localidad: number | null
  id_institucion_padre: number | null
  ind_empresa: string

  origen_informacion: string | null

  id_tipo_inst_nivel_uno?: number | null
  id_tipo_inst_nivel_dos?: number | null
}>

export type CrearInstitucionPayload = {
  desc_institucion: string
  cve_institucion: string
  cve_peoplesoft: string
  tipo_institucion: string
  id_tipo_institucion: number
  id_pais: number
  id_entidad: number | null
  id_entidad_ubicacion: number | null
  id_municipio: number | null
  id_localidad: number | null
  id_institucion_padre: number | null
  id_tipo_inst_nivel_uno: number | null
  id_tipo_inst_nivel_dos: number | null
  ind_empresa: string
  origen_informacion: string | null
  observaciones: string

  ind_inst_superior: string
}

export async function obtenerInstituciones(
  filtros: FiltrosInstituciones = {}
): Promise<{
  count: number
  next: string | null
  previous: string | null
  results: InstitucionAPI[]
  totalPages: number
  currentPage: number
}> {
  const params = new URLSearchParams()
  params.append('page', String(filtros.page ?? 1))
  params.append('size', String(filtros.size ?? 10)) 
  params.append('ordering', '-id_institucion')
  

  if (filtros.search) params.append('desc_institucion', filtros.search)
  if (filtros.id_pais) params.append('id_pais', String(filtros.id_pais))
  if (filtros.tipo_institucion) params.append('tipo_institucion', filtros.tipo_institucion)

  const url = `${API_BASE_URL}/api/v1/instituciones-c/?${params.toString()}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Error al obtener instituciones: ${response.status}`)

  const data = await response.json()
  
  const totalHeader = response.headers.get('X-Total')
  const totalPagesHeader = response.headers.get('X-Total-Pages')
  const currentPageHeader = response.headers.get('X-Page') 

  const results = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
  
  const count = totalHeader ? Number(totalHeader) : data?.count ?? results.length
  const totalPages = totalPagesHeader ? Number(totalPagesHeader) : Math.max(1, Math.ceil(count / (filtros.size ?? 10)))
  const currentPage = currentPageHeader ? Number(currentPageHeader) : (filtros.page ?? 1)

  return { 
    results, 
    count, 
    totalPages, 
    currentPage, 
    next: data?.next ?? null, 
    previous: data?.previous ?? null 
  }
}

export async function crearInstitucion(data: CrearInstitucionPayload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/instituciones-c/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al crear institución: ${response.status} - ${errorText}`)
  }
  return response.json()
}

export async function eliminarInstitucion(id: number) {
  const response = await fetch(`${API_BASE_URL}/api/v1/instituciones-c/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al eliminar institución: ${response.status} - ${errorText}`)
  }
  return true
}

export async function actualizarInstitucion(id: number, cambios: CambiosInstitucion) {
  const response = await fetch(`${API_BASE_URL}/api/v1/instituciones-c/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cambios),
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al actualizar institución: ${response.status} - ${errorText}`)
  }
  return response.json()
}