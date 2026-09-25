const API_BASE_URL = 'http://172.16.11.20:8000'

export type InstitucionAPI = {
  id_institucion: number
  id_institucion_padre: number | null
  id_tipo_institucion: number | null
  id_pais: number | null
  id_entidad: number | null
  id_entidad_ubicacion: number | null
  id_municipio: number | null
  id_localidad: number | null
  id_tipo_inst_nivel_uno: number | null
  id_tipo_inst_nivel_dos: number | null
  id_tipo_inst_nivel_tres: number | null
  cve_institucion: string | null
  desc_institucion: string
  ind_empresa: string | null
  origen_informacion: string | null
  tipo_institucion: string | null
  tipo_poder?: string | null
  cve_peoplesoft?: string | null
  ind_inst_superior?: string | null
}

export type FiltrosInstituciones = {
  page?: number
  search?: string
  id_pais?: number | null
  tipo_institucion?: string | null

}

export async function obtenerInstituciones(
  filtros: FiltrosInstituciones = {}
): Promise<{
  count: number
  next: string | null
  previous: string | null
  results: InstitucionAPI[]
}> {
  const params = new URLSearchParams()

  params.append('page', String(filtros.page ?? 1))

  if (filtros.search) params.append('search', filtros.search)
  if (filtros.id_pais) params.append('id_pais', String(filtros.id_pais))
  if (filtros.tipo_institucion)
    params.append('tipo_institucion', filtros.tipo_institucion)


  const url = `${API_BASE_URL}/api/v1/instituciones-c/?${params.toString()}`

  console.log('CONSULTANDO API:', url)

  const response = await fetch(url)

  console.log('STATUS API:', response.status)

  if (!response.ok) {
    throw new Error(`Error al obtener instituciones: ${response.status}`)
  }

  const data = await response.json()

  return {
    results: Array.isArray(data)
      ? data
      : Array.isArray(data?.results)
        ? data.results
        : [],
    count: data.count || 0,
    next: data.next || null,
    previous: data.previous || null,
  }
}

export async function crearInstitucion(data: {
  desc_institucion: string
  id_tipo_institucion: number
  id_pais: number
  id_entidad: number | null
  id_municipio: number | null
  id_localidad: number | null
  id_institucion_padre: number | null
  ind_empresa: string
  tipo_poder: string | null
  origen_informacion: string | null
}) {
  const response = await fetch(`${API_BASE_URL}/api/v1/instituciones-c/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Error al crear institución: ${response.status} - ${errorText}`
    )
  }

  return response.json()
}