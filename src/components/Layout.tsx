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

      <main
        id="mainContent"
        className="flex-1 w-full relative z-10 flex flex-col"
      >
        {children}
      </main>

      <Footer t={t} />
    </div>
  )
}

export default Layout