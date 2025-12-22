import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAnnouncements } from '@/shared/contexts/AnnouncementContext';
import { Button } from '@/admin/components/ui/Button';
import { Input } from '@/admin/components/ui/Input';
import { Label } from '@/admin/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/admin/components/ui/Card';

const MarqueeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { marqueeMessages, createMarquee, updateMarquee } = useAnnouncements();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    messages: [''],
    color: '#e94242',
    speed: 22,
    position: 'hero',
    isEnabled: true
  });

  useEffect(() => {
    if (isEditMode) {
      const marquee = marqueeMessages.find(m => m.id === id);
      if (marquee) {
        setFormData({
          messages: marquee.messages,
          color: marquee.color,
          speed: marquee.speed,
          position: marquee.position,
          isEnabled: marquee.isEnabled
        });
      } else {
        toast.error('Marquee not found');
        navigate('/admin/announcements');
      }
    }
  }, [id, isEditMode, marqueeMessages, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMessageChange = (index, value) => {
    const newMessages = [...formData.messages];
    newMessages[index] = value;
    setFormData(prev => ({ ...prev, messages: newMessages }));
  };

  const addMessage = () => {
    setFormData(prev => ({
      ...prev,
      messages: [...prev.messages, '']
    }));
  };

  const removeMessage = (index) => {
    if (formData.messages.length > 1) {
      const newMessages = formData.messages.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, messages: newMessages }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter out empty messages
    const filteredMessages = formData.messages.filter(msg => msg.trim() !== '');
    
    if (filteredMessages.length === 0) {
      toast.error('Please add at least one message');
      return;
    }

    const dataToSave = {
      ...formData,
      messages: filteredMessages,
      speed: parseInt(formData.speed)
    };

    try {
      if (isEditMode) {
        updateMarquee(id, dataToSave);
        toast.success('Marquee updated successfully');
      } else {
        createMarquee(dataToSave);
        toast.success('Marquee created successfully');
      }
      navigate('/admin/announcements');
    } catch {
      toast.error('Failed to save marquee');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full overflow-y-auto custom-scrollbar" style={{ padding: '5px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
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
          {isEditMode ? 'Edit Marquee Message' : 'Add New Marquee Message'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ marginTop: '10px' }}>
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader style={{ paddingBottom: '10px' }}>
                <CardTitle>Marquee Messages</CardTitle>
                <CardDescription>Add scrolling text messages (e.g., features, offers, announcements)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Messages</Label>
                  {formData.messages.map((message, index) => (
                    <div key={index} className="flex gap-2" style={{ paddingBottom: '10px' }}>
                      <Input
                        placeholder="e.g. ✓ Free Shipping on Orders Above ₹999"
                        value={message}
                        onChange={(e) => handleMessageChange(index, e.target.value)}
                        style={{ padding: '20px 10px' }}
                      />
                      {formData.messages.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMessage(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMessage}
                    className="mt-2"
                    style={{ padding: '0px 5px' }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span style={{ marginTop: '2px' }}>Add Message</span>
                  </Button>
                </div>

                <div className="grid gap-2" style={{ marginTop: '10px' }}>
                  <Label htmlFor="position">Position</Label>
                  <select
                    id="position"
                    name="position"
                    className="flex h-auto w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
                    value={formData.position}
                    onChange={handleChange}
                    style={{ padding: '10px 5px' }}
                  >
                    <option value="hero">Hero Section</option>
                    <option value="top">Top of Page</option>
                    <option value="bottom">Bottom of Page</option>
                  </select>
                </div>

                <div className="flex items-center gap-2" style={{ marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="isEnabled"
                    name="isEnabled"
                    checked={formData.isEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    
                  />
                  <Label htmlFor="isEnabled" className="cursor-pointer" style={{ marginTop: '5px' }}>Enable this marquee</Label>
                </div>

                {/* Preview */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200" style={{ marginTop: '10px', padding: '10px 5px' }}>
                  <Label className="mb-2 block">Preview</Label>
                  <div className="overflow-hidden bg-white rounded">
                    <div 
                      className="flex whitespace-nowrap animate-marquee"
                      style={{ 
                        color: formData.color,
                        animationDuration: `${formData.speed}s`
                      }}
                    >
                      {formData.messages.filter(m => m.trim()).map((msg, idx) => (
                        <span key={idx} className="px-8 font-semibold">{msg}</span>
                      ))}
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
                <CardTitle>Styling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="color">Text Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="h-10 w-20 rounded border border-gray-200"
                    />
                    <Input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#e94242"
                      className="flex-1"
                      style={{ padding: '10px' }}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="speed">Animation Speed: {formData.speed}s</Label>
                  <input
                    type="range"
                    id="speed"
                    name="speed"
                    min="10"
                    max="60"
                    value={formData.speed}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[8px] sm:text-xs text-gray-500">
                    <span>Fast (10s)</span>
                    <span>Slow (60s)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end pt-4" style={{ marginTop: '10px' }}> 
          <Button type="submit" size="md" style={{ padding: '5px 10px' }}>
            <Save className="mr-2 h-4 w-4" />
            <span style={{ marginTop: '4px', paddingLeft: '5px' }}>
              {isEditMode ? 'Update Marquee' : 'Create Marquee'}
            </span>
          </Button>
        </div>
      </form>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MarqueeForm;
