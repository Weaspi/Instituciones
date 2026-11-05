import Header from './Header'
import Footer from './Footer'

type LayoutProps = {
  t: any
  vista: 'alta' | 'lista' | 'masiva' 
  onIrMasiva: () => void 
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
  onIrMasiva,
  children,
}: LayoutProps) {
  return (

    <div className="min-h-screen bg-slate-100 flex flex-col">
    
      <div className="sticky top-0 z-50">
        <Header
          t={t}
          vista={vista}
          totalRegistradas={totalRegistradas}
          onCambiarIdioma={onCambiarIdioma}
          onIrAlta={onIrAlta}
          onIrLista={onIrLista}
        />
      </div>

      <div className="flex-1 flex flex-col md:flex-row w-full">
        
        <aside className="w-full md:w-50 bg-[var(--pverde700)] text-white p-2 hidden md:flex flex-col shrink-0 md:sticky md:top-[40px] md:h-[calc(100vh-60px)] overflow-y-auto z-40">
          <h2 className="text-xl font-bold mb-8 font-[var(--font-patria)]"></h2>
          <nav className="space-y-4 flex-1">
            <button
              type="button"
              onClick={onIrAlta}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                vista === 'alta' ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`}
            >
              {t.alta}
            </button>

            <button
              type="button"
              onClick={onIrLista}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                vista === 'lista' ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`}
            >
              {t.navRegistradas} ({totalRegistradas})
            </button>

            <button
              type="button"
              onClick={onIrMasiva}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                vista === 'masiva' ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`}
            >
           {t.cargaMasiva}
            </button>
          </nav>
        </aside>


        <main
          id="mainContent"
          className="flex-1 w-full relative z-10 flex flex-col"
        >
          {children}
        </main>
      </div>

      <Footer t={t} />    
    </div>
  )
}

export default Layout