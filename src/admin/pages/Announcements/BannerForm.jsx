import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAnnouncements } from '../../../contexts/AnnouncementContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const BannerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { banners, createBanner, updateBanner } = useAnnouncements();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    imageBase64: null,
    link: '',
    position: 'hero',
    isEnabled: true
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const banner = banners.find(b => b.id === id);
      if (banner) {
        setFormData({
          title: banner.title,
          imageUrl: banner.imageUrl || '',
          imageBase64: banner.imageBase64,
          link: banner.link || '',
          position: banner.position,
          isEnabled: banner.isEnabled
        });
        setImagePreview(banner.imageBase64 || banner.imageUrl);
      } else {
        toast.error('Banner not found');
        navigate('/admin/announcements');
      }
    }
  }, [id, isEditMode, banners, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFormData(prev => ({
          ...prev,
          imageBase64: base64,
          imageUrl: '' // Clear URL if uploading file
        }));
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.imageUrl && !formData.imageBase64) {
      toast.error('Please provide an image URL or upload an image');
      return;
    }

    try {
      if (isEditMode) {
        updateBanner(id, formData);
        toast.success('Banner updated successfully');
      } else {
        createBanner(formData);
        toast.success('Banner created successfully');
      }
      navigate('/admin/announcements');
    } catch {
      toast.error('Failed to save banner');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 min-h-screen" style={{ padding: '10px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
      <Button
        variant="ghost"
        className="pl-0 text-gray-500 hover:text-gray-900"
        onClick={() => navigate('/admin/announcements')}
        style={{ paddingBottom: '10px' }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span style={{ marginTop: '4px' }}>Back to Announcements</span>
      </Button>

      <div className="flex justify-between items-center" style={{ marginTop: '10px' }}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isEditMode ? 'Edit Banner' : 'Add New Banner'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ marginTop: '10px' }}>
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader style={{ paddingBottom: '15px' }}>
                <CardTitle>Banner Details</CardTitle>
                <CardDescription>Configure your banner image and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2" style={{ marginBottom: '20px' }}>
                  <Label htmlFor="title">Banner Title</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="e.g. Summer Sale Banner"
                    value={formData.title}
                    onChange={handleChange}
                    style={{ padding: '20px 10px' }}
                  />
                </div>

                <div className="grid gap-2" style={{ marginBottom: '20px' }}>
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/banner.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value) {
                        setImagePreview(e.target.value);
                        setFormData(prev => ({ ...prev, imageBase64: null }));
                      }
                    }}
                    style={{ padding: '20px 10px' }}
                  />
                  <p className="text-[8px] sm:text-xs text-gray-500">Or upload an image below</p>
                </div>

                <div className="grid gap-2" style={{ marginBottom: '20px' }}>
                  <Label htmlFor="link">Link URL (Optional)</Label>
                  <Input
                    id="link"
                    name="link"
                    type="url"
                    placeholder="https://example.com/products"
                    value={formData.link}
                    onChange={handleChange}
                    style={{ padding: '20px 10px' }}
                  />
                  <p className="text-[8px] sm:text-xs text-gray-500">Where users will be redirected when clicking the banner</p>
                </div>

                <div className="grid gap-2" style={{ marginBottom: '20px' }}>
                  <Label htmlFor="position">Position</Label>
                  <select
                    id="position"
                    name="position"
                    className="flex h-auto w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
                    value={formData.position}
                    onChange={handleChange}
                    style={{ padding: '12px 5px' }}
                  >
                    <option value="hero">Hero Section</option>
                    <option value="top">Top of Page</option>
                    <option value="middle">Middle of Page</option>
                    <option value="bottom">Bottom of Page</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isEnabled"
                    name="isEnabled"
                    checked={formData.isEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <Label htmlFor="isEnabled" className="cursor-pointer">Enable this banner</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <label
                    style={{ padding: '10px 5px' }}
                    htmlFor="imageUpload"
                    className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group block"
                  >
                    <div className="w-full mx-auto flex items-center justify-center">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white transition-colors">
                        <Upload className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">Click to upload</div>
                    <div className="text-[8px] sm:text-xs text-gray-500 mt-1">PNG, JPG (max. 5MB)</div>
                    <input
                      type="file"
                      id="imageUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {imagePreview && (
                    <div className="mt-4">
                      <Label className="mb-2 block">Preview</Label>
                      <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end pt-6" style={{ marginTop: '10px' }}>
          <Button type="submit" size="md" style={{ padding: '5px 10px' }}>
            <Save className="mr-2 h-4 w-4" />
            <span style={{ marginTop: '4px', paddingLeft: '5px' }}>
              {isEditMode ? 'Update Banner' : 'Create Banner'}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BannerForm;
