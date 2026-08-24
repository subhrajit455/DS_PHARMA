import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthCard, InputField, TermsModal } from "@/user/components/auth";
import Button from "@/shared/components/ui/Button";
import { useSignup } from "@/shared/hooks/mutations/useSignup";

const SignupPage = () => {
  const { mutate: signup, isPending } = useSignup();

  const [step, setStep] = useState(1);
  const [showTerms, setShowTerms] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    establishmentName: "",
    incorporationDate: "",
    tradeLicenseNumber: "",
    drugLicenseNumber: "",
    panLicenseNumber: "",
    gstLicenseNumber: "",
    margId: "",

    addressLine1: "",
    addressLine2: "",
    city: "",
    postOffice: "",
    policeStation: "",
    pinNumber: "",
    district: "",
    country: "",

    contactPersonName: "",
    contactPersonPhone: "",

    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full name required";
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.phone) newErrors.phone = "Phone required";

    if (!formData.password) newErrors.password = "Password required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must accept terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    signup({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,

      establishmentName: formData.establishmentName,
      incorporationDate: formData.incorporationDate,
      tradeLicenseNumber: formData.tradeLicenseNumber,
      drugLicenseNumber: formData.drugLicenseNumber,
      panLicenseNumber: formData.panLicenseNumber,
      gstLicenseNumber: formData.gstLicenseNumber,
      margId: formData.margId,

      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      postOffice: formData.postOffice,
      policeStation: formData.policeStation,
      pinNumber: formData.pinNumber,
      district: formData.district,
      country: formData.country,

      contactPersonName: formData.contactPersonName,
      contactPersonPhone: formData.contactPersonPhone,
    });
  };

  return (
    <>
      <AuthCard
        title="Create Account"
        subtitle="Complete your registration"
      >
        <form onSubmit={handleSubmit} className=" p-4 ">

          {/* STEP INDICATOR */}
          <div className="flex justify-between mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 text-center py-2 mx-1 rounded-full text-xs sm:text-sm font-medium
                ${step >= s ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                Step {s}
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
              <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
              <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
              <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
              <InputField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

              <Button type="button" size="full" onClick={nextStep}>
                Next
              </Button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <InputField label="Establishment Name" name="establishmentName" value={formData.establishmentName} onChange={handleChange} />
              <InputField label="Date of Incorporation" name="incorporationDate" type="date" value={formData.incorporationDate} onChange={handleChange} />
              <InputField label="Trade License Number" name="tradeLicenseNumber" value={formData.tradeLicenseNumber} onChange={handleChange} />
              <InputField label="Drug License Number" name="drugLicenseNumber" value={formData.drugLicenseNumber} onChange={handleChange} />
              <InputField label="PAN Number" name="panLicenseNumber" value={formData.panLicenseNumber} onChange={handleChange} />
              <InputField label="GST Number" name="gstLicenseNumber" value={formData.gstLicenseNumber} onChange={handleChange} />
              <InputField label="Marg ID (Optional)" name="margId" value={formData.margId} onChange={handleChange} />

              <div className="flex gap-3">
                <Button type="button" onClick={prevStep}>Back</Button>
                <Button type="button" onClick={nextStep}>Next</Button>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <textarea name="addressLine1" placeholder="Address Line 1" value={formData.addressLine1} onChange={handleChange} className="w-full border rounded-lg p-3" />
              <textarea name="addressLine2" placeholder="Address Line 2" value={formData.addressLine2} onChange={handleChange} className="w-full border rounded-lg p-3" />

              <InputField label="Village / City" name="city" value={formData.city} onChange={handleChange} />
              <InputField label="Post Office" name="postOffice" value={formData.postOffice} onChange={handleChange} />
              <InputField label="Police Station" name="policeStation" value={formData.policeStation} onChange={handleChange} />
              <InputField label="Pin Number" name="pinNumber" value={formData.pinNumber} onChange={handleChange} />
              <InputField label="District" name="district" value={formData.district} onChange={handleChange} />
              <InputField label="Country" name="country" value={formData.country} onChange={handleChange} />

              <div className="flex gap-3">
                <Button type="button" onClick={prevStep}>Back</Button>
                <Button type="button" onClick={nextStep}>Next</Button>
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <InputField label="Contact Person Name" name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} />
              <InputField label="Contact Person Phone" name="contactPersonPhone" value={formData.contactPersonPhone} onChange={handleChange} />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">
                  I agree to{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-emerald-600"
                  >
                    Terms & Conditions
                  </button>
                </span>
              </div>

              {errors.agreeToTerms && (
                <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
              )}

              <div className="flex gap-3">
                <Button type="button" onClick={prevStep}>
                  Back
                </Button>

                <Button
                  type="submit"
                  size="full"
                  disabled={isPending}
                  className="!bg-emerald-600"
                >
                  {isPending ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </>
          )}
        </form>
          <div className="mt-6 text-center text-sm">
          <Link to="/" className="text-white font-medium bg-green-500 px-3 py-2 rounded"
          style={{
            padding:"3px",
            marginTop:"20px",
            textDecorationLine:"none"

          }}
          >
           Back to home
          </Link>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-emerald-600 font-medium">
            Sign In
          </Link>
        </div>
      </AuthCard>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </>
  );
};

export default SignupPage;

