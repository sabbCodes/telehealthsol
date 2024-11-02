import { useEffect, useState } from 'react';
import {
  makeAgoricChainStorageWatcher,
  AgoricChainStoragePathKind as Kind,
} from '@agoric/rpc';
import { create } from 'zustand';
import {
  makeAgoricWalletConnection,
  suggestChain,
} from '@agoric/web-components';
import {
  Activity,
  Heart,
  UserCircle,
  Wallet,
  ClipboardList,
  User,
  LogOut,
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const ENDPOINTS = {
  RPC: 'http://localhost:26657',
  API: 'http://localhost:1317',
};

const watcher = makeAgoricChainStorageWatcher(ENDPOINTS.API, 'agoriclocal');

interface AppState {
  wallet?: any;
  patientContractInstance?: unknown;
  brands?: Record<string, unknown>;
}

const useAppStore = create<AppState>(() => ({}));

const setup = async () => {
  watcher.watchLatest<Array<[string, unknown]>>(
    [Kind.Data, 'published.agoricNames.instance'],
    instances => {
      useAppStore.setState({
        patientContractInstance: instances
          .find(([name]) => name === 'patientData')!
          .at(1),
      });
    },
  );

  watcher.watchLatest<Array<[string, unknown]>>(
    [Kind.Data, 'published.agoricNames.brand'],
    brands => {
      useAppStore.setState({
        brands: Object.fromEntries(brands),
      });
    },
  );
};

const connectWallet = async () => {
  await suggestChain('https://local.agoric.net/network-config');
  const wallet = await makeAgoricWalletConnection(watcher, ENDPOINTS.RPC);
  useAppStore.setState({ wallet });
};

const disconnectWallet = () => {
  useAppStore.setState({ wallet: undefined });
};

const publishPatientData = (patientData: any) => {
  const { wallet, patientContractInstance } = useAppStore.getState();
  if (!patientContractInstance) {
    toast.error('No instance of Smart Contract found on chain!', {
      duration: 10000,
      position: 'bottom-right',
    });
    return;
  }

  wallet?.makeOffer(
    {
      source: 'contract',
      instance: patientContractInstance,
      publicInvitationMaker: 'makePublishInvitation',
    },
    {}, // No assets being exchanged
    {
      patientData,
    },
    (update: { status: string; data?: unknown }) => {
      if (update.status === 'error') {
        toast.error(`Publication error: ${update.data}`, {
          duration: 10000,
          position: 'bottom-right',
        });
      }
      if (update.status === 'accepted') {
        toast.success('Data published successfully', {
          duration: 10000,
          position: 'bottom-right',
        });
      }
      if (update.status === 'refunded') {
        toast.error('Publication rejected', {
          duration: 10000,
          position: 'bottom-right',
        });
      }
    },
  );
};

const PatientDataForm = () => {
  const [formData, setFormData] = useState({
    patientId: 'PAT-2024-001',
    name: 'John Doe',
    age: '30',
    gender: 'male',
    bloodType: 'O+',
    allergies: 'None reported',
    medications: 'No current medications',
    lastVisit: '2024-03-15',
    primaryDoctor: 'Dr. Sarah Smith',
    emergencyContact: '+1 (555) 123-4567',
  });

  useEffect(() => {
    setup();
  }, []);

  const { wallet } = useAppStore(({ wallet }) => ({
    wallet,
  }));

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    publishPatientData(formData);
  };

  return (
    <div className="form-container">
      {/* Form */}
      <form onSubmit={handleSubmit} className="form">
        <div className="sections-container">
          {/* Personal Information */}
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">
                Personal Information <UserCircle className="icon" />{' '}
              </h2>
            </div>
            <div className="field-grid">
              {/* Patient ID */}
              <div className="field">
                <label className="label">Patient ID </label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              {/* Full Name */}
              <div className="field">
                <label className="label">Full Name </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              {/* Primary Doctor */}
              <div className="field">
                <label className="label">Primary Doctor </label>
                <input
                  type="text"
                  name="primaryDoctor"
                  value={formData.primaryDoctor}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              {/* Emergency Contact */}
              <div className="field">
                <label className="label">Emergency Contact </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">
                {' '}
                Medical Information <Heart className="icon" />{' '}
              </h2>
            </div>
            <div className="field-grid">
              {/* Age */}
              <div className="field">
                <label className="label">Age </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              {/* Blood Type */}
              <div className="field">
                <label className="label">Blood Type </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              {/* Gender */}
              <div className="field">
                <label className="label">Gender </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {/* Last Visit Date */}
              <div className="field">
                <label className="label">Last Visit Date </label>
                <input
                  type="date"
                  name="lastVisit"
                  value={formData.lastVisit}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              {/* Allergies */}
              <div className="field">
                <label className="label">Allergies </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  className="textarea"
                  rows={4}
                />
              </div>
              {/* Current Medications */}
              <div className="field">
                <label className="label">Current Medications </label>
                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  className="textarea"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`submit-button ${!wallet ? 'disabled' : ''}`}
          disabled={!wallet}
        >
          <Activity className="icon" />
          <span>Publish Patient Data</span>
        </button>
      </form>
    </div>
  );
};

const PatientTab = () => {
  const [patients, setPatients] = useState<string[]>([]);
  const [selectedPatientData, setSelectedPatientData] = useState<any | null>(
    null,
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  // Fetch patient list
  useEffect(() => {
    const fetchPatientList = async () => {
      const response = await fetch(
        `${ENDPOINTS.API}/agoric/vstorage/children/published.patientData.patients`,
      );
      const data = await response.json();
      setPatients(data.children);
      console.log(data.children);
    };
    fetchPatientList();
  }, []);

  // Fetch individual patient data
  const fetchPatientData = async (patientId: string) => {
    setSelectedPatientId(patientId); // Set the selected patient ID
    const response = await fetch(
      `${ENDPOINTS.API}/agoric/vstorage/data/published.patientData.patients.${patientId}`,
    );
    let data = await response.json();
    const parsedData = JSON.parse(data.value);
    setSelectedPatientData(parsedData.values[0]);
  };

  return (
    <div className="view-container">
      <div className="patient-list-container">
        <h2 className="section-title">
          <ClipboardList className="icon" /> Patients List
        </h2>
        <ul className="patient-list">
          {patients.map(patientId => (
            <li
              key={patientId}
              onClick={() => fetchPatientData(patientId)}
              className={`patient-item ${patientId === selectedPatientId ? 'highlighted' : ''}`}
            >
              <User className="patient-icon" />
              {patientId}
            </li>
          ))}
        </ul>
      </div>

      {selectedPatientData && (
        <div className="patient-details">
          <h3 className="details-title">Patient Details</h3>
          <div className="details-card">
            <pre>
              {JSON.stringify(JSON.parse(selectedPatientData), null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('form');
  const { wallet } = useAppStore(({ wallet }) => ({ wallet }));

  const tryConnectWallet = () => {
    connectWallet().catch(err => {
      switch (err.message) {
        case 'KEPLR_CONNECTION_ERROR_NO_SMART_WALLET':
          toast.error('No smart wallet at that address', {
            duration: 10000,
            position: 'bottom-right',
          });
          break;
        default:
          toast.error(err.message, {
            duration: 10000,
            position: 'bottom-right',
          });
      }
    });
  };

  const copyAddressToClipboard = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast.success('Address copied to clipboard!', {
        duration: 3000,
        position: 'bottom-right',
      });
    }
  };

  useEffect(() => {
    setup();
  }, []);

  return (
    <div className="app-container">
      <Toaster />
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="title-section">
            <Activity className="icon" />
            <h1 className="title">Patient Data Management</h1>
          </div>
          <div className="wallet-section">
            <div className="wallet-info">
              {wallet?.address && (
                <div
                  className="wallet-address"
                  onClick={copyAddressToClipboard}
                  style={{ cursor: 'pointer' }}
                  title="Click to copy address"
                >
                  {wallet.address.slice(0, 10)}...{wallet.address.slice(-4)}
                </div>
              )}
              {!wallet?.address && (
                <div className="wallet-address-placeholder" />
              )}
            </div>
            {wallet ? (
              <button onClick={disconnectWallet} className="wallet-button">
                <LogOut className="icon" />
                <span>Disconnect</span>
              </button>
            ) : (
              <button onClick={tryConnectWallet} className="wallet-button">
                <Wallet className="icon" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="nav-buttons">
          <div
            role="tab"
            className={`nav-tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            <ClipboardList className="icon" />
            Register a New Patient
          </div>
          <div
            role="tab"
            className={`nav-tab ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            <User className="icon" />
            View Current Patients
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'form' ? <PatientDataForm /> : <PatientTab />}
        </div>
      </div>
    </div>
  );
}
