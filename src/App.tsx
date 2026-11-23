import { useState, type FormEvent } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase'

function App() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    if (!supabase) return

    setBusy(true)
    const result = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)

    if (result.error) {
      setMessage(result.error.message)
      return
    }
    setMessage(isSignUp ? 'Revisá tu correo para confirmar la cuenta.' : 'Sesión iniciada correctamente.')
  }

  return (
    <main className="page-shell">
      <section className="intro-panel" aria-labelledby="app-title">
        <div className="brand-mark" aria-hidden="true">PA</div>
        <p className="eyebrow">Tu espacio de aprendizaje</p>
        <h1 id="app-title">Profesor<br />de Aula</h1>
        <p className="intro-copy">Cursos, tareas y anuncios organizados en un mismo lugar.</p>
        <div className="preview-card">
          <span className="preview-label">Una plataforma para aprender mejor</span>
          <div className="preview-lines"><i /><i /><i /></div>
          <div className="preview-dots"><b /><b /><b /><b /></div>
        </div>
      </section>

      <section className="auth-panel" aria-labelledby="welcome-title">
        <div className="auth-card">
          <p className="eyebrow">Empezá por acá</p>
          <h2 id="welcome-title">{isSignUp ? 'Crear una cuenta' : 'Bienvenido de nuevo'}</h2>
          <p className="muted">{isSignUp ? 'Registrate para organizar tus cursos.' : 'Iniciá sesión para continuar con tus cursos.'}</p>

          {!isSupabaseConfigured ? (
            <div className="setup-note" role="status">
              <strong>Falta conectar Supabase</strong>
              <span>Cuando creemos el proyecto, agregaremos su URL y clave pública al archivo <code>.env</code>.</span>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" autoComplete={isSignUp ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
              <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Un momento…' : isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}</button>
              {message && <p className="form-message" role="status">{message}</p>}
            </form>
          )}

          {isSupabaseConfigured && <p className="switch-auth">{isSignUp ? '¿Ya tenés cuenta?' : '¿Todavía no tenés cuenta?'} <button type="button" onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}>{isSignUp ? 'Iniciá sesión' : 'Registrate'}</button></p>}
          <p className="privacy-note">Al continuar, tus cursos y actividades se guardarán en tu cuenta.</p>
        </div>
      </section>
    </main>
  )
}

export default App
