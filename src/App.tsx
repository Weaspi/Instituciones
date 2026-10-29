import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { TRADUCCIONES, type Idioma } from './i18n/traducciones'
import { obtenerInstituciones, crearInstitucion, actualizarInstitucion, eliminarInstitucion, type InstitucionAPI, type CambiosInstitucion } from './services/instituciones'
import Layout from './components/Layout'
import { FormularioAlta, ModalEditar, FORM_INICIAL, type InstitucionForm, normalizar } from './components/FormularioAlta'
import { TablaInstituciones } from './components/TablaInstituciones'
import { ESTADOS_MEXICO } from './data/estados'
import { PAISES } from './data/paises'
import { MUNICIPIOS_DATA } from './data/municipios'
const obtenerIdPais = (nombre: string) => { const i = PAISES.findIndex(p => normalizar(p) === normalizar(nombre)); return i >= 0 ? i + 1 : null }
const obtenerIdEntidad = (nombre: string) => { const i = ESTADOS_MEXICO.findIndex(e => normalizar(e) === normalizar(nombre)); return i >= 0 ? i + 1 : null }

const obtenerIdMunicipio = (nombreMunicipio: string, nombreEstado: string) => {
  if (!nombreMunicipio || !nombreEstado) return null
  const index = MUNICIPIOS_DATA.findIndex(
    (m) => normalizar(m.municipio) === normalizar(nombreMunicipio) && 
           normalizar(m.estado) === normalizar(nombreEstado)
  )
  return index >= 0 ? index + 1 : null
}
const obtenerIdNivelUno = (nombre: string): number | null => {
  if (!nombre) return null
  const index = TRADUCCIONES.es.opcionesNivelUno.findIndex(op => normalizar(op) === normalizar(nombre))
  return index >= 0 ? index + 1 : null
}

const obtenerIdNivelDos = (nombre: string): number | null => {
  if (!nombre) return null
  const index = TRADUCCIONES.es.opcionesNivelDos.findIndex(op => normalizar(op) === normalizar(nombre))
  return index >= 0 ? index + 1 : null
}

type Vista = 'alta' | 'lista'

function App() {
  const [vista, setVista] = useState<Vista>('alta')
  const [form, setForm] = useState<InstitucionForm>(FORM_INICIAL)
  const [enviado, setEnviado] = useState(false)
  const [idioma, setIdioma] = useState<Idioma>('es')
  const [editando, setEditando] = useState<InstitucionAPI | null>(null)
  const t = TRADUCCIONES[idioma]
  const [pageSize, setPageSize] = useState(10) 
  
  const [institucionesAPI, setInstitucionesAPI] = useState<InstitucionAPI[]>([])
  const [cargandoInstituciones, setCargandoInstituciones] = useState(false)
  const [errorInstituciones, setErrorInstituciones] = useState<string | null>(null)
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [haySiguiente, setHaySiguiente] = useState(false)
  const [busquedaDebounced, setBusquedaDebounced] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [filtros, setFiltros] = useState<{
    search: string
    id_pais: number | null
    tipo_institucion: string | null
  }>({ 
    search: '', 
    id_pais: null, 
    tipo_institucion: null
  })

  useEffect(() => { 
    const timer = setTimeout(() => { 
      setBusquedaDebounced(filtros.search)
      setPaginaActual(1)
    }, 400)
    return () => clearTimeout(timer) 
  }, [filtros.search])

  useEffect(() => {
    setPaginaActual(1)
  }, [pageSize])

  useEffect(() => {
    let cancelado = false
    const cargarInstituciones = async () => {
      try {
        setCargandoInstituciones(true); setErrorInstituciones(null)
        
        const data = await obtenerInstituciones({ 
          page: paginaActual, 
          size: pageSize,
          search: busquedaDebounced, 
          id_pais: filtros.id_pais, 
          tipo_institucion: filtros.tipo_institucion 
        })

        if (cancelado) return
        setInstitucionesAPI(data.results); 
        setTotalRegistros(data.count); 
        setTotalPaginas(data.totalPages); 
        setHaySiguiente(Boolean(data.next) || data.currentPage < data.totalPages)
      } catch (error) { 
        if (!cancelado) setErrorInstituciones(error instanceof Error ? error.message : 'Error') 
      } finally { 
        if (!cancelado) setCargandoInstituciones(false) 
      }
    }
    cargarInstituciones()
    return () => { cancelado = true }
  }, [paginaActual, busquedaDebounced, filtros.id_pais, filtros.tipo_institucion, pageSize, refreshTrigger])

  // 4. Efecto para el bloqueo de País/Entidad en Nacional
  useEffect(() => {
    if (form.tipoInstitucion === 'NACIONAL') {
      setForm((prev) => ({ ...prev, pais: 'México' }))
    } else if (form.tipoInstitucion === 'EXTRANJERA') {
      setForm((prev) => ({ ...prev, pais: '', entidad: '', municipio: '', localidad: '' }))
    }
  }, [form.tipoInstitucion])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { 
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })) 
  }
  
  const bloqueado = form.tipoInstitucion === 'EXTRANJERA'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const esNacional = form.tipoInstitucion === 'NACIONAL'
    
    const idEntidad = esNacional && form.entidad ? obtenerIdEntidad(form.entidad) : null
    if (esNacional && form.entidad && idEntidad === null) {
      alert('Selecciona la entidad de la lista')
      return
    }

    const idPais = esNacional ? 143 : obtenerIdPais(form.pais)
    if (idPais === null) {
      alert('Selecciona un país de la lista')
      return
    }

    const payload = {
      desc_institucion: form.nombreInstitucion, 
      cve_institucion: `INST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`, 
      cve_peoplesoft: '',
      tipo_institucion: form.tipoInstitucion || '', 
      id_tipo_institucion: esNacional ? 1 : 2,
      
      id_pais: idPais,
      id_entidad: idEntidad,
      id_entidad_ubicacion: idEntidad, 
      id_municipio: obtenerIdMunicipio(form.municipio, form.entidad),
      municipio_nombre: form.municipio || null,
      id_localidad: null,              
      id_institucion_padre: form.razonSocial ? Number(form.razonSocial) : null, 
      localidad_nombre: form.localidad || null,
      id_tipo_inst_nivel_uno: obtenerIdNivelUno(form.tipoInstitucionNivelUno),
      id_tipo_inst_nivel_dos: obtenerIdNivelDos(form.tipoInstitucionNivelDos),

      ind_empresa: form.privada === 'SI' ? '1' : '0', 
      origen_informacion: form.origenInformacion || null, 
      observaciones: form.observaciones || '',
      tipo_poder: null, 
      ind_inst_superior: 'N',
    }

    try {
      setEnviado(true); await crearInstitucion(payload as any)
      setPaginaActual(1); setBusquedaDebounced(''); 
      setFiltros({ search: '', id_pais: null, tipo_institucion: null })
      setRefreshTrigger((p) => p + 1); setVista('lista'); setForm(FORM_INICIAL)
    } catch (error) { alert(error instanceof Error ? error.message : 'Error'); setEnviado(false) }
  }

  const handleGuardarEdicion = async (formEdicion: InstitucionForm) => {
    if (!editando) return
    const cambios: CambiosInstitucion = {}

     if (formEdicion.tipoInstitucion !== (editando.tipo_institucion ?? '')) {
      cambios.tipo_institucion = formEdicion.tipoInstitucion || undefined 
      cambios.id_tipo_institucion = formEdicion.tipoInstitucion === 'NACIONAL' ? 1 : 2
    }
    
    if (formEdicion.nombreInstitucion !== editando.desc_institucion) 
      cambios.desc_institucion = formEdicion.nombreInstitucion
    
    if (formEdicion.entidad !== (editando.entidad_nombre ?? '')) 
      cambios.id_entidad = obtenerIdEntidad(formEdicion.entidad) || null
    
    if (formEdicion.pais !== (editando.pais_nombre ?? '')) 
      cambios.id_pais = obtenerIdPais(formEdicion.pais) || 1
    
    if (formEdicion.tipoInstitucionNivelUno !== (editando.nivel_uno_nombre ?? '')) {
      cambios.id_tipo_inst_nivel_uno = obtenerIdNivelUno(formEdicion.tipoInstitucionNivelUno)
    }
    if (formEdicion.origenInformacion !== (editando.origen_informacion ?? '')) 
      cambios.origen_informacion = formEdicion.origenInformacion || null

    if (Object.keys(cambios).length > 0) {
      try {
        await actualizarInstitucion(editando.id_institucion, cambios)
        setRefreshTrigger((p) => p + 1); setEditando(null)
      } catch (error) { alert(error instanceof Error ? error.message : 'Error') }
    } else setEditando(null)
  }

  const handleEliminar = async () => {
    if (editando && window.confirm('¿Eliminar?')) {
      await eliminarInstitucion(editando.id_institucion); 
      setRefreshTrigger((p) => p + 1); 
      setEditando(null)
    }
  }

  return (
    <Layout 
      t={t} 
      vista={vista} 
      totalRegistradas={totalRegistros} 
      onCambiarIdioma={() => setIdioma((p) => (p === 'es' ? 'en' : 'es'))} 
      onIrAlta={() => setVista('alta')} 
      onIrLista={() => setVista('lista')}
    >
      {vista === 'lista' ? (
        <TablaInstituciones 
          institucionesAPI={institucionesAPI} 
          cargando={cargandoInstituciones} 
          error={errorInstituciones} 
          t={t} 
          idioma={idioma} 
          paginaActual={paginaActual} 
          totalPaginas={totalPaginas} 
          totalRegistros={totalRegistros} 
          haySiguiente={haySiguiente} 
          onCambiarPagina={setPaginaActual} 
          filtros={filtros} 
          setFiltros={setFiltros} 
          onEditar={setEditando}
          pageSize={pageSize} 
          setPageSize={setPageSize} 
        />
      ) : (
        <FormularioAlta 
          form={form} 
          setForm={setForm} 
          handleSubmit={handleSubmit} 
          handleChange={handleChange} 
          bloqueado={bloqueado} 
          enviado={enviado} 
          setVista={setVista} 
          t={t} 
          idioma={idioma} 
        />
      )}
      {editando && (
        <ModalEditar 
          institucion={editando} 
          t={t} 
          idioma={idioma} 
          onCerrar={() => setEditando(null)} 
          onGuardar={handleGuardarEdicion} 
          onEliminar={handleEliminar} 
        />
      )}
    </Layout>
  )
}

export default App