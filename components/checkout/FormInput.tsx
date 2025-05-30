import React from 'react';

interface FormInputProps {
  label: string;
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  maxLength?: number;
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  error,
  maxLength,
  placeholder,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-2 font-bold text-gray-700">
        {label}:
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`p-3 text-base rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;