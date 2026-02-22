"use client";

import { useState } from "react";

type User = {
  id: number;
  name: string;
  age: number;
  bio: string;
};

const demoUsers: User[] = [
  { id: 1, name: "かしはら", age: 20, bio: "ユダヤの生き残りです" },
  { id: 2, name: "あおい", age: 22, bio: "志望校に落ち、龍谷大に通っています" },
  { id: 3, name: "よつよつ", age: 19, bio: "カバの遺伝子を持っています" },
];

export default function Home() {
  const [profile, setProfile] = useState("");
  const [likes, setLikes] = useState<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);

  const likeUser = (id: number) => {
    if (likes.includes(id)) return;

    setLikes([...likes, id]);

    // デモ：50%でマッチ
    if (Math.random() < 0.5) {
      setMatches([...matches, id]);
    }
  };

  return (
    <main style={{ padding: 40, maxWidth: 600, margin: "auto" }}>
      <h1>マッチングアプリ（デモ）</h1>

      <h2>プロフィール</h2>
      <input
        placeholder="名前を入力"
        value={profile}
        onChange={(e) => setProfile(e.target.value)}
        style={{ padding: 10, width: "100%" }}
      />

      <h2 style={{ marginTop: 30 }}>相手一覧</h2>

      {demoUsers.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginTop: 10,
            borderRadius: 10,
          }}
        >
          <b>{user.name}</b> ({user.age})
          <p>{user.bio}</p>

          <button onClick={() => likeUser(user.id)}>
            👍 いいね
          </button>

          {matches.includes(user.id) && (
            <p style={{ color: "red" }}>❤️ マッチしました！</p>
          )}
        </div>
      ))}
    </main>
  );
}