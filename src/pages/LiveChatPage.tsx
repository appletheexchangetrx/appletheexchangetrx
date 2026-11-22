import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  MoreHorizontal,
  Paperclip,
  Send,
  Smile,
} from 'lucide-react';
import { AppleLogoMark } from '../components/layout/AppShell';
import { StandaloneShell } from '../components/layout/StandaloneShell';
import { BottomSheet } from '../components/ui/Overlay';
import { useStore } from '../context/StoreContext';
import { STORE_BRAND } from '../data/catalog';

const QUICK_TOPICS = [
  'iPhone 18 Pro Max stock?',
  'Store hours at TRX?',
  'Shipping fee RM 52?',
  'Payment status',
];

const QUICK_EMOJIS = ['👍', '🙏', '📱', '💻', '⌚', '🎧'];

export const LiveChatPage: React.FC = () => {
  const {
    chatMessages,
    isSpecialistTyping,
    sendChatMessage,
    clearChatMessages,
    goBack,
    navigate,
  } = useStore();

  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSpecialistTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendChatMessage(input);
    setInput('');
    setEmojiOpen(false);
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <StandaloneShell
      customHeader={
        <div className="h-[56px] px-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => goBack('/')}
              aria-label="Go back"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] shrink-0"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.8} />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#1D1D1F] dark:bg-[#F5F5F7] text-white dark:text-[#1D1D1F] flex items-center justify-center shrink-0">
              <AppleLogoMark className="w-5 h-5" inverted />
            </div>
            <div className="min-w-0 pl-1">
              <div className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                Apple TRX Specialist
              </div>
              <div className="text-[11px] font-medium text-[#248A3D] dark:text-[#30D158]">
                Available · Kuala Lumpur
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Chat options"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] shrink-0"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      }
      bottomAction={
        <div className="flex flex-col gap-2">
          {topicsOpen && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    sendChatMessage(topic);
                    setTopicsOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[12px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] whitespace-nowrap shrink-0"
                >
                  {topic}
                </button>
              ))}
            </div>
          )}

          {emojiOpen && (
            <div className="flex items-center gap-2 pb-1">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setInput((prev) => `${prev}${emoji}`)}
                  className="w-9 h-9 rounded-lg bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[18px] flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTopicsOpen((o) => !o)}
              aria-label="Quick topics"
              className="w-[40px] h-[44px] flex items-center justify-center rounded-xl text-[#6E6E73] dark:text-[#A1A1A6] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] shrink-0"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Apple TRX Specialist..."
              aria-label="Chat message"
              className="flex-1 min-w-0 h-[44px] px-3.5 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#86868B] focus:outline-none focus:border-[#0071E3]"
            />

            <button
              type="button"
              onClick={() => setEmojiOpen((o) => !o)}
              aria-label="Insert emoji"
              className="w-[40px] h-[44px] flex items-center justify-center rounded-xl text-[#6E6E73] dark:text-[#A1A1A6] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] shrink-0"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="w-[44px] h-[44px] rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      }
    >
      <div className="px-4 py-4 flex flex-col gap-3">
        {/* ConversationInfo */}
        <div className="text-center py-2">
          <span className="text-[11px] font-medium text-[#86868B]">
            Today · {STORE_BRAND.name}
          </span>
        </div>

        {/* MessageList */}
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-[16px] px-3.5 py-2.5 text-[14px] leading-relaxed ${
                  isUser
                    ? 'bg-[#0071E3] dark:bg-[#2997FF] text-white rounded-br-[4px]'
                    : 'bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] rounded-bl-[4px]'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-[#86868B] mt-1 px-1 tabular-nums">
                {formatTime(msg.timestamp)}
                {isUser && msg.status ? ` · ${msg.status}` : ''}
              </span>
            </div>
          );
        })}

        {isSpecialistTyping && (
          <div className="flex items-start">
            <div className="rounded-[16px] rounded-bl-[4px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] px-3.5 py-2.5 text-[13px] text-[#6E6E73] dark:text-[#A1A1A6]">
              Specialist is typing...
            </div>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      <BottomSheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Support Options">
        <div className="flex flex-col gap-2.5">
          <div className="rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] p-3.5 text-[13px] text-[#6E6E73] dark:text-[#A1A1A6]">
            <div className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {STORE_BRAND.name}
            </div>
            <p className="mt-1">{STORE_BRAND.address}</p>
            <p className="mt-1">Hours: {STORE_BRAND.hours}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              navigate('/orders');
            }}
            className="w-full h-[48px] px-4 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] text-left text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]"
          >
            View My Orders
          </button>
          <button
            type="button"
            onClick={() => {
              clearChatMessages();
              setMenuOpen(false);
            }}
            className="w-full h-[48px] px-4 rounded-[12px] bg-[#D70015]/10 dark:bg-[#FF453A]/15 text-left text-[14px] font-semibold text-[#D70015] dark:text-[#FF453A]"
          >
            Clear Conversation
          </button>
        </div>
      </BottomSheet>
    </StandaloneShell>
  );
};
