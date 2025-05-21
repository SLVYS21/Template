import React, { useEffect, useState } from "react";
import { Edit, Trash2, ChevronDown, ChevronUp, AlertCircle, MonitorCog } from "lucide-react";
import { format } from "date-fns";
import { on } from "stream";

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

  interface WorkflowItemProps {
    campaign: Campaign;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onTest: (id: string) => void;
  }
  
  const WorkflowItem: React.FC<WorkflowItemProps> = ({ campaign, onEdit, onDelete, onTest }) => {
    const [expanded, setExpanded] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
  
    const formatDate = (dateStr: string | null) => {
      if (!dateStr) return "N/A";
      return format(new Date(dateStr), "PPpp");
    };
  
    // const handleDelete = () => {
    //   if (!confirmDelete) {
    //     setConfirmDelete(true);
    //     setTimeout(() => setConfirmDelete(false), 3000); // Reset after 3 seconds
    //   } else {
    //     onDelete(campaign._id);
    //     setConfirmDelete(false);
    //   }
    // };
  
    return (
      <div 
        className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-grow mr-2">
              <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">{campaign.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Template: <span className="font-medium">{campaign.template?.name || "N/A"}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-1">
            <button 
                onClick={() => onTest(campaign._id)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                aria-label="Test campaign"
              >
                <MonitorCog size={18} />
              </button>
              <button 
                onClick={() => onEdit(campaign._id)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                aria-label="Edit campaign"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={() => onDelete(campaign._id)}

                className={`p-2 rounded-full transition-colors ${
                  confirmDelete 
                    ? "text-white bg-red-500 hover:bg-red-600" 
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                }`}
                aria-label={confirmDelete ? "Confirm delete" : "Delete campaign"}
              >
                {confirmDelete ? <AlertCircle size={18} /> : <Trash2 size={18} />}
              </button>
            </div>
          </div>
  
          <div className="flex justify-between items-center mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              campaign.status === "scheduled"
                ? "bg-green-100 text-green-700"
                : campaign.status === "draft"
                  ? "bg-yellow-100 text-yellow-700"
                  : campaign.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
            }`}>
              {campaign.status}
            </span>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Schedule: </span>
              {formatDate(campaign.scheduleAt)}
            </p>
          </div>
  
          <div className="mb-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Target:</span>
              {(campaign.members.length > 2 ) && (
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-blue-600 flex items-center"
                >
                  {expanded ? (
                    <>
                      <span>Show less</span>
                      <ChevronUp size={14} className="ml-1" />
                    </>
                  ) : (
                    <>
                      <span>Show more</span>
                      <ChevronDown size={14} className="ml-1" />
                    </>
                  )}
                </button>
              )}
            </div>
            
            {campaign.all ? (
              <span className="text-sm text-blue-600 font-medium ml-1">All Users</span>
            ) : campaign.members.length > 0 ? (
              <ul className="mt-1 ml-2 text-sm text-gray-600 space-y-1">
                {(expanded ? campaign.members : campaign.members.slice(0, 2)).map((user) => (
                  <li key={user._id} className="flex items-start">
                    <span className="text-gray-400 mr-1">•</span>
                    <span className="line-clamp-1">{user.fullName} ({user.email})</span>
                  </li>
                ))}
                {!expanded && campaign.members.length > 2 && (
                  <li className="text-xs text-gray-500">+ {campaign.members.length - 2} more</li>
                )}
              </ul>
            ) : (
              <span className="text-sm text-gray-500 ml-1">None selected</span>
            )}
          </div>
  
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
            <div className="text-sm">
              <span className="text-gray-600 font-medium">Moderators: </span>
              <span className="text-gray-800">{campaign.moderators ? "Included" : "Excluded"}</span>
            </div>
  
            <div className="text-sm">
              <span className="text-gray-600 font-medium">One-Time: </span>
              <span className="text-gray-800">{campaign.oneTime ? "Yes" : "No"}</span>
            </div>
          </div>
  
          {!campaign.oneTime && campaign.frequency && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
              <h3 className="font-medium text-gray-700 mb-1">Recurring Schedule</h3>
              <p className="text-gray-600">
                Every {campaign.frequency.frequency} {campaign.frequency.period}(s)
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                <p>
                  <span className="font-medium">From:</span> {formatDate(campaign.frequency.from)}
                </p>
                <p>
                  <span className="font-medium">To:</span> {formatDate(campaign.frequency.to)}
                </p>
              </div>
            </div>
          )}
  
          <p className="text-xs text-gray-400 mt-4">
            Created: {formatDate(campaign.createdAt)}
          </p>
        </div>
      </div>
    );
  };
  
  export default WorkflowItem;