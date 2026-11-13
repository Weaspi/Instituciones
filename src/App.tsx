import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { TRADUCCIONES, type Idioma } from './i18n/traducciones'
import {
  obtenerInstituciones,
  crearInstitucion,
  actualizarInstitucion,
  eliminarInstitucion,
  type InstitucionAPI,
  type CambiosInstitucion,
} from './services/instituciones'
import { obtenerPaises, obtenerEntidades, obtenerMunicipios } from './services/catalogos'
import Layout from './components/Layout'
import {
  FormularioAlta,
  ModalEditar,
  FORM_INICIAL,
  type InstitucionForm,
  normalizar,
  normalizarMayus,
  limpiarNombreInstitucion,
} from './components/FormularioAlta'
import { TablaInstituciones } from './components/TablaInstituciones'
import { ConfirmModal } from './components/ConfirmModal'
import { CargaMasiva } from './components/CargaMasiva'

const obtenerIdNivelUno = (nombre: string): number | null => {
  if (!nombre) return null
  const index = TRADUCCIONES.es.opcionesNivelUno.findIndex(
    (op) => normalizar(op) === normalizar(nombre)
  )
  return index >= 0 ? index + 1 : null
}

const obtenerIdNivelDos = (nombre: string): number | null => {
  if (!nombre) return null
  const index = TRADUCCIONES.es.opcionesNivelDos.findIndex(
    (op) => normalizar(op) === normalizar(nombre)
  )
  return index >= 0 ? index + 1 : null
}

type Vista = 'alta' | 'lista' | 'masiva'

function App() {
  const [vista, setVista] = useState<Vista>('alta')
  const [form, setForm] = useState<InstitucionForm>(FORM_INICIAL)
  const [enviado, setEnviado] = useState(false)
  const [idioma, setIdioma] = useState<Idioma>('es')
  const [editando, setEditando] = useState<InstitucionAPI | null>(null)
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false)
  const t = TRADUCCIONES[idioma]
  const [pageSize, setPageSize] = useState(10)

  const [paises, setPaises] = useState<any[]>([])
  const [entidades, setEntidades] = useState<any[]>([])
  const [municipios, setMunicipios] = useState<any[]>([])

  const [busquedaPais, setBusquedaPais] = useState('')
  const [debouncedPais, setDebouncedPais] = useState('')
  const [busquedaEntidad, setBusquedaEntidad] = useState('')
  const [debouncedEntidad, setDebouncedEntidad] = useState('')
  const [busquedaMunicipio, setBusquedaMunicipio] = useState('')
  const [debouncedMunicipio, setDebouncedMunicipio] = useState('')

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
    tipo_institucion: null,
  })


  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPais(busquedaPais), 500)
    return () => clearTimeout(timer)
  }, [busquedaPais])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedEntidad(busquedaEntidad), 500)
    return () => clearTimeout(timer)
  }, [busquedaEntidad])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMunicipio(busquedaMunicipio), 500)
    return () => clearTimeout(timer)
  }, [busquedaMunicipio])


  useEffect(() => {
    obtenerPaises(debouncedPais).then(setPaises).catch(console.error)
  }, [debouncedPais])

  useEffect(() => {
    if (form.pais) {
      obtenerEntidades(Number(form.pais), debouncedEntidad).then(setEntidades).catch(console.error)
    } else {
      setEntidades([])
      setMunicipios([])
    }
  }, [form.pais, debouncedEntidad])

  useEffect(() => {
    if (form.entidad) {
      obtenerMunicipios(Number(form.entidad), debouncedMunicipio).then(setMunicipios).catch(console.error)
    } else {
      setMunicipios([])
    }
  }, [form.entidad, debouncedMunicipio])


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
        setCargandoInstituciones(true)
        setErrorInstituciones(null)

        const data = await obtenerInstituciones({
          page: paginaActual,
          size: pageSize,
          search: busquedaDebounced,
          id_pais: filtros.id_pais,
          tipo_institucion: filtros.tipo_institucion,
        })

        if (cancelado) return
        setInstitucionesAPI(data.results)
        setTotalRegistros(data.count)
        setTotalPaginas(data.totalPages)
        setHaySiguiente(Boolean(data.next) || data.currentPage < data.totalPages)
      } catch (error) {
        if (!cancelado)
          setErrorInstituciones(
            error instanceof Error ? error.message : 'Error'
          )
      } finally {
        if (!cancelado) setCargandoInstituciones(false)
      }
    }
    cargarInstituciones()
    return () => {
      cancelado = true
    }
  }, [
    paginaActual,
    busquedaDebounced,
    filtros.id_pais,
    filtros.tipo_institucion,
    pageSize,
    refreshTrigger,
  ])

  useEffect(() => {
    if (form.tipoInstitucion === 'NACIONAL') {
      setForm((prev) => ({ ...prev, pais: '143' }))
    } else if (form.tipoInstitucion === 'EXTRANJERA') {
      setForm((prev) => ({
        ...prev,
        pais: '',
        entidad: '',
        municipio: '',
      }))
    }
  }, [form.tipoInstitucion])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const bloqueado = form.tipoInstitucion === 'EXTRANJERA'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const esNacional = form.tipoInstitucion === 'NACIONAL'

    if (esNacional && !form.entidad) {
      alert('Selecciona una entidad')
      return
    }

    const payload = {
      desc_institucion: limpiarNombreInstitucion(form.nombreInstitucion).trim(),
      cve_institucion: `INST-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '')}`,
      cve_peoplesoft: '',
      tipo_institucion: form.tipoInstitucion || '',
      id_tipo_institucion: esNacional ? 1 : 2,
      id_pais: Number(form.pais) || null,
      id_entidad: Number(form.entidad) || null,
      id_entidad_ubicacion: Number(form.entidad) || null,
      id_municipio: Number(form.municipio) || null,
      id_tipo_inst_nivel_uno: obtenerIdNivelUno(form.tipoInstitucionNivelUno),
      id_tipo_inst_nivel_dos: obtenerIdNivelDos(form.tipoInstitucionNivelDos),
      ind_empresa: form.privada === 'SI' ? '1' : '0',
      origen_informacion: form.origenInformacion || null,
      observaciones: form.observaciones || '',
      tipo_poder: null,
    }

    try {
      setEnviado(true)
      await crearInstitucion(payload as any)
      setPaginaActual(1)
      setBusquedaDebounced('')
      setFiltros({ search: '', id_pais: null, tipo_institucion: null })
      setRefreshTrigger((p) => p + 1)
      setVista('lista')
      setForm(FORM_INICIAL)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error')
      setEnviado(false)
    }
  }

  const handleGuardarEdicion = async (formEdicion: InstitucionForm) => {
    if (!editando) return
    const cambios: CambiosInstitucion = {}

    if (formEdicion.tipoInstitucion !== (editando.tipo_institucion ?? '')) {
      cambios.tipo_institucion = formEdicion.tipoInstitucion || undefined
      cambios.id_tipo_institucion =
        formEdicion.tipoInstitucion === 'NACIONAL' ? 1 : 2
    }

  const nombreMayus = limpiarNombreInstitucion(formEdicion.nombreInstitucion).trim()
    if (nombreMayus !== editando.desc_institucion)
      cambios.desc_institucion = nombreMayus

    if (String(formEdicion.entidad) !== String(editando.id_entidad ?? '')) {
      cambios.id_entidad = Number(formEdicion.entidad) || null
    }

    if (String(formEdicion.pais) !== String(editando.id_pais ?? '')) {
      cambios.id_pais = Number(formEdicion.pais)
    }

    if (
      formEdicion.tipoInstitucionNivelUno !== (editando.nivel_uno_nombre ?? '')
    ) {
      cambios.id_tipo_inst_nivel_uno = obtenerIdNivelUno(
        formEdicion.tipoInstitucionNivelUno
      )
    }

    if (formEdicion.origenInformacion !== (editando.origen_informacion ?? ''))
      cambios.origen_informacion = formEdicion.origenInformacion || null

    if (Object.keys(cambios).length > 0) {
      try {
        await actualizarInstitucion(editando.id_institucion, cambios)
        setRefreshTrigger((p) => p + 1)
        setEditando(null)
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error')
      }
    } else setEditando(null)
  }

  const handleAbrirModalEliminar = () => {
    if (editando) setModalEliminarAbierto(true)
  }

  const ejecutarEliminacion = async () => {
    if (editando) {
      try {
        await eliminarInstitucion(editando.id_institucion)
        setRefreshTrigger((p) => p + 1)
        setEditando(null)
        setModalEliminarAbierto(false)
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error')
      }
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
      onIrMasiva={() => setVista('masiva')}
    >
      {vista === 'masiva' ? (
        <CargaMasiva /> 
      ) : vista === 'lista' ? (
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
          paises={paises}
          entidades={entidades}
          municipios={municipios}
          setBusquedaPais={setBusquedaPais}           
          setBusquedaEntidad={setBusquedaEntidad}    
          setBusquedaMunicipio={setBusquedaMunicipio} 
        />
      )}

      {editando && (
        <ModalEditar
          institucion={editando}
          t={t}
          idioma={idioma}
          onCerrar={() => setEditando(null)}
          onGuardar={handleGuardarEdicion}
          onEliminar={handleAbrirModalEliminar}
          paises={paises}
          entidades={entidades}
          municipios={municipios}
          setBusquedaPais={setBusquedaPais}           
          setBusquedaEntidad={setBusquedaEntidad}     
          setBusquedaMunicipio={setBusquedaMunicipio} 
        />
      )}

      <ConfirmModal
        isOpen={modalEliminarAbierto}
        mensaje="¿Estás seguro de que deseas eliminar esta institución? Esta acción no se puede deshacer."
        onConfirm={ejecutarEliminacion}
        onCancel={() => setModalEliminarAbierto(false)}
      />
    </Layout>
  )
}

export default App