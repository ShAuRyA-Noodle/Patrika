"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase, type CommentRow } from "@/lib/supabase";

type Node = CommentRow & { children: Node[] };

function buildTree(rows: CommentRow[]): Node[] {
  const map = new Map<string, Node>();
  rows.forEach((r) => map.set(r.id, { ...r, children: [] }));
  const roots: Node[] = [];
  rows.forEach((r) => {
    const node = map.get(r.id)!;
    if (r.parent_id && map.has(r.parent_id)) map.get(r.parent_id)!.children.push(node);
    else roots.push(node);
  });
  // newest thread first; replies stay chronological within a thread
  roots.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return roots;
}

function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - +new Date(iso)) / 1000));
  const units: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [604800, "w"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of units) {
    if (s >= secs) return `${Math.floor(s / secs)}${label} ago`;
  }
  return "just now";
}

function initials(name: string): string {
  const t = name.trim();
  return t ? t[0].toUpperCase() : "?";
}

function CommentForm({
  onSubmit,
  compact,
  autoFocus,
  onCancel,
}: {
  onSubmit: (name: string, body: string) => Promise<string | null>;
  compact?: boolean;
  autoFocus?: boolean;
  onCancel?: () => void;
}) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.current?.value) return; // bot
    const n = name.trim();
    const b = body.trim();
    if (!n || !b) {
      setErr("Please add your name and a note.");
      return;
    }
    setBusy(true);
    setErr(null);
    const error = await onSubmit(n, b);
    setBusy(false);
    if (error) {
      setErr("Could not post right now. Please try again.");
      return;
    }
    setBody("");
    if (compact) onCancel?.();
  };

  return (
    <form onSubmit={submit} className={compact ? "mt-3" : "mt-6"}>
      {/* honeypot, hidden from humans */}
      <input
        ref={honeypot}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          autoFocus={autoFocus}
          placeholder="your name"
          className="w-full max-w-xs border-b border-[color:var(--c-rule)] bg-transparent pb-1.5 text-[color:var(--c-ink)] outline-none placeholder:text-[color:var(--c-ink-faint-text)] focus:border-[color:var(--c-ink-soft)]"
          style={{ fontFamily: "var(--font-body)" }}
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={2000}
          rows={compact ? 2 : 3}
          placeholder={compact ? "write a reply" : "leave a response for the poet"}
          className="w-full resize-none border-b border-[color:var(--c-rule)] bg-transparent pb-2 text-[18px] leading-relaxed text-[color:var(--c-ink)] outline-none placeholder:text-[color:var(--c-ink-faint-text)] focus:border-[color:var(--c-ink-soft)]"
          style={{ fontFamily: "var(--font-body)" }}
        />
        <div className="flex items-center gap-4">
          <button
            type="submit"
            data-ink
            disabled={busy}
            className="eyebrow-quiet -m-2 p-2 text-[color:var(--c-accent)] transition-colors hover:text-[color:var(--c-ink)] disabled:opacity-40"
          >
            {busy ? "posting" : "post"}
          </button>
          {compact && (
            <button
              type="button"
              onClick={onCancel}
              className="eyebrow-quiet -m-2 p-2 text-[color:var(--c-ink-faint-text)] transition-colors hover:text-[color:var(--c-ink)]"
            >
              cancel
            </button>
          )}
          {err && (
            <span className="text-sm text-[color:var(--c-ink-soft)]" style={{ fontFamily: "var(--font-body)" }}>
              {err}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}

function CommentNode({
  node,
  depth,
  onReply,
}: {
  node: Node;
  depth: number;
  onReply: (parentId: string, name: string, body: string) => Promise<string | null>;
}) {
  const [replying, setReplying] = useState(false);
  return (
    <div className={depth > 0 ? "mt-6 border-l border-[color:var(--c-rule)] pl-5 md:pl-6" : "mt-8"}>
      <div className="flex gap-3.5">
        <span
          aria-hidden
          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--c-paper-2)] text-[color:var(--c-ink-soft)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {initials(node.author_name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <span
              className="text-[color:var(--c-ink)]"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
            >
              {node.author_name}
            </span>
            <span className="eyebrow-quiet text-[color:var(--c-ink-faint-text)]">
              {timeAgo(node.created_at)}
            </span>
          </div>
          <p
            className="mt-1.5 whitespace-pre-wrap break-words text-[18px] leading-relaxed text-[color:var(--c-ink-soft)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {node.body}
          </p>
          <button
            type="button"
            data-ink
            onClick={() => setReplying((v) => !v)}
            className="eyebrow-quiet -m-2 mt-1 p-2 text-[color:var(--c-ink-faint-text)] transition-colors hover:text-[color:var(--c-ink)]"
          >
            reply
          </button>
          {replying && (
            <CommentForm
              compact
              autoFocus
              onCancel={() => setReplying(false)}
              onSubmit={async (name, body) => {
                const e = await onReply(node.id, name, body);
                return e;
              }}
            />
          )}
          {node.children.map((child) => (
            <CommentNode key={child.id} node={child} depth={Math.min(depth + 1, 4)} onReply={onReply} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Comments({ poemId }: { poemId: string }) {
  const [rows, setRows] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("poem_id", poemId)
      .order("created_at", { ascending: true });
    setRows(data ?? []);
    setLoading(false);
  }, [poemId]);

  useEffect(() => {
    load();
  }, [load]);

  const post = useCallback(
    async (parentId: string | null, name: string, body: string): Promise<string | null> => {
      if (!supabase) return "unavailable";
      const { error } = await supabase
        .from("comments")
        .insert({ poem_id: poemId, parent_id: parentId, author_name: name, body });
      if (error) return error.message;
      await load();
      return null;
    },
    [poemId, load]
  );

  const tree = useMemo(() => buildTree(rows), [rows]);

  if (!supabase) return null;

  return (
    <section className="mx-auto mt-20 max-w-[720px]">
      <div className="mb-8 flex items-center gap-4">
        <span className="eyebrow-quiet text-[color:var(--c-ink-faint-text)]">
          responses{rows.length ? ` · ${rows.length}` : ""}
        </span>
        <span className="h-px flex-1 bg-[color:var(--c-rule)]" />
      </div>

      <CommentForm onSubmit={(name, body) => post(null, name, body)} />

      <div className="mt-10">
        {loading ? (
          <p className="text-[color:var(--c-ink-faint-text)]" style={{ fontFamily: "var(--font-body)" }}>
            loading responses…
          </p>
        ) : tree.length === 0 ? (
          <p className="text-[color:var(--c-ink-faint-text)]" style={{ fontFamily: "var(--font-body)" }}>
            Be the first to leave a response.
          </p>
        ) : (
          tree.map((node) => <CommentNode key={node.id} node={node} depth={0} onReply={post} />)
        )}
      </div>
    </section>
  );
}
