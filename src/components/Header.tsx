type HeaderProps = {
  t: {
    irContenido: string
    altEscudo: string
    btnIdioma: string
    navAlta: string
    navRegistradas: string
  }
  vista: 'alta' | 'lista' | 'masiva'
  totalRegistradas: number
  onCambiarIdioma: () => void
  onIrAlta: () => void
  onIrLista: () => void
}

function Header({
  t,
  vista,
  totalRegistradas,
  onCambiarIdioma,
  onIrAlta,
  onIrLista,
}: HeaderProps) {
  return (
    <header className="header">
      <a className="irContent" href="#mainContent">
        {t.irContenido}
      </a>

      <div className="mexico__contenedor flex items-center justify-between gap-4 w-full px-4 max-w-[1700px] mx-auto">
            
        <a
          href="https://www.gob.mx/"
          className="mexico__aescudo shrink-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/img/gobierno-mexico.svg"
            className="mexico__img h-10 md:h-12 w-auto"
            alt={t.altEscudo}
          />
        </a>

        <nav className="mexico__menu hidden md:flex items-center gap-4">
          <a
            href="https://www.gob.mx/tramites"
            className="mexico__a hover:text-gray-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Trámites
          </a>
          <a
            href="https://www.gob.mx/gobierno"
            className="mexico__a hover:text-gray-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gobierno
          </a>

          <span className="mexico__sep hidden lg:block" />

          <button
            type="button"
            onClick={onCambiarIdioma}
            className="btn-gob shrink-0"
          >
            {t.btnIdioma}
          </button>
        </nav>

          <button
                    type="button"
                    onClick={onCambiarIdioma}
                    className="btn-gob md:hidden shrink-0"
                  >
                    {t.btnIdioma}
                  </button>
                  </div>
                </header>
              )
            }
    
export default Header