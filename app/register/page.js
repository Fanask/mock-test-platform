'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function Register() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function register(e) {
    e.preventDefault();
    setMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          mobile: mobile,
        },
      },
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    if (data.user) {
      setMsg(
        'Registration successful. Please check your email if email confirmation is enabled.'
      );
    }
  }

  return (
    <main className="container">
      <div className="card">
        <h1>Student Registration</h1>

        <form onSubmit={register}>
          <label>Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Mobile Number</label>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <button className="btn" type="submit">
            Register
          </button>
        </form>

        {msg && <p>{msg}</p>}

        <p style={{ marginTop: 20 }}>
          Already registered?{' '}
          <a href="/login">Login</a>
        </p>
      </div>
    </main>
  );
}
