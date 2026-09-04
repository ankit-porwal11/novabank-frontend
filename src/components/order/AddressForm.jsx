import { useState } from "react";
import { Send } from "lucide-react";
import Card, { CardHeader } from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { useAddAddress, useCreateOrder } from "../../hooks/useOrders.js";
import { friendlyOrderErrorMessage } from "./orderFormat.js";
import "./AddressForm.css";

// Spec section "Address Form Validation" — exact rules, nothing added.
function validate({ fullName, mobileNumber, addressLine1, city, state, pincode }) {
  const errors = {};
  if (!fullName || fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }
  if (!/^\d{10}$/.test(mobileNumber || "")) {
    errors.mobileNumber = "Mobile number must be exactly 10 digits.";
  }
  if (!addressLine1?.trim()) {
    errors.addressLine1 = "Address is required.";
  }
  if (!city?.trim()) {
    errors.city = "City is required.";
  }
  if (!state?.trim()) {
    errors.state = "State is required.";
  }
  if (!/^\d{6}$/.test(pincode || "")) {
    errors.pincode = "Pincode must be exactly 6 digits.";
  }
  return errors;
}

const EMPTY_FORM = {
  fullName: "",
  mobileNumber: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
};

/**
 * itemType — hidden value sent to POST /order/create (PASSBOOK,
 * CHEQUE_BOOK, or DEBIT_CARD). Never shown or editable in the UI, per spec.
 */
export default function AddressForm({ itemType, heading, onSuccess }) {
  const { mutateAsync: addAddress, isPending: isAddingAddress } = useAddAddress();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // Spec corner case #3 "Order Now Button": prevent double click across
  // the whole click → disable → loading → success flow, which here spans
  // two sequential API calls.
  const isSubmitting = isAddingAddress || isCreatingOrder;

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    setServerError("");
    if (Object.keys(fieldErrors).length > 0) return;

    try {
      const address = await addAddress(form);
      const order = await createOrder({ itemType, addressId: address._id });
      onSuccess?.(order);
    } catch (error) {
      setServerError(friendlyOrderErrorMessage(error));
    }
  }

  return (
    <Card padding="lg" className="address-form-card">
      <CardHeader title={heading} subtitle="Delivery address for this request" />

      <form className="address-form" onSubmit={handleSubmit} noValidate>
        <Input
          label="Full Name"
          value={form.fullName}
          onChange={handleChange("fullName")}
          error={errors.fullName}
          disabled={isSubmitting}
        />
        <Input
          label="Mobile Number"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={form.mobileNumber}
          onChange={handleChange("mobileNumber")}
          error={errors.mobileNumber}
          disabled={isSubmitting}
        />
        <Input
          label="Address Line 1"
          value={form.addressLine1}
          onChange={handleChange("addressLine1")}
          error={errors.addressLine1}
          disabled={isSubmitting}
        />
        <div className="address-form__row">
          <Input
            label="City"
            value={form.city}
            onChange={handleChange("city")}
            error={errors.city}
            disabled={isSubmitting}
          />
          <Input
            label="State"
            value={form.state}
            onChange={handleChange("state")}
            error={errors.state}
            disabled={isSubmitting}
          />
        </div>
        <Input
          label="Pincode"
          inputMode="numeric"
          maxLength={6}
          value={form.pincode}
          onChange={handleChange("pincode")}
          error={errors.pincode}
          disabled={isSubmitting}
        />

        {serverError && <p className="address-form__server-error">{serverError}</p>}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
          leftIcon={<Send size={16} strokeWidth={2.25} />}
        >
          Order Now
        </Button>
      </form>
    </Card>
  );
}
