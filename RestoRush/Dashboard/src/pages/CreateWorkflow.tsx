import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/user";
import { Template, WorkflowFormData } from "../types";
import {
  getUsersSearch,
  getReminderTemplates,
  createCampaign,
} from "@/components/forms/services/api";
import { useDebouncedValue } from "@/pages/UserPage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSettingsAccount } from "../components/forms/services/api";
import Tooltip from "@/ui/Tooltip";

export interface EmailAccount {
  _id: string;
  email: string;
  profile: string;
}

export interface EmailsResponse {
  success: boolean;
  accounts: EmailAccount[];
}

const Workflow = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templatePreview, setTemplatePreview] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [emails, setEmails] = useState<EmailsResponse>();
  const [formData, setFormData] = useState<WorkflowFormData>({
    name: "",
    all: false,
    moderators: false,
    oneTime: false,
    scheduleAt: "",
    frequency: {
      period: "day",
      frequency: 1,
      from: "",
      to: "",
    },
    account: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const navigate = useNavigate();
  const page = 1;
  const limit = 10;

     const fetchAccounts = async () => {
      try {
      const response = await getSettingsAccount();
      setEmails(response);
      console.log("Accounts:", response);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    useEffect(() => {
      fetchAccounts();
    }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const response = await getReminderTemplates();
        setTemplates(response);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsersSearch(page, limit, debouncedSearch);
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (!formData.all) {
      fetchUsers();
    }
  }, [debouncedSearch, formData.all]);

  const handleFormChange = (field: string, value: any) => {
    if (field.startsWith("frequency.")) {
      const key = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        frequency: {
          ...prev.frequency,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleUserSelect = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    const selected = templates.find((t) => t._id === id);
    setTemplatePreview(selected || null);
  };

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      template: selectedTemplate,
      members: formData.all ? [] : selectedUsers,
      all: formData.all,
      moderators: formData.moderators,
      scheduleAt: formData.scheduleAt,
      oneTime: formData.oneTime,
      frequency: formData.oneTime ? null : formData.frequency,
      account: formData.account,
    };

    try {
      await createCampaign(payload);
      toast("Success", {
        description: "Workflow created successfully!",
      });
      setFormData({
        name: "",
        all: false,
        moderators: false,
        oneTime: false,
        scheduleAt: "",
        frequency: {
          period: "day",
          frequency: 1,
          from: "",
          to: "",
        },
        account: "",
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast("Error", {
        description: "Failed to create workflow.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Workflow</CardTitle>
          <CardDescription>
            Set up automated workflows for your users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Workflow Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Enter workflow name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Select Template</Label>
            <Select
              value={selectedTemplate || ""}
              onValueChange={handleTemplateSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- Select Template --" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((tpl) => (
                  <SelectItem key={tpl._id} value={tpl._id}>
                    {tpl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {templatePreview && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Template Preview</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewOpen(true)}
                >
                  View Full Preview
                </Button>
              </div>
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="font-semibold">
                    Subject: {templatePreview.subject}
                  </p>
                </CardContent>
              </Card>
              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{templatePreview.name}</DialogTitle>
                    <DialogDescription>
                      Subject: {templatePreview.subject}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 p-4 border rounded-md bg-background">
                    <div
                      dangerouslySetInnerHTML={{ __html: templatePreview.body }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-users"
              checked={formData.all}
              onCheckedChange={(checked) => handleFormChange("all", !!checked)}
            />
            <label
              htmlFor="all-users"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Apply to All Users
            </label>
          </div>

          {!formData.all && (
            <div className="space-y-2">
              <Label htmlFor="user-search">Search and Select Users</Label>
              <Input
                id="user-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search users..."
              />
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                {users.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No users found
                  </p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        id={`user-${user._id}`}
                        checked={selectedUsers.includes(user._id)}
                        onCheckedChange={() => handleUserSelect(user._id)}
                      />
                      <label
                        htmlFor={`user-${user._id}`}
                        className="text-sm flex-1 font-medium leading-none"
                      >
                        {user.fullName}
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          {user.email}
                        </span>
                      </label>
                    </div>
                  ))
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Selected {selectedUsers.length} user(s)
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="moderators"
              checked={formData.moderators}
              onCheckedChange={(checked) =>
                handleFormChange("moderators", !!checked)
              }
            />
            <label
              htmlFor="moderators"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include Moderators
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-at">Schedule At</Label>
            <Input
              id="schedule-at"
              type="datetime-local"
              value={formData.scheduleAt}
              onChange={(e) => handleFormChange("scheduleAt", e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="one-time"
              checked={formData.oneTime}
              onCheckedChange={(checked) =>
                handleFormChange("oneTime", !!checked)
              }
            />
            <label
              htmlFor="one-time"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              One-Time Workflow
            </label>
          </div>

          {!formData.oneTime && (
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Frequency Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="period">Period</Label>
                    <Select
                      value={formData.frequency.period}
                      onValueChange={(value) =>
                        handleFormChange("frequency.period", value)
                      }
                    >
                      <SelectTrigger id="period">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency-number">Frequency</Label>
                    <Input
                      id="frequency-number"
                      type="number"
                      min="1"
                      value={formData.frequency.frequency}
                      onChange={(e) =>
                        handleFormChange(
                          "frequency.frequency",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-date">From Date</Label>
                    <Input
                      id="from-date"
                      type="date"
                      value={formData.frequency.from}
                      onChange={(e) =>
                        handleFormChange("frequency.from", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to-date">To Date</Label>
                    <Input
                      id="to-date"
                      type="date"
                      value={formData.frequency.to}
                      onChange={(e) =>
                        handleFormChange("frequency.to", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="mt-4">
             <div className="mb-1 flex items-center">
            <Label htmlFor="default-email">Default Email</Label>
            <Tooltip
              content="Default email to use for reminders"
              position="right"
              className="ml-1"
            />
          </div>
          <div className="mt-2">
            <select
              value={formData.account}
              onChange={(e) => handleFormChange("account", e.target.value)}
              className="w-md border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Select a default email</option>
              {emails?.accounts?.map((account: any) => (
                <option key={account._id} value={account._id}>
                  {account.email}
                </option>
              ))}
            </select>
          </div>
          {formData.account && (() => {
            const selected = emails.accounts?.find(e => e._id === formData.account);
            return selected ? (
              <div className="flex items-center mt-2">
                <img
                  src={selected.profile}
                  alt="Profile"
                  className="h-8 w-8 rounded-full mr-2"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/default-avatar.png";
                  }}
                />
                <span>{selected.email}</span>
              </div>
            ) : null;
          })()}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => navigate("/workflows")}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Workflow</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Workflow;
