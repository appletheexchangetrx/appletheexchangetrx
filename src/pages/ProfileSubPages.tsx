import React, { useState } from 'react';
import { Check, CreditCard, MapPin, Plus, Trash2 } from 'lucide-react';
import { StandaloneShell } from '../components/layout/StandaloneShell';
import { Modal } from '../components/ui/Overlay';
import { useStore } from '../context/StoreContext';

export const AccountPage: React.FC = () => {
  const { profile, updateProfileInfo, showToast } = useStore();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required.', 'error');
      return;
    }
    updateProfileInfo({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
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
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[48px] px-3.5 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-[48px] px-3.5 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7]"
            />
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
  const { profile, saveAddress, deleteAddress, setDefaultAddress } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  const [label, setLabel] = useState('Home');
  const [recipientName, setRecipientName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('Kuala Lumpur');
  const [stateName, setStateName] = useState('Wilayah Persekutuan Kuala Lumpur');
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !line1.trim() || !postcode.trim()) {
      setError('Please complete all required address fields.');
      return;
    }
    saveAddress({
      label: label.trim() || 'Home',
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      line1: line1.trim(),
      city: city.trim(),
      state: stateName.trim(),
      postcode: postcode.trim(),
      isDefault: profile.addresses.length === 0,
    });
    setError(null);
    setModalOpen(false);
    setLine1('');
    setPostcode('');
  };

  return (
    <StandaloneShell
      title="My Addresses"
      backFallback="/profile"
      headerRight={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          aria-label="Add address"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#0071E3] dark:text-[#2997FF]"
        >
          <Plus className="w-5 h-5" />
        </button>
      }
    >
      <div className="px-4 py-4 flex flex-col gap-3">
        {profile.addresses.length === 0 ? (
          <div className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-8 text-center flex flex-col items-center gap-3">
            <MapPin className="w-9 h-9 text-[#86868B]" strokeWidth={1.5} />
            <p className="text-[14px] text-[#6E6E73] dark:text-[#A1A1A6]">
              No saved delivery addresses yet.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="h-[44px] px-5 rounded-[12px] bg-[#0071E3] text-white text-[13px] font-semibold"
            >
              Add Address
            </button>
          </div>
        ) : (
          profile.addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[11px] font-semibold text-[#0071E3] dark:text-[#2997FF]">
                      Default
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteAddress(addr.id)}
                  aria-label={`Delete ${addr.label} address`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#86868B] hover:text-[#D70015] dark:hover:text-[#FF453A]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                {addr.recipientName} · {addr.phone}
              </p>
              <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6]">
                {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ''}, {addr.postcode} {addr.city}, {addr.state}
              </p>

              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => setDefaultAddress(addr.id)}
                  className="self-start mt-1 text-[12px] font-semibold text-[#0071E3] dark:text-[#2997FF] inline-flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Set as Default</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Address">
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          {error && <p className="text-[12px] text-[#D70015]">{error}</p>}
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (Home, Office)"
            className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px]"
          />
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Recipient Name"
            className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px]"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px]"
          />
          <input
            type="text"
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            placeholder="Street Address"
            className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px]"
          />
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="Postcode"
              className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px]"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px]"
            />
          </div>
          <input
            type="text"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            placeholder="State"
            className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px]"
          />
          <button
            type="submit"
            className="mt-1 h-[48px] rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[14px] font-semibold"
          >
            Save Address
          </button>
        </form>
      </Modal>
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
