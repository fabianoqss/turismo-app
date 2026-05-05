import { useNavigate } from 'react-router-dom'

export default function Cadastro() {
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
        CADASTRO
      </h1>

      <div style={{
        backgroundColor: '#00e020',
        borderRadius: '40px',
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        width: '280px'
      }}>
        {['Login:', 'E-mail:', 'Senha:'].map((label) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ color: '#fff', fontSize: '13px' }}>{label}</label>
            <input
              type={label === 'Senha:' ? 'password' : label === 'E-mail:' ? 'email' : 'text'}
              style={{
                borderRadius: '20px',
                border: 'none',
                padding: '8px 14px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/preferencias')}
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
        CONTINUAR
      </button>
    </div>
  )
}