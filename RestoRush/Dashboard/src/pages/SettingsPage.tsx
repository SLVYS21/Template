import React, { useEffect, useState } from 'react';
import { Settings, Save, Loader2, AlertCircle } from 'lucide-react';
import { getSettings, getSpaces, getReminderTemplates, getForms, updateSettings, getSettingsAccount } from "@/components/forms/services/api";
import axios from 'axios';
import ReminderSettings from '../components/settings/ReminderSettings';
import SpaceSettings from '../components/settings/SpaceSettings';
import ConfirmDialog from '../ui/ConfirmDialog';
import Tooltip from '../ui/Tooltip';
import EmailSettings from '@/components/settings/EmailSettings';

enum TabType {
  REMINDERS = 'reminders',
  SPACES = 'spaces',
  EMAIL = 'email',
}

export interface EmailAccount {
  _id: string;
  email: string;
  profile: string;
}

export interface EmailsResponse {
  success: boolean;
  accounts: EmailAccount[];
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [emails, setEmails] = useState<EmailsResponse>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.REMINDERS);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [settingsRes, spacesRes, templatesRes, formsRes, emailsRes] = await Promise.all([
          getSettings(),
          getSpaces(),
          getReminderTemplates(),
          getForms(),
          getSettingsAccount()
        ]);
        setSettings(settingsRes.data);
        console.log(settingsRes.data);
        setInitialSettings(JSON.parse(JSON.stringify(settingsRes.data))); // Deep copy
        setSpaces(spacesRes);
        setTemplates(templatesRes);
        setForms(formsRes);
        setEmails(emailsRes);
        console.log(emailsRes);
      } catch (err) {
        console.error('Error fetching settings data:', err);
        setError('Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (settings && initialSettings) {
      setHasChanges(JSON.stringify(settings) !== JSON.stringify(initialSettings));
    }
  }, [settings, initialSettings]);

  const handleUpdateSettings = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const payload = {
        totalPaymentReminders: settings.totalPaymentReminders,
        paymentRemindersFrequence: settings.paymentRemindersFrequence,
        noPaymentSpaces: settings.noPaymentSpaces,
        totalSubscriptionReminders: settings.totalSubscriptionReminders,
        subscriptionRemindersFrequence: settings.subscriptionRemindersFrequence,
        noSubscriptionSpaces: settings.noSubscriptionSpaces,
        paymentTemplates: settings.paymentTemplates,
        subscriptionTemplates: settings.subscriptionTemplates,
        joiningForm: settings.joiningForm,
        default_account: settings.defaultEmail,
      };
      
      await updateSettings(payload);
      setInitialSettings(JSON.parse(JSON.stringify(settings))); // Update initial settings
      setHasChanges(false);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-up';
      notification.textContent = 'Settings saved successfully';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => document.body.removeChild(notification), 500);
      }, 3000);
      
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-600" />
        <p className="text-lg text-gray-600">Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center text-red-500">
            <AlertCircle className="mr-2 h-6 w-6" />
            <h2 className="text-xl font-semibold">Error</h2>
          </div>
          <p className="mb-4 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center">
          <Settings className="mr-3 h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">System Settings</h1>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
          <div className="flex border-b">
            <button
              className={`flex-1 px-4 py-3 text-center text-sm font-medium transition duration-200 md:text-base
                ${activeTab === TabType.REMINDERS 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange(TabType.REMINDERS)}
            >
              Reminder Settings
            </button>
            <button
              className={`flex-1 px-4 py-3 text-center text-sm font-medium transition duration-200 md:text-base
                ${activeTab === TabType.SPACES 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange(TabType.SPACES)}
            >
              Space & Form Settings
            </button>
            <button
              className={`flex-1 px-4 py-3 text-center text-sm font-medium transition duration-200 md:text-base
                ${activeTab === TabType.EMAIL 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange(TabType.EMAIL)}
            >
              Email Settings
            </button>
          </div>

          <div className="p-4 md:p-6">
            {activeTab === TabType.REMINDERS && (
              <ReminderSettings 
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                templates={templates}
                emails={emails}
              />
            )}
            
            {activeTab === TabType.SPACES && (
              <SpaceSettings 
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                spaces={spaces}
                forms={forms}
              />
            )}

            {activeTab === TabType.EMAIL && (
              <EmailSettings/>
            )}
          </div>
        </div>
        {activeTab !== TabType.EMAIL && (
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md md:relative md:bg-transparent md:p-0 md:shadow-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {hasChanges && (
                <p className="text-sm text-amber-600">
                  <span className="mr-1">•</span> You have unsaved changes
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <button
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 md:text-base"
                  onClick={() => setSettings(JSON.parse(JSON.stringify(initialSettings)))}
                  disabled={saving}
                >
                  Discard Changes
                </button>
              )}
              <button
                className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 md:text-base"
                onClick={() => setShowConfirmDialog(true)}
                disabled={saving || !hasChanges}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
              <Tooltip 
                content={!hasChanges ? "No changes to save" : "Save your changes"} 
                position="top"
              >
                <div className="ml-1 h-4 w-4" />
              </Tooltip>
            </div>
          </div>
        </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleSave}
        title="Save Changes"
        message="Are you sure you want to save these changes? This will update your system settings."
        confirmLabel="Save"
      />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }

        .animate-fade-out {
          animation: fadeOut 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;