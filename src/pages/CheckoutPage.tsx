import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Plus,
  Truck,
} from 'lucide-react';
import { StandaloneShell } from '../components/layout/StandaloneShell';
import { BottomSheet, Modal } from '../components/ui/Overlay';
import { PhoneInput } from '../components/ui/PhoneInput';
import { ResilientImage } from '../components/ui/ResilientImage';
import { useStore } from '../context/StoreContext';
import {
  FIXED_SHIPPING_FEE,
  formatMalaysiaPhone,
  formatMYR,
  stripMalaysiaPhonePrefix,
} from '../utils/storage';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    checkout,
    profile,
    setSelectedAddressId,
    saveAddress,
    placeOrder,
    navigate,
    showToast,
  } = useStore();

  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [addAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Add address form state
  const [label, setLabel] = useState('Home');
  const [recipientName, setRecipientName] = useState(profile.name);
  const [phone, setPhone] = useState(() => stripMalaysiaPhonePrefix(profile.phone));
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('Kuala Lumpur');
  const [stateName, setStateName] = useState('Wilayah Persekutuan Kuala Lumpur');
  const [postcode, setPostcode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const checkoutItems = useMemo(() => {
    if (checkout.buyNowItem) return [checkout.buyNowItem];
    return cart.filter((item) => item.selected);
  }, [cart, checkout.buyNowItem]);

  const activeAddress = useMemo(() => {
    return (
      profile.addresses.find((a) => a.id === checkout.selectedAddressId) ||
      profile.addresses.find((a) => a.isDefault) ||
      profile.addresses[0] ||
      null
    );
  }, [profile.addresses, checkout.selectedAddressId]);

  const subtotal = useMemo(
    () => checkoutItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [checkoutItems]
  );

  const shippingFee = FIXED_SHIPPING_FEE;
  const discount = 0;
  const total = subtotal + shippingFee - discount;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !recipientName.trim() ||
      !stripMalaysiaPhonePrefix(phone).trim() ||
      !line1.trim() ||
      !city.trim() ||
      !postcode.trim()
    ) {
      setFormError('Please fill in all required Malaysian delivery fields.');
      return;
    }
    saveAddress({
      label: label.trim() || 'Home',
      recipientName: recipientName.trim(),
      phone: formatMalaysiaPhone(phone),
      line1: line1.trim(),
      line2: line2.trim() || undefined,
      city: city.trim(),
      state: stateName.trim() || 'Kuala Lumpur',
      postcode: postcode.trim(),
      isDefault: profile.addresses.length === 0,
    });
    setFormError(null);
    setAddAddressModalOpen(false);
    setAddressSheetOpen(false);
    setLine1('');
    setLine2('');
    setPostcode('');
  };

  const handlePlaceOrder = () => {
    setValidationError(null);
    if (checkoutItems.length === 0) {
      setValidationError('No items selected for checkout.');
      return;
    }
    if (!activeAddress) {
      setValidationError('Please add a shipping address before placing your order.');
      return;
    }
    const result = placeOrder();
    if (result.ok === false) {
      setValidationError(result.error);
      showToast(result.error, 'error');
      return;
    }
    navigate('/order-success', { replace: true });
  };

  return (
    <StandaloneShell
      title="Checkout"
      backFallback="/cart"
      headerRight={
        <span
          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#248A3D] dark:text-[#30D158] pr-2 whitespace-nowrap"
          aria-label="Secure Checkout"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Secure</span>
        </span>
      }
      bottomAction={
        checkoutItems.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6]">
                Total (incl. RM 52.00 delivery)
              </span>
              <span className="text-[17px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {formatMYR(total)}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="w-full h-[48px] rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#47A7FF] text-white text-[14px] font-semibold transition-colors"
            >
              Place Order
            </button>
          </div>
        ) : undefined
      }
    >
      {checkoutItems.length === 0 ? (
        <div className="px-6 py-16 text-center flex flex-col items-center gap-4">
          <h2 className="text-[18px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Nothing to check out
          </h2>
          <p className="text-[14px] text-[#6E6E73] dark:text-[#A1A1A6]">
            Select items in your shopping bag or browse the Apple store first.
          </p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="h-[48px] px-6 rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[14px] font-semibold"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Shipping Address Section */}
          <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF]" />
                <span>Shipping Address</span>
              </h2>
              {profile.addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAddressSheetOpen(true)}
                  className="text-[12px] font-semibold text-[#0071E3] dark:text-[#2997FF] min-h-[32px] px-1"
                >
                  Change
                </button>
              )}
            </div>

            {activeAddress ? (
              <div className="text-[13px] text-[#1D1D1F] dark:text-[#F5F5F7]">
                <div className="flex items-center gap-2 font-semibold">
                  <span>{activeAddress.recipientName}</span>
                  <span className="text-[#86868B]">·</span>
                  <span className="text-[#6E6E73] dark:text-[#A1A1A6] font-normal">
                    {activeAddress.label}
                  </span>
                </div>
                <p className="text-[#6E6E73] dark:text-[#A1A1A6] mt-0.5 tabular-nums">
                  {activeAddress.phone}
                </p>
                <p className="text-[#6E6E73] dark:text-[#A1A1A6] mt-1 leading-relaxed">
                  {activeAddress.line1}
                  {activeAddress.line2 ? `, ${activeAddress.line2}` : ''},{' '}
                  {activeAddress.postcode} {activeAddress.city}, {activeAddress.state}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddAddressModalOpen(true)}
                className="w-full h-[44px] rounded-[12px] border border-dashed border-[#D2D2D7] dark:border-[#38383A] text-[13px] font-semibold text-[#0071E3] dark:text-[#2997FF] flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Shipping Address</span>
              </button>
            )}
          </section>

          {/* Order Items Section */}
          <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4">
            <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-3">
              Order Items ({checkoutItems.length})
            </h2>
            <div className="divide-y divide-[#E8E8ED] dark:divide-[#2C2C2E]">
              {checkoutItems.map((item) => (
                <div key={item.key} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] overflow-hidden shrink-0">
                    <ResilientImage
                      src={item.image}
                      alt={item.name}
                      fallbackTitle={item.name}
                      className="w-full h-full object-contain block"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                      {item.name}
                    </div>
                    <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] truncate">
                      {item.variantSummary} · Qty {item.quantity}
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums shrink-0">
                    {formatMYR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Section (Fixed RM 52.00) */}
          <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4">
            <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF]" />
              <span>Delivery</span>
            </h2>
            <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] p-3">
              <div>
                <div className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Standard Insured Courier
                </div>
                <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
                  Dispatched from Apple The Exchange TRX
                </div>
              </div>
              <span className="text-[14px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums shrink-0">
                {formatMYR(FIXED_SHIPPING_FEE)}
              </span>
            </div>
          </section>

          {/* Payment Method Section (Strictly undecided / empty methods per spec) */}
          <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF]" />
                <span>Payment Method</span>
              </h2>
              <span className="text-[11px] font-semibold text-[#B7791F] dark:text-[#FFD60A]">
                Undecided
              </span>
            </div>

            <div className="rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] p-3.5 flex flex-col gap-3">
              <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed">
                Online payment methods are currently undecided and not yet activated for this
                storefront. Your order will be recorded with pending payment confirmation.
              </p>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(true)}
                className="h-[42px] px-4 rounded-[10px] border border-[#D2D2D7] dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] self-start"
              >
                Choose Payment Method
              </button>
            </div>
          </section>

          {/* Price Summary */}
          <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-2.5">
            <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
              Price Summary
            </h2>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#6E6E73] dark:text-[#A1A1A6]">Subtotal</span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {formatMYR(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#6E6E73] dark:text-[#A1A1A6]">Shipping Fee</span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {formatMYR(shippingFee)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#6E6E73] dark:text-[#A1A1A6]">Discount</span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {formatMYR(discount)}
              </span>
            </div>
            <div className="pt-2.5 border-t border-[#E8E8ED] dark:border-[#2C2C2E] flex items-center justify-between">
              <span className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Total
              </span>
              <span className="text-[18px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {formatMYR(total)}
              </span>
            </div>
          </section>

          {validationError && (
            <div
              role="alert"
              className="rounded-[12px] bg-[#D70015]/10 dark:bg-[#FF453A]/15 border border-[#D70015]/30 p-3 flex items-center gap-2 text-[13px] font-medium text-[#D70015] dark:text-[#FF453A]"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>
      )}

      {/* Change Address BottomSheet */}
      <BottomSheet
        open={addressSheetOpen}
        onClose={() => setAddressSheetOpen(false)}
        title="Select Shipping Address"
      >
        <div className="flex flex-col gap-3">
          {profile.addresses.map((addr) => {
            const selected = activeAddress?.id === addr.id;
            return (
              <button
                key={addr.id}
                type="button"
                onClick={() => {
                  setSelectedAddressId(addr.id);
                  setAddressSheetOpen(false);
                }}
                className={`w-full text-left rounded-[14px] p-3.5 border transition-colors ${
                  selected
                    ? 'border-[#0071E3] dark:border-[#2997FF] bg-[#0071E3]/5 dark:bg-[#2997FF]/10'
                    : 'border-[#E8E8ED] dark:border-[#2C2C2E]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {addr.recipientName} · {addr.label}
                  </span>
                  {selected && <Check className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF]" />}
                </div>
                <p className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] mt-0.5">
                  {addr.phone}
                </p>
                <p className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] mt-1">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ''}, {addr.postcode} {addr.city}
                </p>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setAddressSheetOpen(false);
              setAddAddressModalOpen(true);
            }}
            className="w-full h-[48px] rounded-[12px] border border-[#0071E3] dark:border-[#2997FF] text-[#0071E3] dark:text-[#2997FF] text-[14px] font-semibold flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>
      </BottomSheet>

      {/* Add Address Modal */}
      <Modal
        open={addAddressModalOpen}
        onClose={() => setAddAddressModalOpen(false)}
        title="Add Shipping Address"
      >
        <form onSubmit={handleSaveAddress} className="flex flex-col gap-3">
          {formError && (
            <p className="text-[12px] text-[#D70015] dark:text-[#FF453A] font-medium">
              {formError}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
                Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Home / Office"
                className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
                Phone *
              </label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                compact
                placeholder="12-345 6789"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
              Recipient Name *
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder="Unit, Building, Street"
              className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
                Postcode *
              </label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="55188"
                className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
                City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
              State
            </label>
            <input
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="w-full h-[44px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-[48px] rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[14px] font-semibold"
          >
            Save Address
          </button>
        </form>
      </Modal>

      {/* Undecided Payment Method Info Modal */}
      <Modal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Payment Method Status"
      >
        <div className="flex flex-col gap-3 text-[14px] text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed">
          <p className="text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">
            Payment gateway integration is currently undecided for Apple The Exchange TRX.
          </p>
          <p>
            No payment methods are active at this time. You may proceed to place your order now and
            receive an order reference with pending payment status.
          </p>
          <button
            type="button"
            onClick={() => setPaymentModalOpen(false)}
            className="mt-2 h-[48px] rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[14px] font-semibold"
          >
            Understood
          </button>
        </div>
      </Modal>
    </StandaloneShell>
  );
};
