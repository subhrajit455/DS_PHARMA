import React, { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Edit2, Save, X, User, Mail, Phone, Loader2 } from "lucide-react";
import useIsMobile from "@/shared/hooks/useIsMobile";
import { userProfileService } from "@/services/userProfileService";
import { toast } from "react-toastify";

const PersonalInfoForm = () => {
  const isMobile = useIsMobile(768);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [tempData, setTempData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await userProfileService.getUserProfile();
      const userData = response.data || response;
      const profileInfo = {
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      };
      setProfileData(profileInfo);
      setTempData(profileInfo);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load user profile",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...profileData });
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...profileData });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!tempData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!tempData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!tempData.phone) {
      newErrors.phone = "Phone is required";
    } else if (tempData.phone.length !== 10) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setIsSaving(true);
      const response = await userProfileService.updateUserProfile(tempData);
      setProfileData({ ...tempData });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses = `w-full ${isMobile ? "text-[10px]" : "text-xs"} pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:border-emerald-300`;
  const labelClasses = `block mb-1 ${isMobile ? "text-[10px]" : "text-xs sm:text-sm"} font-medium text-gray-700`;

  if (isLoading) {
    return (
      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-emerald-50/20 rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        style={{
          marginTop: isMobile ? "0" : "30px",
          padding: isMobile ? "5px" : "10px",
          marginBottom: isMobile ? "5px" : "10px",
        }}
      >
        <div className="flex justify-center items-center p-12">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      </Motion.div>
    );
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-emerald-50/20 rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      style={{
        marginTop: isMobile ? "0" : "30px",
        padding: isMobile ? "5px" : "10px",
        marginBottom: isMobile ? "5px" : "10px",
      }}
    >
      <div
        className={`border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50/50 to-white ${isMobile ? "p-4" : "p-6"}`}
        style={{ marginBottom: isMobile ? "8px" : "15px" }}
      >
        <div>
          <h2
            className={`${isMobile ? "text-base" : "text-lg"} font-bold text-gray-900`}
          >
            Personal Information
          </h2>
          <p
            className={`${isMobile ? "text-[11px]" : "text-xs sm:text-sm"} text-gray-500 mt-0.5`}
          >
            Manage your personal details
          </p>
        </div>

        {/* {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className={`flex items-center gap-1 ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors`}
                        style={{ padding: isMobile ? '2px 10px' : '2px 10px'}}
                    >

                        <Edit2 className="w-4 h-4" />
                        <span className='hidden sm:inline-block' style={{ marginTop: '3px'}}>Edit Details</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-1">
                         <button
                            onClick={handleCancel}
                            className="flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            style={{ padding: isMobile ? '2px 10px' : '2px 10px'}}
                        >
                            <X className="w-4 h-4" />
                            <span className='hidden sm:inline-block' style={{ marginTop: '3px'}}>Cancel</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-1 ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm`}
                            style={{ padding: isMobile ? '2px 10px' : '2px 10px'}}
                        >
                            {isSaving ? (
                                <Loader2 className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} animate-spin`} />
                            ) : (
                                <Save className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                            )}
                            <span className='hidden sm:inline-block' style={{ marginTop: isMobile ? '1px' : '3px'}}>Save Changes</span>
                        </button>
                    </div>
                )} */}
      </div>

      {/* Personal Info Grid */}
      <div
        className={`${isMobile ? "p-4" : "p-6"} grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6`}
      >
        {/* Name */}
        <div className="relative md:col-span-2">
          <label className={labelClasses}>Business Name</label>
          <div className="relative">
            <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              <User size={16} />
            </div>
            <input
              style={{ padding: "8px 30px" }}
              type="text"
              value={isEditing ? tempData.name : profileData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!isEditing}
              className={`${inputClasses} ${errors.name ? "border-red-500 ring-1 ring-red-500/20" : ""}`}
              placeholder="Enter business name"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.name}</p>
          )}
        </div>

        {/* Business Details Grid */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ledger Code */}
          <div className="relative">
            <label className={labelClasses}>Ledger Code</label>
            <input
              style={{ padding: "8px 12px" }}
              type="text"
              value={profileData.LedgerCode || "XDS006"}
              disabled
              className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
            />
          </div>

          {/* Marg Code */}
          <div className="relative">
            <label className={labelClasses}>Marg Code</label>
            <input
              style={{ padding: "8px 12px" }}
              type="text"
              value={profileData.MargCode || "0XDS0063137S 312"}
              disabled
              className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
            />
          </div>

          {/* RID */}
          <div className="relative">
            <label className={labelClasses}>RID</label>
            <input
              style={{ padding: "8px 12px" }}
              type="text"
              value={profileData.rid || "8278663"}
              disabled
              className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="md:col-span-2">
          <h3
            className={`${isMobile ? "text-sm" : "text-base"} font-semibold text-gray-800 mb-3`}
          >
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="relative">
              <label className={labelClasses}>Email</label>
              <div className="relative">
                <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                  <Mail size={16} />
                </div>
                <input
                  style={{ padding: "8px 30px" }}
                  type="email"
                  value={
                    isEditing
                      ? tempData.email
                      : profileData.email ||
                        profileData.email1 ||
                        "Not provided"
                  }
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  className={`${inputClasses} ${errors.email ? "border-red-500 ring-1 ring-red-500/20" : ""}`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[10px] mt-1 ml-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="relative">
              <label className={labelClasses}>Phone</label>
              <div className="relative">
                <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                  <Phone size={16} />
                </div>
                <input
                  style={{ padding: "8px 30px" }}
                  type="tel"
                  value={
                    isEditing
                      ? tempData.phone
                      : profileData.phone ||
                        profileData.phone1 ||
                        profileData.userId ||
                        "7074903661"
                  }
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    handleInputChange("phone", val);
                  }}
                  disabled={!isEditing}
                  className={`${inputClasses} ${errors.phone ? "border-red-500 ring-1 ring-red-500/20" : ""}`}
                  placeholder="10-digit phone number"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-[10px] mt-1 ml-1">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="md:col-span-2">
          <h3
            className={`${isMobile ? "text-sm" : "text-base"} font-semibold text-gray-800 mb-3`}
          >
            Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* DL Number */}
            <div className="relative">
              <label className={labelClasses}>DL Number</label>
              <input
                style={{ padding: "8px 12px" }}
                type="text"
                value={profileData.DlNo || "3137S 3127SB *"}
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
            </div>

            {/* GSTIN */}
            <div className="relative">
              <label className={labelClasses}>GSTIN</label>
              <input
                style={{ padding: "8px 12px" }}
                type="text"
                value={profileData.GSTIN || "Not provided"}
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
            </div>

            {/* Area */}
            <div className="relative">
              <label className={labelClasses}>Area</label>
              <input
                style={{ padding: "8px 12px" }}
                type="text"
                value={profileData.area || "12"}
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
            </div>

            {/* Code */}
            <div className="relative">
              <label className={labelClasses}>Code</label>
              <input
                style={{ padding: "8px 12px" }}
                type="text"
                value={profileData.code || "X320"}
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
            </div>

            {/* GCode */}
            <div className="relative">
              <label className={labelClasses}>GCode</label>
              <input
                style={{ padding: "8px 12px" }}
                type="text"
                value={profileData.gcode || "C6"}
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
            </div>

            {/* User ID */}
            <div className="relative">
              <label className={labelClasses}>User ID</label>
              <input
                style={{ padding: "8px 12px" }}
                type="text"
                value={profileData.userId || "7074903661"}
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Business Address</label>
          <textarea
            value={
              profileData.address ||
              "BERACHAMPA BERACHAMPA  BERACHAMPA 7074903661"
            }
            disabled
            rows={3}
            className={`${inputClasses} bg-gray-100 cursor-not-allowed resize-none`}
            style={{ padding: "8px 12px" }}
          />
        </div>

        {/* Financial Information */}
        <div className="md:col-span-2">
          <h3
            className={`${isMobile ? "text-sm" : "text-base"} font-semibold text-gray-800 mb-3`}
          >
            Financial Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Opening Balance */}
            <div className="relative">
              <label className={labelClasses}>Opening Balance (₹)</label>
              <input
                style={{ padding: "8px 12px" }}
                type="text"
                value={profileData.opening || "67,977.00"}
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
            </div>

            {/* Current Balance */}
            <div className="relative">
              <label className={labelClasses}>Current Balance (₹)</label>
              <input
                style={{ padding: "8px 12px" }}
                type="text"
                value={profileData.balance || "3,01,321.00"}
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
            </div>

            {/* PDC */}
            <div className="relative">
              <label className={labelClasses}>PDC (₹)</label>
              <input
                style={{ padding: "8px 12px" }}
                type="text"
                value={profileData.pdc || "0.00"}
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
            </div>
          </div>
        </div>

        {/* Bank Information */}
        {(profileData.bank || profileData.branch) && (
          <div className="md:col-span-2">
            <h3
              className={`${isMobile ? "text-sm" : "text-base"} font-semibold text-gray-800 mb-3`}
            >
              Bank Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className={labelClasses}>Bank Name</label>
                <input
                  style={{ padding: "8px 12px" }}
                  type="text"
                  value={profileData.bank || "Not provided"}
                  disabled
                  className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                />
              </div>
              <div className="relative">
                <label className={labelClasses}>Branch</label>
                <input
                  style={{ padding: "8px 12px" }}
                  type="text"
                  value={profileData.branch || "Not provided"}
                  disabled
                  className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Verification Status */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4
                className={`${isMobile ? "text-sm" : "text-base"} font-medium text-gray-800`}
              >
                Verification Status
              </h4>
              <p
                className={`${isMobile ? "text-xs" : "text-sm"} text-gray-600`}
              >
                Account verification status
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                profileData.isVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {profileData.isVerified ? "Verified" : "Pending Verification"}
            </div>
          </div>
        </div>

        {/* Additional Phones */}
        {(profileData.phone2 || profileData.phone3 || profileData.phone4) && (
          <div className="md:col-span-2">
            <h3
              className={`${isMobile ? "text-sm" : "text-base"} font-semibold text-gray-800 mb-3`}
            >
              Additional Contact Numbers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profileData.phone2 && (
                <div className="relative">
                  <label className={labelClasses}>Phone 2</label>
                  <input
                    style={{ padding: "8px 12px" }}
                    type="text"
                    value={profileData.phone2}
                    disabled
                    className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                  />
                </div>
              )}
              {profileData.phone3 && (
                <div className="relative">
                  <label className={labelClasses}>Phone 3</label>
                  <input
                    style={{ padding: "8px 12px" }}
                    type="text"
                    value={profileData.phone3}
                    disabled
                    className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                  />
                </div>
              )}
              {profileData.phone4 && (
                <div className="relative">
                  <label className={labelClasses}>Phone 4</label>
                  <input
                    style={{ padding: "8px 12px" }}
                    type="text"
                    value={profileData.phone4}
                    disabled
                    className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Emails */}
        {(profileData.email2 || profileData.email3) && (
          <div className="md:col-span-2">
            <h3
              className={`${isMobile ? "text-sm" : "text-base"} font-semibold text-gray-800 mb-3`}
            >
              Additional Email Addresses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.email2 && (
                <div className="relative">
                  <label className={labelClasses}>Email 2</label>
                  <input
                    style={{ padding: "8px 12px" }}
                    type="email"
                    value={profileData.email2}
                    disabled
                    className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                  />
                </div>
              )}
              {profileData.email3 && (
                <div className="relative">
                  <label className={labelClasses}>Email 3</label>
                  <input
                    style={{ padding: "8px 12px" }}
                    type="email"
                    value={profileData.email3}
                    disabled
                    className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Information */}
        <div className="md:col-span-2">
          <h3
            className={`${isMobile ? "text-sm" : "text-base"} font-semibold text-gray-800 mb-3`}
          >
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className={labelClasses}>Created Date</label>
              <input
                style={{ padding: "8px 12px" }}
                type="text"
                value={
                  profileData.createdAt
                    ? new Date(profileData.createdAt).toLocaleDateString()
                    : "2026-03-06"
                }
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
            </div>
            <div className="relative">
              <label className={labelClasses}>Last Updated</label>
              <input
                style={{ padding: "8px 12px" }}
                type="text"
                value={
                  profileData.updatedAt
                    ? new Date(profileData.updatedAt).toLocaleDateString()
                    : "2026-03-06"
                }
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default PersonalInfoForm;
