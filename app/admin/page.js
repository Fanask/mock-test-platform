'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadAdmin();
  }, []);

  async function loadAdmin() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push('/login');
      return;
    }

    setUser(userData.user);

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (profileError || profileData?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setProfile(profileData);

    const { data: testData } = await supabase
      .from('tests')
      .select('*')
      .order('created_at', { ascending: false });

    setTests(testData || []);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) {
    return <main className="container">Checking admin access...</main>;
  }

  return (
    <main className="container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
        }}
      >
        <div>
          <h1>Admin Dashboard</h1>
          <p className="muted">
            Welcome, {profile?.full_name || user?.email}
          </p>
        </div>

        <button className="btn secondary" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Mock Tests</h3>
          <p>{tests.length} tests found</p>
          <button className="btn">
            Create Test
          </button>
        </div>

        <div className="card">
          <h3>Questions</h3>
          <p>Manage your MCQ question bank.</p>
          <button className="btn">
            Manage Questions
          </button>
        </div>

        <div className="card">
          <h3>Student Results</h3>
          <p>View student scores and attempts.</p>
          <button className="btn">
            View Results
          </button>
        </div>
      </div>

      <section style={{ marginTop: 35 }}>
        <h2>Published / Created Tests</h2>

        {tests.length === 0 ? (
          <div className="card">
            <p>No tests have been created yet.</p>
          </div>
        ) : (
          <div className="grid">
            {tests.map((test) => (
              <div className="card" key={test.id}>
                <h3>{test.title}</h3>
                <p>{test.description || 'MCQ Mock Test'}</p>
                <p>
                  Duration: {test.duration_minutes || 150} minutes
                </p>
                <p>
                  Status: {test.published ? 'Published' : 'Draft'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {message && <p>{message}</p>}
    </main>
  );
}
