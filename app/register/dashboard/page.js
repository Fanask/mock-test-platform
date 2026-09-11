'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadDashboard() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push('/login');
        return;
      }

      setUser(data.user);

      const { data: testData } = await supabase
        .from('tests')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      setTests(testData || []);
      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) {
    return <main className="container">Loading...</main>;
  }

  return (
    <main className="container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 15,
          marginBottom: 30,
        }}
      >
        <div>
          <h1>Student Dashboard</h1>
          <p className="muted">
            Welcome, {user?.user_metadata?.full_name || user?.email}
          </p>
        </div>

        <button className="btn secondary" onClick={logout}>
          Logout
        </button>
      </div>

      <h2>Available Mock Tests</h2>

      {tests.length === 0 ? (
        <div className="card">
          <p>No mock tests are available yet.</p>
          <p className="muted">
            Admin will publish tests here when they are ready.
          </p>
        </div>
      ) : (
        <div className="grid">
          {tests.map((test) => (
            <div className="card" key={test.id}>
              <h3>{test.title}</h3>

              <p>{test.description || 'Online MCQ Mock Test'}</p>

              <p>
                <strong>Duration:</strong>{' '}
                {Math.floor((test.duration_minutes || 150) / 60)}h{' '}
                {(test.duration_minutes || 150) % 60}m
              </p>

              <p>
                <strong>Total Marks:</strong> {test.total_marks || 0}
              </p>

              <button
                className="btn"
                onClick={() => router.push(`/test/${test.id}`)}
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
