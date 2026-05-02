import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const categorias = [
  {
    titulo: '1. Natureza e Paisagens',
    opcoes: ['Praia', 'Serra/Montanha', 'Cachoeiras', 'Lagos e rios', 'Florestal/Trilhos', 'Deserto', 'Campos/Fazendas', 'Cavernas']
  },
  {
    titulo: '2. Clima e Temperatura',
    opcoes: ['Clima úmido/quente', 'Clima frio', 'Clima tropical', 'Clima temperado']
  },
  {
    titulo: '3. Atividades',
    opcoes: ['Esportes radicais', 'Observar a fauna', 'Mergulho/Snorkeling', 'Surf', 'Escalada', 'Trekking/Hiking', 'Camping', 'Ciclismo']
  },
  {
    titulo: '4. Cultura e História',
    opcoes: ['Museus', 'Sítios históricos', 'Arquitetura', 'Arte urbana/Street art', 'Festivais e eventos', 'Cultura local/Tradições', 'Religioso/Espiritual']
  },
  {
    titulo: '5. Gastronomia',
    opcoes: ['Culinária local', 'Restaurantes renomados', 'Comida de rua', 'Vinícolas/Cervejarias', 'Cafeterias', 'Mercados locais']
  },
  {
    titulo: '6. Entretenimento',
    opcoes: ['Shows/Festas', 'Parques temáticos', 'Jogos e esportes', 'Compras/Shopping', 'Cinema', 'Spa/Relaxamento']
  },
  {
    titulo: '7. Estilo de Viagem',
    opcoes: ['Aventura', 'Luxo', 'Econômico', 'Romântico', 'Família/Crianças', 'Solo/Mochileiro', 'Fotografia']
  },
  {
    titulo: '8. Ritmo',
    opcoes: ['Agitado/Urbano', 'Tranquilo/Isolado', 'Moderado']
  }
]

export default function Preferencias() {
  const navigate = useNavigate()
  const [selecionados, setSelecionados] = useState({})

  function toggle(categoria, opcao) {
    const key = `${categoria}__${opcao}`
    setSelecionados(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 16px 48px'
    }}>

      <h1 style={{
        color: '#00cc22',
        fontSize: 'clamp(22px, 5vw, 32px)',
        fontWeight: 'bold',
        letterSpacing: '3px',
        marginBottom: '8px'
      }}>
        PREFERÊNCIAS
      </h1>

      <p style={{
        color: '#555',
        fontSize: '13px',
        textAlign: 'center',
        marginBottom: '28px',
        maxWidth: '320px'
      }}>
        Para finalizarmos seu cadastro, selecione todas as suas preferências.
      </p>

      <div style={{
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {categorias.map((cat) => (
          <div key={cat.titulo} style={{
            backgroundColor: '#00e020',
            borderRadius: '20px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <h2 style={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              {cat.titulo}
            </h2>

            {cat.opcoes.map((opcao) => {
              const key = `${cat.titulo}__${opcao}`
              const marcado = !!selecionados[key]
              return (
                <label key={opcao} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  <span style={{ color: '#fff', fontSize: '13px' }}>{opcao}</span>
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => toggle(cat.titulo, opcao)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#fff',
                      cursor: 'pointer'
                    }}
                  />
                </label>
              )
            })}
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/Home')}
        style={{
          marginTop: '36px',
          backgroundColor: '#00e020',
          color: '#fff',
          border: 'none',
          borderRadius: '100px',
          padding: '12px 48px',
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '2px',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '420px'
        }}
      >
        CONTINUAR
      </button>
    </div>
  )
}