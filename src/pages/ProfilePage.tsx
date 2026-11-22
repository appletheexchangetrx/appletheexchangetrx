import React, { useState } from 'react';
import {
  AlertCircle,
  Bell,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  MapPin,
  Moon,
  Package,
  Pencil,
  Sun,
  UserRound,
} from 'lucide-react';
import { AppleLogoMark } from '../components/layout/AppShell';
import { Modal } from '../components/ui/Overlay';
import { PhoneInput } from '../components/ui/PhoneInput';
import { useStore } from '../context/StoreContext';
import { STORE_BRAND } from '../data/catalog';

export const ProfilePage: React.FC = () => {
  const {
    isAuthenticated,
    checkPhoneExists,
    loginWithPhone,
    registerWithPhone,
    logoutAccount,
    profile,
    orders,
    unreadNotificationCount,
    theme,
    setTheme,
    navigate,
  } = useStore();

  const [authStage, setAuthStage] = useState<'phone' | 'login' | 'register'>('phone');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [helpOpen, setHelpOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const countByStatus = {
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped' || o.status === 'out_for_delivery').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  const handlePhoneContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (phone.replace(/\D/g, '').length < 8) {
      setAuthError('Please enter a valid Malaysian phone number.');
      return;
    }
    setAuthStage(checkPhoneExists(phone) ? 'login' : 'register');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const handleChangeNumber = () => {
    setAuthStage('phone');
    setAuthError(null);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (authStage === 'phone') return;
    if (authStage === 'register' && password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const res = authStage === 'register'
        ? await registerWithPhone({ name: fullName, phone, password })
        : await loginWithPhone({ phone, password });
      if (res.ok === false) {
        setAuthError(res.error);
        return;
      }
      setFullName('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setAuthStage('phone');
      setShowPassword(false);
    } catch {
      setAuthError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-5">
      {!isAuthenticated ? (
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-full bg-[#1D1D1F] dark:bg-[#F5F5F7] text-white dark:text-[#1D1D1F] flex items-center justify-center shrink-0">
              <AppleLogoMark className="w-6 h-6" inverted />
            </span>
            <div>
              <h1 className="text-[18px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {authStage === 'phone' ? 'Welcome' : authStage === 'login' ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
                {authStage === 'phone' ? 'Enter your phone number to continue' : authStage === 'login' ? 'Enter your password to access your account' : 'Create an account with your phone number'}
              </p>
            </div>
          </div>
          {authStage === 'phone' ? (
            <form onSubmit={handlePhoneContinue} className="flex flex-col gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">Phone Number</label>
                <PhoneInput value={phone} onChange={setPhone} showIcon placeholder="12-345 6789" />
              </div>
              {authError && (
                <div role="alert" className="rounded-[10px] bg-[#D70015]/10 dark:bg-[#FF453A]/15 border border-[#D70015]/30 p-2.5 flex items-center gap-2 text-[12px] font-medium text-[#D70015] dark:text-[#FF453A]">
                  <AlertCircle className="w-4 h-4 shrink-0" /><span>{authError}</span>
                </div>
              )}
              <button type="submit" className="mt-1 w-full h-[48px] rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#47A7FF] text-white text-[14px] font-semibold transition-colors">Continue</button>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] px-3.5 py-3">
                <div className="min-w-0">
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#A1A1A6]">Phone Number</p>
                  <p className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">+60 {phone}</p>
                </div>
                <button type="button" onClick={handleChangeNumber} className="text-[12px] font-semibold text-[#0071E3] dark:text-[#2997FF] shrink-0">Change</button>
              </div>
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3">
                {authStage === 'register' && (
                  <div>
                    <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">Full Name</label>
                    <div className="relative">
                      <UserRound className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Amirul Hakim" autoComplete="name" required className="w-full h-[48px] pl-10 pr-3.5 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#86868B] focus:outline-none focus:border-[#0071E3] dark:focus:border-[#2997FF]" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={authStage === 'register' ? 'Minimum 6 characters' : 'Enter password'} autoComplete={authStage === 'login' ? 'current-password' : 'new-password'} minLength={authStage === 'register' ? 6 : undefined} required className="w-full h-[48px] pl-10 pr-11 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#86868B] focus:outline-none focus:border-[#0071E3] dark:focus:border-[#2997FF]" />
                    <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-1 top-1/2 -translate-y-1/2 w-[40px] h-[40px] flex items-center justify-center rounded-lg text-[#6E6E73] dark:text-[#A1A1A6]">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {authStage === 'register' && (
                  <div>
                    <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" autoComplete="new-password" required className="w-full h-[48px] pl-10 pr-3.5 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#86868B] focus:outline-none focus:border-[#0071E3] dark:focus:border-[#2997FF]" />
                    </div>
                  </div>
                )}
                {authError && (
                  <div role="alert" className="rounded-[10px] bg-[#D70015]/10 dark:bg-[#FF453A]/15 border border-[#D70015]/30 p-2.5 flex items-center gap-2 text-[12px] font-medium text-[#D70015] dark:text-[#FF453A]">
                    <AlertCircle className="w-4 h-4 shrink-0" /><span>{authError}</span>
                  </div>
                )}
                <button type="submit" disabled={submitting} className="mt-1 w-full h-[48px] rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#47A7FF] text-white text-[14px] font-semibold disabled:opacity-50 transition-colors">
                  {submitting ? 'Please wait...' : authStage === 'login' ? 'Sign In' : 'Create Account'}
                </button>
                <button type="button" onClick={handleChangeNumber} className="w-full min-h-[40px] text-[13px] font-medium text-[#6E6E73] dark:text-[#A1A1A6]">Use a different phone number</button>
              </form>
            </>
          )}
        </section>
      ) : (
        <>
          {/* ProfileSummary */}
          <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex items-center justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-14 h-14 rounded-full bg-[#1D1D1F] dark:bg-[#F5F5F7] text-white dark:text-[#1D1D1F] text-[18px] font-bold flex items-center justify-center shrink-0">
                {profile.avatarInitials}
              </span>
              <div className="min-w-0">
                <h1 className="text-[17px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                  {profile.name}
                </h1>
                <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] truncate tabular-nums">
                  {profile.phone}
                </p>
                {profile.email && (
                  <p className="text-[12px] text-[#86868B] truncate">{profile.email}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/profile/account')}
              aria-label="Edit profile"
              className="w-[44px] h-[44px] rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center justify-center shrink-0"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </section>

          {/* OrderShortcut */}
          <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                My Orders
              </h2>
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="text-[12px] font-semibold text-[#0071E3] dark:text-[#2997FF] inline-flex items-center gap-0.5 min-h-[32px]"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'pending', label: 'Pending', count: countByStatus.pending },
                { id: 'processing', label: 'Processing', count: countByStatus.processing },
                { id: 'shipped', label: 'Shipped', count: countByStatus.shipped },
                { id: 'completed', label: 'Completed', count: countByStatus.completed },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(`/orders?status=${item.id}`)}
                  className="rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] py-2.5 px-1.5 flex flex-col items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                >
                  <span className="text-[16px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                    {item.count}
                  </span>
                  <span className="text-[11px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] truncate max-w-full">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* AccountMenu */}
          <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] overflow-hidden divide-y divide-[#E8E8ED] dark:divide-[#2C2C2E]">
            {[
              { label: 'My Account', Icon: UserRound, path: '/profile/account' },
              { label: 'My Orders', Icon: Package, path: '/orders' },
              { label: 'My Addresses', Icon: MapPin, path: '/profile/addresses' },
              { label: 'Payment Methods', Icon: CreditCard, path: '/profile/payment-methods' },
            ].map(({ label, Icon, path }) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate(path)}
                className="w-full min-h-[54px] px-4 flex items-center justify-between gap-3 text-left hover:bg-[#F5F5F7]/60 dark:hover:bg-[#2C2C2E]/60 transition-colors"
              >
                <span className="flex items-center gap-3 text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                  <Icon className="w-5 h-5 text-[#6E6E73] dark:text-[#A1A1A6]" strokeWidth={1.75} />
                  <span>{label}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#86868B]" />
              </button>
            ))}
          </section>
        </>
      )}

      {/* SupportMenu */}
      <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] overflow-hidden divide-y divide-[#E8E8ED] dark:divide-[#2C2C2E]">
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          className="w-full min-h-[54px] px-4 flex items-center justify-between gap-3 text-left hover:bg-[#F5F5F7]/60 dark:hover:bg-[#2C2C2E]/60 transition-colors"
        >
          <span className="flex items-center gap-3 text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
            <Bell className="w-5 h-5 text-[#6E6E73] dark:text-[#A1A1A6]" strokeWidth={1.75} />
            <span>Notifications</span>
          </span>
          <span className="flex items-center gap-2">
            {unreadNotificationCount > 0 && (
              <span className="text-[12px] font-semibold text-[#0071E3] dark:text-[#2997FF] tabular-nums">
                {unreadNotificationCount} unread
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-[#86868B]" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="w-full min-h-[54px] px-4 flex items-center justify-between gap-3 text-left hover:bg-[#F5F5F7]/60 dark:hover:bg-[#2C2C2E]/60 transition-colors"
        >
          <span className="flex items-center gap-3 text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
            <HelpCircle className="w-5 h-5 text-[#6E6E73] dark:text-[#A1A1A6]" strokeWidth={1.75} />
            <span>Help Center</span>
          </span>
          <ChevronRight className="w-4 h-4 text-[#86868B]" />
        </button>

        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          className="w-full min-h-[54px] px-4 flex items-center justify-between gap-3 text-left hover:bg-[#F5F5F7]/60 dark:hover:bg-[#2C2C2E]/60 transition-colors"
        >
          <span className="flex items-center gap-3 text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
            <Info className="w-5 h-5 text-[#6E6E73] dark:text-[#A1A1A6]" strokeWidth={1.75} />
            <span>About</span>
          </span>
          <ChevronRight className="w-4 h-4 text-[#86868B]" />
        </button>
      </section>

      {/* SettingsSection */}
      <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Appearance
            </div>
            <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
              Light or Dark storefront theme
            </div>
          </div>

          <div
            role="group"
            aria-label="Theme selector"
            className="flex items-center gap-1 p-1 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E]"
          >
            <button
              type="button"
              onClick={() => setTheme('light')}
              aria-pressed={theme === 'light'}
              className={`h-[34px] px-3 rounded-[8px] text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors ${
                theme === 'light'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#6E6E73] dark:text-[#A1A1A6]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              aria-pressed={theme === 'dark'}
              className={`h-[34px] px-3 rounded-[8px] text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors ${
                theme === 'dark'
                  ? 'bg-[#1C1C1E] text-[#F5F5F7] shadow-sm'
                  : 'text-[#6E6E73] dark:text-[#A1A1A6]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        {isAuthenticated && (
          <button
            type="button"
            onClick={() => setSignOutOpen(true)}
            className="mt-1 w-full h-[46px] rounded-[12px] border border-[#D70015]/30 dark:border-[#FF453A]/30 text-[#D70015] dark:text-[#FF453A] text-[14px] font-semibold inline-flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        )}
      </section>

      {/* Help Center Modal */}
      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Help Center">
        <div className="flex flex-col gap-3 text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed">
          <div>
            <h4 className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Shipping & Delivery
            </h4>
            <p className="mt-0.5">
              All orders carry a fixed RM 52.00 insured courier shipping fee across Malaysia.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Returns & Warranty
            </h4>
            <p className="mt-0.5">
              Every Apple product includes 1-year Apple Limited Warranty and 14-day return support.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setHelpOpen(false);
              navigate('/livechat');
            }}
            className="mt-2 h-[46px] rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[14px] font-semibold"
          >
            Chat with a Specialist
          </button>
        </div>
      </Modal>

      {/* About Modal */}
      <Modal open={aboutOpen} onClose={() => setAboutOpen(false)} title="Apple The Exchange TRX">
        <div className="flex flex-col gap-3 text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed">
          <p className="text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">
            Official mobile storefront for Apple The Exchange TRX in Kuala Lumpur, Malaysia.
          </p>
          <p>{STORE_BRAND.address}</p>
          <p>Opening Hours: {STORE_BRAND.hours}</p>
          <p>Contact: {STORE_BRAND.phone}</p>
        </div>
      </Modal>

      {/* Sign Out Confirmation */}
      <Modal open={signOutOpen} onClose={() => setSignOutOpen(false)} title="Sign Out?">
        <div className="flex flex-col gap-4">
          <p className="text-[14px] text-[#6E6E73] dark:text-[#A1A1A6]">
            You can sign back in anytime using your registered phone number and password.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSignOutOpen(false)}
              className="h-[46px] rounded-[12px] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                logoutAccount();
                setSignOutOpen(false);
              }}
              className="h-[46px] rounded-[12px] bg-[#D70015] dark:bg-[#FF453A] text-white text-[14px] font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
