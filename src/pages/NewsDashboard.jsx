import { Newspaper, Search, RefreshCw, SlidersHorizontal } from 'lucide-react';
import NewsCard from '../components/NewsCard';

const DUMMY_NEWS = [
  { id: 1, category: 'space', title: 'NASA Artemis III Mission Set to Land Astronauts on Moon by 2026', description: 'NASA confirms Artemis III will carry the first woman and first person of color to the lunar surface, targeting the South Pole region for water ice exploration.', author: 'Sarah Mitchell', source: 'NASA.gov', date: '2026-05-07', image: null },
  { id: 2, category: 'space', title: 'SpaceX Starship Completes Seventh Integrated Flight Test Successfully', description: 'SpaceX achieves another milestone as Starship completes full flight profile with both stages returning for successful landings.', author: 'James Carter', source: 'SpaceNews', date: '2026-05-06', image: null },
  { id: 3, category: 'space', title: 'James Webb Telescope Discovers Exoplanet With Potential Biosignatures', description: 'JWST detects methane and carbon dioxide in the atmosphere of a rocky exoplanet 120 light-years away, hinting at possible biological activity.', author: 'Dr. Elena Ross', source: 'Nature Astronomy', date: '2026-05-05', image: null },
  { id: 4, category: 'space', title: "China's Tiangong Station Expands With New Science Module", description: "China launches the Mengshi science module, significantly expanding Tiangong's research capabilities and crew quarters.", author: 'Li Wei', source: 'Xinhua', date: '2026-05-04', image: null },
  { id: 5, category: 'space', title: 'ISS Extended to 2035 as NASA and Partners Agree on New Timeline', description: 'International partners officially agree to extend ISS operations through 2035, ensuring a smooth transition to commercial space stations.', author: 'Mark Johnson', source: 'Space.com', date: '2026-05-03', image: null },
  { id: 6, category: 'tech', title: 'OpenAI Releases GPT-5 With Unprecedented Reasoning Capabilities', description: 'GPT-5 demonstrates human-level performance on complex multi-step reasoning tasks, scoring in the 95th percentile on standardized tests.', author: 'Alex Turner', source: 'TechCrunch', date: '2026-05-07', image: null },
  { id: 7, category: 'tech', title: 'Apple Vision Pro 2 Launched With Neural Interface Support', description: "Apple's second-generation mixed reality headset introduces non-invasive neural interface support for hands-free control.", author: 'Michelle Park', source: 'The Verge', date: '2026-05-06', image: null },
  { id: 8, category: 'tech', title: 'Quantum Computing Achieves 1 Million Qubit Milestone', description: 'IBM announces QSystem Two reaches one million stable qubits, a threshold researchers believe will enable practical quantum advantage.', author: 'Dr. Sam Lee', source: 'Wired', date: '2026-05-05', image: null },
  { id: 9, category: 'tech', title: 'Tesla Launches Full Self-Driving Version 14 Globally', description: "Tesla's FSD v14 rolls out in 40 countries simultaneously, claiming zero intervention required in 99.8% of real-world driving scenarios.", author: 'Ryan Brooks', source: 'Electrek', date: '2026-05-04', image: null },
  { id: 10, category: 'tech', title: 'NVIDIA Blackwell Ultra GPU Breaks All Benchmark Records', description: "NVIDIA's latest flagship GPU delivers 10x performance improvement for AI training workloads over its predecessor.", author: 'Tom Hardy', source: 'AnandTech', date: '2026-05-03', image: null },
];

export default function NewsDashboard() {
  return (
    <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ padding: 8, borderRadius: 12, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Newspaper size={22} style={{ color: '#a78bfa' }} />
            </div>
            <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 700 }}>News Dashboard</h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Latest Space &amp; Tech headlines — cached for 15 minutes</p>
        </div>
        <button className="btn btn-primary" id="news-refresh-btn"><RefreshCw size={15} />Refresh</button>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input id="news-search" placeholder="Search articles..." style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', fontSize: 14, outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SlidersHorizontal size={15} style={{ color: 'var(--color-text-muted)' }} />
            <select id="news-sort" style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
              <option value="date">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="source">Source (A–Z)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="badge badge-blue" style={{ cursor: 'pointer', padding: '6px 14px' }} id="filter-all">All (10)</button>
            <button className="badge badge-cyan" style={{ cursor: 'pointer', padding: '6px 14px' }} id="filter-space">🚀 Space</button>
            <button className="badge badge-purple" style={{ cursor: 'pointer', padding: '6px 14px' }} id="filter-tech">💻 Tech</button>
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>🚀</span>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Space News</h2>
          <span className="badge badge-cyan">5 articles</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 32 }}>
          {DUMMY_NEWS.filter(n => n.category === 'space').map(a => <NewsCard key={a.id} article={a} />)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>💻</span>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Tech News</h2>
          <span className="badge badge-purple">5 articles</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {DUMMY_NEWS.filter(n => n.category === 'tech').map(a => <NewsCard key={a.id} article={a} />)}
        </div>
      </div>
    </div>
  );
}
