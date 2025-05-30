import React from 'react';
import FormInput from './FormInput'; 

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentDetailsFormProps {
  formData: PaymentFormData;
  errors: Partial<PaymentFormData>; 
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({ formData, errors, handleChange }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 mt-10 mb-6 pt-6 border-t border-gray-200">Payment Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col col-span-full"> 
          <FormInput
            label="Card Number (16-digit)"
            id="cardNumber"
            name="cardNumber"
            type="text"
            value={formData.cardNumber}
            onChange={handleChange}
            error={errors.cardNumber}
            maxLength={16}
          />
        </div>

        <FormInput
          label="Expiry Date (MM/YY)"
          id="expiryDate"
          name="expiryDate"
          type="text"
          value={formData.expiryDate}
          onChange={handleChange}
          error={errors.expiryDate}
          maxLength={5}
          placeholder="MM/YY"
        />
        <FormInput
          label="CVV (3-digit)"
          id="cvv"
          name="cvv"
          type="text"
          value={formData.cvv}
          onChange={handleChange}
          error={errors.cvv}
          maxLength={3}
        />
      </div>
    </>
  );
};

export default PaymentDetailsForm;