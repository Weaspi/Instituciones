import Header from './Header'
import Footer from './Footer'

type LayoutProps = {
  t: {
    irContenido: string
    altEscudo: string
    menu: string
    menuTramites: string
    menuGobierno: string
    btnIdioma: string
    navAlta: string
    navRegistradas: string
    footerTituloGobmx: string
    footerLeerMas: string
    footerEnlaces: string
    footerSiguenos: string
    footerDenuncia: string
  }
  vista: 'alta' | 'lista'
  totalRegistradas: number
  onCambiarIdioma: () => void
  onIrAlta: () => void
  onIrLista: () => void
  children: React.ReactNode
}

function Layout({
  t,
  vista,
  totalRegistradas,
  onCambiarIdioma,
  onIrAlta,
  onIrLista,
  children,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header
        t={t}
        vista={vista}
        totalRegistradas={totalRegistradas}
        onCambiarIdioma={onCambiarIdioma}
        onIrAlta={onIrAlta}
        onIrLista={onIrLista}
      />

      <div className="flex-1 flex flex-col md:flex-row w-full">
        
        <aside className="w-full md:w-50 bg-[var(--pverde700)] text-white p-2 hidden md:flex flex-col shrink-0">
         
                    <h2 className="text-xl font-bold mb-8 font-[var]"></h2>
          <nav className="space-y-4 flex-1">


            <button
              type="button"
              onClick={onIrAlta}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                vista === 'alta' ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`}
            >
              Datos generales
            </button>

              
              <button
                type="button"
                onClick={onIrLista}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  vista === 'lista' ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
                }`}> {t.navRegistradas} ({totalRegistradas})
              </button>

          
          </nav>
        </aside>

        <main
          id="mainContent"
          className="flex-1 w-full relative z-10 flex flex-col overflow-x-hidden"
        >
          {children}
        </main>
      </div>

      <Footer t={t} />
    </div>
  )
}

export default Layout