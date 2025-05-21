import axios from 'axios';
import { UsersResponse } from '@/types/user';

// Mocked data for the example
const mockResponse: UsersResponse = {
  count: 945,
  members: [
    {
      payment: {
        status: 'Progress',
        sequence: 1
      },
      reminder: {
        sequence: 1
      },
      _id: "6810a6c4feedb8744c77adff",
      email: "illbeexcompany@gmail.com",
      fullName: "Habib Mame Betty SALL",
      circleId: "29831948",
      profile: null,
      status: "NON TRAITÉ",
      product: "ECOM AFRICA PRO",
      accessGroups: [
        "68109c50b1c963587474316f",
        "68109c51b1c9635874743172",
        // Additional groups excluded for brevity
      ],
    },
    {
      payment: {
        status: 'Progress',
        sequence: 1
      },
      reminder: {
        sequence: 1
      },
      _id: "6810a6c4feedb8744c77ae02",
      email: "souberoufaic@gmail.com",
      fullName: "SOUBEROU faïc",
      circleId: "29831946",
      profile: null,
      status: "TRAITÉ",
      product: "ECOM AFRICA PRO",
      accessGroups: [
        "68109c50b1c963587474316f",
        "68109c51b1c9635874743172",
        // Additional groups excluded for brevity
      ],
    },
    // Add more mock data to populate the table
    {
      payment: {
        status: 'Completed',
        sequence: 2
      },
      reminder: {
        sequence: 0
      },
      _id: "6810a6c4feedb8744c77ae03",
      email: "john.doe@example.com",
      fullName: "John Doe",
      circleId: "29831947",
      profile: null,
      status: "TRAITÉ",
      product: "ECOM AFRICA PRO",
      accessGroups: [],
    },
    {
      payment: {
        status: 'Failed',
        sequence: 1
      },
      reminder: {
        sequence: 3
      },
      _id: "6810a6c4feedb8744c77ae04",
      email: "jane.smith@example.com",
      fullName: "Jane Smith",
      circleId: "29831949",
      profile: null,
      status: "REJETÉ",
      product: "ECOM AFRICA BASIC",
      accessGroups: [],    },
    {
      payment: {
        status: 'Progress',
        sequence: 1
      },
      reminder: {
        sequence: 2
      },
      _id: "6810a6c4feedb8744c77ae05",
      email: "robert.johnson@example.com",
      fullName: "Robert Johnson",
      circleId: "29831950",
      profile: null,
      status: "NON TRAITÉ",
      product: "ECOM AFRICA PRO",
      accessGroups: [],    },
    {
      payment: {
        status: 'Completed',
        sequence: 3
      },
      reminder: {
        sequence: 0
      },
      _id: "6810a6c4feedb8744c77ae06",
      email: "lisa.williams@example.com",
      fullName: "Lisa Williams",
      circleId: "29831951",
      profile: null,
      status: "TRAITÉ",
      product: "ECOM AFRICA PREMIUM",
      accessGroups: [],
    },
    {
      payment: {
        status: 'Progress',
        sequence: 1
      },
      reminder: {
        sequence: 1
      },
      _id: "6810a6c4feedb8744c77ae07",
      email: "michael.brown@example.com",
      fullName: "Michael Brown",
      circleId: "29831952",
      profile: null,
      status: "NON TRAITÉ",
      product: "ECOM AFRICA BASIC",
      accessGroups: [],    },
    {
      payment: {
        status: 'Failed',
        sequence: 2
      },
      reminder: {
        sequence: 4
      },
      _id: "6810a6c4feedb8744c77ae08",
      email: "sarah.davis@example.com",
      fullName: "Sarah Davis",
      circleId: "29831953",
      profile: null,
      status: "REJETÉ",
      product: "ECOM AFRICA PRO",
      accessGroups: [],    },
    {
      payment: {
        status: 'Completed',
        sequence: 1
      },
      reminder: {
        sequence: 0
      },
      _id: "6810a6c4feedb8744c77ae09",
      email: "david.miller@example.com",
      fullName: "David Miller",
      circleId: "29831954",
      profile: null,
      status: "TRAITÉ",
      product: "ECOM AFRICA PREMIUM",
      accessGroups: [],
    },
    {
      payment: {
        status: 'Progress',
        sequence: 1
      },
      reminder: {
        sequence: 2
      },
      _id: "6810a6c4feedb8744c77ae10",
      email: "laura.wilson@example.com",
      fullName: "Laura Wilson",
      circleId: "29831955",
      profile: null,
      status: "NON TRAITÉ",
      product: "ECOM AFRICA PRO",
      accessGroups: [],    },
    {
      payment: {
        status: 'Failed',
        sequence: 1
      },
      reminder: {
        sequence: 2
      },
      _id: "6810a6c4feedb8744c77ae11",
      email: "james.taylor@example.com",
      fullName: "James Taylor",
      circleId: "29831956",
      profile: null,
      status: "REJETÉ",
      product: "ECOM AFRICA BASIC",
      accessGroups: [],    }
  ]
};


export const exportUsersToCsv = (users: UsersResponse['members']): string => {
  const headers = ['Full Name', 'Email', 'Circle ID', 'Status', 'Product', 'Payment Status'];
  const rows = users.map(user => [
    user.fullName,
    user.email,
    user.circleId,
    user.status,
    user.product,
    user.payment.status
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

export type QuestionType = 
  | 'short-answer' 
  | 'paragraph' 
  | 'multiple-choice' 
  | 'checkbox' 
  | 'dropdown' 
  | 'file-upload' 
  | 'date' 
  | 'linear-scale'
  | 'image';

export interface Option {
  id: string;
  value: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: Option[];
  minValue?: number;
  maxValue?: number;
  step?: number;
  allowedFileTypes?: string[];
  maxFileSize?: number;
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isPublished: boolean;
  visibility: 'public' | 'private' | 'invite-only';
  createdAt: Date;
  updatedAt: Date;
}

const backendUrl = "http://localhost:5000/"
export const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  const token = storedUser ? JSON.parse(storedUser)?.token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token:", token);
  }

  return config;
});


export const createForm = async (data: FormData) => {
  const response = await api.post('/api/forms', data );
  return response.data;
};

export const getForms = async () => {
  const response = await api.get('/api/forms');
  return response.data;
};

export const getFormsById = async (id: string) => {
  const response = await api.get(`/api/forms/${id}`);
  return response.data;
};

export const deleteFormsById = async (id: string) => {
  const response = await api.delete(`/api/forms/${id}`);
  return response.data;
};

export const addQuestion = async (formId: string, questionData: any) => {
  const response = await api.post(`/formation/addQuestions/${formId}`, questionData);
  return response.data;
};

export const submitFormResponse = async (data: any) => {
  const response = await api.post("/api/answers", data);
  return response.data;
}

export const getAnswersByFormId = async (formId: string) => {
  const response = await api.get(`/api/answers/${formId}`);
  return response.data;
}

export const duplicateForm = async (formId: string) => {
  const response = await api.post(`/api/forms/${formId}/duplicate`);
  return response.data;
}

export const getUsers = async (page: number, limit: number, search?: string, option?: string) => {
  const response = await api.get('/api/circle', {
    params: { page, limit, search, option },
  });

  return {
    response: response.data.members,
    count: response.data.count,
  };
};

export const getUsersSearch = async (page: number, limit: number, search: string) => {
  const response = await api.get('/api/circle/select-members', {
    params: { page, limit, search },
  });

  return response.data;
  
}

export const getUsersById = async (id: string) => {
  const response = await api.get(`/api/circle/members/${id}`);
  return response.data;
};


export const getPayments = async (
  page: number = 1, 
  limit: number = 10,
  startDate: Date,
  endDate: Date,
  period: string
) => {
  try {
    const response = await api.get('/api/payment', {
      params: { 
        page, 
        limit,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        period
      },
    });
    return {
      payments : response.data.payments,
      totalPages: response.data.count
    };
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const getPaymentById = async (id: string) => {
  const response = await api.get(`/api/payment/member/${id}`);
  return response.data;
};

export const sendPaymentReminder = async (id: string) => {
  const response = await api.post(`/api/reminders/${id}`);
  return response.data;
}

export const setAsModarator = async (id: string, moderator: boolean) => {
  const response = await api.post(`/api/circle/set-as-moderator/${id}`, {
    moderator
  });
  return response.data;
};

export const getReminderTemplates = async () => {
  const response = await api.get('/api/templates');
  return response.data;
}

export const getTemplateById = async (id: string) => {
  const response = await api.get(`/api/templates/${id}`);
  return response.data;
}

export const deleteTemplateById = async (id: string) => {
  const response = await api.delete(`/api/templates/${id}`);
  return response.data;
}

export const updateTemplateById = async (id: string, data: any) => {
  const response = await api.patch(`/api/templates/${id}`, data);
  return response.data;
}

export const createCampaign = async (data: any) => {
  const response = await api.post('/api/campaign/create', data);
  return response.data;
}

export const getCampaigns = async () => {
  const response = await api.get('/api/campaign');
  return response.data;
}

export const getCampaignById = async (id: string) => {
  const response = await api.get(`/api/campaign/getCampaign/${id}`);
  return response.data;
}

export const updateCampaign = async (id: string, data: any) => {
  const response = await api.patch('/api/campaign', {
    params: { id },
    data
  });
  return response.data;
}

export const deleteCampaign = async (id: string) => {
  const response = await api.delete(`/api/campaign/${id}`);
  return response.data;
}

export const getTemplatePreview = async (id: string) => {
  const response = await api.get(`/api/templates/preview/${id}`);
  return response.data;
}

export const getSpaces = async () => {
  const response = await api.get('/api/circle/spaces');
  return response.data;
}

export const addToSpace = async (id: string, spaceId: string[]) => {
  const response = await api.post(`/api/circle/add-to-space/${id}`, {
   spaces: spaceId
  });
  return response.data;
}

export const removeFromSpace = async (id: string, spaceId: string[]) => {
  const response = await api.post(`/api/circle/remove-from-space/${id}`, {
   spaces: spaceId
  });
  return response.data;
}

export const testWorkflow = async (id: string) => {
  const response = await api.post(`/api/campaign/test/${id}`);
  return response.data;
}

export const getSettings = async () => {
  const response = await api.get('/api/setting');
  return response.data;
}

export const updateSettings = async (data: any) => {
  const response = await api.patch('/api/setting', data);
  return response.data;
}

export const getSettingsAccount = async () => {
  const response = await api.get('/api/setting/accounts');
  return response.data;
}

export const deleteAccount = async (id: string) => {
  const response = await api.delete(`/api/setting/account/${id}`);
  return response.data;
}

export const sendGoogleCode = async (code: string) => {
  const response = await api.post('/api/auth/google/callback', { code });
  return response.data;
}