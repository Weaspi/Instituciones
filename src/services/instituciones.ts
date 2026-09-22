const API_BASE_URL = 'http://172.16.11.24:8000'

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

export async function obtenerInstituciones(): Promise<InstitucionAPI[]> {
  const url = `${API_BASE_URL}/api/v1/instituciones-c/`

  console.log('CONSULTANDO API:', url)

  const response = await fetch(url)

  console.log('STATUS API:', response.status)

  if (!response.ok) {
    throw new Error(
      `Error al obtener instituciones: ${response.status}`
    )
  }

  const data = await response.json()

  console.log('JSON RECIBIDO:', data)
  console.log('ES ARRAY:', Array.isArray(data))
  console.log('CANTIDAD:', Array.isArray(data) ? data.length : 0)

  return Array.isArray(data) ? data : []
}
