import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Modal from '../../../components/ui/Modal';
import { VOICE_LANGUAGES, useVoice } from '../../../contexts/VoiceContext';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { INTENTS, describeCommand, parseVoiceCommand } from '../../../utils/voiceCommands';
import { useCart } from '../../../contexts/CartContext';
import { useToast } from '../../../contexts/ToastContext';

/**
 * Bolo Mandi — speak instead of tapping, for a vendor whose hands are busy.
 *
 * This previously opened no microphone at all: you tapped one of three
 * pre-written phrases, a 1,800 ms timer ran, and it revealed the "transcript"
 * it already had. It also advertised "Hindi, Marathi, Tamil & 6 more". It now
 * records real speech, matches it with the keyword parser in
 * utils/voiceCommands, and claims only the languages actually available.
 */

const EXAMPLES = [
  { text: '10 kilo pyaaz mangwa do', gloss: 'Order 10 kg onions', icon: 'ShoppingCart' },
  { text: 'Aaj shaam ke liye helper chahiye', gloss: 'Need a helper this evening', icon: 'Wrench' },
  { text: '3 litre batter surplus mein daal do', gloss: 'List 3 L batter as surplus', icon: 'RefreshCw' },
];

const BoloMandi = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();
  const { language, setLanguage, canListen, recognitionSupported } = useVoice();

  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState(null);
  const [heard, setHeard] = useState('');

  const { isListening, interim, error, start, stop, clearError } = useSpeechRecognition({
    onInterim: setHeard,
    onResult: (transcript) => {
      setHeard(transcript);
      setCommand(parseVoiceCommand(transcript));
    },
  });

  const reset = () => {
    setCommand(null);
    setHeard('');
    clearError();
  };

  const close = () => {
    stop();
    reset();
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (command.intent === INTENTS.ORDER) {
      addToCart(
        {
          id: `voice-${Date.now()}`,
          name: command.item ?? 'Voice order item',
          price: 30,
          unit: command.unit ?? 'kg',
          supplierName: 'Veggie World',
          category: 'vegetables',
        },
        command.quantity ?? 1,
      );
      toast.success(`Added to cart from voice: ${describeCommand(command)}.`);
    } else {
      toast.info(`Opening ${command.label} — finish the details there.`);
    }

    const target = command.route;
    close();
    if (target) navigate(target);
  };

  const summary = command ? describeCommand(command) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="press fixed bottom-8 left-4 w-14 h-14 bg-turmeric text-ink rounded-2xl shadow-lg flex items-center justify-center hover:brightness-95 transition z-40"
        aria-label="Bolo Mandi — order and hire by voice"
      >
        <Icon name="Mic" size={22} />
      </button>

      {isOpen && (
        <Modal
          title="Bolo Mandi"
          description="Hands busy? Say what you need."
          onClose={close}
        >
          {/* Dictation is Chrome, Edge and Safari only. Rather than showing a
              mic that cannot work, say why and leave the examples as a guide. */}
          {!recognitionSupported ? (
            <div className="flex items-start gap-3 bg-turmeric-light border border-turmeric/30 rounded-xl p-3.5 mb-4">
              <Icon name="Info" size={17} className="text-turmeric-dark flex-shrink-0 mt-0.5" />
              <p className="text-sm text-ink leading-relaxed">
                Your browser doesn&apos;t support voice input. Chrome, Edge and Safari do —
                everything here can still be done by tapping.
              </p>
            </div>
          ) : !canListen ? (
            <div className="flex items-start gap-3 bg-turmeric-light border border-turmeric/30 rounded-xl p-3.5 mb-4">
              <Icon name="MicOff" size={17} className="text-turmeric-dark flex-shrink-0 mt-0.5" />
              <p className="text-sm text-ink leading-relaxed">
                Voice is switched off, or this page isn&apos;t on a secure connection. Turn it back
                on under Profile → Settings.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <label htmlFor="bolo-language" className="text-xs font-semibold text-ink-medium">
                  Speaking in
                </label>
                <select
                  id="bolo-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm font-semibold bg-paper border border-paper-dark rounded-lg px-2.5 py-1.5 text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                >
                  {VOICE_LANGUAGES.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.native}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-center py-4">
                <button
                  type="button"
                  onClick={isListening ? stop : start}
                  aria-label={isListening ? 'Stop listening' : 'Start listening'}
                  aria-pressed={isListening}
                  className={`press relative w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                    isListening ? 'bg-chili text-white' : 'bg-turmeric text-ink'
                  }`}
                >
                  {isListening && (
                    <span className="absolute inset-0 rounded-full bg-chili/40 animate-ping" />
                  )}
                  <Icon name={isListening ? 'Square' : 'Mic'} size={30} />
                </button>

                <p className="text-sm font-bold text-ink mt-3" role="status" aria-live="polite">
                  {isListening ? 'Listening…' : heard ? 'Got it' : 'Tap and speak'}
                </p>

                {(heard || interim) && (
                  <p className="text-sm text-ink-light italic mt-1 text-center max-w-sm">
                    “{heard || interim}”
                  </p>
                )}
              </div>

              {error && (
                <p role="alert" className="text-sm text-chili text-center mb-3">
                  {error}
                </p>
              )}

              {/* What was understood, shown for confirmation before anything
                  is added to a cart or posted. */}
              {command && command.intent !== INTENTS.UNKNOWN && (
                <div className="border border-terracotta/30 bg-terracotta-light rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon name={command.icon} size={14} className="text-terracotta-dark" />
                    <p className="text-[11px] font-bold text-terracotta-dark uppercase tracking-wide">
                      {command.label}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-ink">{summary}</p>
                  <p className="text-xs text-ink-medium mt-1">
                    Check this is right before confirming.
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={reset}
                      className="press flex-1 text-sm font-bold text-ink-light border border-paper-dark bg-paper-light px-4 py-2.5 rounded-xl hover:bg-paper-dark/40 transition-colors"
                    >
                      Try again
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="press flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-bold text-white bg-terracotta px-4 py-2.5 rounded-xl hover:bg-terracotta-dark transition-colors"
                    >
                      <Icon name="Check" size={15} />
                      Confirm
                    </button>
                  </div>
                </div>
              )}

              {command && command.intent === INTENTS.UNKNOWN && (
                <div className="border border-paper-dark bg-paper rounded-xl p-4 mb-4">
                  <p className="text-sm font-bold text-ink">Didn&apos;t catch that one</p>
                  <p className="text-xs text-ink-medium mt-1 leading-relaxed">
                    Bolo Mandi understands supply orders, karigar gigs and surplus listings. Try one
                    of the examples below, or do it by tapping instead.
                  </p>
                </div>
              )}
            </>
          )}

          <div>
            <p className="text-[11px] font-semibold text-ink-medium uppercase tracking-wide mb-2">
              Things you can say
            </p>
            <ul className="space-y-2">
              {EXAMPLES.map((example) => (
                <li
                  key={example.text}
                  className="flex items-center gap-3 p-3 rounded-xl border border-paper-dark bg-paper"
                >
                  <Icon name={example.icon} size={15} className="text-terracotta flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">“{example.text}”</p>
                    <p className="text-xs text-ink-medium">{example.gloss}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BoloMandi;
