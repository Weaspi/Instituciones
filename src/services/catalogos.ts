const API_BASE_URL = 'http://172.16.11.22:8000'


async function fetchTodasLasPaginas(urlBase: string, pageSize = 26) {
  const sep = urlBase.includes('?') ? '&' : '?'
  const todos: any[] = []
  let totalPages: number | null = null
  let primeraAnterior: string | null = null

  for (let page = 1; page <= 500; page++) {
    const res = await fetch(
      `${urlBase}${sep}page=${page}&page_size=${pageSize}`
    )

    if (res.status === 404 && page > 1) break
    if (!res.ok) throw new Error(`Error al cargar datos: ${res.status}`)

    const data = await res.json()
    const lista: any[] = Array.isArray(data) ? data : data?.results ?? []
    if (lista.length === 0) break

    const primera = JSON.stringify(lista[0])
    if (primera === primeraAnterior) break
    primeraAnterior = primera

    todos.push(...lista)

    const header = res.headers.get('X-Total-Pages')
    if (header) totalPages = Number(header)
    if (totalPages !== null && page >= totalPages) break
    if (!Array.isArray(data) && !data?.next) break
  }

  return todos
}

const cache = new Map<string, Promise<any[]>>()

function cargarCatalogo(url: string) {
  if (!cache.has(url)) {
    const promesa = fetchTodasLasPaginas(url).catch((error) => {
      cache.delete(url) 
      throw error
    })
    cache.set(url, promesa)
  }
  return cache.get(url)!
}

export async function obtenerPaises(_search: string = '') {
  const lista = await cargarCatalogo(`${API_BASE_URL}/api/v1/paises`)

  return lista.map((p: any) => ({
    id: String(p.id_pais),
    nombre: p.nombre_es || p.nombre,
  }))
}

export async function obtenerEntidades(idPais: number, _search: string = '') {
  const lista = await cargarCatalogo(`${API_BASE_URL}/api/v1/estados`)

  const delPais = lista.filter(
    (e: any) => e.id_pais === undefined || String(e.id_pais) === String(idPais)
  )

  return delPais.map((e: any) => ({
    id: String(e.id_estado || e.id),
    nombre: e.nombre_estado || e.nombre || e.nombre_es,
  }))
}

export async function obtenerMunicipios(
  idEntidad: number,
  _search: string = ''
) {
  const lista = await cargarCatalogo(
    `${API_BASE_URL}/api/v1/estados/${idEntidad}/municipios`
  )

  return lista.map((m: any) => ({
    id: String(m.id_municipio || m.id),
    nombre: m.nombre_municipio || m.nombre || m.nombre_es,
  }))
}