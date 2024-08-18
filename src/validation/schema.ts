import * as yup from 'yup';

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png'];
const FILE_SIZE = 5000000;

export const formSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Z]/, 'Name must start with an uppercase letter')
    .required('Name is required')
    .trim(),
  age: yup
    .number()
    .min(0, 'Age must be a positive number')
    .transform((value, originalValue) => (String(originalValue).trim() === '' ? undefined : value))
    .required('Age is required')
    .test('isNotNegativeZero', 'Age cannot be -0', (value) => !Object.is(value, -0)),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .matches(/(?=.*[0-9])/, 'Password must contain a number')
    .matches(/(?=.*[A-Z])/, 'Password must contain an English uppercase letter')
    .matches(/(?=.*[a-z])/, 'Password must contain an English lowercase letter')
    .matches(/(?=.*[!@#$%^&*])/, 'Password must contain a special character'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  gender: yup.string().required('Gender is required'),
  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions').required(),
  picture: yup
    .mixed()
    .required('Picture is required')
    .test('fileType', 'Upload a JPEG or PNG image.', (value) => {
      if (value && value instanceof File) {
        console.log('Validating file type:', value.type);
        return SUPPORTED_FORMATS.includes(value.type.toLowerCase());
      }
      return false;
    })
    .test('fileSize', `Max allowed file size is ${FILE_SIZE / 1000000}MB`, (value) => {
      if (value && value instanceof File) {
        console.log('Validating file size:', value.size);
        return value.size <= FILE_SIZE;
      }
      return false;
    }),
  country: yup.string().required('Country is required'),
});
