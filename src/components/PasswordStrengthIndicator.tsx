import { FC } from 'react';

interface PasswordStrengthIndicatorProps {
  passwordStrength: {
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    hasSpecial: boolean;
  };
}

const PasswordStrengthIndicator: FC<PasswordStrengthIndicatorProps> = ({ passwordStrength }) => {
  return (
    <div className="password-tooltip">
      <ul>
        <li className={passwordStrength.hasUpperCase ? 'valid' : ''}>1 uppercase English letter</li>
        <li className={passwordStrength.hasLowerCase ? 'valid' : ''}>1 lowercase English letter</li>
        <li className={passwordStrength.hasNumbers ? 'valid' : ''}>1 number</li>
        <li className={passwordStrength.hasSpecial ? 'valid' : ''}>1 special character</li>
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
