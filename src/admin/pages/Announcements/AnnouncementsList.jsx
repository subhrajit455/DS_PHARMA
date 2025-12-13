import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Image as ImageIcon, MessageSquare, Bell } from 'lucide-react';
import { useAnnouncements } from '../../../contexts/AnnouncementContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';

const AnnouncementsList = () => {
  const navigate = useNavigate();
  const {
    banners,
    marqueeMessages,
    alerts,
    toggleBannerStatus,
    toggleMarqueeStatus,
    toggleAlertStatus,
    deleteBanner,
    deleteMarquee,
    deleteAlert
  } = useAnnouncements();

  const [activeTab, setActiveTab] = useState('banners');

  const handleDelete = (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (type === 'banner') deleteBanner(id);
      else if (type === 'marquee') deleteMarquee(id);
      else if (type === 'alert') deleteAlert(id);
    }
  };

  const tabs = [
    { id: 'banners', label: 'Banners', icon: ImageIcon, count: banners.length },
    { id: 'marquee', label: 'Marquee Messages', icon: MessageSquare, count: marqueeMessages.length },
    { id: 'alerts', label: 'Alerts', icon: Bell, count: alerts.length },
  ];

  return (
    <div className="flex flex-col h-full space-y-6" style={{ padding: '10px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          Announcements & Alerts
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mt-4 sm:mt-6 overflow-x-auto no-scrollbar" style={{ paddingTop: '5px' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              style={{ padding: '2px 5px' }}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-3 font-medium text-[8px] sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span style={{ marginTop: '3px' }}>{tab.label}</span>
              <Badge variant="secondary" className="text-[8px] sm:text-xs">{tab.count}</Badge>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-6">
        {activeTab === 'banners' && (
          <BannersTab
            banners={banners}
            onToggle={toggleBannerStatus}
            onDelete={(id) => handleDelete('banner', id)}
            onEdit={(id) => navigate(`/admin/announcements/banners/${id}/edit`)}
            onAdd={() => navigate('/admin/announcements/banners/new')}
          />
        )}

        {activeTab === 'marquee' && (
          <MarqueeTab
            marqueeMessages={marqueeMessages}
            onToggle={toggleMarqueeStatus}
            onDelete={(id) => handleDelete('marquee', id)}
            onEdit={(id) => navigate(`/admin/announcements/marquee/${id}/edit`)}
            onAdd={() => navigate('/admin/announcements/marquee/new')}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsTab
            alerts={alerts}
            onToggle={toggleAlertStatus}
            onDelete={(id) => handleDelete('alert', id)}
            onEdit={(id) => navigate(`/admin/announcements/alerts/${id}/edit`)}
            onAdd={() => navigate('/admin/announcements/alerts/new')}
          />
        )}
      </div>
    </div>
  );
};



// Helper for pagination
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-between mt-4 border-t pt-4">
        <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
        </div>
    </div>
);

// Banners Tab Component
const BannersTab = ({ banners, onToggle, onDelete, onEdit, onAdd }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(banners.length / itemsPerPage);
  const paginatedBanners = banners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
  <div className="flex flex-col">
    <div className="flex justify-end mb-2 sm:mb-3 md:mb-4 shrink-0" style={{ padding: '5px' }}>
      <Button onClick={onAdd} className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm h-7 sm:h-9 md:h-10" style={{ padding: '5px' }}>
        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
        <span style={{ marginTop: '3px' }}>Add Banner</span>
      </Button>
    </div>

    <div className="space-y-4">
      {banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No banners yet. Create your first banner!</p>
          </CardContent>
        </Card>
      ) : (
        <>
            {paginatedBanners.map(banner => (
            <Card key={banner.id}>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4">
                <div className="w-full sm:w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {banner.imageUrl || banner.imageBase64 ? (
                    <img
                        src={banner.imageBase64 || banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                    />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{banner.title}</h3>
                    <p className="text-[8px] sm:text-sm text-gray-500">Position: {banner.position}</p>
                    {banner.link && (
                    <p className="text-[8px] sm:text-sm text-gray-500 truncate">Link: {banner.link}</p>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center">
                    <Switch
                    checked={banner.isEnabled}
                    onCheckedChange={() => onToggle(banner.id)}
                    />
                    <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    onClick={() => onEdit(banner.id)}
                    >
                    <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(banner.id)}
                    >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                </div>
                </CardContent>
            </Card>
            ))}
            {banners.length > itemsPerPage && (
                <PaginationControls 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </>
      )}
    </div>
  </div>
  );
};

// Marquee Tab Component
const MarqueeTab = ({ marqueeMessages, onToggle, onDelete, onEdit, onAdd }) => (
  <div>
    <div className="flex justify-end mb-4" style={{ padding: '5px' }} >
      <Button onClick={onAdd} className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm h-7 sm:h-9 md:h-10" style={{ padding: '5px' }}>
        <Plus className="h-4 w-4 mr-2" />
        <span style={{ marginTop: '3px' }}>Add Marquee</span>
      </Button>
    </div>

    <div className="grid gap-4">
      {marqueeMessages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No marquee messages yet. Create your first one!</p>
          </CardContent>
        </Card>
      ) : (
        marqueeMessages.map(marquee => (
          <Card key={marquee.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">Marquee Messages</h3>
                    <Badge variant="outline">{marquee.messages.length} items</Badge>
                  </div>
                  <div className="space-y-1 mb-2">
                    {marquee.messages.slice(0, 3).map((msg, idx) => (
                      <p key={idx} className="text-sm text-gray-600">• {msg}</p>
                    ))}
                    {marquee.messages.length > 3 && (
                      <p className="text-sm text-gray-400">...and {marquee.messages.length - 3} more</p>
                    )}
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Speed: {marquee.speed}s</span>
                    <span>Position: {marquee.position}</span>
                    <span style={{ color: marquee.color }}>Color: {marquee.color}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={marquee.isEnabled}
                    onCheckedChange={() => onToggle(marquee.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(marquee.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(marquee.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  </div>
);

// Alerts Tab Component
const AlertsTab = ({ alerts, onToggle, onDelete, onEdit, onAdd }) => {
  const getAlertColor = (type) => {
    const colors = {
      info: 'bg-blue-50 border-blue-200 text-blue-900',
      success: 'bg-green-50 border-green-200 text-green-900',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      error: 'bg-red-50 border-red-200 text-red-900'
    };
    return colors[type] || colors.info;
  };

  return (
    <div>
      <div className="flex justify-end mb-4" style={{ padding: '5px' }}>
        <Button onClick={onAdd} className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm h-7 sm:h-9 md:h-10" style={{ padding: '5px' }}>
          <Plus className="h-4 w-4 mr-2" />
          <span style={{ marginTop: '3px' }}>Add Alert</span>
        </Button>
      </div>

      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No alerts yet. Create your first alert!</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map(alert => (
            <Card key={alert.id} className={`border ${getAlertColor(alert.type)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <Badge variant="outline">{alert.type}</Badge>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <div className="flex gap-4 text-[8px] sm:text-xs opacity-75">
                      <span>Position: {alert.position}</span>
                      {alert.dismissible && <span>Dismissible</span>}
                      {alert.expiresAt && <span>Expires: {new Date(alert.expiresAt).toLocaleDateString()}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={alert.isEnabled}
                      onCheckedChange={() => onToggle(alert.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(alert.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(alert.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementsList;
