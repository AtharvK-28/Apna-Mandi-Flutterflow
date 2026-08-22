import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Modal from '../../../components/ui/Modal';
import VoiceInput from '../../../components/ui/VoiceInput';
import { useAuth } from '../../../contexts/AuthContext';

const GIG_TYPE_OPTIONS = [
  { value: 'emergency', label: 'Emergency cover — someone today' },
  { value: 'prep', label: 'Prep help — chopping, packing, setup' },
  { value: 'training', label: 'Skill training — teach me something' },
];

const DATE_OPTIONS = [
  { value: 'Today', label: 'Today' },
  { value: 'Tomorrow', label: 'Tomorrow' },
  { value: 'This week', label: 'This week' },
  { value: 'Next week', label: 'Next week' },
];

const EMPTY = {
  title: '',
  description: '',
  gigType: 'emergency',
  skills: '',
  date: 'Today',
  time: '',
  duration: '',
  rate: '',
};

const PostGigModal = ({ onClose, onSubmit }) => {
  const { user, displayName } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const totalPay = useMemo(() => {
    const hours = Number(form.duration) || 0;
    const rate = Number(form.rate) || 0;
    return hours * rate;
  }, [form.duration, form.rate]);

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Give the shift a name karigars will recognise';
    if (!form.description.trim()) next.description = 'Describe what the work involves';
    if (!form.skills.trim()) next.skills = 'List at least one skill';
    if (!form.time.trim()) next.time = 'Add the hours, e.g. 5:00 PM - 10:00 PM';
    if (!(Number(form.duration) > 0)) next.duration = 'Duration must be more than zero';
    if (!(Number(form.rate) > 0)) next.rate = 'Rate must be more than zero';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      skills: form.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      duration: `${form.duration} hours`,
      rate: Number(form.rate),
      totalPay,
      // A gig is posted by whoever is signed in, so it carries their stall.
      vendor: displayName ?? 'Your stall',
      vendorPhone: user?.phone ? `+91 ${user.phone}` : '',
      vendorRating: 4.5,
      vendorLocation: user?.location ?? 'Your location',
      urgency: form.gigType === 'emergency' ? 'high' : 'medium',
      distance: 'Your stall',
      foodImage: '/assets/images/orange.jpeg',
    });
  };

  return (
    <Modal
      title="Post a gig"
      description="Karigars nearby will see this straight away."
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold text-ink-medium uppercase tracking-wide">
              Total for the shift
            </p>
            <p className="font-display font-extrabold text-xl text-leaf-dark leading-none mt-0.5">
              {totalPay ? `₹${totalPay.toLocaleString('en-IN')}` : '—'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="press text-sm font-bold text-ink-light px-4 py-2.5 rounded-xl border border-paper-dark hover:bg-paper-dark/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="post-gig-form"
              className="press inline-flex items-center gap-2 text-sm font-bold text-white bg-terracotta px-5 py-2.5 rounded-xl hover:bg-terracotta-dark transition-colors"
            >
              <Icon name="Briefcase" size={15} />
              Post gig
            </button>
          </div>
        </div>
      }
    >
      <form id="post-gig-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="What do you need?"
          value={form.title}
          onChange={(e) => set('title')(e.target.value)}
          placeholder="Emergency juice stall cover"
          error={errors.title}
          required
        />

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label htmlFor="gig-description" className="block text-sm font-medium text-ink">
              Describe the work
            </label>
            {/* The longest field in the app, and the one a vendor is most
                likely to be filling in with one hand mid-service. */}
            <VoiceInput
              label="the description"
              onTranscript={(text) =>
                set('description')(form.description ? `${form.description} ${text}` : text)
              }
            />
          </div>
          <textarea
            id="gig-description"
            value={form.description}
            onChange={(e) => set('description')(e.target.value)}
            placeholder="What they will be doing, what equipment is there, anything they should know before arriving."
            rows={3}
            aria-invalid={!!errors.description}
            className="w-full px-3 py-2.5 border border-paper-dark rounded-xl bg-paper text-sm text-ink placeholder:text-ink-medium resize-none focus:outline-none focus:ring-2 focus:ring-terracotta/40"
          />
          {errors.description && (
            <p className="text-xs text-chili mt-1.5">{errors.description}</p>
          )}
        </div>

        <Select
          label="Kind of help"
          value={form.gigType}
          onChange={set('gigType')}
          options={GIG_TYPE_OPTIONS}
        />

        <Input
          label="Skills needed"
          description="Separate with commas"
          value={form.skills}
          onChange={(e) => set('skills')(e.target.value)}
          placeholder="Juice making, cash handling"
          error={errors.skills}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Select label="Day" value={form.date} onChange={set('date')} options={DATE_OPTIONS} />
          <Input
            label="Hours"
            value={form.time}
            onChange={(e) => set('time')(e.target.value)}
            placeholder="5:00 PM - 10:00 PM"
            error={errors.time}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Duration (hours)"
            type="number"
            min="1"
            value={form.duration}
            onChange={(e) => set('duration')(e.target.value)}
            placeholder="5"
            error={errors.duration}
            required
          />
          <Input
            label="Rate (₹ per hour)"
            type="number"
            min="1"
            value={form.rate}
            onChange={(e) => set('rate')(e.target.value)}
            placeholder="150"
            error={errors.rate}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default PostGigModal;
