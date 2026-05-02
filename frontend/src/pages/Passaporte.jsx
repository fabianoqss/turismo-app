import { useNavigate } from 'react-router-dom'

const selos = [
  { id: 1, nome: 'Praia de Tambau', conquistado: true },
  { id: 2, nome: 'Centro Histórico', conquistado: true },
  { id: 3, nome: 'Feira de Artesanato', conquistado: false },
  { id: 4, nome: 'Parque Sólon de Lucena', conquistado: false },
  { id: 5, nome: 'Caminhos do Frio', conquistado: false },
  { id: 6, nome: 'Rota do Cangaço', conquistado: false },
  { id: 7, nome: 'Costa Paraibana', conquistado: true },
  { id: 8, nome: 'Mata Atlântica', conquistado: false },
  { id: 9, nome: 'Lagoa de Araçagi', conquistado: false },
]

export default function Passaporte() {
  const navigate = useNavigate()

  const conquistados = selos.filter(s => s.conquistado).length

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
          PASSAPORTE
        </h1>

        {/* Contador */}
        <div style={{
          backgroundColor: '#00e020',
          borderRadius: '24px',
          padding: '16px 24px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{ color: '#fff', fontSize: '13px', marginBottom: '4px' }}>
            Locais visitados
          </div>
          <div style={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}>
            {conquistados} / {selos.length}
          </div>
        </div>

        {/* Grade de selos */}
        <div style={{
          backgroundColor: '#00e020',
          borderRadius: '24px',
          padding: '20px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          {selos.map(s => (
            <div key={s.id} style={{
              backgroundColor: s.conquistado ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
              borderRadius: '16px',
              padding: '14px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              {/* Círculo do selo */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: s.conquistado ? '#00e020' : 'rgba(255,255,255,0.3)',
                border: s.conquistado ? 'none' : '2px dashed rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: s.conquistado ? '#fff' : 'rgba(255,255,255,0.4)',
                fontWeight: 'bold'
              }}>
                {s.conquistado ? '✓' : '?'}
              </div>

              {/* Nome do selo */}
              <span style={{
                fontSize: '10px',
                fontWeight: 'bold',
                textAlign: 'center',
                color: s.conquistado ? '#007a10' : 'rgba(255,255,255,0.5)',
                lineHeight: '1.3'
              }}>
                {s.conquistado ? s.nome : '???'}
              </span>
            </div>
          ))}
        </div>

        {/* Botão voltar */}
        <button
          onClick={() => navigate('/Perfilcv.')}
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

      </div>
    </div>
  )
}