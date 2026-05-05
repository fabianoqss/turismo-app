import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const sugestoes = [
  { id: 1, nome: 'Praia de Tambau', tipo: 'Praia', distancia: '1.2 km', avaliacao: '4.8★' },
  { id: 2, nome: 'Centro Histórico', tipo: 'Cultura', distancia: '2.5 km', avaliacao: '4.6★' },
  { id: 3, nome: 'Feira de Artesanato', tipo: 'Gastronomia', distancia: '3.1 km', avaliacao: '4.7★' },
  { id: 4, nome: 'Parque Sólon de Lucena', tipo: 'Natureza', distancia: '0.8 km', avaliacao: '4.5★' },
]

const pontos = [
  { id: 1, pos: [-7.115, -34.861], nome: 'Praia de Tambau' },
  { id: 2, pos: [-7.119, -34.869], nome: 'Centro Histórico' },
  { id: 3, pos: [-7.122, -34.856], nome: 'Feira de Artesanato' },
  { id: 4, pos: [-7.110, -34.863], nome: 'Parque Sólon de Lucena' },
]

const centro = [-7.115, -34.863]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      padding: '28px 16px 48px',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '500px',
      margin: '0 auto'
    }}>

      {/* ALTERADO: era só um <h2>, agora é uma linha com nome + botão perfil */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: '#00cc22',
          fontSize: 'clamp(18px, 5vw, 24px)',
          fontWeight: 'bold',
        }}>
          Nome do usuário
        </h2>

        <button
          onClick={() => navigate('/perfil')}
          style={{
            backgroundColor: '#00e020',
            color: '#fff',
            border: 'none',
            borderRadius: '100px',
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          PERFIL
        </button>
      </div>

      <div style={{
        border: '4px solid #00e020',
        borderRadius: '32px',
        overflow: 'hidden',
        height: '320px',
        width: '100%',
        marginBottom: '28px'
      }}>
        <MapContainer
          center={centro}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Circle
            center={centro}
            radius={600}
            pathOptions={{ color: '#3a7bd5', fillColor: '#3a7bd5', fillOpacity: 0.15 }}
          />
          {pontos.map(p => (
            <Marker key={p.id} position={p.pos}>
              <Popup>{p.nome}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <h2 style={{
        color: '#00cc22',
        fontSize: 'clamp(18px, 5vw, 24px)',
        fontWeight: 'bold',
        marginBottom: '16px'
      }}>
        Sugestões
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sugestoes.map(s => (
          <div
            key={s.id}
            onClick={() => navigate(`/roteiro?id=${s.id}`)}
            style={{
              backgroundColor: '#00e020',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                {s.nome}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>
                {s.tipo} • {s.distancia}
              </div>
            </div>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
              {s.avaliacao}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}