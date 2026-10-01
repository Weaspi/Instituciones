import facebook from '../assets/icons/facebook.svg'
import twitter from '../assets/icons/x.svg'
import instagram from '../assets/icons/instagram.svg'
import youtube from '../assets/icons/youtube.svg'

type FooterProps = {
  t: {
    footerTituloGobmx: string
    footerLeerMas: string
    footerEnlaces: string
    footerSiguenos: string
    footerDenuncia: string
  }
}

function Footer({ t }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__contenedor">
        <div className="footer__mexico">
          <img
            src="https://framework-gb.cdn.gob.mx/gobmx/img/logo_blanco.svg"
            alt="Gobierno de México"
            className="footer__escudo"
          />
        </div>

        <div className="footer__colCentral">
          <div className="footer__gobmx">
            <span className="footer__tit">{t.footerTituloGobmx}</span>
            <p className="mexico__detailsp">
              Es el portal único de trámites, información y participación
              ciudadana.{' '}
              <a href="https://www.gob.mx/que-es-gobmx" target="_blank" rel="noopener noreferrer">
                <b>{t.footerLeerMas}</b>
              </a>
            </p>
          </div>

          <div className="footer__enlaces">
            <span className="footer__tit">{t.footerEnlaces}</span>
            <div className="footer__enlacesList">
              <div className="footer__enlacesCol1">
                <a className="footer__enlacesLink" href="https://datos.gob.mx/" target="_blank" rel="noopener noreferrer">Datos</a>
                <a className="footer__enlacesLink" href="https://www.gob.mx/inafed/acciones-y-programas/portal-de-obligaciones-de-transparencia-pot" target="_blank" rel="noopener noreferrer">Portal de Obligaciones de Transparencia</a>
                <a className="footer__enlacesLink" href="https://www.plataformadetransparencia.org.mx/Inicio" target="_blank" rel="noopener noreferrer">Plataforma Nacional de Transparencia</a>
                <a className="footer__enlacesLink" href="https://alertadores.buengobierno.gob.mx/" target="_blank" rel="noopener noreferrer">Alerta</a>
              </div>

              <div className="footer__enlacesCol2">
                <a className="footer__enlacesLink" href="#" target="_blank" rel="noopener noreferrer">Administraciones anteriores</a>
                <a className="footer__enlacesLink" href="https://www.gob.mx/accesibilidad" target="_blank" rel="noopener noreferrer">Declaración de accesibilidad</a>
                <a className="footer__enlacesLink" href="http://www.ordenjuridico.gob.mx/" target="_blank" rel="noopener noreferrer">Marco jurídico</a>
                <a className="footer__enlacesLink" href="#" target="_blank" rel="noopener noreferrer">Política de seguridad</a>
                <a className="footer__enlacesLink" href="https://www.gob.mx/terminos" target="_blank" rel="noopener noreferrer">Términos y condiciones</a>
                <a className="footer__enlacesLink" href="#" target="_blank" rel="noopener noreferrer">Aviso de privacidad</a>
                <a className="footer__enlacesLink" href="#" target="_blank" rel="noopener noreferrer">Aviso de privacidad simplificado</a>
                <a className="footer__enlacesLink" href="#" target="_blank" rel="noopener noreferrer">Mapa de sitio</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__redes">
          <p className="footer__denuncia">
            <a href="https://sidec.buengobierno.gob.mx/#!/" target="_blank" rel="noopener noreferrer">
              {t.footerDenuncia}
            </a>
          </p>

          <div className="footer__siguenosCont">
            <p className="footer__siguenosTit">{t.footerSiguenos}</p>
            <ul className="footer__redes__ul">
              <li>
                <a href="https://www.facebook.com/gobmexico" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <img alt="Facebook" src={facebook} />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/GobiernoMX" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <img alt="Twitter" src={twitter} />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/gobmexico/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <img alt="Instagram" src={instagram} />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@gobiernodemexico" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <img alt="YouTube" src={youtube} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer