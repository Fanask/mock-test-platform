'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function CreateTest() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('150');
  const [totalMarks, setTotalMarks] = useState('');
  const [published, setPublished] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  async function createTest(e) {
    e.preventDefault();
    setMessage('');
    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();

    if (profile?.role !== 'admin') {
      setMessage('You are not authorized as an admin.');
      setSaving(false);
      return;
    }

    const { error } = await supabase.from('tests').insert({
      title,
      description,
      duration_minutes: Number(duration),
      total_marks: Number(totalMarks) || 0,
      published,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Test created successfully!');
      setTitle('');
      setDescription('');
      setDuration('150');
      setTotalMarks('');
      setPublished(false);
    }

    setSaving(false);
  }

  return (
    <main className="container">
      <div className="card">
        <h1>Create Mock Test</h1>

        <form onSubmit={createTest}>
          <label>Test Name</label>
          <input
            type="text"
            placeholder="Example: WBP Constable Mock Test 1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            placeholder="Write test details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />

          <label>Exam Duration (minutes)</label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />

          <label>Total Marks</label>
          <input
            type="number"
            min="0"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
          />

          <label style={{ display: 'block', marginBottom: 20 }}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={{ width: 'auto', marginRight: 8 }}
            />
            Publish this test immediately
          </label>

          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Creating...' : 'Create Test'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: 20 }}>
            {message}
          </p>
        )}

        <button
          className="btn secondary"
          style={{ marginTop: 15 }}
          onClick={() => router.push('/admin')}
        >
          Back to Admin
        </button>
      </div>
    </main>
  );
}
