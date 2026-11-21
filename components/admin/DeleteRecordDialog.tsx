"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  name: string;
  kind: string;
  options?: { id: string; label: string }[];
  remove: (
    replacement?: string,
  ) => Promise<{ success: boolean; message: string; linked?: boolean }>;
  close: () => void;
  refresh: () => void;
}

export default function DeleteRecordDialog({
  name,
  kind,
  options,
  remove,
  close,
  refresh,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [linked, setLinked] = useState(false);
  const [replacement, setReplacement] = useState("");
  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  async function submit() {
    setBusy(true);
    try {
      const result = await remove(linked ? replacement : undefined);
      if (!result.success) {
        setError(result.message);
        if (result.linked) setLinked(true);
        return;
      }
      close();
      refresh();
    } catch {
      setError("Could not confirm deletion. Refresh the list before retrying.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      aria-labelledby="delete-record-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) close();
      }}
      className="fixed inset-0 m-auto w-[min(92vw,28rem)] rounded-xl border border-slate-200 bg-white p-6 shadow-xl backdrop:bg-slate-950/50"
    >
      <h2 id="delete-record-title" className="text-lg font-bold">
        Delete {kind}?
      </h2>
      <p className="my-3 break-words">
        This permanently deletes <strong>{name}</strong>.
      </p>
      {error && (
        <p role="alert" className="my-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {linked &&
        options &&
        (options.length ? (
          <label className="block text-sm">
            Transfer all linked records to
            <select
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              disabled={busy}
              className="my-2 block w-full rounded border p-2"
            >
              <option value="">Choose a replacement {kind}</option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            This changes the {kind} assigned to the linked records, including
            student history.
          </label>
        ) : (
          <p>Create another {kind} to receive these records first.</p>
        ))}
      <div className="mt-5 flex justify-end gap-3">
        <button autoFocus disabled={busy} onClick={close}>
          Cancel
        </button>
        <button
          disabled={busy || (linked && !replacement)}
          onClick={submit}
          className="rounded bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Deleting…" : linked ? "Transfer and delete" : "Delete"}
        </button>
      </div>
    </dialog>
  );
}
