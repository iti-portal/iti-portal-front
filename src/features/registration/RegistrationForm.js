import { useState } from 'react';
import ProgressSteps from './ProgressSteps';
import AccountType from './AccountType';
import PersonalInfo from './PersonalInfo';
import Security from './Security';
import Review from './Review';

function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    accountType: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AccountType formData={formData} handleChange={handleChange} nextStep={nextStep} />;
      case 2:
        return <PersonalInfo formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        // Only show Security if NOT company
        if (formData.role !== 'company') {
          return (
            <Security
              formData={formData}
              handleChange={handleChange}
              nextStep={nextStep}
              prevStep={prevStep}
              handleFileChange={handleFileChange}
            />
          );
        }
        // If company, skip to Review
        return <Review formData={formData} prevStep={prevStep} />;
      case 4:
        return <Review formData={formData} prevStep={prevStep} />;
      default:
        return <AccountType formData={formData} handleChange={handleChange} nextStep={nextStep} />;
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2 mt-5">
        Let's get you started with an ITI Portal account
      </h1>
      <ProgressSteps currentStep={step} role={formData.role} />
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 mt-6">
        {renderStep()}
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-medium"
            style={{ color: '#901b20' }}
          >
            Sign in
          </a>
        </p>
      </div>
    </>
  );
}

export default RegistrationForm;