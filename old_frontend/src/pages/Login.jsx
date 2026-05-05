import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      gap: '24px'
    }}>
      <h1 style={{
        color: '#00cc22',
        fontSize: '32px',
        fontWeight: 'bold',
        letterSpacing: '3px'
      }}>
        LOGIN
      </h1>

      <div style={{
        backgroundColor: '#00e020',
        borderRadius: '40px',
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        width: '300px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: '#fff', fontSize: '13px' }}>Login:</label>
          <input type="text" style={{
            borderRadius: '20px',
            border: 'none',
            padding: '8px 14px',
            fontSize: '14px',
            outline: 'none'
          }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: '#fff', fontSize: '13px' }}>Senha:</label>
          <input type="password" style={{
            borderRadius: '20px',
            border: 'none',
            padding: '8px 14px',
            fontSize: '14px',
            outline: 'none'
          }} />
        </div>
      </div>

      <button
        onClick={() => navigate('/Preferencias')}
        style={{
          backgroundColor: '#00e020',
          color: '#fff',
          border: 'none',
          borderRadius: '100px',
          padding: '10px 40px',
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '2px',
          cursor: 'pointer'
        }}
      >
        ENTRAR
      </button>

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#555' }}>
        Não tem cadastro?<br />
        <span
          onClick={() => navigate('/cadastro')}
          style={{ fontWeight: 'bold', cursor: 'pointer', color: '#111' }}
        >
          Cadastre-se
        </span>
      </div>
    </div>
  )
}