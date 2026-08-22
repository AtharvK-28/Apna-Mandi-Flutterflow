import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import PageShell from '../../../components/ui/PageShell';
import EmptyState from '../../../components/ui/EmptyState';
import VoiceInput from '../../../components/ui/VoiceInput';
import { useWork } from '../../../contexts/WorkContext';

const formatSent = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

const Messages = () => {
  const { messages, applications, sendMessage } = useWork();
  const [draft, setDraft] = useState('');
  const [activeThread, setActiveThread] = useState(null);

  // Every vendor you have applied to is someone you can message. Threads are
  // grouped by vendor so a karigar sees conversations, not a flat log.
  const threads = useMemo(() => {
    const byVendor = new Map();

    applications.forEach((application) => {
      if (!byVendor.has(application.vendor)) {
        byVendor.set(application.vendor, {
          id: application.vendor,
          name: application.vendor,
          context: application.gigTitle,
          messages: [],
        });
      }
    });

    messages.forEach((message) => {
      const key = message.recipientName;
      if (!byVendor.has(key)) {
        byVendor.set(key, { id: key, name: key, context: null, messages: [] });
      }
      byVendor.get(key).messages.push(message);
    });

    return Array.from(byVendor.values());
  }, [applications, messages]);

  const selected = threads.find((t) => t.id === activeThread) ?? threads[0] ?? null;

  const handleSend = (event) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selected) return;
    sendMessage({ id: selected.id, name: selected.name }, body);
    setDraft('');
  };

  if (!threads.length) {
    return (
      <PageShell title="Messages" subtitle="Conversations with the vendors you work for.">
        <EmptyState
          icon="MessageSquare"
          title="No conversations yet"
          description="Once you apply for a shift you can message the vendor here to sort out timings, tools and directions."
          action={
            <Link
              to="/karigar/find-work"
              className="press inline-flex items-center gap-2 text-sm font-bold text-white bg-terracotta px-4 py-2.5 rounded-xl hover:bg-terracotta-dark transition-colors"
            >
              <Icon name="Search" size={15} />
              Find work near you
            </Link>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell title="Messages" subtitle="Conversations with the vendors you work for.">
      <div className="grid lg:grid-cols-[280px_1fr] gap-3">
        {/* Thread list */}
        <aside className="card-warm overflow-hidden self-start">
          <ul className="divide-y divide-paper-dark/50">
            {threads.map((thread) => {
              const latest = thread.messages[0];
              const isActive = selected?.id === thread.id;

              return (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => setActiveThread(thread.id)}
                    aria-current={isActive}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                      isActive ? 'bg-terracotta-light' : 'hover:bg-paper-dark/30'
                    }`}
                  >
                    <span className="w-9 h-9 rounded-xl bg-paper-dark/60 text-ink-light flex items-center justify-center flex-shrink-0">
                      <Icon name="Store" size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-ink truncate">{thread.name}</p>
                      <p className="text-xs text-ink-medium truncate">
                        {latest ? latest.body : thread.context ?? 'No messages yet'}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Conversation */}
        <section className="card-warm flex flex-col min-h-[420px]">
          <header className="px-4 py-3 border-b border-paper-dark/70 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-terracotta-light text-terracotta-dark flex items-center justify-center flex-shrink-0">
              <Icon name="Store" size={18} />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-[15px] text-ink truncate">{selected.name}</p>
              {selected.context && (
                <p className="text-xs text-ink-medium truncate">Re: {selected.context}</p>
              )}
            </div>
          </header>

          <div className="flex-1 px-4 py-4 flex flex-col-reverse gap-2.5 overflow-y-auto">
            {selected.messages.length ? (
              selected.messages.map((message) => (
                <div key={message.id} className="self-end max-w-[75%]">
                  <div className="bg-terracotta text-white rounded-2xl rounded-br-md px-3.5 py-2.5">
                    <p className="text-sm leading-relaxed">{message.body}</p>
                  </div>
                  <p className="text-[10px] font-semibold text-ink-medium mt-1 text-right">
                    {formatSent(message.sentAt)} · {message.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink-medium text-center my-auto">
                Say hello — ask about timings, what to bring, or how to find the stall.
              </p>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="px-4 py-3 border-t border-paper-dark/70 flex items-center gap-2"
          >
            <label htmlFor="message-body" className="sr-only">
              Message {selected.name}
            </label>
            <input
              id="message-body"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${selected.name}`}
              className="flex-1 bg-paper border border-paper-dark rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-medium focus:outline-none focus:ring-2 focus:ring-terracotta/40"
            />
            <VoiceInput
              label="a message"
              onTranscript={(text) => setDraft((prev) => (prev ? `${prev} ${text}` : text))}
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="press w-10 h-10 rounded-xl bg-terracotta text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-terracotta-dark transition-colors flex-shrink-0"
              aria-label="Send message"
            >
              <Icon name="Send" size={17} />
            </button>
          </form>
        </section>
      </div>
    </PageShell>
  );
};

export default Messages;
