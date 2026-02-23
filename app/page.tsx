"use client";

import React, {useEffect, useMemo, useRef, useState } from "react";

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

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Page() {
  const [profileName, setProfileName] = useState("");
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState<number[]>([]);
  const [nopes, setNopes] = useState<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const onPickPhoto = (file: File | null) => {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("画像を選択してください");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result?.toString() ?? "";
    setPhotoDataUrl(result);
    localStorage.setItem("profile_photo", result);
  };
  reader.readAsDataURL(file);
};
useEffect(() => {
  const saved = localStorage.getItem("profile_photo");
  if (saved) setPhotoDataUrl(saved);
}, []);
  const current = demoUsers[index] ?? null;

  // スワイプ状態
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const likeOpacity = useMemo(() => clamp(dx / 120, 0, 1), [dx]);
  const nopeOpacity = useMemo(() => clamp(-dx / 120, 0, 1), [dx]);
  const rotate = useMemo(() => clamp(dx / 20, -12, 12), [dx]);

  const SWIPE_THRESHOLD = 140;

  function nextCard() {
    setDx(0);
    setDy(0);
    setDragging(false);
    startRef.current = null;
    setIndex((v) => v + 1);
  }

  function doLike(user: User) {
    if (!likes.includes(user.id)) setLikes((v) => [...v, user.id]);

    // デモ：40%で相手からもLike→マッチ
    const isMatch = Math.random() < 0.4;
    if (isMatch && !matches.includes(user.id)) {
      setMatches((v) => [...v, user.id]);
    }
    nextCard();
  }

  function doNope(user: User) {
    if (!nopes.includes(user.id)) setNopes((v) => [...v, user.id]);
    nextCard();
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || !startRef.current) return;
    setDx(e.clientX - startRef.current.x);
    setDy(e.clientY - startRef.current.y);
  }

  function onPointerUp() {
    if (!current) return;

    // しきい値超えたら確定
    if (dx > SWIPE_THRESHOLD) return doLike(current);
    if (dx < -SWIPE_THRESHOLD) return doNope(current);

    // 戻す
    setDx(0);
    setDy(0);
    setDragging(false);
    startRef.current = null;
  }

  const done = index >= demoUsers.length;

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 20 }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>マッチングアプリ（スワイプ）</h1>
        <span style={{ fontSize: 12, opacity: 0.7 }}>
          {index}/{demoUsers.length}
        </span>
      </header>

      <section style={{ marginTop: 14, padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "12px 0" }}>
  <div
    style={{
      width: 72,
      height: 72,
      borderRadius: 18,
      border: "1px solid #ddd",
      overflow: "hidden",
      background: "#fafafa",
      display: "grid",
      placeItems: "center"
    }}
  >
    {photoDataUrl ? (
      <img
        src={[photoDataUrl]}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      <span style={{ fontSize: 12 }}>No Photo</span>
    )}
  </div>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
  />
</div>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>プロフィール</div>
        <input
          placeholder="名前を入力"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
        />
      </section>

      <section style={{ marginTop: 16 }}>
        <div style={{ position: "relative", height: 420 }}>
          {/* 背面カード（次の人がちらっと見える） */}
          {!done && demoUsers[index + 1] ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 18,
                border: "1px solid #eee",
                background: "#fafafa",
                transform: "scale(0.98) translateY(8px)",
              }}
            />
          ) : null}

          {/* メインカード */}
          {done ? (
            <div
              style={{
                height: "100%",
                borderRadius: 18,
                border: "1px solid #eee",
                display: "grid",
                placeItems: "center",
                background: "#fff",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>終了！</div>
                <div style={{ marginTop: 8, opacity: 0.8 }}>相手がもういません。</div>
              </div>
            </div>
          ) : (
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 18,
                border: "1px solid #eee",
                background: "#fff",
                cursor: dragging ? "grabbing" : "grab",
                userSelect: "none",
                touchAction: "none",
                transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`,
                transition: dragging ? "none" : "transform 180ms ease",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                padding: 18,
              }}
            >
              {/* バッジ */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div
                  style={{
                    fontWeight: 900,
                    color: "#16a34a",
                    border: "3px solid #16a34a",
                    padding: "6px 10px",
                    borderRadius: 12,
                    transform: "rotate(-10deg)",
                    opacity: likeOpacity,
                  }}
                >
                  LIKE
                </div>
                <div
                  style={{
                    fontWeight: 900,
                    color: "#dc2626",
                    border: "3px solid #dc2626",
                    padding: "6px 10px",
                    borderRadius: 12,
                    transform: "rotate(10deg)",
                    opacity: nopeOpacity,
                  }}
                >
                  NOPE
                </div>
              </div>

              <div style={{ fontSize: 22, fontWeight: 900 }}>
                {current?.name} <span style={{ fontSize: 18, opacity: 0.7 }}>({current?.age})</span>
              </div>
              <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.9 }}>{current?.bio}</p>

              {matches.includes(current!.id) ? (
                <div style={{ marginTop: 10, fontWeight: 800 }}>❤️ マッチしました！</div>
              ) : (
                <div style={{ marginTop: 10, opacity: 0.7, fontSize: 12 }}>
                  左にスワイプでNOPE / 右にスワイプでLIKE
                </div>
              )}

              <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, display: "flex", gap: 10 }}>
                <button
                  onClick={() => current && doNope(current)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 14,
                    border: "1px solid #ddd",
                    fontWeight: 800,
                  }}
                >
                  👎 NOPE
                </button>
                <button
                  onClick={() => current && doLike(current)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 14,
                    border: "1px solid #111",
                    fontWeight: 800,
                  }}
                >
                  👍 LIKE
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <div style={{ padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
          <div style={{ fontWeight: 800 }}>いいねした相手</div>
          <div style={{ marginTop: 6, opacity: 0.85, fontSize: 13 }}>
            {likes.length ? likes.join(", ") : "なし"}
          </div>
        </div>
        <div style={{ padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
          <div style={{ fontWeight: 800 }}>マッチ</div>
          <div style={{ marginTop: 6, opacity: 0.85, fontSize: 13 }}>
            {matches.length ? matches.join(", ") : "なし"}
          </div>
        </div>
      </section>
    </main>
  );
}