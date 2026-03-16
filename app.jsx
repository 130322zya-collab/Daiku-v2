const { useState, useEffect } = React;

const TODAY = new Date().toISOString().slice(0, 10);

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

const SAMPLE_SITES = [
  { id: '1', name: '田中邸 新築', address: '東京都杉並区', status: '施工中' },
  { id: '2', name: '鈴木邸 リフォーム', address: '東京都世田谷区', status: '施工中' },
];
const SAMPLE_TASKS = [
  { id: 't1', siteId: '1', date: TODAY, content: '1F柱の建て込み', done: false },
  { id: 't2', siteId: '1', date: TODAY, content: '梁の墨付け確認', done: true },
  { id: 't3', siteId: '2', date: TODAY, content: 'フローリング張り', done: false },
];

// ── スタイル定数 ──────────────────────────────────────────
const S = {
  root: { fontFamily: "'Helvetica Neue',Arial,'Hiragino Kaku Gothic ProN',sans-serif", fontSize: 14, color: '#222', minHeight: '100vh', background: '#f4f5f7', margin: 0 },
  header: { background: '#2c3e50', color: '#fff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { margin: 0, fontSize: 18, fontWeight: 'bold' },
  headerDate: { fontSize: 13, opacity: 0.8 },
  body: { display: 'flex', height: 'calc(100vh - 48px)' },
  sidebar: { width: 200, minWidth: 200, background: '#fff', borderRight: '1px solid #ddd', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  sidebarHead: { padding: '12px 14px', fontWeight: 'bold', fontSize: 13, color: '#666', borderBottom: '1px solid #eee', background: '#fafafa' },
  siteItem: (active) => ({ padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid #eee', background: active ? '#ebf5fb' : '#fff', borderLeft: active ? '3px solid #2980b9' : '3px solid transparent', fontWeight: active ? 'bold' : 'normal' }),
  addBtn: { margin: 10, padding: '8px', background: '#fff', border: '1px dashed #aaa', borderRadius: 6, cursor: 'pointer', color: '#555', fontSize: 13 },
  main: { flex: 1, overflowY: 'auto', padding: 20 },
  card: { background: '#fff', borderRadius: 8, padding: 18, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  cardTitle: { margin: '0 0 12px', fontSize: 15, fontWeight: 'bold', color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: 8 },
  badge: (s) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 'bold', background: s === '完了' ? '#d5f5e3' : '#fef9e7', color: s === '完了' ? '#1e8449' : '#b7950b', marginLeft: 8 }),
  taskRow: { display: 'flex', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f0f0f0', gap: 8 },
  taskInput: { flex: 1, border: '1px solid #ddd', borderRadius: 5, padding: '6px 10px', fontSize: 13 },
  btn: (color) => ({ padding: '7px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: 13, background: color === 'blue' ? '#2980b9' : color === 'green' ? '#27ae60' : color === 'red' ? '#e74c3c' : '#eee', color: color ? '#fff' : '#333' }),
  textarea: { width: '100%', border: '1px solid #ddd', borderRadius: 6, padding: 10, fontSize: 13, resize: 'vertical', minHeight: 90, boxSizing: 'border-box' },
  reportRow: { borderBottom: '1px solid #f0f0f0', padding: '8px 0', fontSize: 13 },
  reportMeta: { color: '#999', fontSize: 11, marginBottom: 3 },
  emptyMsg: { color: '#aaa', fontSize: 13, textAlign: 'center', padding: 20 },
  statusSelect: { border: '1px solid #ddd', borderRadius: 5, padding: '4px 8px', fontSize: 12 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 10, padding: 24, width: 300, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
};

// ── 現場追加モーダル ──────────────────────────────────────
function AddSiteModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const submit = () => {
    if (!name.trim()) return;
    onAdd({ id: Date.now().toString(), name: name.trim(), address: address.trim(), status: '施工中' });
    onClose();
  };
  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>現場を追加</h3>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>現場名 *</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="例：山田邸 新築" style={{ ...S.taskInput, width: '100%', boxSizing: 'border-box' }} autoFocus />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>住所</div>
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="例：東京都新宿区" style={{ ...S.taskInput, width: '100%', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button style={S.btn()} onClick={onClose}>キャンセル</button>
          <button style={S.btn('blue')} onClick={submit}>追加</button>
        </div>
      </div>
    </div>
  );
}

// ── メインパネル ──────────────────────────────────────────
function MainPanel({ site, tasks, setTasks, reports, setReports }) {
  const [newTask, setNewTask] = useState('');
  const [reportText, setReportText] = useState('');

  const todayTasks = tasks.filter(t => t.siteId === site.id && t.date === TODAY);
  const siteReports = reports.filter(r => r.siteId === site.id).sort((a, b) => b.createdAt - a.createdAt);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), siteId: site.id, date: TODAY, content: newTask.trim(), done: false }]);
    setNewTask('');
  };
  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const saveReport = () => {
    if (!reportText.trim()) return;
    setReports(prev => [...prev, { id: Date.now().toString(), siteId: site.id, date: TODAY, content: reportText.trim(), createdAt: Date.now() }]);
    setReportText('');
  };

  const doneCount = todayTasks.filter(t => t.done).length;

  return (
    <div style={S.main}>
      {/* 現場情報 */}
      <div style={S.card}>
        <h2 style={{ margin: '0 0 6px', fontSize: 17 }}>{site.name}<span style={S.badge(site.status)}>{site.status}</span></h2>
        {site.address && <div style={{ color: '#777', fontSize: 13 }}>📍 {site.address}</div>}
      </div>

      {/* 今日のタスク */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>
          今日の作業 <span style={{ fontWeight: 'normal', fontSize: 13, color: '#888' }}>{TODAY}　{doneCount}/{todayTasks.length}完了</span>
        </h3>
        {todayTasks.length === 0 && <div style={S.emptyMsg}>タスクがありません</div>}
        {todayTasks.map(t => (
          <div key={t.id} style={S.taskRow}>
            <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <span style={{ flex: 1, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#aaa' : '#222' }}>{t.content}</span>
            <button onClick={() => deleteTask(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 16, padding: '0 4px' }}>✕</button>
          </div>
        ))}
        <div style={{ ...S.taskRow, borderBottom: 'none', marginTop: 8 }}>
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="作業内容を入力してEnter"
            style={S.taskInput}
          />
          <button style={S.btn('blue')} onClick={addTask}>追加</button>
        </div>
      </div>

      {/* 日報 */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>日報</h3>
        <textarea
          value={reportText}
          onChange={e => setReportText(e.target.value)}
          placeholder={`${TODAY} の作業内容・進捗・特記事項を記入...`}
          style={S.textarea}
        />
        <div style={{ textAlign: 'right', marginTop: 8 }}>
          <button style={S.btn('green')} onClick={saveReport}>保存</button>
        </div>
        {siteReports.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>過去の日報</div>
            {siteReports.map(r => (
              <div key={r.id} style={S.reportRow}>
                <div style={S.reportMeta}>{r.date}</div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{r.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────
function App() {
  const [sites, setSites] = useState(() => load('dv2_sites', null) ?? SAMPLE_SITES);
  const [tasks, setTasks] = useState(() => load('dv2_tasks', null) ?? SAMPLE_TASKS);
  const [reports, setReports] = useState(() => load('dv2_reports', []));
  const [selectedId, setSelectedId] = useState(() => load('dv2_selected', SAMPLE_SITES[0].id));
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { save('dv2_sites', sites); }, [sites]);
  useEffect(() => { save('dv2_tasks', tasks); }, [tasks]);
  useEffect(() => { save('dv2_reports', reports); }, [reports]);
  useEffect(() => { save('dv2_selected', selectedId); }, [selectedId]);

  const selectedSite = sites.find(s => s.id === selectedId) ?? sites[0];

  const addSite = (site) => {
    setSites(prev => [...prev, site]);
    setSelectedId(site.id);
  };

  const formatDate = () => {
    const d = new Date();
    return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（${'日月火水木金土'[d.getDay()]}）`;
  };

  return (
    <div style={S.root}>
      <header style={S.header}>
        <h1 style={S.headerTitle}>大工現場管理</h1>
        <span style={S.headerDate}>{formatDate()}</span>
      </header>
      <div style={S.body}>
        {/* サイドバー */}
        <div style={S.sidebar}>
          <div style={S.sidebarHead}>現場一覧</div>
          {sites.map(s => (
            <div key={s.id} style={S.siteItem(s.id === selectedId)} onClick={() => setSelectedId(s.id)}>
              {s.name}
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{s.status}</div>
            </div>
          ))}
          <button style={S.addBtn} onClick={() => setShowAddModal(true)}>＋ 現場を追加</button>
        </div>

        {/* メイン */}
        {selectedSite
          ? <MainPanel key={selectedSite.id} site={selectedSite} tasks={tasks} setTasks={setTasks} reports={reports} setReports={setReports} />
          : <div style={{ ...S.main, ...S.emptyMsg }}>現場を選択してください</div>
        }
      </div>

      {showAddModal && <AddSiteModal onAdd={addSite} onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
