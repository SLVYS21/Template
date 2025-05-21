import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCampaigns,
  testWorkflow,
  deleteCampaign,
} from "@/components/forms/services/api";
import { Plus } from "lucide-react";
import WorkflowItem from "@/components/workflow/WorkflowItem";

interface Member {
  _id: string;
  fullName: string;
  email: string;
}

interface Template {
  _id: string;
  name: string;
}

interface Frequency {
  frequency: number;
  period: string;
  from: string | null;
  to: string | null;
}

interface Campaign {
  _id: string;
  name: string;
  status: string;
  template?: Template;
  scheduleAt: string | null;
  all: boolean;
  members: Member[];
  moderators: boolean;
  oneTime: boolean;
  frequency?: Frequency;
  createdAt: string | null;
  account: string;
}

const WorkflowView: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const response = await getCampaigns();
        setCampaigns(response);
        setError(null);
      } catch (err) {
        setError("Failed to load campaigns. Please try again later.");
        console.error("Error fetching campaigns:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleEdit = (id: string) => {
    console.log(`Edit campaign with ID: ${id}`);
    navigate(`/edit-workflow/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        const response = await deleteCampaign(id);
        console.log("Campaign deleted:", response);
        alert("Campaign deleted successfully");
        setCampaigns(campaigns.filter((campaign) => campaign._id !== id));
      } catch (err) {
        console.error("Error deleting campaign:", err);
      }
    }
  };

  const handleTestWorkflow = async (id: string) => {
    try {
      const response = await testWorkflow(id);
      alert(response.message);
    } catch (err) {
      console.error("Error testing workflow:", err);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Campaign Workflows
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your email campaign workflows
          </p>
        </div>

        <button
          onClick={() => navigate("/workflows/create")}
          className="mt-4 sm:mt-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <Plus size={18} className="mr-2" />
          <span>New Campaign</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-200 rounded-full mb-3"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No campaigns found
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first campaign to get started
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            <Plus size={18} className="inline mr-2" />
            <span>Create Campaign</span>
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <WorkflowItem
              key={campaign._id}
              campaign={campaign}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTest={handleTestWorkflow}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowView;
