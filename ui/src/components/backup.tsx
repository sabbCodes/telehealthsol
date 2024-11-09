/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Activity, Wallet, LogOut } from 'lucide-react';
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
      fee: {
        gas: '400000',
        amount: [
          {
            amount: '0',
            denom: 'uist',
          },
        ],
      },
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
    patientId: 'AXisVZ9Aus6PVdnCNWSD6oHHMM16SF1Vs49aqtRVPvSy',
    doctorId: '74bd3SEfw5hkLx8xLnx7NLvLjjTsK2tV6TKRZxEvB1GL',
    signsNSymptoms: '',
    diagnosis: '',
    prescription: '',
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
            <div className="field-grid">
              {/* Primary Doctor */}
              <div className="field">
                <label className="label">Doctor's ID</label>
                <input
                  type="text"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  placeholder="doctor's id"
                  className="input bg-white shadow-md"
                  required
                />
              </div>
              {/* Patient ID */}
              <div className="field">
                <label className="label">Patient's ID</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  placeholder="patient's id"
                  className="input bg-white shadow-md"
                  required
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="section">
            <div className="section-header">
              <textarea
                name="signsNSymptoms"
                value={formData.signsNSymptoms}
                onChange={handleInputChange}
                placeholder="Signs and Symptoms"
                rows={4}
                className="w-full mb-2 bg-white shadow-md p-2 border rounded textarea"
              />
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                placeholder="Diagnosis"
                rows={4}
                className="w-full mb-2 bg-white shadow-md p-2 border rounded textarea"
              />
              <textarea
                name="prescription"
                value={formData.prescription}
                onChange={handleInputChange}
                placeholder="Prescription"
                rows={4}
                className="w-full mb-2 bg-white shadow-md p-2 border rounded textarea"
              />
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

export default function App() {
  //   const [activeTab, setActiveTab] = useState('form');
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
            <h1 className="title">
              teleHealthSol Patient Health Records Simulation
            </h1>
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
        <PatientDataForm />
      </div>
    </div>
  );
}
