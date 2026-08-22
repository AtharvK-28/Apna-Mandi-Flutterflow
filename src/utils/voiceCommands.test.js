import { describe, expect, it } from 'vitest';
import { INTENTS, describeCommand, parseVoiceCommand } from './voiceCommands';

describe('intent matching', () => {
  it('recognises a supply order in English', () => {
    const command = parseVoiceCommand('order 10 kg onions');
    expect(command.intent).toBe(INTENTS.ORDER);
    expect(command.quantity).toBe(10);
    expect(command.unit).toBe('kg');
    expect(command.item).toBe('Onions');
  });

  it('recognises the same order in romanised Hindi', () => {
    // Vendors code-switch constantly; both phrasings must reach one place.
    const command = parseVoiceCommand('kal ke liye 10 kilo pyaaz mangwa do');
    expect(command.intent).toBe(INTENTS.ORDER);
    expect(command.quantity).toBe(10);
    expect(command.unit).toBe('kg');
    expect(command.item).toBe('Onions');
  });

  it('recognises Devanagari, which is what hi-IN dictation returns', () => {
    const command = parseVoiceCommand('10 किलो प्याज मंगवा दो');
    expect(command.intent).toBe(INTENTS.ORDER);
    expect(command.item).toBe('Onions');
    expect(command.unit).toBe('kg');
  });

  it('recognises Marathi vocabulary for the same goods', () => {
    const command = parseVoiceCommand('20 kilo kanda pahije');
    expect(command.intent).toBe(INTENTS.ORDER);
    expect(command.item).toBe('Onions');
    expect(command.quantity).toBe(20);
  });

  it('recognises a hiring request', () => {
    expect(parseVoiceCommand('aaj shaam ke liye helper chahiye').intent).toBe(INTENTS.GIG);
    expect(parseVoiceCommand('need a karigar for tonight').intent).toBe(INTENTS.GIG);
  });

  it('recognises a surplus listing', () => {
    const command = parseVoiceCommand('3 litre batter surplus mein daal do');
    expect(command.intent).toBe(INTENTS.SURPLUS);
    expect(command.quantity).toBe(3);
    expect(command.unit).toBe('litre');
    expect(command.item).toBe('Batter');
  });

  it('reads spoken numbers as well as digits', () => {
    expect(parseVoiceCommand('das kilo aloo chahiye').quantity).toBe(10);
    expect(parseVoiceCommand('order five kg rice').quantity).toBe(5);
  });

  it('says it did not understand rather than guessing', () => {
    // Guessing an intent here would put something in a real cart.
    for (const phrase of ['what is the weather', 'hello there', '']) {
      expect(parseVoiceCommand(phrase).intent).toBe(INTENTS.UNKNOWN);
    }
  });

  it('never returns a route for an unrecognised command', () => {
    expect(parseVoiceCommand('sing me a song').route).toBeNull();
  });

  it('handles a matched intent with no quantity or item', () => {
    const command = parseVoiceCommand('I need to order supplies');
    expect(command.intent).toBe(INTENTS.ORDER);
    expect(command.quantity).toBeNull();
    expect(command.item).toBeNull();
    expect(describeCommand(command)).toBe('Start a supply order');
  });

  it('tolerates null and undefined without throwing', () => {
    expect(parseVoiceCommand(undefined).intent).toBe(INTENTS.UNKNOWN);
    expect(parseVoiceCommand(null).intent).toBe(INTENTS.UNKNOWN);
  });
});

describe('readback', () => {
  it('describes what will happen before it happens', () => {
    expect(describeCommand(parseVoiceCommand('10 kilo pyaaz mangwa do')))
      .toBe('Order 10 kg Onions');
    expect(describeCommand(parseVoiceCommand('helper chahiye')))
      .toBe('Post a gig on Karigar Connect');
  });

  it('has nothing to describe when nothing was understood', () => {
    expect(describeCommand(parseVoiceCommand('blah blah'))).toBeNull();
  });
});
