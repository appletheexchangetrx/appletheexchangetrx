import React, { useState } from 'react';
import { Check, CreditCard, MapPin, Plus, Trash2 } from 'lucide-react';
import { StandaloneShell } from '../components/layout/StandaloneShell';
import { useStore } from '../context/StoreContext';

export const AccountPage: React.FC = () => {
  const { isAuthenticated, profile, updateProfileInfo, navigate, showToast } = useStore();
  const [name, setName] = useState(profile.name);

  if (!isAuthenticated) {
    return (
      <StandaloneShell title="My Account" backFallback="/profile">
        <div className="px-4 py-12 text-center flex flex-col items-center gap-4">
          <h2 className="text-[17px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Sign in required
          </h2>
          <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] max-w-[280px]">
            Please sign in or register with your phone number and password to edit account details.
          </p>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="h-[48px] px-6 rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[14px] font-semibold"
          >
            Go to Sign In
          </button>
        </div>
      </StandaloneShell>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Full name and a valid phone number are required.', 'error');
      return;
    }
    await updateProfileInfo({ name: name.trim() });
  };

  return (
    <StandaloneShell title="My Account" backFallback="/profile">
      <form onSubmit={handleSubmit} className="px-4 py-4 flex flex-col gap-4">
        <div className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-3.5">
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[48px] px-3.5 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
              Phone Number
            </label>
            <div className="w-full h-[48px] px-3.5 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#6E6E73] dark:text-[#A1A1A6] flex items-center">
              {profile.phone}
            </div>
            <p className="mt-1 text-[11px] text-[#86868B]">Phone number is your account ID and cannot be changed here.</p>
          </div>
        </div>

        <button
          type="submit"
          className="h-[48px] rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#47A7FF] text-white text-[14px] font-semibold"
        >
          Save Changes
        </button>
      </form>
    </StandaloneShell>
  );
};

export const AddressesPage: React.FC = () => {
  const { profile, deleteAddress, setDefaultAddress, navigate } = useStore();
  const openAddAddress = () => navigate('/profile/addresses/new?returnTo=%2Fprofile%2Faddresses');
  return (
    <StandaloneShell title="My Addresses" backFallback="/profile"
      headerRight={<button type="button" onClick={openAddAddress} aria-label="Add address" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#0071E3] dark:text-[#2997FF]"><Plus className="w-5 h-5" /></button>}>
      <div className="px-4 py-4 flex flex-col gap-3">
        {profile.addresses.length === 0 ? (
          <div className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-8 text-center flex flex-col items-center gap-3">
            <MapPin className="w-9 h-9 text-[#86868B]" strokeWidth={1.5} /><p className="text-[14px] text-[#6E6E73] dark:text-[#A1A1A6]">No saved delivery addresses yet.</p>
            <button type="button" onClick={openAddAddress} className="h-[44px] px-5 rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[13px] font-semibold">Add Address</button>
          </div>
        ) : profile.addresses.map((addr) => (
          <div key={addr.id} className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">{addr.label}</span>{addr.isDefault && <span className="text-[11px] font-semibold text-[#0071E3] dark:text-[#2997FF]">Default</span>}</div>
              <button type="button" onClick={() => deleteAddress(addr.id)} aria-label={`Delete ${addr.label} address`} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#86868B] hover:text-[#D70015] dark:hover:text-[#FF453A]"><Trash2 className="w-4 h-4" /></button>
            </div>
            <p className="text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">{addr.recipientName} · {addr.phone}</p>
            <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6]">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.postcode} {addr.city}, {addr.state}</p>
            {!addr.isDefault && <button type="button" onClick={() => setDefaultAddress(addr.id)} className="self-start mt-1 text-[12px] font-semibold text-[#0071E3] dark:text-[#2997FF] inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /><span>Set as Default</span></button>}
          </div>
        ))}
      </div>
    </StandaloneShell>
  );
};

export const PaymentMethodsPage: React.FC = () => {
  return (
    <StandaloneShell title="Payment Methods" backFallback="/profile">
      <div className="px-4 py-8">
        <div className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-6 text-center flex flex-col items-center gap-3">
          <span className="w-14 h-14 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#86868B] flex items-center justify-center">
            <CreditCard className="w-7 h-7" strokeWidth={1.5} />
          </span>
          <h2 className="text-[17px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Payment Methods Undecided
          </h2>
          <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed max-w-[300px]">
            No payment methods are active yet for Apple The Exchange TRX. Checkout orders are
            recorded with pending payment confirmation.
          </p>
        </div>
      </div>
    </StandaloneShell>
  );
};
