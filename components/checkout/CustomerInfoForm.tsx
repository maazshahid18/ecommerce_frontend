import React from 'react';
import FormInput from './FormInput'; 

type CustomerFormFields = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

interface CustomerInfoFormProps {
  formData: CustomerFormFields;
  errors: Partial<CustomerFormFields>; 
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({ formData, errors, handleChange }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-white mb-6">Customer Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <FormInput
          label="Full Name"
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />
        <FormInput
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormInput
          label="Phone Number"
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
        />
        <FormInput
          label="Address"
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
        />
        <FormInput
          label="City"
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
        />
        <FormInput
          label="State"
          id="state"
          name="state"
          type="text"
          value={formData.state}
          onChange={handleChange}
          error={errors.state}
        />
        <FormInput
          label="Zip Code"
          id="zipCode"
          name="zipCode"
          type="text"
          value={formData.zipCode}
          onChange={handleChange}
          error={errors.zipCode}
        />
      </div>
    </>
  );
};

export default CustomerInfoForm;