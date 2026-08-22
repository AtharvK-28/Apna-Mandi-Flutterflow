import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import PageShell from '../../components/ui/PageShell';
import Modal from '../../components/ui/Modal';
import InstallAppCard from '../../components/ui/InstallAppCard';
import SwachhBadgeCard from './components/SwachhBadgeCard';
import CartWarisCard from './components/CartWarisCard';
import { ROLES } from '../../config/roles';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { VOICE_LANGUAGES, useVoice } from '../../contexts/VoiceContext';
import { useWork } from '../../contexts/WorkContext';

/**
 * One profile page, adapted per role.
 *
 * The version this replaces hardcoded "Rajesh Kumar" regardless of who was
 * signed in, injected its own Google Fonts so the whole page rendered in
 * different typefaces from the rest of the app, offered a "Dark Mode" switch
 * wired to a local boolean that did nothing, had a Sign Out button with no
 * handler, and let anyone change their account type from vendor to supplier
 * with one click.
 */

/* ── Building blocks ───────────────────────────────────────────────────────── */

const Avatar = ({ name, src, size = 88 }) => {
  const initials = name
    ? name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : null;

  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={{ width: size, height: size }}
        className="rounded-2xl object-cover ring-4 ring-paper-light shadow-lg"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      className="rounded-2xl ring-4 ring-paper-light shadow-lg flex items-center justify-center bg-gradient-to-br from-terracotta to-chili text-white font-display font-extrabold"
    >
      {initials ?? <Icon name="User" size={size * 0.4} />}
    </div>
  );
};

const Card = ({ title, action, children }) => (
  <section className="card-warm p-5">
    {(title || action) && (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-ink-medium uppercase tracking-widest">{title}</h2>
        {action}
      </div>
    )}
    {children}
  </section>
);

const Field = ({ label, value, icon, editing, onChange, type = 'text', locked }) => {
  const id = `field-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold text-ink-medium uppercase tracking-wider mb-1.5"
      >
        {label}
      </label>
      {editing && !locked ? (
        <div className="relative">
          <Icon
            name={icon}
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-medium pointer-events-none"
          />
          <input
            id={id}
            type={type}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-paper border border-paper-dark rounded-xl text-ink text-sm font-medium focus:outline-none focus:ring-2 focus:ring-terracotta/40"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2.5 py-2">
          <Icon name={icon} size={15} className="text-ink-medium flex-shrink-0" />
          <span className="text-ink font-medium text-sm">{value || '—'}</span>
          {locked && (
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-ink-medium bg-paper-dark/60 px-2 py-0.5 rounded-full">
              <Icon name="Lock" size={9} />
              Verified
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const Toggle = ({ label, description, icon, value, onChange }) => (
  <div className="flex items-center justify-between gap-4 py-3.5 border-b border-paper-dark/60 last:border-0">
    <div className="flex items-center gap-3 min-w-0">
      <span className="w-8 h-8 bg-paper-dark/50 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon name={icon} size={15} className="text-ink-medium" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{label}</p>
        {description && <p className="text-xs text-ink-medium">{description}</p>}
      </div>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        value ? 'bg-terracotta' : 'bg-paper-dark'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-paper-light rounded-full shadow transition-transform ${
          value ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  </div>
);

const LinkRow = ({ icon, label, sub, tone = 'default', onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
      tone === 'danger' ? 'hover:bg-chili-light' : 'hover:bg-paper-dark/40'
    }`}
  >
    <span
      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        tone === 'danger' ? 'bg-chili-light text-chili' : 'bg-paper-dark/50 text-ink-medium'
      }`}
    >
      <Icon name={icon} size={15} />
    </span>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-semibold ${tone === 'danger' ? 'text-chili' : 'text-ink'}`}>
        {label}
      </p>
      <p className="text-xs text-ink-medium">{sub}</p>
    </div>
    <Icon name="ChevronRight" size={16} className="text-ink-medium/60 flex-shrink-0" />
  </button>
);

/* ── Page ──────────────────────────────────────────────────────────────────── */

const Profile = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { user, displayName, role, roleMeta, signOut, forgetDevice } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const voice = useVoice();
  const { earnings, applications } = useWork();

  const [tab, setTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Editable fields come from the session, so the page shows the person who is
  // actually signed in rather than a fixed demo profile.
  const [profile, setProfile] = useState(() => ({
    name: displayName ?? '',
    phone: user?.phone ? `+91 ${user.phone}` : '',
    location: user?.location ?? user?.businessAddress ?? '',
    bio: user?.bio ?? '',
  }));
  const [draft, setDraft] = useState(profile);

  const [settings, setSettings] = useState({
    dealAlerts: true,
    orderUpdates: true,
    newsletter: false,
    locationShare: true,
  });

  const isVendor = role === ROLES.VENDOR;
  const isKarigar = role === ROLES.KARIGAR;

  // Stats mean different things to different roles — a karigar has no orders
  // placed, and a supplier has no shifts worked.
  const stats = useMemo(() => {
    if (isKarigar) {
      return [
        { icon: 'Briefcase', value: String(earnings.shiftCount), label: 'Shifts', tint: 'bg-terracotta-light text-terracotta-dark' },
        { icon: 'Star', value: earnings.averageRating ?? '—', label: 'Rating', tint: 'bg-turmeric-light text-turmeric-dark' },
        { icon: 'ClipboardList', value: String(applications.length), label: 'Applied', tint: 'bg-leaf-light text-leaf-dark' },
        { icon: 'IndianRupee', value: `₹${(earnings.totalPaid / 1000).toFixed(1)}k`, label: 'Earned', tint: 'bg-chili-light text-chili' },
      ];
    }
    if (isVendor) {
      return [
        { icon: 'ShoppingBag', value: '47', label: 'Orders', tint: 'bg-terracotta-light text-terracotta-dark' },
        { icon: 'Star', value: '4.9', label: 'Rating', tint: 'bg-turmeric-light text-turmeric-dark' },
        { icon: 'Wrench', value: '12', label: 'Gigs posted', tint: 'bg-leaf-light text-leaf-dark' },
        { icon: 'TrendingDown', value: '₹12k', label: 'Saved', tint: 'bg-chili-light text-chili' },
      ];
    }
    return [
      { icon: 'Package', value: '312', label: 'Orders filled', tint: 'bg-terracotta-light text-terracotta-dark' },
      { icon: 'Star', value: '4.8', label: 'Rating', tint: 'bg-turmeric-light text-turmeric-dark' },
      { icon: 'Users', value: '38', label: 'Vendors', tint: 'bg-leaf-light text-leaf-dark' },
      { icon: 'Truck', value: '3', label: 'Routes', tint: 'bg-chili-light text-chili' },
    ];
  }, [applications.length, earnings, isKarigar, isVendor]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ];

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAvatar = (event) => {
    const file = event.target.files?.[0];
    if (file) setAvatarSrc(URL.createObjectURL(file));
  };

  const setField = (key) => (value) => setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <PageShell title="" documentTitle="Profile — Apna Mandi" width="narrow">
      {/* Identity */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div className="flex items-end gap-4 min-w-0">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative group flex-shrink-0 rounded-2xl"
            aria-label="Change profile photo"
          >
            <Avatar name={profile.name} src={avatarSrc} />
            <span className="absolute inset-0 rounded-2xl bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Icon name="Camera" size={20} className="text-white" />
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
          </button>

          <div className="min-w-0 pb-1">
            <h1 className="font-display font-extrabold text-2xl text-ink truncate">
              {profile.name || 'Add your name'}
            </h1>
            <p className="text-ink-medium text-sm flex items-center gap-1.5 mt-0.5">
              {roleMeta && <Icon name={roleMeta.icon} size={13} />}
              {roleMeta?.label}
              {profile.location && (
                <>
                  <span aria-hidden>·</span>
                  <Icon name="MapPin" size={12} />
                  <span className="truncate">{profile.location}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0 pb-1">
          {editing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setDraft(profile);
                  setEditing(false);
                }}
                className="press px-4 py-2 text-sm font-bold text-ink-light bg-paper-light border border-paper-dark rounded-xl hover:bg-paper-dark/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="press px-4 py-2 text-sm font-bold text-white bg-terracotta rounded-xl hover:bg-terracotta-dark transition-colors flex items-center gap-1.5"
              >
                <Icon name="Check" size={15} />
                Save
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="press px-4 py-2 text-sm font-bold text-terracotta-dark bg-terracotta-light border border-terracotta/30 rounded-xl hover:brightness-95 transition flex items-center gap-1.5"
            >
              <Icon name="Pencil" size={14} />
              Edit
            </button>
          )}
        </div>
      </div>

      {profile.bio && !editing && (
        <p className="text-sm text-ink-light leading-relaxed mb-5">{profile.bio}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {stats.map((stat) => (
          <div key={stat.label} className="card-warm p-3 flex flex-col items-center text-center gap-1">
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center mb-0.5 ${stat.tint}`}>
              <Icon name={stat.icon} size={17} />
            </span>
            <span className="font-display font-extrabold text-lg text-ink leading-none">
              {stat.value}
            </span>
            <span className="text-[10px] text-ink-medium font-semibold leading-tight">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Profile sections"
        className="flex items-center gap-1 bg-paper-light border border-paper-dark rounded-2xl p-1 mb-5"
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`press flex-1 inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${
              tab === item.id
                ? 'bg-terracotta text-white'
                : 'text-ink-light hover:text-ink hover:bg-paper-dark/50'
            }`}
          >
            <Icon name={item.icon} size={15} />
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="space-y-4">
          {isVendor && (
            <>
              <SwachhBadgeCard vendorName={profile.name || 'Your stall'} />
              <CartWarisCard />
            </>
          )}

          <Card title="Personal details">
            <div className="space-y-3 divide-y divide-paper-dark/50">
              <Field
                label="Full name"
                icon="User"
                value={editing ? draft.name : profile.name}
                editing={editing}
                onChange={setField('name')}
              />
              <div className="pt-3">
                <Field
                  label="Phone number"
                  icon="Phone"
                  value={profile.phone}
                  editing={editing}
                  locked
                />
              </div>
              <div className="pt-3">
                <Field
                  label="Location"
                  icon="MapPin"
                  value={editing ? draft.location : profile.location}
                  editing={editing}
                  onChange={setField('location')}
                />
              </div>
            </div>
          </Card>

          <Card title="About">
            {editing ? (
              <textarea
                value={draft.bio}
                onChange={(e) => setField('bio')(e.target.value)}
                rows={3}
                placeholder="Tell other people on Apna Mandi what you do."
                className="w-full px-4 py-3 bg-paper border border-paper-dark rounded-xl text-ink text-sm resize-none focus:outline-none focus:ring-2 focus:ring-terracotta/40"
              />
            ) : (
              <p className="text-sm text-ink-light leading-relaxed">
                {profile.bio || 'Nothing here yet. Use Edit to add a short description.'}
              </p>
            )}
          </Card>

          {/* Account type is set at registration and verified against different
              documents per role, so it is shown but not editable — the old page
              let anyone switch from vendor to supplier with a single click. */}
          <Card title="Account type">
            <div className="flex items-center gap-3 p-3 bg-paper border border-paper-dark rounded-xl">
              <span className="w-10 h-10 rounded-xl bg-terracotta-light text-terracotta-dark flex items-center justify-center flex-shrink-0">
                <Icon name={roleMeta?.icon ?? 'User'} size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-ink">{roleMeta?.label}</p>
                <p className="text-xs text-ink-medium">{roleMeta?.tagline}</p>
              </div>
            </div>
            <p className="text-[11px] text-ink-medium mt-2.5 leading-relaxed">
              Your account type is verified at registration and cannot be changed here. Contact
              support if you need to trade under a different type.
            </p>
          </Card>

          <Card title="Account">
            <div className="space-y-1">
              <LinkRow
                icon="LogOut"
                label="Sign out"
                sub="Your profile stays on this device for a faster return"
                onClick={() => {
                  signOut();
                  navigate('/login', { replace: true });
                }}
              />
              <LinkRow
                icon="Trash2"
                label="Forget this device"
                sub="Remove your saved profile from this browser"
                tone="danger"
                onClick={() => setConfirmDelete(true)}
              />
            </div>
          </Card>
        </div>
      )}

      {tab === 'settings' && (
        <div className="space-y-4">
          <Card title="Notifications">
            <Toggle
              label="Deal alerts"
              description="Flash deals from suppliers near you"
              icon="Bell"
              value={settings.dealAlerts}
              onChange={(v) => setSettings((p) => ({ ...p, dealAlerts: v }))}
            />
            <Toggle
              label="Order updates"
              description="Status changes on anything you have placed"
              icon="Package"
              value={settings.orderUpdates}
              onChange={(v) => setSettings((p) => ({ ...p, orderUpdates: v }))}
            />
            <Toggle
              label="Weekly digest"
              description="A summary of deals and stories every Monday"
              icon="Mail"
              value={settings.newsletter}
              onChange={(v) => setSettings((p) => ({ ...p, newsletter: v }))}
            />
          </Card>

          <Card title="Privacy and appearance">
            <Toggle
              label="Share location"
              description="Used to show what is genuinely nearby"
              icon="MapPin"
              value={settings.locationShare}
              onChange={(v) => setSettings((p) => ({ ...p, locationShare: v }))}
            />
            {/* Wired to the real theme context — this switch used to flip a
                local boolean and change nothing on screen. */}
            <Toggle
              label="Dark mode"
              description="Easier on the eyes during early morning prep"
              icon="Moon"
              value={isDarkMode}
              onChange={toggleTheme}
            />
          </Card>

          <Card title="Voice">
            <Toggle
              label="Voice features"
              description="Read-aloud buttons and dictate-by-microphone"
              icon="Mic"
              value={voice.enabled}
              onChange={voice.setEnabled}
            />

            {voice.enabled && (
              <div className="pt-3.5">
                <label
                  htmlFor="voice-language"
                  className="block text-[11px] font-semibold text-ink-medium uppercase tracking-wider mb-1.5"
                >
                  Dictation language
                </label>
                <select
                  id="voice-language"
                  value={voice.language}
                  onChange={(e) => voice.setLanguage(e.target.value)}
                  className="w-full bg-paper border border-paper-dark rounded-xl px-3 py-2.5 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                >
                  {VOICE_LANGUAGES.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.native} ({option.label})
                    </option>
                  ))}
                </select>

                <p className="text-xs text-ink-medium mt-2 flex items-start gap-1.5 leading-relaxed">
                  <Icon name="Info" size={13} className="flex-shrink-0 mt-0.5" />
                  This sets the language you speak in. Read-aloud is separate — summaries are
                  written in English and read in English.
                </p>

                {!voice.hasVoiceFor('en-IN') && (
                  <p className="text-xs text-ink-medium mt-2 flex items-start gap-1.5 leading-relaxed">
                    <Icon name="Volume2" size={13} className="flex-shrink-0 mt-0.5" />
                    Your device has no Indian English voice installed, so read-aloud will use its
                    default voice. Add one in your operating system&apos;s speech settings.
                  </p>
                )}

                {/* Dictation in Chrome uploads audio to Google for processing.
                    That is a material fact about a microphone feature and
                    belongs next to the switch, not buried in a policy page. */}
                <p className="text-xs text-ink-medium mt-3 flex items-start gap-1.5 leading-relaxed">
                  <Icon name="ShieldAlert" size={13} className="flex-shrink-0 mt-0.5" />
                  {voice.recognitionSupported
                    ? 'Dictation uses your browser’s speech service. In Chrome that means the audio you dictate is sent to Google for transcription. Reading aloud happens on your device.'
                    : 'Your browser doesn’t support dictation — Chrome, Edge and Safari do. Reading aloud works here and happens on your device.'}
                </p>
              </div>
            )}
          </Card>

          <Card title="App">
            <InstallAppCard />
            <p className="text-xs text-ink-medium leading-relaxed mt-3 flex items-start gap-1.5">
              <Icon name="CloudOff" size={13} className="flex-shrink-0 mt-0.5" />
              Apna Mandi keeps a copy of the pages you have opened, so it still opens when your
              signal drops. Anything you send &mdash; an order, a gig, a message &mdash; needs a
              connection.
            </p>
          </Card>

          <Card title="Support">
            <div className="space-y-1">
              {[
                { icon: 'HelpCircle', label: 'Help and FAQ', sub: 'Common questions answered' },
                { icon: 'MessageCircle', label: 'Contact support', sub: 'Chat with our team' },
                { icon: 'FileText', label: 'Privacy policy', sub: 'What we collect and why' },
                { icon: 'Shield', label: 'Terms of service', sub: 'The rules of using Apna Mandi' },
              ].map((item) => (
                <LinkRow key={item.label} {...item} />
              ))}
            </div>
          </Card>

          <p className="text-center text-xs text-ink-medium py-2">Apna Mandi v2.4.1</p>
        </div>
      )}

      {confirmDelete && (
        <Modal
          title="Forget this device?"
          onClose={() => setConfirmDelete(false)}
          size="narrow"
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="press text-sm font-bold text-ink-light px-4 py-2.5 rounded-xl border border-paper-dark hover:bg-paper-dark/40 transition-colors"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={() => {
                  forgetDevice();
                  navigate('/login', { replace: true });
                }}
                className="press text-sm font-bold text-white bg-chili px-4 py-2.5 rounded-xl hover:brightness-95 transition"
              >
                Forget device
              </button>
            </div>
          }
        >
          <p className="text-sm text-ink-light leading-relaxed">
            Your saved profile will be removed from this browser and you will need to register
            again on it. This does not delete your Apna Mandi account or your order history.
          </p>
        </Modal>
      )}

      {saved && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-paper-light px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold z-50"
        >
          <span className="w-5 h-5 bg-leaf rounded-full flex items-center justify-center">
            <Icon name="Check" size={12} className="text-white" />
          </span>
          Profile saved
        </div>
      )}
    </PageShell>
  );
};

export default Profile;
