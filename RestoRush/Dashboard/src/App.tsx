import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import FormBuilder from "./components/forms/FormBuilder";
import FormsList from "./components/forms/FormsList";
import ResponsesTable from "./components/forms/ResponsesTable";
import DashboardLayout from "./components/layout/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { FormsPage } from "./pages/FormsPage";
import ResponseForm from "./components/forms/ResponseForm";
import { ResponseView } from "./components/forms/ResponseView";
import UserPage from "./pages/UserPage";
import Payment from "./pages/Payment";
import MemberPayments from "./components/payment/MemberPayments";
import UserProfile from "./pages/UserProfile";
import TemplateBuilder from "./pages/TemplateBuilder";
import TemplatesList from "./pages/TemplatesList";
import EditTemplateView from "./pages/EditTemplate";
import CreateWorkflow from "./pages/CreateWorkflow";
import WorkflowView from "./pages/WorkflowView";
import EditWorkflow from "./pages/EditWorkflow";
import TemplatePreview from "./pages/TemplatePreview";
import SettingsPage from "./pages/SettingsPage";
import GoogleAuthCallback from "./pages/Callback";
import Login from "./pages/authForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

// Mock data for forms list
const mockForms = [
  {
    id: "form-1",
    title: "Customer Satisfaction Survey",
    description: "Get feedback from customers about their experience",
    answer: 0,
    questions: [
      {
        id: "q1",
        type: "multiple-choice" as const,
        title: "How did you hear about us?",
        description: "Select all that apply",
        required: true,
        options: [
          { id: "opt1", value: "Social Media" },
          { id: "opt2", value: "Search Engine" },
          { id: "opt3", value: "Friend/Referral" },
          { id: "opt4", value: "Other" },
        ],
      },
      {
        id: "q2",
        type: "linear-scale" as const,
        title: "How would you rate our service?",
        description: "1 = Poor, 5 = Excellent",
        answer: 0,
        required: true,
        minValue: 1,
        maxValue: 5,
      },
      {
        id: "q3",
        type: "paragraph" as const,
        title: "Any additional feedback?",
        description: "Please share your thoughts",
        required: false,
      },
    ],
    isPublished: true,
    visibility: "public" as const,
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-03-10"),
  },
  {
    id: "form-2",
    title: "E-commerce Course Enrollment",
    description: "Sign up for our advanced e-commerce training",
    answer: 0,
    questions: [
      {
        id: "q1",
        type: "short-answer" as const,
        title: "Full Name",
        required: true,
      },
      {
        id: "q2",
        type: "short-answer" as const,
        title: "Email Address",
        required: true,
      },
      {
        id: "q3",
        type: "dropdown" as const,
        title: "Experience Level",
        required: true,
        options: [
          { id: "opt1", value: "Beginner" },
          { id: "opt2", value: "Intermediate" },
          { id: "opt3", value: "Advanced" },
        ],
      },
    ],
    isPublished: true,
    visibility: "public" as const,
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-03-05"),
  },
  {
    id: "form-3",
    title: "Dropshipping Strategy Questionnaire",
    description: "Help us understand your dropshipping goals",
    answer: 0,
    questions: [
      {
        id: "q1",
        type: "checkbox" as const,
        title: "What products are you interested in?",
        required: true,
        options: [
          { id: "opt1", value: "Electronics" },
          { id: "opt2", value: "Clothing" },
          { id: "opt3", value: "Home Goods" },
          { id: "opt4", value: "Beauty Products" },
        ],
      },
      {
        id: "q2",
        type: "short-answer" as const,
        title: "What's your monthly budget for marketing?",
        required: false,
      },
    ],
    isPublished: false,
    visibility: "private" as const,
    createdAt: new Date("2025-02-20"),
    updatedAt: new Date("2025-02-28"),
  },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<GoogleAuthCallback />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <FormsPage />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/forms/new"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <FormBuilder />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/forms/:id"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <FormBuilder />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/forms/:id/responses"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <ResponsesTable form={mockForms[0]} />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/share/response/:id"
            element={
              <ProtectedRoute>
              <ResponseForm />
              </ProtectedRoute>
              } />

            <Route
              path="/forms/responses/:id"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <ResponseView />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <UserPage />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <Payment />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:memberId/payments"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <MemberPayments />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/:memberId/profile"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <UserProfile />
                </DashboardLayout>
                </ProtectedRoute>

              }
            />

            <Route
              path="/templates/new"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <TemplateBuilder />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/templates/list"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <TemplatesList />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-template/:id"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <EditTemplateView />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/workflows/create"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <CreateWorkflow />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/workflows"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <WorkflowView />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-workflow/:id"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <EditWorkflow />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/template-preview/:id"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <TemplatePreview />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
