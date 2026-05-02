import { useNavigate } from 'react-router-dom'

const preferencias = [
  'Praia', 'Trilhas', 'Culinária local', 'Cultura e História',
  'Fotografia', 'Ecoturismo', 'Festivais e eventos'
]

export default function Perfil() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px 48px'
    }}>

      <div style={{
        width: '100%',
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>

        {/* Título */}
        <h1 style={{
          color: '#00cc22',
          fontSize: 'clamp(22px, 5vw, 30px)',
          fontWeight: 'bold',
          letterSpacing: '3px'
        }}>
          PERFIL
        </h1>

        {/* Avatar + nome */}
        <div style={{
          backgroundColor: '#00e020',
          borderRadius: '24px',
          padding: '24px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#fff'
          }}>
            JP
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>
              João Pedro
            </div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>
              joao@email.com
            </div>
          </div>
        </div>

        {/* Preferências */}
        <div style={{
          backgroundColor: '#00e020',
          borderRadius: '24px',
          padding: '20px 24px',
          width: '100%'
        }}>
          <h2 style={{
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '14px'
          }}>
            Minhas preferências
          </h2>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {preferencias.map((p, i) => (
              <span key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                color: '#fff',
                borderRadius: '100px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Botão logout */}
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#fff',
            color: '#00cc22',
            border: '2px solid #00e020',
            borderRadius: '100px',
            padding: '12px 48px',
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          SAIR
        </button>

        <button
          onClick={() => navigate('/Home')}
          style={{
            backgroundColor: '#fff',
            color: '#00cc22',
            border: '2px solid #00e020',
            borderRadius: '100px',
            padding: '12px 48px',
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          VOLTAR
        </button>

        <button
          onClick={() => navigate('/passaporte')}
          style={{
            backgroundColor: '#00e020',
            color: '#fff',
            border: 'none',
            borderRadius: '100px',
            padding: '12px 48px',
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            cursor: 'pointer',
            width: '100%'
         }}
        >       
          MEU PASSAPORTE
        </button>

      </div>
    </div>
  )
}