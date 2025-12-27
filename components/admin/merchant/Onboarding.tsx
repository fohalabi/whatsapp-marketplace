'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  MapPin, 
  Package, 
  ChevronDown, 
  ChevronUp,
  Eye,
  File,
  Image as ImageIcon,
  Download,
  X
} from 'lucide-react';

type StepStatus = 'pending' | 'approved' | 'rejected';
type DocumentType = 'id_card' | 'business_license' | 'tax_certificate' | 'utility_bill' | 'bank_statement';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface Document {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedDate: string;
  verified: boolean;
}

interface OnboardingStep {
  id: string;
  name: string;
  status: StepStatus;
  icon: IconType;
  completedDate?: string;
  notes?: string;
  documents?: Document[];
}

interface OnboardingMerchant {
  id: string;
  name: string;
  category: string;
  appliedDate: string;
  currentStep: string;
  progress: number;
  steps: OnboardingStep[];
}

const getDocumentTypeName = (type: DocumentType): string => {
  const names: Record<DocumentType, string> = {
    id_card: 'Government ID',
    business_license: 'Business License',
    tax_certificate: 'Tax Certificate',
    utility_bill: 'Utility Bill',
    bank_statement: 'Bank Statement'
  };
  return names[type];
};

const getDocumentIcon = (type: DocumentType) => {
  const icons: Record<DocumentType, React.ReactNode> = {
    id_card: <FileText className="w-4 h-4" />,
    business_license: <File className="w-4 h-4" />,
    tax_certificate: <FileText className="w-4 h-4" />,
    utility_bill: <File className="w-4 h-4" />,
    bank_statement: <FileText className="w-4 h-4" />
  };
  return icons[type];
};

const mockOnboardingMerchants: OnboardingMerchant[] = [
  {
    id: 'OB001',
    name: 'Urban Style Boutique',
    category: 'Fashion & Apparel',
    appliedDate: '2024-12-18',
    currentStep: 'Product Sample Review',
    progress: 66,
    steps: [
      {
        id: 'id-verify',
        name: 'ID Verification',
        status: 'approved',
        icon: FileText,
        completedDate: '2024-12-18',
        documents: [
          {
            id: 'doc1',
            type: 'id_card',
            name: 'national_id_front.jpg',
            url: 'https://example.com/documents/id_front.jpg',
            uploadedDate: '2024-12-17',
            verified: true
          },
          {
            id: 'doc2',
            type: 'id_card',
            name: 'national_id_back.jpg',
            url: 'https://example.com/documents/id_back.jpg',
            uploadedDate: '2024-12-17',
            verified: true
          },
          {
            id: 'doc3',
            type: 'business_license',
            name: 'business_license.pdf',
            url: 'https://example.com/documents/license.pdf',
            uploadedDate: '2024-12-17',
            verified: true
          }
        ]
      },
      {
        id: 'location-verify',
        name: 'Location Verification',
        status: 'approved',
        icon: MapPin,
        completedDate: '2024-12-19',
        documents: [
          {
            id: 'doc4',
            type: 'utility_bill',
            name: 'electricity_bill_dec.pdf',
            url: 'https://example.com/documents/utility_bill.pdf',
            uploadedDate: '2024-12-18',
            verified: true
          }
        ]
      },
      {
        id: 'product-sample',
        name: 'Product Sample Review',
        status: 'pending',
        icon: Package,
      },
    ],
  },
  {
    id: 'OB002',
    name: 'Smart Gadgets NG',
    category: 'Electronics',
    appliedDate: '2024-12-19',
    currentStep: 'Location Verification',
    progress: 33,
    steps: [
      {
        id: 'id-verify',
        name: 'ID Verification',
        status: 'approved',
        icon: FileText,
        completedDate: '2024-12-19',
        documents: [
          {
            id: 'doc5',
            type: 'id_card',
            name: 'drivers_license.jpg',
            url: 'https://example.com/documents/drivers_license.jpg',
            uploadedDate: '2024-12-18',
            verified: true
          },
          {
            id: 'doc6',
            type: 'tax_certificate',
            name: 'tax_certificate_2024.pdf',
            url: 'https://example.com/documents/tax_certificate.pdf',
            uploadedDate: '2024-12-18',
            verified: true
          }
        ]
      },
      {
        id: 'location-verify',
        name: 'Location Verification',
        status: 'pending',
        icon: MapPin,
      },
      {
        id: 'product-sample',
        name: 'Product Sample Review',
        status: 'pending',
        icon: Package,
      },
    ],
  },
  {
    id: 'OB003',
    name: 'Organic Farm Fresh',
    category: 'Food & Beverages',
    appliedDate: '2024-12-17',
    currentStep: 'ID Verification',
    progress: 33,
    steps: [
      {
        id: 'id-verify',
        name: 'ID Verification',
        status: 'rejected',
        icon: FileText,
        notes: 'Document unclear, please resubmit',
        documents: [
          {
            id: 'doc7',
            type: 'id_card',
            name: 'passport_page.jpg',
            url: 'https://example.com/documents/passport.jpg',
            uploadedDate: '2024-12-16',
            verified: false
          },
          {
            id: 'doc8',
            type: 'bank_statement',
            name: 'bank_statement_nov.pdf',
            url: 'https://example.com/documents/bank_statement.pdf',
            uploadedDate: '2024-12-16',
            verified: false
          }
        ]
      },
      {
        id: 'location-verify',
        name: 'Location Verification',
        status: 'pending',
        icon: MapPin,
      },
      {
        id: 'product-sample',
        name: 'Product Sample Review',
        status: 'pending',
        icon: Package,
      },
    ],
  },
];

const StepStatusIcon = ({ status }: { status: StepStatus }) => {
  if (status === 'approved') {
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  }
  if (status === 'rejected') {
    return <XCircle className="w-5 h-5 text-red-600" />;
  }
  return <Clock className="w-5 h-5 text-yellow-600" />;
};

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  stepName: string;
  merchantName: string;
}

const DocumentViewerModal = ({ 
  isOpen, 
  onClose, 
  documents, 
  stepName, 
  merchantName 
}: DocumentViewerModalProps) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">KYC Documents</h3>
            <p className="text-sm text-gray-600">
              {merchantName} • {stepName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Document List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-4">Uploaded Documents</h4>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedDoc?.id === doc.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded">
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getDocumentTypeName(doc.type)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            Uploaded: {doc.uploadedDate}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            doc.verified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {doc.verified ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {selectedDoc ? getDocumentTypeName(selectedDoc.type) : 'Select a document'}
                  </h4>
                  {selectedDoc && (
                    <p className="text-sm text-gray-600">{selectedDoc.name}</p>
                  )}
                </div>
                {selectedDoc && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(selectedDoc.url, '_blank')}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto bg-gray-50">
              {selectedDoc ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="max-w-2xl w-full">
                    {selectedDoc.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <img
                          src={selectedDoc.url}
                          alt={selectedDoc.name}
                          className="w-full h-auto rounded"
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/600x400/3b82f6/ffffff?text=${encodeURIComponent(
                              getDocumentTypeName(selectedDoc.type)
                            )}`;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-900 font-medium mb-2">
                          {getDocumentTypeName(selectedDoc.type)}
                        </p>
                        <p className="text-gray-600 text-sm mb-4">PDF Document</p>
                        <button
                          onClick={() => window.open(selectedDoc.url, '_blank')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Open PDF in New Tab
                        </button>
                      </div>
                    )}
                    
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Document Details</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="text-gray-900">{getDocumentTypeName(selectedDoc.type)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Upload Date</p>
                          <p className="text-gray-900">{selectedDoc.uploadedDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            selectedDoc.verified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedDoc.verified ? 'Verified' : 'Pending Verification'}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-500">File Name</p>
                          <p className="text-gray-900 truncate">{selectedDoc.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a document to preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OnboardingMerchantCard = ({ merchant, onAction }: { merchant: OnboardingMerchant; onAction: (action: string, merchantId: string, stepId?: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState<{stepId: string, stepName: string} | null>(null);

  const handleReject = (stepId: string) => {
    if (rejectReason.trim()) {
      onAction('reject-step', merchant.id, stepId);
      setShowRejectModal(null);
      setRejectReason('');
    }
  };

  const currentStep = merchant.steps.find(step => step.status === 'pending') || merchant.steps[merchant.steps.length - 1];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{merchant.name}</h3>
            <p className="text-sm text-gray-600">{merchant.category}</p>
            <p className="text-xs text-gray-500 mt-1">Applied: {merchant.appliedDate}</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{merchant.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${merchant.progress}%` }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Current Step: <span className="font-medium text-gray-900">{merchant.currentStep}</span>
        </div>

        {isExpanded && (
          <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
            {merchant.steps.map((step) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <StepStatusIcon status={step.status} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <step.icon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{step.name}</span>
                    </div>
                    {step.documents && step.documents.length > 0 && (
                      <button
                        onClick={() => setShowDocumentsModal({stepId: step.id, stepName: step.name})}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Documents ({step.documents.length})
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {step.status === 'approved' && `Completed on ${step.completedDate}`}
                    {step.status === 'pending' && 'Awaiting review'}
                    {step.status === 'rejected' && step.notes}
                  </p>
                  
                  {step.documents && step.documents.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {step.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs"
                          >
                            {getDocumentIcon(doc.type)}
                            <span className="text-gray-700">
                              {getDocumentTypeName(doc.type)}
                            </span>
                            {doc.verified ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <Clock className="w-3 h-3 text-yellow-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => onAction('approve-step', merchant.id, step.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Approve Step
                      </button>
                      <button
                        onClick={() => setShowRejectModal(step.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {merchant.progress === 100 && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => onAction('final-approve', merchant.id)}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Final Approval - Activate Merchant
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reject Step</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Viewer Modal */}
      {showDocumentsModal && (
        <DocumentViewerModal
          isOpen={!!showDocumentsModal}
          onClose={() => setShowDocumentsModal(null)}
          documents={merchant.steps.find(s => s.id === showDocumentsModal.stepId)?.documents || []}
          stepName={showDocumentsModal.stepName}
          merchantName={merchant.name}
        />
      )}
    </div>
  );
};

export default function OnboardingPage() {
  const [merchants, setMerchants] = useState(mockOnboardingMerchants);

  const handleAction = (action: string, merchantId: string, stepId?: string) => {
    console.log(`Action: ${action} for merchant ${merchantId}, step ${stepId}`);
    
    if (action === 'approve-step' && stepId) {
      setMerchants(prev =>
        prev.map(m => {
          if (m.id === merchantId) {
            const updatedSteps = m.steps.map(s =>
              s.id === stepId
                ? { 
                    ...s, 
                    status: 'approved' as StepStatus, 
                    completedDate: new Date().toISOString().split('T')[0],
                    // Mark all documents as verified when step is approved
                    documents: s.documents?.map(doc => ({ ...doc, verified: true }))
                  }
                : s
            );
            const approvedCount = updatedSteps.filter(s => s.status === 'approved').length;
            const progress = Math.round((approvedCount / updatedSteps.length) * 100);
            const currentStep = updatedSteps.find(s => s.status === 'pending')?.name || 'Complete';
            return { ...m, steps: updatedSteps, progress, currentStep };
          }
          return m;
        })
      );
    }

    if (action === 'reject-step' && stepId) {
      setMerchants(prev =>
        prev.map(m => {
          if (m.id === merchantId) {
            const updatedSteps = m.steps.map(s =>
              s.id === stepId ? { 
                ...s, 
                status: 'rejected' as StepStatus,
                // Mark all documents as not verified when step is rejected
                documents: s.documents?.map(doc => ({ ...doc, verified: false }))
              } : s
            );
            return { ...m, steps: updatedSteps };
          }
          return m;
        })
      );
    }

    if (action === 'final-approve') {
      console.log(`Merchant ${merchantId} fully approved and activated!`);
      setMerchants(prev => prev.filter(m => m.id !== merchantId));
    }
  };

  return (
    <div className="flex-1 min-h-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Merchant Onboarding</h1>
          <p className="text-gray-600">Track and approve new merchants step by step</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="w-5 h-5" />
            <span className="font-medium">{merchants.length} merchants awaiting approval</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Click "View Documents" to review KYC proofs and supporting documents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {merchants.map((merchant) => (
            <OnboardingMerchantCard
              key={merchant.id}
              merchant={merchant}
              onAction={handleAction}
            />
          ))}

          {merchants.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">All merchants have been processed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}