import React, { useState } from 'react';
import { Check, MapPin } from 'lucide-react';
import { StandaloneShell } from '../components/layout/StandaloneShell';
import { PhoneInput } from '../components/ui/PhoneInput';
import { useStore } from '../context/StoreContext';
import { formatMalaysiaPhone, stripMalaysiaPhonePrefix } from '../utils/storage';

const ADDRESS_RETURN_PATHS = ['/checkout', '/profile/addresses'];

export const AddressFormPage: React.FC = () => {
  const { profile, saveAddress, navigate } = useStore();
  const requestedReturnTo = new URLSearchParams(window.location.search).get('returnTo') || '';
  const returnTo = ADDRESS_RETURN_PATHS.includes(requestedReturnTo) ? requestedReturnTo : '/profile/addresses';
  const [label, setLabel] = useState('Home');
  const [recipientName, setRecipientName] = useState(profile.name);
  const [phone, setPhone] = useState(() => stripMalaysiaPhonePrefix(profile.phone));
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('Kuala Lumpur');
  const [stateName, setStateName] = useState('Wilayah Persekutuan Kuala Lumpur');
  const [postcode, setPostcode] = useState('');
  const [isDefault, setIsDefault] = useState(profile.addresses.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    const phoneDigits = stripMalaysiaPhonePrefix(phone).replace(/\D/g, '');
    if (!label.trim() || !recipientName.trim() || phoneDigits.length < 7 || !line1.trim() ||
      !city.trim() || !stateName.trim() || !/^\d{5}$/.test(postcode.trim())) {
      setError('Please complete all required fields. Enter a valid Malaysian phone number and 5-digit postcode.');
      return;
    }
    setIsSaving(true);
    saveAddress({
      label: label.trim(), recipientName: recipientName.trim(), phone: formatMalaysiaPhone(phone),
      line1: line1.trim(), line2: line2.trim() || undefined, city: city.trim(), state: stateName.trim(),
      postcode: postcode.trim(), isDefault: isDefault || profile.addresses.length === 0,
    });
    navigate(returnTo, { replace: true });
  };

  const inputClass = 'w-full h-[48px] px-3.5 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#86868B] focus:outline-none focus:border-[#0071E3] dark:focus:border-[#2997FF]';
  const labelClass = 'block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1.5';

  return (
    <StandaloneShell title="Add Shipping Address" backFallback={returnTo}
      bottomAction={<button type="submit" form="add-shipping-address-form" disabled={isSaving} className="w-full h-[48px] rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 dark:bg-[#2997FF] dark:hover:bg-[#47A7FF] text-white text-[14px] font-semibold transition-colors">{isSaving ? 'Saving Address...' : 'Save Address'}</button>}>
      <form id="add-shipping-address-form" onSubmit={handleSubmit} className="px-4 py-5 pb-6 flex flex-col gap-5">
        <div><h2 className="text-[20px] font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">Where should we deliver?</h2><p className="mt-1 text-[13px] leading-relaxed text-[#6E6E73] dark:text-[#A1A1A6]">Add your recipient and delivery details.</p></div>
        {error && <p role="alert" className="rounded-[12px] border border-[#D70015]/25 bg-[#D70015]/10 px-3 py-2.5 text-[12px] font-medium text-[#D70015] dark:text-[#FF453A]">{error}</p>}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-3.5">
          <h3 className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Contact information</h3>
          <div><label className={labelClass} htmlFor="address-label">Address label</label><input id="address-label" name="addressLabel" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Home or Office" autoComplete="off" className={inputClass} /></div>
          <div><label className={labelClass} htmlFor="recipient-name">Recipient name *</label><input id="recipient-name" name="name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} autoComplete="name" required className={inputClass} /></div>
          <div><label className={labelClass}>Phone number *</label><PhoneInput value={phone} onChange={setPhone} showIcon placeholder="12-345 6789" /></div>
        </section>
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-3.5">
          <h3 className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Delivery address</h3>
          <div><label className={labelClass} htmlFor="address-line1">Street address *</label><input id="address-line1" name="address-line1" value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Unit, building, street" autoComplete="address-line1" required className={inputClass} /></div>
          <div><label className={labelClass} htmlFor="address-line2">Apartment, suite, floor (optional)</label><input id="address-line2" name="address-line2" value={line2} onChange={(e) => setLine2(e.target.value)} autoComplete="address-line2" className={inputClass} /></div>
          <div><label className={labelClass} htmlFor="address-city">City *</label><input id="address-city" name="address-level2" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" required className={inputClass} /></div>
          <div><label className={labelClass} htmlFor="address-state">State *</label><input id="address-state" name="address-level1" value={stateName} onChange={(e) => setStateName(e.target.value)} autoComplete="address-level1" required className={inputClass} /></div>
          <div><label className={labelClass} htmlFor="address-postcode">Postcode *</label><input id="address-postcode" name="postal-code" value={postcode} onChange={(e) => setPostcode(e.target.value.replace(/\D/g, '').slice(0, 5))} inputMode="numeric" autoComplete="postal-code" placeholder="50000" maxLength={5} required className={inputClass} /></div>
        </section>
        <button type="button" onClick={() => setIsDefault((v) => !v)} aria-pressed={isDefault} className="flex items-start gap-3 rounded-[14px] border border-[#E8E8ED] dark:border-[#2C2C2E] bg-white dark:bg-[#1C1C1E] p-4 text-left">
          <span className={isDefault ? 'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border border-[#0071E3] bg-[#0071E3] text-white dark:border-[#2997FF] dark:bg-[#2997FF]' : 'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border border-[#C7C7CC] dark:border-[#636366]'}>{isDefault && <Check className="h-3.5 w-3.5" />}</span>
          <span className="flex-1"><span className="block text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Set as default address</span><span className="mt-0.5 block text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">Use this address automatically for future checkouts.</span></span>
        </button>
        {profile.addresses.length === 0 && <p className="flex items-center gap-2 text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]"><MapPin className="h-4 w-4 shrink-0" />Your first saved address will automatically become your default address.</p>}
      </form>
    </StandaloneShell>
  );
};
