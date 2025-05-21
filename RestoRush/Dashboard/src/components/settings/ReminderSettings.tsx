import React from "react";
import TabCard from "../../ui/TabCard";
import NumberInput from "../../ui/NumberInput";
import MultiSelect from "../../ui/MultiSelect";
import Tooltip from "../../ui/Tooltip";
import { Select, SelectItem } from "../ui/select";

export interface EmailAccount {
  _id: string;
  email: string;
  profile: string;
}

export interface EmailsResponse {
  success: boolean;
  accounts: EmailAccount[];
}

interface ReminderSettingsProps {
  settings: any;
  onUpdateSettings: (key: string, value: any) => void;
  templates: any[];
  emails?: EmailsResponse;
}

const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  settings,
  onUpdateSettings,
  templates,
  emails,
}) => {
  const handleFrequencyChange = (
    type: "payment" | "subscription",
    value: string
  ) => {
    const frequencyArray = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map(Number)
      .filter((item) => !isNaN(item));

    onUpdateSettings(
      type === "payment"
        ? "paymentRemindersFrequence"
        : "subscriptionRemindersFrequence",
      frequencyArray
    );
  };

  return (
    <div className="space-y-6">
      <TabCard
        title="Payment Reminders"
        description="Configure settings for payment reminder emails"
      >
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center">
              <label className="text-sm font-medium text-gray-700">
                Total Payment Reminders
              </label>
              <Tooltip
                content="Maximum number of payment reminder emails to send"
                position="right"
                className="ml-1"
              />
            </div>
            <NumberInput
              value={settings.totalPaymentReminders || 0}
              onChange={(value) =>
                onUpdateSettings("totalPaymentReminders", value)
              }
              min={0}
              max={10}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center">
              <label className="text-sm font-medium text-gray-700">
                Reminder Frequency (Days)
              </label>
              <Tooltip
                content="Days after due date to send reminders (comma-separated)"
                position="right"
                className="ml-1"
              />
            </div>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., 1,3,7,14"
              value={settings.paymentRemindersFrequence?.join(",") || ""}
              onChange={(e) => handleFrequencyChange("payment", e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter days separated by commas (e.g., 1,3,7,14)
            </p>
          </div>

          <div>
            <div className="mb-1 flex items-center">
              <label className="text-sm font-medium text-gray-700">
                Payment Templates
              </label>
              <Tooltip
                content="Email templates to use for payment reminders"
                position="right"
                className="ml-1"
              />
            </div>
            <MultiSelect
              options={templates.map((t) => ({ value: t._id, label: t.name }))}
              selectedValues={settings.paymentTemplates || []}
              onChange={(values) =>
                onUpdateSettings("paymentTemplates", values)
              }
              placeholder="Select templates"
            />
          </div>
        </div>
      </TabCard>

      <TabCard
        title="Subscription Reminders"
        description="Configure settings for subscription reminder emails"
      >
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center">
              <label className="text-sm font-medium text-gray-700">
                Total Subscription Reminders
              </label>
              <Tooltip
                content="Maximum number of subscription reminder emails to send"
                position="right"
                className="ml-1"
              />
            </div>
            <NumberInput
              value={settings.totalSubscriptionReminders || 0}
              onChange={(value) =>
                onUpdateSettings("totalSubscriptionReminders", value)
              }
              min={0}
              max={10}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center">
              <label className="text-sm font-medium text-gray-700">
                Reminder Frequency (Days)
              </label>
              <Tooltip
                content="Days before expiration to send reminders (comma-separated)"
                position="right"
                className="ml-1"
              />
            </div>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., 30,14,7,2"
              value={settings.subscriptionRemindersFrequence?.join(",") || ""}
              onChange={(e) =>
                handleFrequencyChange("subscription", e.target.value)
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter days separated by commas (e.g., 30,14,7,2)
            </p>
          </div>

          <div>
            <div className="mb-1 flex items-center">
              <label className="text-sm font-medium text-gray-700">
                Subscription Templates
              </label>
              <Tooltip
                content="Email templates to use for subscription reminders"
                position="right"
                className="ml-1"
              />
            </div>
            <MultiSelect
              options={templates.map((t) => ({ value: t._id, label: t.name }))}
              selectedValues={settings.subscriptionTemplates || []}
              onChange={(values) =>
                onUpdateSettings("subscriptionTemplates", values)
              }
              placeholder="Select templates"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center">
            <label className="text-sm font-medium text-gray-700">
              Default Email
            </label>
            <Tooltip
              content="Default email to use for reminders"
              position="right"
              className="ml-1"
            />
          </div>
          <div className="mt-2">
            <select
              value={settings.default_account || ""}
              onChange={(e) => onUpdateSettings("defaultEmail", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Select a default email</option>
              {emails?.accounts?.map((account: any) => (
                <option key={account._id} value={account._id}>
                  {account.email}
                </option>
              ))}
            </select>
          </div>
        </div>
        {settings.default_account && (
          <div className="flex items-center mt-2">
            {(() => {
              const selected = emails.accounts?.find(
                (e) => e._id === settings.default_account
              );

              return selected ? (
                <img
                  src={selected.profile}
                  alt="Profile"
                  className="h-8 w-8 rounded-full mr-2"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/default-avatar.png"; // fallback
                  }}
                />
              ) : null;
            })()}
            {(() => {
              const selectedemail = emails.accounts?.find(
                (e) => e._id === settings.default_account
              );
              return selectedemail ? (
                <span className="text-sm">{selectedemail.email}</span>
              ) : null;
            })()}
          </div>
        )}
      </TabCard>
    </div>
  );
};

export default ReminderSettings;
