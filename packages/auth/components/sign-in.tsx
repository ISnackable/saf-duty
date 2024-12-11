"use client";

import { signIn } from '../client';
import { useState } from 'react';

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await signIn.email({
          email,
          password,
          name
        })
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Sign in</button>
    </form>
  );
}
