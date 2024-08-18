import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { InferType } from 'yup';

import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { toBase64, getPasswordStrength } from '../utils/formUtils';
import { formSchema } from '../validation/schema';
import { addFormData, RootState } from '@/store';

type FormData = InferType<typeof formSchema>;

function HookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    control,
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const countries = useSelector((state: RootState) => state.form.countries);

  const [fileError, setFileError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const passwordValue = useWatch({ control, name: 'password' });
  const passwordStrength = getPasswordStrength(passwordValue || '');

  const picture = watch('picture');

  useEffect(() => {
    if (picture instanceof File) {
      setFileError(null);
    }
  }, [picture]);

  const onSubmit = async (data: FormData) => {
    try {
      if (file) {
        const pictureBase64 = await toBase64(file);

        const formData = {
          ...data,
          picture: pictureBase64,
        };

        dispatch(addFormData(formData));
        navigate('/');
      } else {
        setFileError('Please select a valid image file.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('picture', file, { shouldValidate: true });
      setFileError(null);
      setFile(file);
      trigger('picture');
    } else {
      setFileError('Please select a valid image file.');
      setFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register('name')} autoComplete="name" />
        <p className="error">{errors.name?.message}</p>
      </div>
      <div>
        <label htmlFor="age">Age</label>
        <input id="age" type="number" {...register('age')} autoComplete="bday" />
        <p className="error">{errors.age?.message}</p>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} autoComplete="email" />
        <p className="error">{errors.email?.message}</p>
      </div>
      <div className="password-strength">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} autoComplete="new-password" />
        <p className="error">{errors.password?.message}</p>

        <PasswordStrengthIndicator passwordStrength={passwordStrength} />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" {...register('confirmPassword')} autoComplete="new-password" />
        <p className="error">{errors.confirmPassword?.message}</p>
      </div>
      <div>
        <label htmlFor="gender">Gender</label>
        <select id="gender" {...register('gender')} autoComplete="sex">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <p className="error">{errors.gender?.message}</p>
      </div>
      <div>
        <label htmlFor="country">Country</label>
        <input id="country" type="text" list="country-list" {...register('country')} autoComplete="country-name" />
        <datalist id="country-list">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        <p className="error">{errors.country?.message}</p>
      </div>
      <div>
        <label htmlFor="acceptTerms">Accept Terms & Conditions</label>
        <input id="acceptTerms" type="checkbox" {...register('acceptTerms')} autoComplete="off" />
        <p className="error">{errors.acceptTerms?.message}</p>
      </div>
      <div>
        <label htmlFor="picture">Upload Picture</label>
        <input id="picture" type="file" accept="image/jpeg, image/png" autoComplete="off" onChange={handleFileChange} />
        {fileError && <p className="error">{fileError}</p>}
        <p className="error">{errors.picture?.message}</p>
      </div>
      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}

export default HookForm;
