import { useState } from 'react'
import './App.css'

function App() {
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    tipo: '',
    descripcion: ''
  })
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnviado(true)
    console.log('Institución registrada:', form)
  }

  return (
    <div className="container">
      <h1>Alta de Institución</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            name="direccion"
            type="text"
            value={form.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="tipo">Tipo de institución</label>
          <select
            id="tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="publica">Pública</option>
            <option value="privada">Privada</option>
            <option value="ong">ONG</option>
          </select>
        </div>
        <div className="campo">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="4"
          />
        </div>
        <button type="submit" className="btn-enviar">Guardar</button>
      </form>
      {enviado && <p className="mensaje">Institución registrada correctamente.</p>}
    </div>
  )
}

export default App
