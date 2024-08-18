import { FormEvent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { InferType } from 'yup';

import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { toBase64, getPasswordStrength } from '../utils/formUtils';
import { formSchema } from '../validation/schema';
import { addFormData, RootState } from '@/store';

type MutableFormData = Omit<InferType<typeof formSchema>, 'picture'> & { picture: File | string };

function UncontrolledForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const countries = useSelector((state: RootState) => state.form.countries);

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(formRef.current!);

    const mutableFormData: MutableFormData = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      gender: formData.get('gender') as string,
      acceptTerms: formData.get('acceptTerms') === 'on',
      picture: formData.get('picture') as File,
      country: formData.get('country') as string,
    };

    try {
      await formSchema.validate(mutableFormData, { abortEarly: false });

      if (mutableFormData.picture instanceof File) {
        mutableFormData.picture = await toBase64(mutableFormData.picture);
      }

      const finalData = {
        ...mutableFormData,
        picture: mutableFormData.picture as string,
      };

      dispatch(addFormData(finalData));
      navigate('/');
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          validationErrors[error.path!] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" name="name" autoComplete="name" />
        <p className="error">{errors.name}</p>
      </div>
      <div>
        <label htmlFor="age">Age</label>
        <input id="age" type="number" name="age" autoComplete="bday" />
        <p className="error">{errors.age}</p>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" autoComplete="email" />
        <p className="error">{errors.email}</p>
      </div>
      <div className="password-strength">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          autoComplete="new-password"
          onChange={handlePasswordChange}
        />
        <p className="error">{errors.password}</p>

        <PasswordStrengthIndicator passwordStrength={passwordStrength} />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" name="confirmPassword" autoComplete="new-password" />
        <p className="error">{errors.confirmPassword}</p>
      </div>
      <div>
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" autoComplete="sex">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <p className="error">{errors.gender}</p>
      </div>
      <div>
        <label htmlFor="country">Country</label>
        <input id="country" type="text" name="country" list="country-list" autoComplete="country-name" />
        <datalist id="country-list">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        <p className="error">{errors.country}</p>
      </div>
      <div>
        <label htmlFor="acceptTerms">Accept Terms & Conditions</label>
        <input id="acceptTerms" type="checkbox" name="acceptTerms" autoComplete="off" />
        <p className="error">{errors.acceptTerms}</p>
      </div>
      <div>
        <label htmlFor="picture">Upload Picture</label>
        <input id="picture" type="file" name="picture" accept="image/jpeg, image/png" />
        <p className="error">{errors.picture}</p>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default UncontrolledForm;
