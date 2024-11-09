// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
// import DocImg from './assets/Frame 75.svg';
// import ArrowLeft from './assets/arrow-left.svg';
// import VideoIcon from './assets/video.svg';
// import Attachment from './assets/attachment.svg';
// import CameraIcon from './assets/camera.svg';
// import MicrophoneIcon from './assets/microphone-2.svg';
// import SendIcon from './assets/send.svg';
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Link, useNavigation, useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { database, db } from './components/firebase-config';
// import PatientDetailsPopup from './components/PatientDetailsPopup';
// // import { PublicKey } from '@solana/web3.js';
// // import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
// // import idl from '@/app/components/libs/tele_health.json';
// // import type { TeleHealth } from '@/app/components/libs/tele_health';
// // import { useWallet, useConnection } from '@solana/wallet-adapter-react';
// // import { useQuery } from '@tanstack/react-query';
// // import { useMutation } from '@tanstack/react-query';
// import { toast, ToastContainer } from 'react-toastify';
// import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
// import { ref, push, onValue, off } from 'firebase/database';
// import PopupWallet from './components/PopupWallet';
// import 'react-toastify/dist/ReactToastify.css';
// // import { useRouter } from 'next/navigation';

// import {
//   makeAgoricChainStorageWatcher,
//   AgoricChainStoragePathKind as Kind,
// } from '@agoric/rpc';
// import { create } from 'zustand';
// import {
//   makeAgoricWalletConnection,
//   suggestChain,
// } from '@agoric/web-components';

// const ENDPOINTS = {
//   RPC: 'http://localhost:26657',
//   API: 'http://localhost:1317',
// };

// const watcher = makeAgoricChainStorageWatcher(ENDPOINTS.API, 'agoriclocal');

// interface AppState {
//   wallet?: any;
//   patientContractInstance?: unknown;
//   brands?: Record<string, unknown>;
// }

// const useAppStore = create<AppState>(() => ({}));

// const setup = async () => {
//   watcher.watchLatest<Array<[string, unknown]>>(
//     [Kind.Data, 'published.agoricNames.instance'],
//     instances => {
//       useAppStore.setState({
//         patientContractInstance: instances
//           .find(([name]) => name === 'patientData')!
//           .at(1),
//       });
//     },
//   );

//   watcher.watchLatest<Array<[string, unknown]>>(
//     [Kind.Data, 'published.agoricNames.brand'],
//     brands => {
//       useAppStore.setState({
//         brands: Object.fromEntries(brands),
//       });
//     },
//   );
// };

// const connectWallet = async () => {
//   await suggestChain('https://local.agoric.net/network-config');
//   const wallet = await makeAgoricWalletConnection(watcher, ENDPOINTS.RPC);
//   useAppStore.setState({ wallet });
// };

// const disconnectWallet = () => {
//   useAppStore.setState({ wallet: undefined });
// };

// const publishPatientData = (patientData: any) => {
//   const { wallet, patientContractInstance } = useAppStore.getState();
//   if (!patientContractInstance) {
//     toast.error('No instance of Smart Contract found on chain!', {
//       duration: 10000,
//       position: 'bottom-right',
//     });
//     return;
//   }

//   wallet?.makeOffer(
//     {
//       source: 'contract',
//       instance: patientContractInstance,
//       publicInvitationMaker: 'makePublishInvitation',
//       fee: {
//         gas: '400000',
//         amount: [
//           {
//             amount: '0',
//             denom: 'uist',
//           },
//         ],
//       },
//     },
//     {}, // No assets being exchanged
//     {
//       patientData,
//     },
//     (update: { status: string; data?: unknown }) => {
//       if (update.status === 'error') {
//         toast.error(`Publication error: ${update.data}`, {
//           duration: 10000,
//           position: 'bottom-right',
//         });
//       }
//       if (update.status === 'accepted') {
//         toast.success('Data published successfully', {
//           duration: 10000,
//           position: 'bottom-right',
//         });
//       }
//       if (update.status === 'refunded') {
//         toast.error('Publication rejected', {
//           duration: 10000,
//           position: 'bottom-right',
//         });
//       }
//     },
//   );
// };

// interface PatientDetails {
//   firstName: string;
//   lastName: string;
//   dateOfBirth: number;
//   allergies: string;
//   medicalHistory: string;
//   walletAddress: string;
// }

// interface MedicalRecord {
//   doctorId: string;
//   signsAndSymptoms: string;
//   diagnosis: string;
//   prescription: string;
//   timestamp: number;
// }

// interface CryptoKeyPair {
//   publicKey: CryptoKey;
//   privateKey: CryptoKey;
// }

// // function useAnchorProvider() {
// //   const { connection } = useConnection();
// //   const wallet = useWallet();

// //   return new AnchorProvider(connection, wallet as any, {
// //     commitment: 'confirmed',
// //   });
// // }

// // function getRecordsProgram(provider: AnchorProvider): Program<TeleHealth> {
// //   return new Program(idl as unknown as TeleHealth, provider);
// // }

// function App() {
//   //   const wallet = useWallet();
//   //   const provider = useAnchorProvider();
//   //   const program = getRecordsProgram(provider);
//   //   const { chatId } = useParams();
//   const chatId = 'AXisVZ9Aus6PVdnCNWSD6oHHMM16SF1Vs49aqtRVPvSy';
//   const [message, setMessage] = useState<string>('');
//   const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
//     null,
//   );
//   const [showPopup, setShowPopup] = useState(false);
//   const [showConnectWallet, setShowConnectWallet] = useState(false);
//   const [signsAndSymptoms, setSignsAndSymptoms] = useState('');
//   const [diagnosis, setDiagnosis] = useState('');
//   const [prescription, setPrescription] = useState('');
//   const [loading] = useState(false);
//   const [decryptedMessages, setDecryptedMessages] = useState<any[]>([]);
//   const [chatKeyPair, setChatKeyPair] = useState<CryptoKeyPair | null>(null);
//   const [otherPublicKey, setOtherPublicKey] = useState<string | null>(null);
//   const chatRef = ref(database, 'chats/doctor-patient-chat');
//   const [publicKey, setPublicKey] = useState<string | null>(null);
//   const [publicKeyStoredInDb, setPublicKeyStoredInDb] = useState(false);
// //   const router = useNavigation();
//   const userId = '74bd3SEfw5hkLx8xLnx7NLvLjjTsK2tV6TKRZxEvB1GL';
//   //   let userId: string;

//   useEffect(() => {
//     setup();
//   }, []);

//   const { wallet } = useAppStore(({ wallet }) => ({
//     wallet,
//   }));

//   //   useEffect(() => {
//   //     if (wallet.connected && wallet.publicKey) {
//   //       userId = wallet.publicKey.toString();
//   //     } else {
//   //       setShowConnectWallet(true);
//   //     }
//   //   }, [wallet]);

//   // 1. Key Generation
//   const generateKeyPair = async (): Promise<CryptoKeyPair> => {
//     return await crypto.subtle.generateKey(
//       {
//         name: 'RSA-OAEP',
//         modulusLength: 2048,
//         publicExponent: new Uint8Array([1, 0, 1]),
//         hash: 'SHA-256',
//       },
//       true,
//       ['encrypt', 'decrypt'],
//     );
//   };

//   // 2. Key Exchange
//   const exportPublicKey = async (keyPair: CryptoKeyPair): Promise<string> => {
//     const exportedKey = await crypto.subtle.exportKey(
//       'spki',
//       keyPair.publicKey,
//     );
//     const exportedKeyArray = Array.from(new Uint8Array(exportedKey));
//     return btoa(String.fromCharCode.apply(null, exportedKeyArray));
//   };

//   // // Function to import the public key from base64 string
//   const importPublicKey = async (base64Key: string): Promise<CryptoKey> => {
//     const publicKeyBuffer = Uint8Array.from(atob(base64Key), c =>
//       c.charCodeAt(0),
//     );
//     return await crypto.subtle.importKey(
//       'spki',
//       publicKeyBuffer,
//       {
//         name: 'RSA-OAEP',
//         hash: 'SHA-256',
//       },
//       true,
//       ['encrypt'],
//     );
//   };

//   // 3. Encryption
//   const encryptMessage = async (
//     message: string,
//     publicKey: CryptoKey,
//   ): Promise<string> => {
//     const encodedMessage = new TextEncoder().encode(message);
//     const encryptedData = await crypto.subtle.encrypt(
//       {
//         name: 'RSA-OAEP',
//       },
//       publicKey,
//       encodedMessage,
//     );
//     const encryptedDataArray = Array.from(new Uint8Array(encryptedData));
//     return btoa(String.fromCharCode.apply(null, encryptedDataArray));
//   };

//   // 4. Decryption
//   const decryptMessage = async (
//     encryptedMessage: string,
//     privateKey: CryptoKey,
//   ): Promise<string> => {
//     try {
//       const binaryString = atob(encryptedMessage);
//       const bytes = new Uint8Array(binaryString.length);
//       for (let i = 0; i < binaryString.length; i++) {
//         bytes[i] = binaryString.charCodeAt(i);
//       }
//       const decryptedData = await crypto.subtle.decrypt(
//         {
//           name: 'RSA-OAEP',
//         },
//         privateKey,
//         bytes,
//       );
//       return new TextDecoder().decode(decryptedData);
//     } catch (error) {
//       console.error('Decryption failed:', error);
//       return ''; // or handle the error as appropriate for your application
//     }
//   };

//   // Utility functions to store and retrieve keys from local storage
//   const storeKey = (keyName: string, key: string) => {
//     localStorage.setItem(keyName, key);
//   };

//   const retrieveKey = (keyName: string): string | null => {
//     return localStorage.getItem(keyName);
//   };

//   // 1. Key Generation and Storage
//   const generateAndStoreKeyPair = async (): Promise<CryptoKeyPair> => {
//     const keyPair = await generateKeyPair();

//     // Export keys
//     const publicKey = await exportPublicKey(keyPair);
//     const privateKey = await crypto.subtle.exportKey(
//       'pkcs8',
//       keyPair.privateKey,
//     );
//     const privateKeyArray = Array.from(new Uint8Array(privateKey));
//     const privateKeyBase64 = btoa(
//       String.fromCharCode.apply(null, privateKeyArray),
//     );

//     // Store keys in local storage
//     storeKey('rsa-public-key', publicKey);
//     storeKey('rsa-private-key', privateKeyBase64);

//     return keyPair;
//   };

//   // 2. Importing the Private Key
//   const importPrivateKey = async (base64Key: string): Promise<CryptoKey> => {
//     const privateKeyBuffer = Uint8Array.from(atob(base64Key), c =>
//       c.charCodeAt(0),
//     );
//     return await crypto.subtle.importKey(
//       'pkcs8',
//       privateKeyBuffer,
//       {
//         name: 'RSA-OAEP',
//         hash: 'SHA-256',
//       },
//       true,
//       ['decrypt'],
//     );
//   };

//   useEffect(() => {
//     const initKeyPair = async () => {
//       // Check if the keys are already in local storage
//       let publicKey = retrieveKey('rsa-public-key');
//       let privateKeyBase64 = retrieveKey('rsa-private-key');

//       let keyPair: CryptoKeyPair;

//       if (publicKey && privateKeyBase64) {
//         // If keys exist in local storage, import the private key
//         const privateKey = await importPrivateKey(privateKeyBase64);
//         keyPair = { publicKey: await importPublicKey(publicKey), privateKey };
//       } else {
//         // Otherwise, generate and store a new key pair
//         keyPair = await generateAndStoreKeyPair();
//         publicKey = retrieveKey('rsa-public-key')!;
//         privateKeyBase64 = retrieveKey('rsa-private-key')!;
//       }

//       setChatKeyPair(keyPair);
//       setPublicKey(publicKey);

//       // Store the public key in Firebase under the user's ID if not already stored
//       if (chatId && !publicKeyStoredInDb) {
//         await addDoc(collection(db, 'publicKeys'), {
//           userId: userId,
//           publicKey,
//         });
//         setPublicKeyStoredInDb(true);
//       }

//       // Retry fetching the other party's public key
//       const fetchOtherPublicKey = async () => {
//         const q = query(
//           collection(db, 'publicKeys'),
//           where('userId', '==', chatId),
//         );
//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//           const otherUserPublicKey = querySnapshot.docs[0].data().publicKey;
//           setOtherPublicKey(otherUserPublicKey);
//         } else {
//           console.error('No public key found for the other user, retrying...');
//           setTimeout(fetchOtherPublicKey, 2000); // Retry after 2 seconds
//         }
//       };

//       fetchOtherPublicKey();
//     };

//     initKeyPair();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [chatId]);

//   const formatTimestamp = (timestamp: number): string => {
//     if (typeof timestamp !== 'number' || isNaN(timestamp)) {
//       console.error('Invalid timestamp:', timestamp);
//       return 'Invalid Time';
//     }

//     const date = new Date(timestamp);

//     if (isNaN(date.getTime())) {
//       console.error('Invalid date object:', date);
//       return 'Invalid Time';
//     }

//     return date.toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false, // Ensures 24-hour format
//     });
//   };

//   const storeSentMessageLocally = (
//     message: string,
//     recipientPublicKey: string,
//     timestamp: number,
//   ) => {
//     const sentMessages = JSON.parse(
//       localStorage.getItem('sentMessages') || '[]',
//     );
//     sentMessages.push({ message, recipientPublicKey, timestamp });
//     localStorage.setItem('sentMessages', JSON.stringify(sentMessages));
//   };

//   const loadSentMessages = (recipientPublicKey: string) => {
//     const sentMessages = JSON.parse(
//       localStorage.getItem('sentMessages') || '[]',
//     );
//     return sentMessages.filter(
//       (msg: any) => msg.recipientPublicKey === recipientPublicKey,
//     );
//   };

//   useEffect(() => {
//     if (otherPublicKey) {
//       const storedMessages = loadSentMessages(otherPublicKey);
//       setDecryptedMessages(prevMessages => [
//         ...prevMessages,
//         ...storedMessages.map((msg: any) => ({
//           content: msg.message,
//           sender: publicKey,
//           timestamp: msg.timestamp,
//           formattedTime: formatTimestamp(msg.timestamp),
//         })),
//       ]);
//     }
//   }, [otherPublicKey]);

//   const handleSend = async () => {
//     if (!otherPublicKey || !message.trim() || !chatKeyPair) return;

//     try {
//       // Import the other party's public key
//       const importedPublicKey = await importPublicKey(otherPublicKey);

//       // Encrypt the message using the imported public key
//       const encryptedMessage = await encryptMessage(message, importedPublicKey);
//       if (encryptedMessage) {
//         const timestamp = Date.now();

//         // Push the encrypted message to the database
//         push(chatRef, {
//           sender: publicKey, // Sender's public key
//           recipient: otherPublicKey, // Recipient's public key
//           message: encryptedMessage,
//           timestamp,
//         });

//         // Store the plaintext message locally
//         storeSentMessageLocally(message, otherPublicKey, timestamp);

//         // Directly add the plain text message to the decryptedMessages array
//         setDecryptedMessages(prevMessages => [
//           ...prevMessages,
//           {
//             content: message, // Add the plain text message
//             sender: publicKey,
//             timestamp,
//             formattedTime: formatTimestamp(timestamp),
//           },
//         ]);

//         // Clear the message input
//         setMessage('');
//       }
//     } catch (err) {
//       console.error('Failed to encrypt or send message:', err);
//     }
//   };

//   useEffect(() => {
//     const handleNewMessages = async (snapshot: any) => {
//       const messages = snapshot.val();
//       if (messages && chatKeyPair && publicKey) {
//         const newMessages = await Promise.all(
//           Object.entries(messages).map(async ([key, msg]: [string, any]) => {
//             // Filter messages based on recipient
//             if (msg.recipient !== publicKey && msg.sender !== publicKey) {
//               // Skip messages where the current user is neither the sender nor the recipient
//               return null;
//             }

//             if (msg.sender === publicKey) {
//               // Skip decryption for messages sent by the current user
//               return null;
//             } else {
//               try {
//                 const decryptedContent = await decryptMessage(
//                   msg.message,
//                   chatKeyPair.privateKey,
//                 );
//                 return {
//                   key, // Use the key as a unique identifier
//                   content: decryptedContent,
//                   sender: msg.sender,
//                   timestamp: msg.timestamp,
//                   formattedTime: formatTimestamp(msg.timestamp),
//                 };
//               } catch (error) {
//                 console.error('Failed to decrypt message:', error);
//                 return null;
//               }
//             }
//           }),
//         );

//         // Filter out null values (messages that are not meant for this user)
//         const filteredNewMessages = newMessages.filter(msg => msg !== null);

//         if (filteredNewMessages.length > 0) {
//           setDecryptedMessages(prevMessages => {
//             const existingKeys = new Set(prevMessages.map(msg => msg.key));
//             const uniqueNewMessages = filteredNewMessages.filter(
//               msg => !existingKeys.has(msg.key),
//             );
//             return [...prevMessages, ...uniqueNewMessages];
//           });
//         }
//       }
//     };

//     onValue(chatRef, handleNewMessages);

//     return () => {
//       off(chatRef, 'value', handleNewMessages);
//     };
//   }, [chatRef, chatKeyPair, publicKey]);

//   useEffect(() => {
//     const fetchPatientDetails = async () => {
//       if (chatId) {
//         try {
//           const doctorsRef = collection(db, 'users');
//           const q = query(
//             doctorsRef,
//             where('walletAddress', '==', chatId as string),
//           );
//           const querySnapshot = await getDocs(q);

//           if (!querySnapshot.empty) {
//             const patientDoc = querySnapshot.docs[0].data() as PatientDetails;
//             setPatientDetails(patientDoc);
//           } else {
//             console.error('Patient not found');
//           }
//         } catch (error) {
//           console.error('Error fetching patient details:', error);
//         }
//       }
//     };

//     fetchPatientDetails();
//   }, [chatId]);

//   //   const recordsQuery = useQuery({
//   //     queryKey: ['recordDetailsEntry', patientDetails?.walletAddress],
//   //     queryFn: async () => {
//   //       if (!patientDetails) {
//   //         throw new Error('No patient details available');
//   //       }

//   //       const patientPublicKey = new PublicKey(patientDetails.walletAddress);

//   //       const allRecords = await program.account.recordDetailsEntry.all();

//   //       const filteredRecords = allRecords.filter(
//   //         record => record.account.patientId === patientPublicKey.toBase58(),
//   //       );

//   //       return filteredRecords;
//   //     },
//   //     enabled: !!patientDetails,
//   //   });

//   //   const handleFetchRecords = async (): Promise<MedicalRecord[] | null> => {
//   //     if (recordsQuery.isSuccess) {
//   //       return recordsQuery.data.map(record => ({
//   //         doctorId: record.account.doctor.toBase58(),
//   //         signsAndSymptoms: record.account.signsNSymptoms,
//   //         diagnosis: record.account.diagnosis,
//   //         prescription: record.account.prescription,
//   //         timestamp: record.account.timestamp.toNumber(),
//   //       }));
//   //     } else if (recordsQuery.isError) {
//   //       console.error('Error fetching records:', recordsQuery.error);
//   //       return null;
//   //     }
//   //     return null;
//   //   };

//   //   const createEntry = useMutation({
//   //     mutationFn: async () => {
//   //       if (!wallet.publicKey || !patientDetails?.walletAddress) {
//   //         setShowConnectWallet(true);
//   //         throw new Error('Missing wallet or patient details.');
//   //       }

//   //       const record = web3.Keypair.generate();

//   //       await program.methods
//   //         .enterHealthRecord(
//   //           patientDetails.walletAddress,
//   //           signsAndSymptoms,
//   //           diagnosis,
//   //           prescription,
//   //         )
//   //         .accounts({
//   //           recordEntry: record.publicKey,
//   //           doctor: wallet.publicKey,
//   //           // systemProgram: web3.SystemProgram.programId,
//   //         })
//   //         .signers([record])
//   //         .rpc();
//   //     },
//   //     onSuccess: signature => {
//   //       toast.success('Record updated successfully');
//   //       recordsQuery.refetch();
//   //       setShowPopup(false);
//   //       setSignsAndSymptoms('');
//   //       setDiagnosis('');
//   //       setPrescription('');
//   //       setMessage('');
//   //     },
//   //     onError: error => {
//   //       toast.error(`Failed to update record: ${error.message}`);
//   //     },
//   //   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setMessage(e.target.value);
//   };

//   const handleProfileClick = () => {
//     setShowPopup(true);
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//   };

//   //   const handleUpdateRecords = () => {
//   //     createEntry.mutate();
//   //   };

//   //   const handleVideoCallClick = () => {
//   //     if (chatId) {
//   //       router.push(`/doctor/video-call?receiverId=${chatId}`);
//   //     } else {
//   //       setShowConnectWallet(true);
//   //       console.error('User ID is not available');
//   //     }
//   //   };

//   return (
//     <div className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen box-border">
//       <div className="flex mt-2 justify-between items-center">
//         <div className="flex gap-3 items-center">
//           <div>
//             <img src={ArrowLeft} alt="back icon" />
//           </div>
//           <div
//             className="flex gap-2 cursor-pointer"
//             onClick={handleProfileClick}
//           >
//             <img
//               src={DocImg}
//               alt="doctor profile image"
//               className="w-10 h-10 rounded-full"
//             />
//             <div className="leading-none flex flex-col justify-center">
//               <p className="leading-none text-custom-black font-semibold text-base m-0">
//                 {patientDetails?.firstName} {patientDetails?.lastName}
//               </p>
//               <p className="leading-none text-xs text-dark-grey m-0 p-0">
//                 Active now!
//               </p>
//             </div>
//           </div>
//         </div>
//         <img
//           src={VideoIcon}
//           onClick={handleVideoCallClick}
//           alt="video call"
//           className="w-6 h-6"
//         />
//       </div>
//       {showPopup && (
//         <PatientDetailsPopup
//           patientDetails={patientDetails}
//           onClose={handleClosePopup}
//           onFetchRecords={handleFetchRecords}
//           onUpdateRecords={handleUpdateRecords}
//           signsAndSymptoms={signsAndSymptoms}
//           setSignsAndSymptoms={setSignsAndSymptoms}
//           diagnosis={diagnosis}
//           setDiagnosis={setDiagnosis}
//           prescription={prescription}
//           setPrescription={setPrescription}
//           handleUpdateRecords={handleUpdateRecords}
//           loading={loading}
//         />
//       )}
//       <div className="pb-12">
//         <p className="text-sm text-center italic mt-1 text-gray-500">
//           Messages are end-to-end eencrypted
//         </p>
//         <h3 className="text-center bg-doc-bg w-14 h-6 flex justify-center items-center p-2 text-sm mx-auto mt-2 rounded-lg">
//           Today
//         </h3>
//         {decryptedMessages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex flex-col my-1 ${msg.sender === publicKey?.toString() ? 'ml-auto items-end' : 'mr-auto items-start'}`}
//           >
//             <p
//               className={`${msg.sender === publicKey?.toString() ? 'bg-chat-blue text-white rounded-br-none' : 'bg-doc-bg text-black rounded-bl-none'} py-2 px-4 rounded-lg`}
//             >
//               {msg.content}
//             </p>
//             <p className="text-xs text-dark-grey">{msg.formattedTime}</p>
//           </div>
//         ))}
//       </div>
//       <div className="fixed bottom-0 left-0 w-full bg-white py-2 px-4 flex items-center justify-between z-10">
//         <img src={Attachment} alt="select a file" className="mr-0" />
//         <input
//           type="text"
//           value={message}
//           onChange={handleChange}
//           placeholder="Write a message"
//           className="flex-1 py-2 px-3 rounded-xl bg-doc-bg text-base mx-2 outline-0"
//         />
//         <div className="flex items-center">
//           {message === '' ? (
//             <>
//               <img src={CameraIcon} alt="send picture" className="mr-2" />
//               <img src={MicrophoneIcon} alt="record audio" />
//             </>
//           ) : (
//             <img
//               src={SendIcon}
//               onClick={handleSend}
//               alt="send message"
//               className="w-6 h-6"
//             />
//           )}
//         </div>
//       </div>
//       {showConnectWallet && (
//         <PopupWallet onClose={() => setShowConnectWallet(false)} />
//       )}
//       <ToastContainer />
//     </div>
//   );
// }

// export default App;
