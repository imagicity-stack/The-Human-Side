"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getClientAuth, firebaseConfigured } from "@/lib/firebaseClient";
import "./admin.css";

const fmtINR = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const entries = (obj) => Object.entries(obj || {}).sort((a, b) => b[1] - a[1]);
const PALETTE = ["#7C3F98", "#B68AD0", "#4A2D6B", "#C7B4DC", "#5E2A78", "#A49CC4", "#1F1036", "#8E83A4"];

export default function AdminPage() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

  const [stats, setStats] = useState(null);
  const [currentFee, setCurrentFee] = useState(null);
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [search, setSearch] = useState("");
  const [paySearch, setPaySearch] = useState("");
  const [backfilling, setBackfilling] = useState(false);
  const [backfillMsg, setBackfillMsg] = useState(null);
  const [feeInput, setFeeInput] = useState("");
  const [feeMsg, setFeeMsg] = useState(null);
  const [vuFee, setVuFee] = useState(null);
  const [vuFeeInput, setVuFeeInput] = useState("");
  const [vuFeeMsg, setVuFeeMsg] = useState(null);
  const [dataErr, setDataErr] = useState("");
  const [chartReady, setChartReady] = useState(false);

  const canvases = { month: useRef(null), revenue: useRef(null), role: useRef(null), city: useRef(null), interest: useRef(null), tshirt: useRef(null) };
  const chartObjs = useRef({});

  useEffect(() => {
    if (!firebaseConfigured) return;
    const unsub = onAuthStateChanged(getClientAuth(), (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function adminApi(path, body) {
    const token = await getClientAuth().currentUser.getIdToken();
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify(body || {}),
    });
    let d = null;
    try { d = await res.json(); } catch (_) {}
    if (!res.ok) throw new Error((d && d.error) || `Request failed (${res.status})`);
    return d || {};
  }

  async function loadData() {
    setDataErr("");
    try {
      const { stats, currentFee, fees } = await adminApi("/api/adminStats", {});
      setStats(stats);
      setCurrentFee(currentFee);
      setFeeInput(String(currentFee));
      const vu = fees && fees["voices-unheard"];
      if (vu != null) {
        setVuFee(vu);
        setVuFeeInput(String(vu));
      }
    } catch (err) { setDataErr("Could not load stats: " + err.message); }
    try {
      const { members } = await adminApi("/api/adminListMembers", {});
      setMembers(members);
    } catch (err) { setDataErr((p) => p || "Could not load members: " + err.message); }
    try {
      const { payments, totalCollected } = await adminApi("/api/adminListPayments", {});
      setPayments(payments || []);
      setTotalCollected(totalCollected || 0);
    } catch (err) { setDataErr((p) => p || "Could not load payments: " + err.message); }
  }

  // (re)draw charts whenever stats or Chart.js readiness changes
  useEffect(() => {
    if (!stats || !chartReady || typeof window.Chart === "undefined") return;
    const draw = (ref, type, data, opts) => {
      if (!ref.current) return;
      const labels = data.map((d) => d[0]);
      const values = data.map((d) => d[1]);
      const key = ref.current.id;
      if (chartObjs.current[key]) chartObjs.current[key].destroy();
      chartObjs.current[key] = new window.Chart(ref.current, {
        type,
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: type === "bar" ? "#7C3F98" : PALETTE,
            borderWidth: 0,
            borderRadius: type === "bar" ? 6 : 0,
          }],
        },
        options: Object.assign({
          responsive: true,
          plugins: { legend: { display: type !== "bar", position: "bottom", labels: { font: { size: 11 } } } },
          scales: type === "bar" ? { y: { beginAtZero: true, ticks: { precision: 0 } } } : {},
        }, opts || {}),
      });
    };
    const months = entries(stats.byMonth).sort((a, b) => a[0].localeCompare(b[0]));
    draw(canvases.month, "bar", months);
    const rev = Object.entries(stats.revenueByMonth || {}).sort((a, b) => a[0].localeCompare(b[0]));
    draw(canvases.revenue, "bar", rev);
    draw(canvases.role, "doughnut", entries(stats.byRole));
    draw(canvases.city, "bar", entries(stats.byCity).slice(0, 10), { indexAxis: "y" });
    draw(canvases.interest, "bar", entries(stats.byInterest), { indexAxis: "y" });
    draw(canvases.tshirt, "doughnut", entries(stats.byTshirt));
    return () => { Object.values(chartObjs.current).forEach((c) => c.destroy()); chartObjs.current = {}; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats, chartReady]);

  async function onLogin(e) {
    e.preventDefault();
    setLoginErr("");
    setLoginBusy(true);
    try {
      await signInWithEmailAndPassword(getClientAuth(), email.trim(), pass);
    } catch (err) {
      setLoginErr("Sign in failed: " + (err.code || err.message));
    } finally {
      setLoginBusy(false);
    }
  }

  async function onDeregister(m) {
    const label = m.memberId || `${m.firstName} ${m.lastName}`;
    if (!confirm(`Deregister ${label}? They will no longer count as an active member.`)) return;
    try { await adminApi("/api/adminDeregister", { id: m.id }); await loadData(); }
    catch (err) { alert("Could not deregister: " + err.message); }
  }

  async function onSaveFee() {
    const amount = parseInt(feeInput, 10);
    if (!amount || amount < 1) { setFeeMsg({ ok: false, text: "Enter a valid amount." }); return; }
    try {
      await adminApi("/api/adminSetAmount", { amount, program: "membership" });
      setFeeMsg({ ok: true, text: "Membership fee updated to " + fmtINR(amount) + "." });
      setCurrentFee(amount);
    } catch (err) { setFeeMsg({ ok: false, text: "Could not update: " + err.message }); }
  }

  async function onSaveVuFee() {
    const amount = parseInt(vuFeeInput, 10);
    if (!amount || amount < 1) { setVuFeeMsg({ ok: false, text: "Enter a valid amount." }); return; }
    try {
      await adminApi("/api/adminSetAmount", { amount, program: "voices-unheard" });
      setVuFeeMsg({ ok: true, text: "Voices Unheard fee updated to " + fmtINR(amount) + "." });
      setVuFee(amount);
    } catch (err) { setVuFeeMsg({ ok: false, text: "Could not update: " + err.message }); }
  }

  async function onBackfill() {
    setBackfilling(true);
    setBackfillMsg(null);
    try {
      const r = await adminApi("/api/adminBackfillPayments", {});
      setBackfillMsg({ ok: true, text: `Backfill complete — ${r.created} record(s) created, ${r.skipped} already present.` });
      await loadData();
    } catch (err) {
      setBackfillMsg({ ok: false, text: err.message });
    } finally {
      setBackfilling(false);
    }
  }

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return [m.memberId, m.firstName, m.lastName, m.email, m.city, m.role].filter(Boolean).join(" ").toLowerCase().includes(q);
  });

  const payFiltered = payments.filter((p) => {
    const q = paySearch.toLowerCase();
    if (!q) return true;
    return [p.paymentId, p.orderId, p.memberId, p.name, p.email].filter(Boolean).join(" ").toLowerCase().includes(q);
  });

  return (
    <div className="pg-admin">
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" strategy="afterInteractive" onLoad={() => setChartReady(true)} />

      <header className="admin-top">
        <div className="admin-top__inner">
          <div className="brand">
            <span className="dot" aria-hidden="true"></span>
            <div><b>The Human Side</b><span>Admin Dashboard</span></div>
          </div>
          {user && (
            <div className="admin-who">
              <span>{user.email}</span>
              <button className="btn-dereg" onClick={() => signOut(getClientAuth())}>Sign out</button>
            </div>
          )}
        </div>
      </header>

      {!user ? (
        <section className="login admin-wrap">
          <div className="login__card">
            <span className="eyebrow" style={{ color: "var(--red)" }}>— Restricted</span>
            <h1>Admin sign in</h1>
            <p>Sign in with the authorised admin email to manage members and settings.</p>
            {!firebaseConfigured ? (
              <div className="msg err">Firebase is not configured yet. Set the NEXT_PUBLIC_FIREBASE_* env vars in Vercel.</div>
            ) : (
              <form onSubmit={onLogin}>
                <div className="field">
                  <label htmlFor="login-email">Email</label>
                  <input id="login-email" type="email" autoComplete="username" placeholder="admin@thehumanside.org" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="field">
                  <label htmlFor="login-pass">Password</label>
                  <input id="login-pass" type="password" autoComplete="current-password" placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} required />
                </div>
                <button className="btn-solid" type="submit" disabled={loginBusy}>{loginBusy ? "Signing in…" : "Sign in"}</button>
                {loginErr && <div className="msg err">{loginErr}</div>}
              </form>
            )}
          </div>
        </section>
      ) : (
        <main className="admin-wrap">
          <div className="cards">
            <div className="card"><div className="k">Active members</div><div className="v">{stats ? stats.active : "—"}</div></div>
            <div className="card"><div className="k">New this month</div><div className="v">{stats ? stats.thisMonth : "—"}</div></div>
            <div className="card"><div className="k">Pending</div><div className="v">{stats ? stats.pending : "—"}</div></div>
            <div className="card"><div className="k">Deregistered</div><div className="v">{stats ? stats.deregistered : "—"}</div></div>
            <div className="card"><div className="k">Transactions</div><div className="v">{payments.length}</div></div>
            <div className="card accent"><div className="k">Revenue (total)</div><div className="v">{stats ? fmtINR(stats.revenue) : "—"}</div></div>
            <div className="card accent"><div className="k">Revenue this month</div><div className="v">{stats ? fmtINR(stats.thisMonthRevenue) : "—"}</div></div>
          </div>

          <div className="panel">
            <h2>Membership registration fee</h2>
            <div className="fee-row">
              <div className="field">
                <label htmlFor="fee-input">Set amount (INR)</label>
                <input id="fee-input" type="number" min="1" step="1" placeholder="999" value={feeInput} onChange={(e) => setFeeInput(e.target.value)} />
              </div>
              <button className="btn-solid" style={{ width: "auto", padding: "13px 24px" }} onClick={onSaveFee}>Update fee</button>
              <div className="fee-now">Current: <b>{currentFee != null ? fmtINR(currentFee) : "—"}</b> · used on /get-involved</div>
            </div>
            {feeMsg && <div className={"msg " + (feeMsg.ok ? "ok" : "err")}>{feeMsg.text}</div>}
          </div>

          <div className="panel">
            <h2>Voices Unheard 2026 fee</h2>
            <div className="fee-row">
              <div className="field">
                <label htmlFor="vu-fee-input">Set amount (INR)</label>
                <input id="vu-fee-input" type="number" min="1" step="1" placeholder="799" value={vuFeeInput} onChange={(e) => setVuFeeInput(e.target.value)} />
              </div>
              <button className="btn-solid" style={{ width: "auto", padding: "13px 24px" }} onClick={onSaveVuFee}>Update fee</button>
              <div className="fee-now">Current: <b>{vuFee != null ? fmtINR(vuFee) : "—"}</b> · used on /voices-unheard</div>
            </div>
            {vuFeeMsg && <div className={"msg " + (vuFeeMsg.ok ? "ok" : "err")}>{vuFeeMsg.text}</div>}
          </div>

          <div className="charts" style={{ marginBottom: 24 }}>
            <div className="panel"><h2>Registrations by month</h2><canvas id="ch-month" ref={canvases.month} height={120}></canvas></div>
            <div className="panel"><h2>Revenue by month (₹)</h2><canvas id="ch-revenue" ref={canvases.revenue} height={120}></canvas></div>
          </div>
          <div className="charts-2">
            <div className="panel"><h2>By role</h2><canvas id="ch-role" ref={canvases.role} height={120}></canvas></div>
            <div className="panel"><h2>By city</h2><canvas id="ch-city" ref={canvases.city} height={120}></canvas></div>
          </div>
          <div className="charts-2">
            <div className="panel"><h2>Causes of interest</h2><canvas id="ch-interest" ref={canvases.interest} height={120}></canvas></div>
            <div className="panel"><h2>T-shirt sizes</h2><canvas id="ch-tshirt" ref={canvases.tshirt} height={120}></canvas></div>
          </div>

          <div className="panel">
            <h2>Members</h2>
            <div className="table-tools">
              <input type="search" placeholder="Search name, email, ID, city…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr>
                  <th>Member ID</th><th>Name</th><th>Email</th><th>Phone</th>
                  <th>City</th><th>Role</th><th>Status</th><th>Fee</th><th>Joined</th><th></th>
                </tr></thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={10} style={{ padding: 24, color: "var(--muted)" }}>No members yet.</td></tr>
                  ) : filtered.map((m) => (
                    <tr key={m.id}>
                      <td className="mid">{m.memberId || "—"}</td>
                      <td>{[m.firstName, m.lastName].filter(Boolean).join(" ") || "—"}</td>
                      <td>{m.email}</td>
                      <td>{m.phone}</td>
                      <td>{m.city}</td>
                      <td>{m.role}</td>
                      <td><span className={"pill " + m.status}>{m.status.replace("_", " ")}</span></td>
                      <td>{m.membershipFee ? fmtINR(m.membershipFee) : "—"}</td>
                      <td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                      <td><button className="btn-dereg" disabled={m.status === "deregistered"} onClick={() => onDeregister(m)}>Deregister</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {dataErr && <div className="msg err">{dataErr}</div>}
          </div>

          {/* PAYMENTS / TRANSACTIONS — separate ledger */}
          <div className="panel">
            <div className="panel__head">
              <h2>Payments &amp; transactions</h2>
              <span className="tot">
                {payments.length} transactions · collected <b>{fmtINR(totalCollected)}</b>
                <button className="btn-dereg" style={{ marginLeft: 14 }} onClick={onBackfill} disabled={backfilling}>
                  {backfilling ? "Backfilling…" : "Backfill past payments"}
                </button>
              </span>
            </div>
            {backfillMsg && <div className={"msg " + (backfillMsg.ok ? "ok" : "err")}>{backfillMsg.text}</div>}
            <div className="table-tools">
              <input type="search" placeholder="Search transaction id, member id, name…" value={paySearch} onChange={(e) => setPaySearch(e.target.value)} />
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr>
                  <th>Transaction ID</th><th>Order ID</th><th>Member ID</th><th>Name</th><th>Amount</th><th>Type</th><th>Status</th><th>Date</th>
                </tr></thead>
                <tbody>
                  {payFiltered.length === 0 ? (
                    <tr><td colSpan={8} style={{ padding: 24, color: "var(--muted)" }}>No transactions yet.</td></tr>
                  ) : payFiltered.map((p) => (
                    <tr key={p.id}>
                      <td className="txn">{p.paymentId}</td>
                      <td className="txn">{p.orderId}</td>
                      <td className="mid">{p.memberId || "—"}</td>
                      <td>{p.name || "—"}</td>
                      <td>{p.amount ? fmtINR(p.amount) : "—"}</td>
                      <td>{p.type}</td>
                      <td><span className="pill active">{p.status}</span></td>
                      <td>{p.createdAt ? new Date(p.createdAt).toLocaleString("en-IN") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
