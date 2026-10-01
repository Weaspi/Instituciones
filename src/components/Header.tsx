type HeaderProps = {
  t: {
    irContenido: string
    altEscudo: string
    btnIdioma: string
    navAlta: string
    navRegistradas: string
  }
  vista: 'alta' | 'lista'
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

      <div className="mexico__contenedor">
        {/* Escudo */}
        <a
          href="https://www.gob.mx/"
          className="mexico__aescudo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/img/gobierno-mexico.svg"
            className="mexico__img"
            alt={t.altEscudo}
          />
        </a>

        {/* Links oficiales + botones de la app */}
        <nav className="mexico__menu">
          <a
            href="https://www.gob.mx/tramites"
            className="mexico__a"
            target="_blank"
            rel="noopener noreferrer"
          >
            Trámites
          </a>
          <a
            href="https://www.gob.mx/gobierno"
            className="mexico__a"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gobierno
          </a>

          <span className="mexico__sep" />

          <button
            type="button"
            onClick={onCambiarIdioma}
            className="btn-gob"
          >
            {t.btnIdioma}
          </button>
          <button
            type="button"
            onClick={onIrAlta}
            className={`btn-gob ${vista === 'alta' ? 'btn-gob--active' : ''}`}
          >
            {t.navAlta}
          </button>
          <button
            type="button"
            onClick={onIrLista}
            className={`btn-gob ${vista === 'lista' ? 'btn-gob--active' : ''}`}
          >
            {t.navRegistradas} ({totalRegistradas})
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header