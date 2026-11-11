import { useState } from 'react'

export function CargaMasiva() { 

  const [pasoActual, setPasoActual] = useState(0)
  
  const [archivo, setArchivo] = useState<File | null>(null)

  const pasos = [
    { titulo: 'Plantilla'},
    { titulo: 'Archivo' },
    { titulo: 'Validación'},
    { titulo: 'Revisión' },
    { titulo: 'Carga'}
  ]

  const siguiente = () => setPasoActual((prev) => Math.min(prev + 1, pasos.length - 1))
  const anterior = () => setPasoActual((prev) => Math.max(prev - 1, 0))

  return (
    <main className="flex-1 p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 font-patria">
            Altas masivas de instituciones
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sigue los pasos para cargar un archivo masivo al sistema.
          </p>
        </div>


        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded"></div> 
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#5c0a2e] z-0 rounded transition-all duration-300"
              style={{ width: `${(pasoActual / (pasos.length - 1)) * 100}%` }}
            ></div>

            {pasos.map((paso, index) => {
              const activo = index === pasoActual
              const completado = index < pasoActual
              return (
                <div key={index} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300
                    ${activo ? 'bg-[#5c0a2e] border-[#5c0a2e] text-white' 
                      : completado ? 'bg-[#5c0a2e] border-[#5c0a2e] text-white' 
                      : 'bg-white border-gray-300 text-gray-400'}`}>
                    {completado ? '✓' : index + 1}
                  </div>
                  <span className={`text-xs font-medium absolute top-12 whitespace-nowrap ${activo ? 'text-[#5c0a2e]' : 'text-gray-500'}`}>
                    {paso.titulo}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-12 min-h-100 flex flex-col justify-between">
          
          <div>

            {pasoActual === 0 && (
              <div className="text-center space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Descargar plantilla</h2>
                <p className="text-gray-500 text-sm">El usuario descarga el formato establecido antes de capturar información.</p>
                <div className="mt-6 inline-flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="text-left">
                    <p className="font-medium text-gray-700">Plantilla de instituciones.xlsx</p>
                    <p className="text-xs text-gray-500">Columnas y formatos oficiales</p>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Descargar XLSX
                  </button>
                </div>
              </div>
            )}

  
            {pasoActual === 1 && (
              <div className="text-center space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Seleccionar archivo</h2>
                <p className="text-gray-500 text-sm">Selecciona y carga el archivo Excel que llenaste previamente.</p>
                <div className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-12 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    className="hidden" 
                    id="file-upload" 
                    onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <span className="text-sm font-medium text-[#5c0a2e]">Haz clic para subir tu archivo</span>
                    <span className="text-xs text-gray-500 mt-1">o arrastra y suelta aquí (XLSX)</span>
                  </label>
                </div>
                {archivo && (
                  <p className="text-sm text-green-600 font-medium mt-4">
                    Archivo seleccionado: {archivo.name}
                  </p>
                )}
              </div>
            )}

        
            {pasoActual === 2 && (
              <div className="text-center space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Validando archivo</h2>
                <p className="text-gray-500 text-sm">El motor está revisando las reglas de negocio, duplicados y formatos.</p>
                <div className="mt-8 max-w-md mx-auto">
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div className="bg-[#5c0a2e] h-4 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600">Procesando 1,250 registros... (65%)</p>
                </div>
              </div>
            )}

      
            {pasoActual === 3 && (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Revisión de resultados</h2>
                    <p className="text-gray-500 text-sm">Consulta los errores y advertencias antes de confirmar.</p>
                  </div>
                  {/* Filtros de revisión */}
                  <div className="flex gap-2">
                    <select className="text-sm border-gray-300 rounded-md p-2 border">
                      <option>Todos los problemas</option>
                      <option>Solo Errores</option>
                      <option>Solo Advertencias</option>
                      <option>Duplicados</option>
                    </select>
                  </div>
                </div>

                {/* Tabla simulada de revisión */}
                
              </div>
            )}

            {/* PASO 4: CARGA FINAL */}
            {pasoActual === 4 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
                  ✓
                </div>
                <h2 className="text-lg font-semibold text-gray-800">¡Carga completada!</h2>
                <p className="text-gray-500 text-sm">Se han insertado 1,200 instituciones correctamente.</p>
                <button className="mt-6 px-6 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-200">
                  Descargar reporte final
                </button>
              </div>
            )}
          </div>

          {/* 3. BOTONES DE NAVEGACIÓN */}
          <div className="flex justify-between items-center border-t border-gray-200 pt-6 mt-8">
            <button 
              onClick={anterior} 
              disabled={pasoActual === 0}
              className={`px-4 py-2 rounded-md font-medium text-sm ${pasoActual === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
            >
              Anterior
            </button>
            <button 
              onClick={siguiente} 
              disabled={pasoActual === pasos.length - 1 || (pasoActual === 1 && !archivo)}
              className={`px-6 py-2 rounded-md font-medium text-sm text-white ${pasoActual === pasos.length - 1 || (pasoActual === 1 && !archivo) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5c0a2e] hover:bg-[#4a0825]'}`}
            >
              Siguiente
            </button>
          </div>
          
        </div>
      </div>
    </main>
  )
}