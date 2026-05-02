import { useNavigate } from 'react-router-dom'

const roteiros = {
  1: {
    nome: 'Praia de Tambau',
    tipo: 'Praia',
    avaliacao: '4.8★',
    distancia: '1.2 km',
    descricao: 'Uma das praias mais famosas de João Pessoa, com águas calmas, quiosques, e a famosa estátua do Cristo. Ótima para famílias e caminhadas ao pôr do sol.',
    dicas: ['Melhor horário: manhã cedo ou fim de tarde', 'Leve protetor solar', 'Há estacionamento gratuito nas proximidades']
  },
  2: {
    nome: 'Centro Histórico',
    tipo: 'Cultura',
    avaliacao: '4.6★',
    distancia: '2.5 km',
    descricao: 'O centro histórico de João Pessoa é um dos mais preservados do Brasil, com igrejas barrocas, casarões coloniais e museus que contam séculos de história paraibana.',
    dicas: ['Visite o Museu do Choro', 'Passeio a pé pelo Largo de São Frei Pedro Gonçalves', 'Ótimo para fotografia urbana']
  },
  3: {
    nome: 'Feira de Artesanato',
    tipo: 'Gastronomia',
    avaliacao: '4.7★',
    distancia: '3.1 km',
    descricao: 'Feira tradicional com artesãos locais vendendo peças únicas de cerâmica, bordado e couro. Também tem barracas com comidas típicas paraibanas.',
    dicas: ['Funciona aos fins de semana', 'Leve dinheiro em espécie', 'Experimente a tapioca e o caldo de cana']
  },
  4: {
    nome: 'Parque Sólon de Lucena',
    tipo: 'Natureza',
    avaliacao: '4.5★',
    distancia: '0.8 km',
    descricao: 'Conhecido como Lagoa, é o cartão postal de João Pessoa. Um lago cercado de palmeiras imperiais no coração da cidade, ideal para caminhadas e piqueniques.',
    dicas: ['Ótimo para correr ou caminhar', 'Tem pedalinhos no lago', 'Movimentado aos domingos']
  },
}

export default function Roteiro() {
  const navigate = useNavigate()

  const params = new URLSearchParams(window.location.search)
  const id = params.get('id') || 1
  const roteiro = roteiros[id] || roteiros[1]

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
          letterSpacing: '2px',
          textAlign: 'center'
        }}>
          {roteiro.nome.toUpperCase()}
        </h1>

        {/* Info */}
        <div style={{
          display: 'flex',
          gap: '12px',
          fontSize: '13px',
          color: '#555'
        }}>
          <span>{roteiro.tipo}</span>
          <span>•</span>
          <span>{roteiro.avaliacao}</span>
          <span>•</span>
          <span>{roteiro.distancia}</span>
        </div>

        {/* Sobre */}
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
            marginBottom: '10px'
          }}>
            Sobre o local
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            {roteiro.descricao}
          </p>
        </div>

        {/* Dicas */}
        <div style={{
          backgroundColor: '#00e020',
          borderRadius: '24px',
          padding: '20px 24px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <h2 style={{
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '2px'
          }}>
            Dicas
          </h2>
          {roteiro.dicas.map((dica, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#fff'
            }}>
              {dica}
            </div>
          ))}
        </div>

        {/* Botão Como chegar */}
        <button style={{
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
        }}>
          COMO CHEGAR
        </button>

        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/home')}
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