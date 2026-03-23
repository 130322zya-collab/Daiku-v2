const { useState } = React;

// ====== 初期データ ======
const initialSites = [
  { id: 1, name: "渋谷区マンション新築工事", address: "東京都渋谷区桜丘1-2-3", status: "進行中", startDate: "2026-01-15", endDate: "2026-06-30" },
  { id: 2, name: "世田谷区戸建リフォーム", address: "東京都世田谷区経堂4-5-6", status: "準備中", startDate: "2026-04-01", endDate: "2026-05-31" },
  { id: 3, name: "品川区オフィスビル改修", address: "東京都品川区大崎2-3-4", status: "完了", startDate: "2025-10-01", endDate: "2026-02-28" },
];

const initialWorkers = [
  { id: 1, name: "田中 一郎", role: "棟梁", phone: "090-1234-5678", siteId: 1 },
  { id: 2, name: "鈴木 次郎", role: "大工", phone: "090-2345-6789", siteId: 1 },
  { id: 3, name: "佐藤 三郎", role: "電気工", phone: "090-3456-7890", siteId: 1 },
  { id: 4, name: "山田 四郎", role: "大工", phone: "090-4567-8901", siteId: 2 },
  { id: 5, name: "中村 五郎", role: "左官", phone: "090-5678-9012", siteId: 2 },
];

const initialTasks = [
  { id: 1, title: "基礎工事", siteId: 1, workerId: 1, status: "完了", priority: "高", dueDate: "2026-02-28", note: "" },
  { id: 2, title: "フレーミング（骨組み）", siteId: 1, workerId: 2, status: "進行中", priority: "高", dueDate: "2026-03-31", note: "2階部分が残っている" },
  { id: 3, title: "電気配線工事", siteId: 1, workerId: 3, status: "未着手", priority: "中", dueDate: "2026-04-30", note: "" },
  { id: 4, title: "現場調査", siteId: 2, workerId: 4, status: "完了", priority: "高", dueDate: "2026-03-15", note: "" },
  { id: 5, title: "資材搬入", siteId: 2, workerId: 5, status: "未着手", priority: "中", dueDate: "2026-04-10", note: "" },
];

// ====== ステータスの色 ======
const statusColor = {
  "進行中": { bg: "#dbeafe", text: "#1e40af" },
  "準備中": { bg: "#fef9c3", text: "#854d0e" },
  "完了":   { bg: "#dcfce7", text: "#166534" },
  "未着手": { bg: "#f3f4f6", text: "#374151" },
};

const priorityColor = {
  "高": { bg: "#fee2e2", text: "#991b1b" },
  "中": { bg: "#fef9c3", text: "#854d0e" },
  "低": { bg: "#f3f4f6", text: "#374151" },
};

// ====== バッジコンポーネント ======
function Badge({ label, colorMap }) {
  const c = colorMap[label] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span style={{
      backgroundColor: c.bg,
      color: c.text,
      padding: "2px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
    }}>{label}</span>
  );
}

// ====== モーダル ======
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
    }}>
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "24px",
        width: "480px", maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "18px" }}>{title}</h3>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: "20px", cursor: "pointer", color: "#6b7280" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ====== 現場タブ ======
function SitesTab({ sites, setSites }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", status: "準備中", startDate: "", endDate: "" });

  function handleAdd() {
    if (!form.name.trim()) return;
    setSites(prev => [...prev, { ...form, id: Date.now() }]);
    setForm({ name: "", address: "", status: "準備中", startDate: "", endDate: "" });
    setShowForm(false);
  }

  function handleDelete(id) {
    if (window.confirm("この現場を削除しますか？")) {
      setSites(prev => prev.filter(s => s.id !== id));
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ margin: 0 }}>現場一覧</h2>
        <button onClick={() => setShowForm(true)} style={btnStyle("#2563eb")}>＋ 現場追加</button>
      </div>

      {sites.map(site => (
        <div key={site.id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>{site.name}</div>
              <div style={{ color: "#6b7280", fontSize: "14px", marginBottom: "8px" }}>📍 {site.address}</div>
              <div style={{ color: "#6b7280", fontSize: "13px" }}>
                {site.startDate} 〜 {site.endDate}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
              <Badge label={site.status} colorMap={statusColor} />
              <button onClick={() => handleDelete(site.id)} style={btnStyle("#ef4444", "small")}>削除</button>
            </div>
          </div>
        </div>
      ))}

      {showForm && (
        <Modal title="現場を追加" onClose={() => setShowForm(false)}>
          <FormField label="現場名 *">
            <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="例: 渋谷区マンション新築工事" />
          </FormField>
          <FormField label="住所">
            <input style={inputStyle} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="例: 東京都渋谷区..." />
          </FormField>
          <FormField label="ステータス">
            <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>準備中</option><option>進行中</option><option>完了</option>
            </select>
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FormField label="開始日">
              <input type="date" style={inputStyle} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </FormField>
            <FormField label="終了日">
              <input type="date" style={inputStyle} value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            </FormField>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
            <button onClick={() => setShowForm(false)} style={btnStyle("#6b7280")}>キャンセル</button>
            <button onClick={handleAdd} style={btnStyle("#2563eb")}>追加</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ====== 作業員タブ ======
function WorkersTab({ workers, setWorkers, sites }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "大工", phone: "", siteId: sites[0]?.id || "" });

  function handleAdd() {
    if (!form.name.trim()) return;
    setWorkers(prev => [...prev, { ...form, id: Date.now(), siteId: Number(form.siteId) }]);
    setForm({ name: "", role: "大工", phone: "", siteId: sites[0]?.id || "" });
    setShowForm(false);
  }

  function handleDelete(id) {
    if (window.confirm("この作業員を削除しますか？")) {
      setWorkers(prev => prev.filter(w => w.id !== id));
    }
  }

  const getSiteName = (siteId) => sites.find(s => s.id === siteId)?.name || "未配属";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ margin: 0 }}>作業員一覧</h2>
        <button onClick={() => setShowForm(true)} style={btnStyle("#2563eb")}>＋ 作業員追加</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
        {workers.map(worker => (
          <div key={worker.id} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "16px" }}>{worker.name}</div>
                <div style={{ color: "#6b7280", fontSize: "14px", margin: "4px 0" }}>🔨 {worker.role}</div>
                <div style={{ color: "#6b7280", fontSize: "13px" }}>📞 {worker.phone}</div>
                <div style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>🏗 {getSiteName(worker.siteId)}</div>
              </div>
              <button onClick={() => handleDelete(worker.id)} style={btnStyle("#ef4444", "small")}>削除</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <Modal title="作業員を追加" onClose={() => setShowForm(false)}>
          <FormField label="氏名 *">
            <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="例: 田中 一郎" />
          </FormField>
          <FormField label="役職">
            <select style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              {["棟梁", "大工", "電気工", "左官", "配管工", "塗装工", "その他"].map(r => <option key={r}>{r}</option>)}
            </select>
          </FormField>
          <FormField label="電話番号">
            <input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="例: 090-0000-0000" />
          </FormField>
          <FormField label="配属現場">
            <select style={inputStyle} value={form.siteId} onChange={e => setForm({ ...form, siteId: e.target.value })}>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </FormField>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
            <button onClick={() => setShowForm(false)} style={btnStyle("#6b7280")}>キャンセル</button>
            <button onClick={handleAdd} style={btnStyle("#2563eb")}>追加</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ====== タスクタブ ======
function TasksTab({ tasks, setTasks, sites, workers }) {
  const [showForm, setShowForm] = useState(false);
  const [filterSite, setFilterSite] = useState("all");
  const [form, setForm] = useState({ title: "", siteId: sites[0]?.id || "", workerId: "", status: "未着手", priority: "中", dueDate: "", note: "" });

  function handleAdd() {
    if (!form.title.trim()) return;
    setTasks(prev => [...prev, { ...form, id: Date.now(), siteId: Number(form.siteId), workerId: Number(form.workerId) }]);
    setForm({ title: "", siteId: sites[0]?.id || "", workerId: "", status: "未着手", priority: "中", dueDate: "", note: "" });
    setShowForm(false);
  }

  function handleStatusChange(id, newStatus) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  }

  function handleDelete(id) {
    if (window.confirm("このタスクを削除しますか？")) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  }

  const getSiteName = (siteId) => sites.find(s => s.id === siteId)?.name || "不明";
  const getWorkerName = (workerId) => workers.find(w => w.id === workerId)?.name || "未割当";

  const filtered = filterSite === "all" ? tasks : tasks.filter(t => t.siteId === Number(filterSite));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ margin: 0 }}>タスク一覧</h2>
        <button onClick={() => setShowForm(true)} style={btnStyle("#2563eb")}>＋ タスク追加</button>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <select style={{ ...inputStyle, width: "auto" }} value={filterSite} onChange={e => setFilterSite(e.target.value)}>
          <option value="all">全現場</option>
          {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {filtered.map(task => (
        <div key={task.id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontWeight: "700", fontSize: "16px" }}>{task.title}</span>
                <Badge label={task.priority} colorMap={priorityColor} />
              </div>
              <div style={{ color: "#6b7280", fontSize: "13px", marginBottom: "4px" }}>
                🏗 {getSiteName(task.siteId)} &nbsp;|&nbsp; 👷 {getWorkerName(task.workerId)}
              </div>
              {task.dueDate && <div style={{ color: "#6b7280", fontSize: "13px", marginBottom: "4px" }}>📅 期限: {task.dueDate}</div>}
              {task.note && <div style={{ color: "#6b7280", fontSize: "13px" }}>📝 {task.note}</div>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", marginLeft: "12px" }}>
              <select
                value={task.status}
                onChange={e => handleStatusChange(task.id, e.target.value)}
                style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "4px 8px", fontSize: "13px", cursor: "pointer" }}
              >
                <option>未着手</option><option>進行中</option><option>完了</option>
              </select>
              <Badge label={task.status} colorMap={statusColor} />
              <button onClick={() => handleDelete(task.id)} style={btnStyle("#ef4444", "small")}>削除</button>
            </div>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px" }}>タスクがありません</div>
      )}

      {showForm && (
        <Modal title="タスクを追加" onClose={() => setShowForm(false)}>
          <FormField label="タスク名 *">
            <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="例: 基礎工事" />
          </FormField>
          <FormField label="現場">
            <select style={inputStyle} value={form.siteId} onChange={e => setForm({ ...form, siteId: e.target.value })}>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </FormField>
          <FormField label="担当者">
            <select style={inputStyle} value={form.workerId} onChange={e => setForm({ ...form, workerId: e.target.value })}>
              <option value="">未割当</option>
              {workers.map(w => <option key={w.id} value={w.id}>{w.name}（{w.role}）</option>)}
            </select>
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FormField label="ステータス">
              <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>未着手</option><option>進行中</option><option>完了</option>
              </select>
            </FormField>
            <FormField label="優先度">
              <select style={inputStyle} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option>高</option><option>中</option><option>低</option>
              </select>
            </FormField>
          </div>
          <FormField label="期限日">
            <input type="date" style={inputStyle} value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </FormField>
          <FormField label="メモ">
            <textarea style={{ ...inputStyle, height: "72px", resize: "vertical" }} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="備考・注意事項など" />
          </FormField>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
            <button onClick={() => setShowForm(false)} style={btnStyle("#6b7280")}>キャンセル</button>
            <button onClick={handleAdd} style={btnStyle("#2563eb")}>追加</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ====== ダッシュボードタブ ======
function DashboardTab({ sites, workers, tasks }) {
  const stats = [
    { label: "現場数", value: sites.length, icon: "🏗" },
    { label: "進行中の現場", value: sites.filter(s => s.status === "進行中").length, icon: "⚙️" },
    { label: "作業員数", value: workers.length, icon: "👷" },
    { label: "未完了タスク", value: tasks.filter(t => t.status !== "完了").length, icon: "📋" },
  ];

  const recentTasks = [...tasks]
    .filter(t => t.status !== "完了")
    .sort((a, b) => (a.dueDate || "9999") > (b.dueDate || "9999") ? 1 : -1)
    .slice(0, 5);

  const getSiteName = (siteId) => sites.find(s => s.id === siteId)?.name || "不明";
  const getWorkerName = (workerId) => workers.find(w => w.id === workerId)?.name || "未割当";

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>ダッシュボード</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...cardStyle, textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: "#2563eb" }}>{s.value}</div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h3>直近の未完了タスク（期限順）</h3>
      {recentTasks.length === 0 ? (
        <div style={{ color: "#9ca3af", padding: "20px 0" }}>未完了のタスクはありません 🎉</div>
      ) : (
        recentTasks.map(task => (
          <div key={task.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: "600" }}>{task.title}</div>
              <div style={{ color: "#6b7280", fontSize: "13px" }}>{getSiteName(task.siteId)} | {getWorkerName(task.workerId)}</div>
              {task.dueDate && <div style={{ color: "#6b7280", fontSize: "13px" }}>期限: {task.dueDate}</div>}
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <Badge label={task.priority} colorMap={priorityColor} />
              <Badge label={task.status} colorMap={statusColor} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ====== ユーティリティ ======
function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", fontWeight: "600", fontSize: "13px", marginBottom: "4px", color: "#374151" }}>{label}</label>
      {children}
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "12px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const inputStyle = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  padding: "8px 10px",
  fontSize: "14px",
  boxSizing: "border-box",
  outline: "none",
};

function btnStyle(bg, size) {
  return {
    backgroundColor: bg,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: size === "small" ? "4px 10px" : "8px 16px",
    fontSize: size === "small" ? "12px" : "14px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

// ====== メインアプリ ======
function App() {
  const [sites, setSites] = useState(initialSites);
  const [workers, setWorkers] = useState(initialWorkers);
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "📊 ダッシュボード" },
    { id: "sites",     label: "🏗 現場管理" },
    { id: "workers",   label: "👷 作業員管理" },
    { id: "tasks",     label: "📋 タスク管理" },
  ];

  return (
    <div style={{ fontFamily: "'Hiragino Sans', 'Meiryo', sans-serif", minHeight: "100vh", background: "#f9fafb" }}>
      {/* ヘッダー */}
      <header style={{
        background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
        color: "#fff",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}>
        <span style={{ fontSize: "28px" }}>🔨</span>
        <div>
          <div style={{ fontSize: "20px", fontWeight: "700" }}>大工現場管理システム</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>Daiku Site Management v2</div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", display: "flex", padding: "0 24px" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "3px solid #2563eb" : "3px solid transparent",
              color: activeTab === tab.id ? "#2563eb" : "#6b7280",
              fontWeight: activeTab === tab.id ? "700" : "400",
              padding: "14px 16px",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "inherit",
              transition: "color 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* メインコンテンツ */}
      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "24px 16px" }}>
        {activeTab === "dashboard" && <DashboardTab sites={sites} workers={workers} tasks={tasks} />}
        {activeTab === "sites"     && <SitesTab sites={sites} setSites={setSites} />}
        {activeTab === "workers"   && <WorkersTab workers={workers} setWorkers={setWorkers} sites={sites} />}
        {activeTab === "tasks"     && <TasksTab tasks={tasks} setTasks={setTasks} sites={sites} workers={workers} />}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
