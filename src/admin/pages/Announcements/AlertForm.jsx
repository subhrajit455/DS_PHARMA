import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAnnouncements } from '../../../contexts/AnnouncementContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const AlertForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { alerts, createAlert, updateAlert } = useAnnouncements();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    type: 'info',
    title: '',
    message: '',
    position: 'top',
    dismissible: true,
    expiresAt: '',
    isEnabled: true
  });

  useEffect(() => {
    if (isEditMode) {
      const alert = alerts.find(a => a.id === id);
      if (alert) {
        setFormData({
          type: alert.type,
          title: alert.title,
          message: alert.message,
          position: alert.position,
          dismissible: alert.dismissible,
          expiresAt: alert.expiresAt ? alert.expiresAt.split('T')[0] : '',
          isEnabled: alert.isEnabled
        });
      } else {
        toast.error('Alert not found');
        navigate('/admin/announcements');
      }
    }
  }, [id, isEditMode, alerts, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSave = {
      ...formData,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
    };

    try {
      if (isEditMode) {
        updateAlert(id, dataToSave);
        toast.success('Alert updated successfully');
      } else {
        createAlert(dataToSave);
        toast.success('Alert created successfully');
      }
      navigate('/admin/announcements');
    } catch {
      toast.error('Failed to save alert');
    }
  };

  const getAlertPreviewStyles = () => {
    const baseStyles = {
      info: 'bg-blue-50 border-blue-500 text-blue-900',
      success: 'bg-green-50 border-green-500 text-green-900',
      warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
      error: 'bg-red-50 border-red-500 text-red-900'
    };
    return baseStyles[formData.type] || baseStyles.info;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full overflow-y-auto custom-scrollbar" style={{ padding: '10px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
      <Button
        variant="ghost"
        className="pl-0 text-gray-500 hover:text-gray-900"
        onClick={() => navigate('/admin/announcements')}
        style={{ paddingBottom: '20px' }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span style={{ marginTop: '4px' }}>Back to Announcements</span>
      </Button>

      <div className="flex justify-between items-center" style={{ marginTop: '10px' }}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isEditMode ? 'Edit Alert' : 'Add New Alert'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ marginTop: '10px' }}>
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader style={{ paddingBottom: '10px' }}>
                <CardTitle>Alert Details</CardTitle>
                <CardDescription>Configure your alert notification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2" style={{ marginBottom: '20px' }}>
                  <Label htmlFor="type">Alert Type</Label>
                  <select
                    id="type"
                    name="type"
                    className="flex h-auto w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
                    value={formData.type}
                    onChange={handleChange}
                    style={{ padding: '11px 5px' }}
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div className="grid gap-2" style={{ marginBottom: '20px' }}>
                  <Label htmlFor="title">Alert Title</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="e.g. Free Delivery"
                    value={formData.title}
                    onChange={handleChange}
                    style={{ padding: '20px 10px' }}
                  />
                </div>

                <div className="grid gap-2" style={{ marginBottom: '20px' }}>
                  <Label htmlFor="message">Alert Message</Label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    className="flex min-h-[60px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    placeholder="e.g. Get free delivery on all orders above ₹999. Limited time offer!"
                    value={formData.message}
                    onChange={handleChange}
                    style={{ padding: '20px 10px' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '20px' }}>
                  <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <select
                      id="position"
                      name="position"
                      className="flex h-auto w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
                      value={formData.position}
                      onChange={handleChange}
                      style={{ padding: '11px 5px' }}
                    >
                      <option value="top">Top of Page</option>
                      <option value="bottom">Bottom of Page</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                    <Input
                      id="expiresAt"
                      name="expiresAt"
                      type="date"
                      value={formData.expiresAt}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      style={{ padding: '20px 10px' }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="dismissible"
                      name="dismissible"
                      checked={formData.dismissible}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <Label htmlFor="dismissible" className="cursor-pointer" style={{ marginTop: '5px' }}>Allow users to dismiss this alert</Label>
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
                    <Label htmlFor="isEnabled" className="cursor-pointer" style={{ marginTop: '5px' }}>Enable this alert</Label>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6" style={{ marginTop: '10px' }}>
                  <Label className="mb-2 block" style={{ marginBottom: '10px' }}>Preview</Label>
                  <div className={`p-4 rounded-lg border-l-4 ${getAlertPreviewStyles()}`} style={{ padding: '10px 5px' }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{formData.title || 'Alert Title'}</h4>
                        <p className="text-sm">{formData.message || 'Alert message will appear here...'}</p>
                      </div>
                      {formData.dismissible && (
                        <button type="button" className="ml-4 text-current opacity-50 hover:opacity-100">
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="font-medium">Info</span>
                    <span className="text-gray-500 text-[8px] sm:text-xs">- General information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">Success</span>
                    <span className="text-gray-500 text-[8px] sm:text-xs">- Positive updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="font-medium">Warning</span>
                    <span className="text-gray-500 text-[8px] sm:text-xs">- Important notices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="font-medium">Error</span>
                    <span className="text-gray-500 text-[8px] sm:text-xs">- Critical alerts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end pt-6" style={{ marginTop: '10px' }}>
          <Button type="submit" size="md" style={{ padding: '5px 10px' }}>
            <Save className="mr-2 h-4 w-4" />
            <span style={{ marginTop: '4px', paddingLeft: '5px' }}>
              {isEditMode ? 'Update Alert' : 'Create Alert'}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AlertForm;
