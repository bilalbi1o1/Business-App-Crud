// MyForm.js

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, DatePicker } from '@mui/material';

const MyForm = () => {
  const { handleSubmit, control, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Date Inputs */}
      <Controller
        name="date1"
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            label="Date 1"
            fullWidth
            inputFormat="MM/dd/yyyy"
          />
        )}
      />
      <Controller
        name="date2"
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            label="Date 2"
            fullWidth
            inputFormat="MM/dd/yyyy"
          />
        )}
      />

      {/* Text Inputs */}
      {[...Array(13)].map((_, index) => (
        <Controller
          key={index}
          name={`text${index + 1}`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={`Text ${index + 1}`}
              fullWidth
            />
          )}
        />
      ))}

      {/* Submit Button */}
      <button type="submit">Submit</button>
      <button type="button" onClick={() => reset()}>Reset</button>
    </form>
  );
};

export default MyForm;
