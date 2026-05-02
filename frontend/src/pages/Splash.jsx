import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  return (
    <div style={{
      backgroundColor: '#00e020',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '40px'
    }}>
      <h1 style={{
        color: '#00a010',
        fontSize: '28px',
        fontWeight: 'bold',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        Guia Turístico Interativo
      </h1>

      <button
        onClick={() => navigate('/login')}
        style={{
          backgroundColor: '#ffffff',
          color: '#008f40',
          border: 'none',
          borderRadius: '100px',
          padding: '10px 40px',
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '2px',
          cursor: 'pointer'
        }}
      >
        AVANÇAR
      </button>
    </div>
  )
}