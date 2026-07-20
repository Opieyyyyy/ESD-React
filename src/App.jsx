import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, Calendar, Car, Settings, Shield, Activity,
  FileText, MapPin, TrendingUp, DollarSign, AlertTriangle,
  CheckCircle, RefreshCw, Star, User, Plus, Trash, CreditCard,
  Lock, PieChart, Info, Layers, Award, Check, ChevronRight,
  Map, Eye, Truck, Zap, Droplet, Clock, Download, FileSpreadsheet,
  LogOut, LogIn, UserPlus, ShieldAlert
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';

const DEFAULT_ACCOUNTS = [
  {
    email: "harith@utp.edu.my",
    password: "password123",
    role: "customer",
    name: "MUHAMMAD HARITH LUTFI",
    studentId: "22005760",
    details: "UTP Residence Hall V, Seri Iskandar, Perak"
  },
  {
    email: "idris@utp.edu.my",
    password: "password123",
    role: "provider",
    name: "MUHAMMAD IDRIS BIN JOHAN",
    studentId: "22005830",
    details: "Apex Mobile Detailing & HHO"
  },
  {
    email: "helmi@utp.edu.my",
    password: "password123",
    role: "admin",
    name: "Ts Lt Dr Helmi B Md Rais",
    studentId: "LECTURER",
    details: "System Overlord Authority"
  }
];

const INITIAL_PROVIDERS = [
  {
    id: 'p1',
    name: "Apex Mobile Detailing & HHO",
    owner: "Zulhelmi Bin Mansor",
    rating: 4.9,
    reviewsCount: 142,
    baseLocation: "Subang Jaya",
    coords: { x: 45, y: 55 },
    coverageRadius: 25, // km
    services: ['carbon_cleaning', 'polishing', 'ceramic_coating', 'interior_wash'],
    certified: true,
    equipmentVetted: true,
    hhoMachineModel: "HydroClean Pro H2",
    basePrice: 150,
  },
  {
    id: 'p2',
    name: "Utara Carbon Solution & Detailing",
    owner: "Ahmad Farhan",
    rating: 4.7,
    reviewsCount: 89,
    baseLocation: "Shah Alam",
    coords: { x: 30, y: 45 },
    coverageRadius: 20,
    services: ['carbon_cleaning', 'interior_wash', 'polishing'],
    certified: true,
    equipmentVetted: true,
    hhoMachineModel: "Eco-Emission Buster 5000",
    basePrice: 130,
  },
  {
    id: 'p3',
    name: "Signature Paint Correction & Ceramic",
    owner: "Kavinesh Raj",
    rating: 4.95,
    reviewsCount: 210,
    baseLocation: "Petaling Jaya",
    coords: { x: 60, y: 50 },
    coverageRadius: 30,
    services: ['polishing', 'ceramic_coating', 'interior_wash'],
    certified: true,
    equipmentVetted: false,
    hhoMachineModel: "None",
    basePrice: 200,
  },
  {
    id: 'p4',
    name: "Elite Eco-Wash & HHO Tech",
    owner: "Muhammad Idris",
    rating: 4.6,
    reviewsCount: 64,
    baseLocation: "Kajang",
    coords: { x: 75, y: 75 },
    coverageRadius: 15,
    services: ['carbon_cleaning', 'interior_wash'],
    certified: true,
    equipmentVetted: true,
    hhoMachineModel: "H2 Carbon Blaster Lite",
    basePrice: 120,
  }
];

const INITIAL_VEHICLES = [
  { id: 'v1', make: "Proton", model: "Saga", year: "2021", plate: "VEE 2011", category: "Sedan", engineSize: "1.3L" },
  { id: 'v2', make: "Perodua", model: "Ativa", year: "2023", plate: "WQA 8821", category: "SUV", engineSize: "1.0L Turbo" },
  { id: 'v3', make: "Honda", model: "Civic FE", year: "2022", plate: "ALL 993", category: "Sedan", engineSize: "1.5L Turbo" },
];

export default function App() {
  const [accounts, setAccounts] = useState(() => {

    const savedAccounts =
      localStorage.getItem("accounts");

    return savedAccounts
      ? JSON.parse(savedAccounts)
      : DEFAULT_ACCOUNTS;

  });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState('login'); // login | register
  const [currentUser, setCurrentUser] = useState(null);

  // Login input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Registration input states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('customer'); // customer | provider
  const [regDetail, setRegDetail] = useState('Subang Jaya');

  // Conditional Registration vehicle/provider details
  const [regPlate, setRegPlate] = useState('');
  const [regVehicleMake, setRegVehicleMake] = useState('Proton');
  const [regVehicleModel, setRegVehicleModel] = useState('Saga');
  const [regVehicleCategory, setRegVehicleCategory] = useState('Sedan');
  const [regEngineSize, setRegEngineSize] = useState('1.5L');
  const [regHhoModel, setRegHhoModel] = useState('HydroClean Pro X');
  const [regRadius, setRegRadius] = useState(25);

  const [currentRole, setCurrentRole] = useState('customer'); // customer | provider | admin
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);

  const [selectedVehicleId, setSelectedVehicleId] = useState(INITIAL_VEHICLES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('All');

  const [bookingStep, setBookingStep] = useState('search');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedServices, setSelectedServices] = useState(['carbon_cleaning']);
  const [appointmentDate, setAppointmentDate] = useState('2026-07-25');
  const [appointmentTime, setAppointmentTime] = useState('10:00');
  const [customerAddress, setCustomerAddress] = useState('Subang Jaya');
  const [customerCoords, setCustomerCoords] = useState({ x: 50, y: 50 });

  const [bookings, setBookings] = useState([
    {
      id: "B-88301",
      customerName: "MUHAMMAD HARITH LUTFI",
      vehicleId: "v1",
      vehiclePlate: "VEE 2011",
      providerId: "p1",
      providerName: "Apex Mobile Detailing & HHO",
      services: ["carbon_cleaning", "interior_wash"],
      date: "2026-07-22",
      time: "09:00",
      totalPrice: 220,
      status: "In Progress",
      address: "Bota, Perak",
      progressPercent: 60,
      timestamp: "2026-07-20T08:30:00.000Z",
    },
    {
      id: "B-88302",
      customerName: "MUHAMMAD HARITH LUTFI",
      vehicleId: "v3",
      vehiclePlate: "ALL 993",
      providerId: "p2",
      providerName: "Utara Carbon Solution & Detailing",
      services: ["carbon_cleaning"],
      date: "2026-07-15",
      time: "14:00",
      totalPrice: 150,
      status: "Completed",
      address: "Seri Iskandar, Perak",
      progressPercent: 100,
      timestamp: "2026-07-15T14:00:00.000Z",
      reviewRating: 5,
      reviewText: "Exceptional engine sound recovery after carbon cleaning! Fuel consumption has improved immediately."
    }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: "L-001", timestamp: "2026-07-20T00:05:12Z", category: "SECURITY", user: "system_daemon", event: "Token Session validation completed for student credentials (22005760 / 22005830)", status: "SUCCESS" },
    { id: "L-002", timestamp: "2026-07-20T00:10:45Z", category: "TRANSACTION", user: "customer_harith", event: "Booking B-88301 transition state changed: [Paid/Confirmed] -> [Technician Assigned] based on Group 1 Mobile Vehicle Detailing & Carbon Cleaning Marketplace Report.docx rules", status: "SUCCESS" },
    { id: "L-003", timestamp: "2026-07-20T00:15:30Z", category: "GEOLOCATION", user: "system_core", event: "Calculated distance route: Customer (Bota, Perak) to Provider p1 inside 25km radius limit", status: "VALIDATED" },
    { id: "L-004", timestamp: "2026-07-20T01:02:18Z", category: "WORKFLOW", user: "provider_p1", event: "Technician marked booking B-88301 status -> 'En Route'", status: "SUCCESS" },
  ]);

  const [newVehicleMake, setNewVehicleMake] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehicleYear, setNewVehicleYear] = useState('');
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newVehicleCategory, setNewVehicleCategory] = useState('Sedan');
  const [newVehicleEngine, setNewVehicleEngine] = useState('1.5L');

  const [annualKm, setAnnualKm] = useState(18000);
  const [averageFuelEfficiency, setAverageFuelEfficiency] = useState(8.5);
  useEffect(() => {

    const savedUser =
      localStorage.getItem("currentUser");

    if (savedUser) {

      const user =
        JSON.parse(savedUser);

      setCurrentUser(user);
      setCurrentRole(user.role);
      setIsAuthenticated(true);

    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "accounts",
      JSON.stringify(accounts)
    );

  }, [accounts]);

  const addAuditLog = (category, user, event, status = "SUCCESS") => {
    const newLog = {
      id: `L-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + 'Z',
      category,
      user,
      event,
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const account = accounts.find(acc => acc.email.toLowerCase() === loginEmail.toLowerCase() && acc.password === loginPassword);

    if (account) {

      localStorage.setItem(
        "currentUser",
        JSON.stringify(account)
      );

      setIsAuthenticated(true);
      setCurrentUser(account);
      setCurrentRole(account.role);
      setActiveTab('dashboard');

      setAuthSuccess(
        `Welcome back, ${account.name}! Authenticating session...`
      );

      addAuditLog(
        "SECURITY",
        account.email,
        `User successfully authenticated as [${account.role.toUpperCase()}] role using credentials`,
        "SUCCESS"
      );
    } else {
      setAuthError('Invalid credentials. Please enter correct email and password.');
      addAuditLog("SECURITY", loginEmail || "anonymous", `Failed login attempt. Credential mismatch against system directory`, "FAILED");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!regName || !regEmail || !regPassword) {
      setAuthError('All basic fields are strictly required.');
      return;
    }

    if (accounts.some(acc => acc.email.toLowerCase() === regEmail.toLowerCase())) {
      setAuthError('This email directory already exists inside the UTP database.');
      return;
    }

    const newAccount = {
      email: regEmail,
      password: regPassword,
      role: regRole,
      name: regName.toUpperCase(),
      studentId: regRole === 'customer' ? `REG-${Math.floor(100000 + Math.random() * 900000)}` : "PARTNER",
      details: regDetail || "Verified Campus Address"
    };

    setAccounts(prev => [...prev, newAccount]);

    // Role-Based dynamic entity generation
    if (regRole === 'customer') {
      const initialCarId = `v${vehicles.length + 1}`;
      const newCar = {
        id: initialCarId,
        make: regVehicleMake,
        model: regVehicleModel,
        year: "2024",
        plate: regPlate || `UTP ${Math.floor(1000 + Math.random() * 9000)}`,
        category: regVehicleCategory,
        engineSize: regEngineSize
      };
      setVehicles(prev => [...prev, newCar]);
      setSelectedVehicleId(initialCarId);
    } else if (regRole === 'provider') {
      const newProvId = `p${providers.length + 1}`;
      const newProvider = {
        id: newProvId,
        name: regName.toUpperCase() + " ENTERPRISE",
        owner: regName,
        rating: 5.0,
        reviewsCount: 1,
        baseLocation: regDetail || "Seri Iskandar, Perak",
        coords: { x: 50, y: 50 },
        coverageRadius: parseInt(regRadius) || 25,
        services: ['carbon_cleaning', 'interior_wash'],
        certified: true,
        equipmentVetted: true,
        hhoMachineModel: regHhoModel,
        basePrice: 150
      };
      setProviders(prev => [...prev, newProvider]);
    }

    addAuditLog("SECURITY", regEmail, `Enrolled new user profile: ${newAccount.name} as [${regRole.toUpperCase()}]`, "SUCCESS");

    // Auto login
    localStorage.setItem(
      "currentUser",
      JSON.stringify(newAccount)
    );

    setIsAuthenticated(true);
    setCurrentUser(newAccount);
    setCurrentRole(newAccount.role);
    setActiveTab('dashboard');
    setAuthSuccess('Registration completed successfully. Your profile matches constraints defined in Group 1 Mobile Vehicle Detailing & Carbon Cleaning Marketplace Report.docx.');
  };

  const handleQuickDemoLogin = (email, password) => {
    setLoginEmail(email);
    setLoginPassword(password);
    // Submit login with temporary timeouts
    setTimeout(() => {
      const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password);
      if (account) {

        localStorage.setItem(
          "currentUser",
          JSON.stringify(account)
        );

        setIsAuthenticated(true);
        setCurrentUser(account);
        setCurrentRole(account.role);
        setActiveTab('dashboard');


        setCurrentRole(account.role);
        setActiveTab('dashboard');
        addAuditLog("SECURITY", email, `Lecturer triggered automatic Quick-Login sequence as [${account.role.toUpperCase()}]`, "SUCCESS");
      }
    }, 100);
  };

const handleLogout = () => {

  localStorage.removeItem("currentUser");

  addAuditLog(
    "SECURITY",
    currentUser?.email || "unknown",
    "Terminated active login session. Revoking tokens",
    "SUCCESS"
  );

  setIsAuthenticated(false);
  setCurrentUser(null);
  setLoginEmail('');
  setLoginPassword('');
  setAuthError('');
  setAuthSuccess('');
};

  const calculateDynamicPrice = (provider, servicesList, vehicleId) => {
    if (!provider) return 0;
    const vehicle = vehicles.find(v => v.id === vehicleId) || { category: 'Sedan', engineSize: '1.5L' };
    let runningTotal = 0;

    servicesList.forEach(service => {
      if (service === 'carbon_cleaning') {
        const sizeVal = parseFloat(vehicle.engineSize);
        if (isNaN(sizeVal) || sizeVal <= 1.5) {
          runningTotal += 150;
        } else if (sizeVal > 1.5 && sizeVal <= 2.5) {
          runningTotal += 220;
        } else {
          runningTotal += 300;
        }
      } else if (service === 'polishing') {
        if (['SUV', 'MPV'].includes(vehicle.category)) {
          runningTotal += 250;
        } else {
          runningTotal += 180;
        }
      } else if (service === 'ceramic_coating') {
        if (['SUV', 'MPV'].includes(vehicle.category)) {
          runningTotal += 750;
        } else {
          runningTotal += 550;
        }
      } else if (service === 'interior_wash') {
        runningTotal += 70;
      }
    });

    return runningTotal;
  };

  const locationDistances = {

    "Subang Jaya": {
      "Subang Jaya": 0,
      "Shah Alam": 8,
      "Petaling Jaya": 10,
      "Kajang": 30,
      "Puchong": 15,
      "Cheras": 25,
      "KLCC": 20,
      "Bangsar": 18
    },

    "Shah Alam": {
      "Subang Jaya": 8,
      "Shah Alam": 0,
      "Petaling Jaya": 12,
      "Kajang": 35,
      "Puchong": 15,
      "Cheras": 30,
      "KLCC": 25,
      "Bangsar": 20
    },

    "Petaling Jaya": {
      "Subang Jaya": 10,
      "Shah Alam": 12,
      "Petaling Jaya": 0,
      "Kajang": 28,
      "Puchong": 15,
      "Cheras": 18,
      "KLCC": 12,
      "Bangsar": 8
    },

    "Kajang": {
      "Subang Jaya": 30,
      "Shah Alam": 35,
      "Petaling Jaya": 28,
      "Kajang": 0,
      "Puchong": 20,
      "Cheras": 15,
      "KLCC": 25,
      "Bangsar": 22
    },

    "Puchong": {
      "Subang Jaya": 15,
      "Shah Alam": 15,
      "Petaling Jaya": 15,
      "Kajang": 20,
      "Puchong": 0,
      "Cheras": 18,
      "KLCC": 22,
      "Bangsar": 18
    },

    "Cheras": {
      "Subang Jaya": 25,
      "Shah Alam": 30,
      "Petaling Jaya": 18,
      "Kajang": 15,
      "Puchong": 18,
      "Cheras": 0,
      "KLCC": 12,
      "Bangsar": 10
    },

    "KLCC": {
      "Subang Jaya": 20,
      "Shah Alam": 25,
      "Petaling Jaya": 12,
      "Kajang": 25,
      "Puchong": 22,
      "Cheras": 12,
      "KLCC": 0,
      "Bangsar": 5
    },

    "Bangsar": {
      "Subang Jaya": 18,
      "Shah Alam": 20,
      "Petaling Jaya": 8,
      "Kajang": 22,
      "Puchong": 18,
      "Cheras": 10,
      "KLCC": 5,
      "Bangsar": 0
    }

  };

  const calculateDistance = (providerLocation) => {

    return (
      locationDistances[
        providerLocation
      ]?.[
        customerAddress
      ] ?? 20
    );

  };

const calculateTravelFee = (providerLocation) => {

  const distanceTable = {
    "Subang Jaya": {
      "Subang Jaya": 0,
      "Shah Alam": 8,
      "Petaling Jaya": 10,
      "Kajang": 30,
      "Puchong": 15,
      "Cheras": 25,
      "KLCC": 20,
      "Bangsar": 18
    }
  };

  const distance =
    distanceTable[providerLocation]?.[customerAddress] ?? 20;

  return Math.ceil(distance * 1.5);
};

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      const distance =
      calculateDistance(
        provider.baseLocation
      );
      const matchesRadius = distance <= provider.coverageRadius;
      const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.baseLocation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesService = selectedServiceFilter === 'All' || provider.services.includes(selectedServiceFilter);

      return matchesRadius && matchesSearch && matchesService;
    });
  }, [providers, searchQuery, selectedServiceFilter, customerCoords]);

  const handleCheckoutSubmit = () => {
    if (!selectedProvider) return;
    const finalPrice =
    calculateDynamicPrice(
      selectedProvider,
      selectedServices,
      selectedVehicleId
    ) +
    calculateTravelFee(
      selectedProvider?.baseLocation
    );
    calculateTravelFee();

    const newBooking = {
      id: `B-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: currentUser?.name || "MUHAMMAD HARITH LUTFI",
      vehicleId: selectedVehicleId,
      vehiclePlate: vehicles.find(v => v.id === selectedVehicleId)?.plate || "VEE 2011",
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      services: [...selectedServices],
      date: appointmentDate,
      time: appointmentTime,
      totalPrice: finalPrice,
      status: "Paid",
      address: customerAddress,
      progressPercent: 20,
      timestamp: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    addAuditLog("TRANSACTION", currentUser?.email, `Authorized Escrow Lock of RM ${finalPrice} under Group 1 Mobile Vehicle Detailing & Carbon Cleaning Marketplace Report.docx guidelines`, "SUCCESS");
    addAuditLog("WORKFLOW", "system_core", `Platform Fee: RM ${(finalPrice * 0.12).toFixed(2)} (12%), Provider cut: RM ${(finalPrice * 0.88).toFixed(2)}`, "COMPLETED");
    setBookingStep('confirmed');
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!newVehicleMake || !newVehicleModel || !newVehiclePlate) return;
    const newCar = {
      id: `v${vehicles.length + 1}`,
      make: newVehicleMake,
      model: newVehicleModel,
      year: newVehicleYear || '2026',
      plate: newVehiclePlate,
      category: newVehicleCategory,
      engineSize: newVehicleEngine
    };
    setVehicles(prev => [...prev, newCar]);
    setSelectedVehicleId(newCar.id);
    addAuditLog("DATA_MANAGEMENT", currentUser?.email, `Registered new mobile asset profile: ${newCar.make} ${newCar.model} (${newCar.plate})`, "SUCCESS");

    setNewVehicleMake('');
    setNewVehicleModel('');
    setNewVehicleYear('');
    setNewVehiclePlate('');
  };

  const handleDeleteVehicle = (id) => {
    const deleted = vehicles.find(v => v.id === id);
    setVehicles(prev => prev.filter(v => v.id !== id));
    addAuditLog("DATA_MANAGEMENT", currentUser?.email, `Deleted asset profile: ${deleted?.make} ${deleted?.model}`, "SUCCESS");
  };

  const updateBookingStatus = (bookingId, nextStatus, progress) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: nextStatus, progressPercent: progress };
      }
      return b;
    }));
    addAuditLog("WORKFLOW", "provider_technician", `Status of booking ${bookingId} updated to [${nextStatus}]`, "SUCCESS");
  };

  const handleSubmitReview = (bookingId, rating, comment) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, reviewRating: rating, reviewText: comment, status: "Completed" };
      }
      return b;
    }));
    addAuditLog("WORKFLOW", currentUser?.email, `Submitted feedback rating for ${bookingId}: Rated ${rating} Stars`, "SUCCESS");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">

        {/* Simple Header */}
        <header className="bg-slate-950 border-b border-purple-500/20 py-4 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-900 via-purple-500 to-fuchsia-500 p-0.5 flex items-center justify-center shadow-lg">
                <div className="bg-slate-950 rounded-full h-full w-full flex items-center justify-center font-bold text-purple-400 text-xs">UTP</div>
              </div>
              <div>
                <span className="block text-[10px] text-purple-400 font-mono uppercase tracking-wider">TEB3323 Enterprise Systems</span>
                <h1 className="text-sm font-extrabold tracking-tight text-white uppercase">Mobile Care Marketplace Portal</h1>
              </div>
            </div>
            <span className="hidden md:inline px-3 py-1 text-xs bg-purple-950/40 text-purple-300 border border-purple-900 rounded font-mono">May Semester 2026</span>
          </div>
        </header>

        {/* Main Split Gateway Block */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-8">

          {/* Left Documentation Reference Banner */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-gradient-to-tr from-purple-950/20 via-slate-900 to-indigo-950/20 border border-purple-900/30 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-400" />
                <span className="font-mono text-xs text-purple-300 font-semibold uppercase tracking-widest">MOBILE VEHICLE DETAILING MARKETPLACE</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight leading-snug">
                Professional Mobile Detailing & Carbon Cleaning Services
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Book trusted mobile vehicle detailing and hydrogen carbon cleaning services directly to your home, office, or preferred location. <strong className="text-purple-300">"Our marketplace connects customers with certified automotive care specialists across the Klang Valley, providing convenient scheduling, transparent pricing, and professional on-site vehicle maintenance."</strong>
              </p>

              <div className="h-px bg-slate-800"></div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-mono">
                <div className="p-2 bg-slate-950/80 rounded border border-purple-950/40">
                  <span className="block text-purple-400 font-bold">100+ Bookings</span>
                  <span className="text-slate-500">Completed Monthly</span>
                </div>
                <div className="p-2 bg-slate-950/80 rounded border border-purple-950/40">
                  <span className="block text-purple-400 font-bold">CERTIFIED TECHNICIANS</span>
                  <span className="text-slate-500">VERIFIED PROFESSIONALS</span>
                </div>
                <div className="p-2 bg-slate-950/80 rounded border border-purple-950/40">
                  <span className="block text-purple-400 font-bold">DOOR SERVICE</span>
                  <span className="text-slate-500">CONVENIENT SCHEDULING</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Accounts Panel for Grading Evaluation */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 space-y-3 shadow-md">
              <div className="flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-purple-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Lecturer & Student Quick Evaluation Panel</h3>
              </div>
              <p className="text-[11px] text-slate-400">Click any preset account profile below to auto-fill the login session instantly:</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <button
                  onClick={() => handleQuickDemoLogin("harith@utp.edu.my", "password123")}
                  className="flex flex-col items-start p-2.5 bg-slate-950 hover:bg-purple-950/30 rounded border border-purple-900/30 transition text-left"
                >
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">1. CUSTOMER</span>
                  <span className="text-[11px] text-white font-semibold truncate max-w-full">Harith Lutfi</span>
                  <span className="text-[9px] text-slate-500 font-mono">harith@utp.edu.my</span>
                </button>
                <button
                  onClick={() => handleQuickDemoLogin("idris@utp.edu.my", "password123")}
                  className="flex flex-col items-start p-2.5 bg-slate-950 hover:bg-purple-950/30 rounded border border-purple-900/30 transition text-left"
                >
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">2. TECHNICIAN</span>
                  <span className="text-[11px] text-white font-semibold truncate max-w-full">Idris Johan</span>
                  <span className="text-[9px] text-slate-500 font-mono">idris@utp.edu.my</span>
                </button>
                <button
                  onClick={() => handleQuickDemoLogin("helmi@utp.edu.my", "password123")}
                  className="flex flex-col items-start p-2.5 bg-slate-950 hover:bg-purple-950/30 rounded border border-purple-900/30 transition text-left"
                >
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">3. SYSTEM ADMIN</span>
                  <span className="text-[11px] text-white font-semibold truncate max-w-full">Dr Helmi Rais</span>
                  <span className="text-[9px] text-slate-500 font-mono">helmi@utp.edu.my</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Form Card Component */}
          <div className="w-full lg:w-96 bg-slate-900 rounded-2xl border border-purple-950/60 p-6 space-y-6 shadow-2xl relative overflow-hidden">

            {/* Elegant Background Glow */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-purple-600/10 rounded-full blur-2xl"></div>

            <div className="flex justify-between border-b border-slate-800 pb-3">
              <button
                onClick={() => { setAuthScreen('login'); setAuthError(''); }}
                className={`pb-1 text-sm font-bold tracking-wider uppercase transition ${authScreen === 'login' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-slate-400'}`}
              >
                Sign In Portal
              </button>
              <button
                onClick={() => { setAuthScreen('register'); setAuthError(''); }}
                className={`pb-1 text-sm font-bold tracking-wider uppercase transition ${authScreen === 'register' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-slate-400'}`}
              >
                Enroll Profile
              </button>
            </div>

            {/* Error alerts */}
            {authError && (
              <div className="p-3 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px] flex items-center gap-2">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {/* Success alerts */}
            {authSuccess && (
              <div className="p-3 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[11px] flex items-center gap-2">
                <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* LOGIN WINDOW SCREEN */}
            {authScreen === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Email Directory</label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="e.g. harith@utp.edu.my"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-transparent text-xs text-white focus:outline-none w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Authorization Secret</label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                    <Lock className="h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-transparent text-xs text-white focus:outline-none w-full"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg text-xs tracking-wider uppercase shadow-lg hover:brightness-110 flex items-center justify-center gap-1.5 transition"
                >
                  <LogIn className="h-4 w-4" /> Secure Auth
                </button>
              </form>
            )}

            {/* REGISTER WINDOW SCREEN */}
            {authScreen === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Full Legal Name (UTP ID)</label>
                  <input
                    type="text"
                    placeholder="e.g. MUHAMMAD IDRIS BIN JOHAN"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Secure Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. idris@utp.edu.my"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Enterprise Marketplace Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="customer">Customer (Vehicle Asset Owner)</option>
                    <option value="provider">Service Provider (Mobile Technician)</option>
                  </select>
                </div>

                {/* Conditional fields based on selected signup role */}
                {regRole === 'customer' && (
                  <div className="bg-slate-950 p-3 rounded-lg border border-purple-950/40 space-y-3">
                    <span className="block text-[9px] text-purple-400 font-mono font-bold uppercase">Asset Profile Onboarding (First Car)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] text-slate-500 font-mono uppercase mb-0.5">License Plate</label>
                        <input
                          type="text"
                          placeholder="ALL 993"
                          value={regPlate}
                          onChange={(e) => setRegPlate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] text-slate-500 font-mono uppercase mb-0.5">Engine Size</label>
                        <select
                          value={regEngineSize}
                          onChange={(e) => setRegEngineSize(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        >
                          <option value="1.3L">Below 1.5L</option>
                          <option value="2.0L">1.6L - 2.5L</option>
                          <option value="3.0L">Above 2.5L</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {regRole === 'provider' && (
                  <div className="bg-slate-950 p-3 rounded-lg border border-purple-950/40 space-y-3">
                    <span className="block text-[9px] text-purple-400 font-mono font-bold uppercase">Equipment & Coverage Settings</span>
                    <div>
                      <label className="block text-[8px] text-slate-500 font-mono uppercase mb-0.5">
                        Business Base Location
                      </label>

                      <select
                        value={regDetail}
                        onChange={(e) => setRegDetail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        <option value="Subang Jaya">Subang Jaya</option>
                        <option value="Shah Alam">Shah Alam</option>
                        <option value="Petaling Jaya">Petaling Jaya</option>
                        <option value="Kajang">Kajang</option>
                        <option value="Puchong">Puchong</option>
                        <option value="Cheras">Cheras</option>
                        <option value="KLCC">KLCC</option>
                        <option value="Bangsar">Bangsar</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] text-slate-500 font-mono uppercase mb-0.5">HHO Machine Model</label>
                        <input
                          type="text"
                          value={regHhoModel}
                          onChange={(e) => setRegHhoModel(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] text-slate-500 font-mono uppercase mb-0.5">Service Radius (km)</label>
                        <input
                          type="number"
                          value={regRadius}
                          onChange={(e) => setRegRadius(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg text-xs tracking-wider uppercase shadow-lg hover:brightness-110 flex items-center justify-center gap-1.5 transition"
                >
                  <UserPlus className="h-4 w-4" /> Finalize Profile Onboarding
                </button>
              </form>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-purple-950/30 py-4 px-6 text-center text-xs text-slate-600 font-mono">
          <p>© 2026 Universiti Teknologi Petronas (UTP). Enterprise System Architecture Core Platform.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">

      {/* HEADER */}
      <header className="bg-slate-950 border-b border-purple-500/20 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Elegant Purple UTP Emblem Accent */}
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-900 via-purple-500 to-fuchsia-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <div className="bg-slate-950 rounded-full h-full w-full flex items-center justify-center font-bold text-purple-400 text-xs">
                UTP
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-400 tracking-widest font-bold uppercase">TEB3323 Enterprise Systems</span>
                <span className="px-2 py-0.5 text-[9px] bg-purple-950 text-purple-300 border border-purple-800 rounded font-mono">May 2026</span>
              </div>
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                VEHICLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-300">CARE MARKETPLACE</span>
              </h1>
            </div>
          </div>

          {/* Academic Project Credits */}
          <div className="hidden lg:flex items-center gap-3 text-xs bg-slate-900/60 p-2 rounded-lg border border-purple-950">
            <div>
              <span className="block text-[10px] text-purple-400 font-mono">LECTURER:</span>
              <span className="font-semibold text-slate-200">Ts Lt Dr Helmi B Md Rais</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <span className="block text-[10px] text-purple-400 font-mono">STUDENTS:</span>
              <span className="font-semibold text-slate-200">Harith Lutfi & Idris Johan</span>
            </div>
          </div>

          {/* User Sign Out Header Component */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-[9px] font-mono text-purple-400 uppercase tracking-widest font-bold">Logged in as</span>
              <span className="text-xs text-white font-semibold">{currentUser?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-rose-950/40 text-xs text-slate-400 hover:text-rose-400 border border-slate-800 rounded-lg transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic Report Reference Alert Header */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/20 border-b border-purple-950/40 py-2 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <FileSpreadsheet className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="truncate">
              Compliance model synced with <strong className="text-purple-300">Group 1 Mobile Vehicle Detailing & Carbon Cleaning Marketplace Report.docx</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Stripe Escrow Connected
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-purple-400">Commission Rate: Tiered 10% - 15%</span>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">

        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-3">
          <div className="bg-slate-950 rounded-xl p-4 border border-purple-950/50 shadow-md">
            <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-purple-400">
                {currentRole === 'customer' && <User className="h-4.5 w-4.5" />}
                {currentRole === 'provider' && <Truck className="h-4.5 w-4.5" />}
                {currentRole === 'admin' && <Shield className="h-4.5 w-4.5" />}
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-mono uppercase">Authenticated Session</span>
                <span className="font-semibold text-xs text-white max-w-[150px] block truncate">
                  {currentUser?.name}
                </span>
                <span className="text-[9px] text-purple-400 font-mono block">Role: {currentRole.toUpperCase()}</span>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'dashboard' ? 'bg-purple-950/40 text-purple-400 border border-purple-800' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
              >
                <Activity className="h-4 w-4" />
                <span>Interactive Dashboard</span>
              </button>

              {currentRole === 'customer' && (
                <>
                  <button
                    onClick={() => { setActiveTab('book'); setBookingStep('search'); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'book' ? 'bg-purple-950/40 text-purple-400 border border-purple-800' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                  >
                    <Search className="h-4 w-4" />
                    <span>Search Providers</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('vehicles')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'vehicles' ? 'bg-purple-950/40 text-purple-400 border border-purple-800' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                  >
                    <Car className="h-4 w-4" />
                    <span>My Registered Assets ({vehicles.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('carbon_calculator')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'carbon_calculator' ? 'bg-purple-950/40 text-purple-400 border border-purple-800' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                  >
                    <Zap className="h-4 w-4" />
                    <span>Carbon Reduction Tool</span>
                  </button>
                </>
              )}

              {currentRole === 'provider' && (
                <>
                  <button
                    onClick={() => setActiveTab('active_bookings')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'active_bookings' ? 'bg-purple-950/40 text-purple-400 border border-purple-800' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Manage Daily Runs ({bookings.filter(b => b.status !== 'Completed').length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('smart_pricing')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'smart_pricing' ? 'bg-purple-950/40 text-purple-400 border border-purple-800' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Smart Pricing Assistant</span>
                  </button>
                </>
              )}

              {currentRole === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('vendor_vetting')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'vendor_vetting' ? 'bg-purple-950/40 text-purple-400 border border-purple-800' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                  >
                    <Award className="h-4 w-4" />
                    <span>Vendor Quality Vetting</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('commission_split')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'commission_split' ? 'bg-purple-950/40 text-purple-400 border border-purple-800' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Commission Ledger</span>
                  </button>
                </>
              )}

              <div className="h-px bg-slate-800 my-2"></div>

                {currentRole === 'admin' && (
                  <button
                    onClick={() => setActiveTab('audit_logs')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${
                      activeTab === 'audit_logs'
                        ? 'bg-purple-950/40 text-purple-400 border border-purple-800'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Enterprise Audit Logs</span>
                  </button>
                )}
            </nav>
          </div>

          {/* Quick Informational Academic Project Widget */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl p-4 border border-purple-950/30 text-[11px] text-slate-400 space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs text-purple-400">
              <Info className="h-3.5 w-3.5" />
              Why Choose Our Marketplace
            </h4>
            <p className="leading-relaxed">
              Connect with trusted mobile detailing and carbon cleaning specialists across the Klang Valley. <strong>Our platform provides convenient doorstep vehicle care, transparent pricing, secure bookings, and certified service providers to ensure a professional customer experience every time.</strong>
            </p>
          </div>
        </aside>

        {/* MAIN DISPLAY PORT */}
        <main className="flex-grow space-y-6">

          {/* ==============================================
              CUSTOMER ROLE INTERFACES
              ============================================== */}

          {currentRole === 'customer' && (
            <>
              {/* TAB: CUSTOMER DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* KPI Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-950 border border-purple-950/40 p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <span className="block text-[10px] text-slate-400 tracking-wider font-mono">TOTAL ACTIVE BOOKINGS</span>
                        <span className="text-2xl font-bold text-white">{bookings.length}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-purple-950 text-purple-400">
                        <Calendar className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-purple-950/40 p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <span className="block text-[10px] text-slate-400 tracking-wider font-mono">ESTIMATED CO2 REDUCED</span>
                        <span className="text-2xl font-bold text-emerald-400">324.5 kg</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400">
                        <Zap className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-purple-950/40 p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <span className="block text-[10px] text-slate-400 tracking-wider font-mono">COMMITTED SPEND</span>
                        <span className="text-2xl font-bold text-purple-400">RM 370.00</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-purple-950/50 text-purple-300">
                        <DollarSign className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {/* Active Services Monitor */}
                  <div className="bg-slate-950 rounded-xl border border-purple-950/40 p-5">
                    <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
                      <Truck className="h-4.5 w-4.5 text-purple-400" />
                      Live Service Execution Monitor
                    </h3>

                    {bookings.filter(b => b.status !== 'Completed').length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <p className="text-xs">No active mobile service sessions. Dispatch a certified team now.</p>
                        <button
                          onClick={() => { setActiveTab('book'); setBookingStep('search'); }}
                          className="mt-3 px-3.5 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-lg hover:bg-purple-500 transition shadow"
                        >
                          Find Near Providers
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.filter(b => b.status !== 'Completed').map(booking => (
                          <div key={booking.id} className="bg-slate-900 rounded-lg p-4 border border-purple-950/30 relative overflow-hidden">
                            <div className="absolute top-0 left-0 bottom-0 bg-purple-500/5 transition-all" style={{ width: `${booking.progressPercent}%` }}></div>

                            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">{booking.id}</span>
                                  <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded-full font-mono text-[10px]">
                                    {booking.status}
                                  </span>
                                </div>
                                <span className="block text-slate-400 mt-1">{booking.providerName} • {booking.vehiclePlate}</span>
                              </div>
                              <div className="text-right sm:text-right">
                                <span className="block font-mono text-slate-300">{booking.date} @ {booking.time}</span>
                                <span className="font-bold text-purple-400">RM {booking.totalPrice}</span>
                              </div>
                            </div>

                            {/* State Progression Tracker */}
                            <div className="relative mt-2">
                              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 transition-all duration-500" style={{ width: `${booking.progressPercent}%` }}></div>
                              </div>
                              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1.5 uppercase">
                                <span className={booking.progressPercent >= 20 ? 'text-purple-400 font-bold' : ''}>Confirmed</span>
                                <span className={booking.progressPercent >= 40 ? 'text-purple-400 font-bold' : ''}>Assigned</span>
                                <span className={booking.progressPercent >= 60 ? 'text-purple-400 font-bold' : ''}>En Route</span>
                                <span className={booking.progressPercent >= 80 ? 'text-fuchsia-400 font-bold animate-pulse' : ''}>In Progress</span>
                                <span className={booking.progressPercent >= 100 ? 'text-emerald-400 font-bold' : ''}>Done</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Registered Vehicle Cards */}
                  <div className="bg-slate-950 rounded-xl border border-purple-950/40 p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                        <Car className="h-4.5 w-4.5 text-purple-400" />
                        My Registered Mobile Service Assets
                      </h3>
                      <button
                        onClick={() => setActiveTab('vehicles')}
                        className="text-xs text-purple-400 hover:underline flex items-center gap-1"
                      >
                        Manage Profiles <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {vehicles.map(car => (
                        <div key={car.id} className="bg-slate-900 p-4 rounded-lg border border-purple-950/20 flex flex-col justify-between hover:border-purple-500/40 transition">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="px-1.5 py-0.5 bg-purple-950 text-purple-300 rounded text-[9px] font-bold uppercase font-mono">{car.category}</span>
                              <h4 className="font-bold text-white text-sm mt-1">{car.make} {car.model}</h4>
                            </div>
                            <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 border border-purple-500/20 rounded font-bold">
                              {car.plate}
                            </span>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                            <span>Engine: <strong className="text-slate-200">{car.engineSize}</strong></span>
                            <span>Year: <strong className="text-slate-200">{car.year}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: BOOK A SERVICE */}
              {activeTab === 'book' && (
                <div className="space-y-6">
                  {/* Step Indicators */}
                  <div className="flex justify-between items-center max-w-2xl mx-auto mb-6">
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${bookingStep === 'search' ? 'bg-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20' : 'bg-slate-800 text-slate-400'}`}>1</div>
                      <span className="text-[10px] font-semibold uppercase mt-1">Provider</span>
                    </div>
                    <div className="h-px flex-grow bg-slate-850 mx-2"></div>
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${bookingStep === 'configure' ? 'bg-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20' : 'bg-slate-800 text-slate-400'}`}>2</div>
                      <span className="text-[10px] font-semibold uppercase mt-1">Configure</span>
                    </div>
                    <div className="h-px flex-grow bg-slate-850 mx-2"></div>
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${bookingStep === 'payment' ? 'bg-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20' : 'bg-slate-800 text-slate-400'}`}>3</div>
                      <span className="text-[10px] font-semibold uppercase mt-1">Checkout</span>
                    </div>
                  </div>

                  {/* SUB-STEP: Search Providers */}
                  {bookingStep === 'search' && (
                    <div className="space-y-6">
                      <div className="bg-slate-950 p-4 rounded-xl border border-purple-950/30 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-lg">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Set Your Coordinates (Zip/Location)</label>
                          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2">
                            <MapPin className="h-4 w-4 text-purple-400 shrink-0" />
                            <select
                              value={customerAddress}
                              onChange={(e) => setCustomerAddress(e.target.value)}
                              className="bg-slate-900 text-white border-none text-xs py-1.5 focus:outline-none w-full"
                            >
                              <option value="Subang Jaya" className="bg-slate-900 text-white">
                                Subang Jaya
                              </option>

                              <option value="Shah Alam" className="bg-slate-900 text-white">
                                Shah Alam
                              </option>

                              <option value="Petaling Jaya" className="bg-slate-900 text-white">
                                Petaling Jaya
                              </option>

                              <option value="Kajang" className="bg-slate-900 text-white">
                                Kajang
                              </option>

                              <option value="Puchong" className="bg-slate-900 text-white">
                                Puchong
                              </option>

                              <option value="Cheras" className="bg-slate-900 text-white">
                                Cheras
                              </option>

                              <option value="KLCC" className="bg-slate-900 text-white">
                                KLCC
                              </option>

                              <option value="Bangsar" className="bg-slate-900 text-white">
                                Bangsar
                              </option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Search Keywords</label>
                          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2">
                            <Search className="h-4 w-4 text-slate-500 shrink-0" />
                            <input
                              type="text"
                              placeholder="Name or landmark..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="bg-transparent text-xs text-white py-1.5 focus:outline-none w-full"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Required Specialization</label>
                          <select
                            value={selectedServiceFilter}
                            onChange={(e) => setSelectedServiceFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded w-full py-1.5 px-2 text-xs text-white"
                          >
                            <option value="All">All Services</option>
                            <option value="carbon_cleaning">Hydrogen Carbon Cleaning</option>
                            <option value="polishing">Paint Polishing</option>
                            <option value="ceramic_coating">Ceramic Coating</option>
                            <option value="interior_wash">Interior Extraction</option>
                          </select>
                        </div>
                      </div>

                      {/* Display Map & Providers list */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-slate-950 border border-purple-950/30 p-4 rounded-xl flex flex-col justify-between shadow-lg">
                          <div>
                            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-1 flex items-center gap-1.5">
                              <Map className="h-4 w-4 text-purple-400" />
                              Google Maps Service Coverage
                            </h3>
                            <p className="text-[10px] text-slate-400">Dynamic tracking checks proximity metrics to guarantee safety and low transport fees.</p>
                          </div>

                          <div className="my-4 aspect-[4/3] rounded-lg overflow-hidden border border-slate-800">
                            <iframe
                              title="UTP Location Map"
                              src={`https://www.google.com/maps?q=${encodeURIComponent(customerAddress)}&output=embed`}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              loading="lazy"
                              allowFullScreen
                            />
                          </div>

                          <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono bg-slate-900/60 p-2 rounded">
                            <span>Your Base: X: {customerCoords.x} Y: {customerCoords.y}</span>
                            <span className="text-purple-400 font-bold">Matches found: {filteredProviders.length}</span>
                          </div>
                        </div>

                        {/* List view of Providers */}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                          {filteredProviders.length === 0 ? (
                            <div className="bg-slate-950 p-6 rounded-xl text-center text-slate-500 border border-purple-950/30">
                              <AlertTriangle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                              <p className="text-xs">No providers match the search criteria within your dynamic area range.</p>
                            </div>
                          ) : (
                            filteredProviders.map(prov => {
                              const distance =
                              calculateDistance(
                                prov.baseLocation
                              );
                              return (
                                <div
                                  key={prov.id}
                                  onClick={() => setSelectedProvider(prov)}
                                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${selectedProvider?.id === prov.id ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-500/10' : 'bg-slate-950 border-purple-950/20 hover:border-purple-800'}`}
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <div>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <h4 className="font-bold text-white text-sm">{prov.name}</h4>
                                        {prov.certified && (
                                          <span className="flex items-center gap-0.5 bg-purple-950 text-purple-300 border border-purple-800 text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">
                                            <Award className="h-2.5 w-2.5" /> Vetted
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-slate-400 text-[11px] block mt-1">{prov.baseLocation}</span>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <div className="flex items-center gap-0.5 text-purple-400 text-xs justify-end font-bold">
                                        <Star className="h-3 w-3 fill-purple-500" />
                                        <span>{prov.rating}</span>
                                      </div>
                                      <span className="text-[10px] text-slate-500 font-mono">{prov.reviewsCount} reviews</span>
                                    </div>
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap justify-between items-center gap-2 text-[11px]">
                                    <span className="text-slate-400 font-mono">Distance: <strong className="text-slate-200">{distance} km</strong></span>
                                    <div className="flex gap-1">
                                      {prov.services.includes('carbon_cleaning') && (
                                        <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] text-purple-400 font-mono">HHO Tech</span>
                                      )}
                                      {prov.services.includes('ceramic_coating') && (
                                        <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] text-fuchsia-400 font-mono">Ceramic</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Navigation to step 2 */}
                      {selectedProvider && (
                        <div className="flex justify-end pt-4">
                          <button
                            onClick={() => setBookingStep('configure')}
                            className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 flex items-center gap-2 shadow-lg shadow-purple-500/20 transition"
                          >
                            Configure Custom Package <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUB-STEP: Configure Package */}
                  {bookingStep === 'configure' && selectedProvider && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-6">
                        {/* Select Target Vehicle */}
                        <div className="bg-slate-950 p-5 rounded-xl border border-purple-950/30 shadow-lg">
                          <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-3 flex items-center gap-2">
                            <Car className="h-4.5 w-4.5 text-purple-400" />
                            Step 1: Select Active Registered Asset
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {vehicles.map(car => (
                              <div
                                key={car.id}
                                onClick={() => setSelectedVehicleId(car.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition ${selectedVehicleId === car.id ? 'bg-purple-950/20 border-purple-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                              >
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-white">{car.make} {car.model}</span>
                                  <span className="font-mono text-[10px] text-slate-400">{car.plate}</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                                  <span>Engine: {car.engineSize}</span>
                                  <span>Cat: {car.category}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Select Custom Add-ons */}
                        <div className="bg-slate-950 p-5 rounded-xl border border-purple-950/30 shadow-lg">
                          <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-3 flex items-center gap-2">
                            <Zap className="h-4.5 w-4.5 text-purple-400" />
                            Step 2: Core Treatment & Custom Options
                          </h3>
                          <div className="space-y-2">
                            {selectedProvider.services.map(srvId => {
                              const label = srvId === 'carbon_cleaning' ? 'Engine Hydrogen Carbon Cleaning (HHO)' :
                                srvId === 'polishing' ? 'Exterior Paint Correction & Polish' :
                                  srvId === 'ceramic_coating' ? 'Multi-Layer Ceramic Coating Shield' : 'Deep Interior Clean & Sanitization';

                              const priceEstimate = calculateDynamicPrice(selectedProvider, [srvId], selectedVehicleId);

                              return (
                                <label
                                  key={srvId}
                                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${selectedServices.includes(srvId) ? 'bg-slate-900 border-purple-500/60' : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      checked={selectedServices.includes(srvId)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedServices(prev => [...prev, srvId]);
                                        } else {
                                          setSelectedServices(prev => prev.filter(s => s !== srvId));
                                        }
                                      }}
                                      className="rounded border-slate-800 text-purple-500 focus:ring-transparent"
                                    />
                                    <div>
                                      <span className="text-xs font-semibold text-white block">{label}</span>
                                      <span className="text-[10px] text-slate-400 block">Calculated based on your vehicle class profile</span>
                                    </div>
                                  </div>
                                  <span className="text-xs font-bold font-mono text-purple-400">RM {priceEstimate}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Schedule Selection */}
                        <div className="bg-slate-950 p-5 rounded-xl border border-purple-950/30 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-lg">
                          <div>
                            <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Appointment Date</label>
                            <input
                              type="date"
                              value={appointmentDate}
                              onChange={(e) => setAppointmentDate(e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded w-full py-1.5 px-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Preferred Slot</label>
                            <select
                              value={appointmentTime}
                              onChange={(e) => setAppointmentTime(e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded w-full py-1.5 px-2 text-xs text-white"
                            >
                              <option value="09:00">09:00 AM (Morning Slot)</option>
                              <option value="11:30">11:30 AM (Midday Slot)</option>
                              <option value="14:00">02:00 PM (Afternoon Slot)</option>
                              <option value="16:30">04:30 PM (Evening Slot)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Right Booking Sidebar Summary Card */}
                      <div className="bg-slate-950 p-5 rounded-xl border border-purple-950/30 h-fit space-y-4 shadow-lg">
                        <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase border-b border-slate-800 pb-2">Booking Summary</h4>

                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Technician:</span>
                            <span className="text-slate-200 font-semibold">{selectedProvider.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Target Car:</span>
                            <span className="text-slate-200 font-semibold">
                              {vehicles.find(v => v.id === selectedVehicleId)?.make} {vehicles.find(v => v.id === selectedVehicleId)?.model}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Location Address:</span>
                            <span className="text-slate-200 text-right truncate max-w-[150px]">{customerAddress}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Distance:</span>
                            <span className="text-slate-200 font-mono font-bold">{calculateDistance(selectedProvider.baseLocation)} KM</span>
                          </div>
                                                    <div className="flex justify-between">
                            <span className="text-slate-400">
                              Travel Fee:
                            </span>

                            <span className="text-orange-400 font-bold font-mono">
                              RM {calculateTravelFee(selectedProvider?.baseLocation)}

                            </span>
                          </div>

                          <div className="border-t border-slate-800 pt-3">
                            <span className="text-[10px] text-slate-500 block">SERVICES DETAILED:</span>
                            {selectedServices.map(s => (
                              <div key={s} className="flex justify-between text-[11px] mt-1 text-slate-300">
                                <span>• {s.replace('_', ' ')}</span>
                                <span className="font-mono">RM {calculateDynamicPrice(selectedProvider, [s], selectedVehicleId)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline text-white">
                            <span className="font-bold">Estimated Total:</span>
                            <span className="text-lg font-mono font-black text-purple-400">
                              RM {
                                calculateDynamicPrice(
                                  selectedProvider,
                                  selectedServices,
                                  selectedVehicleId
                                ) + calculateTravelFee(selectedProvider?.baseLocation)
                              }
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                          <button
                            onClick={() => setBookingStep('payment')}
                            disabled={selectedServices.length === 0}
                            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs tracking-wider uppercase shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5 transition"
                          >
                            <CreditCard className="h-4 w-4" />
                            Proceed to Escrow Checkout
                          </button>
                          <button
                            onClick={() => setBookingStep('search')}
                            className="w-full py-1.5 text-[10px] text-slate-400 hover:text-white uppercase tracking-wider font-mono text-center"
                          >
                            Go Back
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-STEP: Escrow Stripe Gateway Payment */}
                  {bookingStep === 'payment' && selectedProvider && (
                    <div className="max-w-md mx-auto bg-slate-950 rounded-xl border border-purple-950/30 p-6 space-y-6 shadow-2xl">
                      <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2">
                          <Lock className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-white text-base">Escrow Payment Gateway</h3>
                        <p className="text-[11px] text-slate-400">Your funds are protected. Payouts are dispatched automatically once the technician uploads the proof-of-work.</p>
                      </div>

                      <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 text-xs space-y-2.5">
                        <div className="flex justify-between text-slate-300">
                          <span>Merchant:</span>
                          <span className="font-semibold text-white">UTP Vehicle Marketplace Sdn Bhd</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Transaction Ref:</span>
                          <span className="font-mono text-slate-400">TXN-{Math.floor(100000 + Math.random() * 900000)}</span>
                        </div>
                        <div className="flex justify-between items-center text-white border-t border-slate-800 pt-2 mt-2 font-bold">
                          <span>Total Escrow Amount:</span>
                          <span className="text-base text-purple-400 font-mono">
                            RM {
                              calculateDynamicPrice(
                                selectedProvider,
                                selectedServices,
                                selectedVehicleId
                              ) + calculateTravelFee(selectedProvider?.baseLocation)
                            }
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Select Payment Protocol</label>
                          <select className="bg-slate-900 border border-slate-800 rounded w-full py-1.5 px-2 text-white">
                            <option>Online Banking FPX (Malaysia Integrated)</option>
                            <option>Visa / Mastercard / Credit Card</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Card / Bank Account Details</label>
                          <input
                            type="text"
                            placeholder="Simulated secure credential block"
                            disabled
                            className="bg-slate-900/50 border border-slate-800 rounded w-full py-1.5 px-2 text-slate-500 select-none"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleCheckoutSubmit}
                        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg text-xs tracking-wider uppercase shadow-lg shadow-purple-500/20 hover:brightness-110 flex items-center justify-center gap-1.5 transition"
                      >
                        <Lock className="h-4 w-4" />
                        Authorize Payment & Bind Booking
                      </button>
                    </div>
                  )}

                  {/* SUB-STEP: Confirmation Success */}
                  {bookingStep === 'confirmed' && (
                    <div className="max-w-md mx-auto bg-slate-950 rounded-xl border border-purple-950/30 p-8 text-center space-y-4 shadow-2xl">
                      <div className="h-12 w-12 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto">
                        <Check className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-white text-lg">Booking & Payment Confirmed!</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Your mobile technician has been assigned and notified. Dynamic routing has mapped their schedule. Watch your "Live Service Monitor" on the dashboard for updates!
                      </p>

                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={() => { setActiveTab('dashboard'); }}
                          className="w-full py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-lg text-xs transition"
                        >
                          Go to My Dashboard
                        </button>
                        <button
                          onClick={() => { setBookingStep('search'); setSelectedProvider(null); }}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg text-xs border border-slate-800 transition"
                        >
                          Book Another Service
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: VEHICLE ASSET MANAGEMENT */}
              {activeTab === 'vehicles' && (
                <div className="space-y-6">
                  <div className="bg-slate-950 rounded-xl border border-purple-950/30 p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
                      <Plus className="h-4.5 w-4.5 text-purple-400" />
                      Register New Vehicle Profile
                    </h3>

                    <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Make / Brand</label>
                        <input
                          type="text"
                          placeholder="e.g. Proton, Perodua, Toyota"
                          value={newVehicleMake}
                          onChange={(e) => setNewVehicleMake(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded w-full py-1.5 px-2 text-xs text-white focus:border-purple-500/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Model Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Saga, Myvi, Vios"
                          value={newVehicleModel}
                          onChange={(e) => setNewVehicleModel(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded w-full py-1.5 px-2 text-xs text-white focus:border-purple-500/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">License Plate No.</label>
                        <input
                          type="text"
                          placeholder="e.g. VEE 2011"
                          value={newVehiclePlate}
                          onChange={(e) => setNewVehiclePlate(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded w-full py-1.5 px-2 text-xs text-white focus:border-purple-500/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Manufacturing Year</label>
                        <input
                          type="number"
                          placeholder="e.g. 2021"
                          value={newVehicleYear}
                          onChange={(e) => setNewVehicleYear(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded w-full py-1.5 px-2 text-xs text-white focus:border-purple-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Vehicle Classification</label>
                        <select
                          value={newVehicleCategory}
                          onChange={(e) => setNewVehicleCategory(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded w-full py-1.5 px-2 text-xs text-white"
                        >
                          <option value="Hatchback">Hatchback (Small)</option>
                          <option value="Sedan">Sedan (Medium)</option>
                          <option value="SUV">SUV (Large)</option>
                          <option value="MPV">MPV (Extra Large)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Engine Size / Capacity</label>
                        <select
                          value={newVehicleEngine}
                          onChange={(e) => setNewVehicleEngine(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded w-full py-1.5 px-2 text-xs text-white"
                        >
                          <option value="1.3L">Below 1.5L (e.g. Myvi, Saga)</option>
                          <option value="2.0L">1.6L - 2.5L (e.g. Civic, Camry)</option>
                          <option value="3.0L">Above 2.5L (e.g. Hilux, Alphard)</option>
                        </select>
                      </div>

                      <div className="md:col-span-3 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-purple-600 text-white font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-purple-500 shadow flex items-center gap-1 transition"
                        >
                          <Plus className="h-4 w-4" /> Add Asset
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Registered Assets Table list */}
                  <div className="bg-slate-950 rounded-xl border border-purple-950/30 p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">Current Configured Assets ({vehicles.length})</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-300">
                        <thead className="text-[10px] bg-slate-900 text-slate-500 uppercase font-mono border-b border-purple-950/20">
                          <tr>
                            <th className="px-4 py-3">Vehicle</th>
                            <th className="px-4 py-3">Plate Number</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Engine Displacement</th>
                            <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {vehicles.map(car => (
                            <tr key={car.id} className="hover:bg-slate-900/40">
                              <td className="px-4 py-3 font-semibold text-white">{car.make} {car.model} ({car.year})</td>
                              <td className="px-4 py-3 font-mono">{car.plate}</td>
                              <td className="px-4 py-3">{car.category}</td>
                              <td className="px-4 py-3 font-mono">{car.engineSize}</td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleDeleteVehicle(car.id)}
                                  className="p-1 text-rose-400 hover:bg-rose-950/40 rounded transition"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CARBON CALCULATOR */}
              {activeTab === 'carbon_calculator' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-950 p-6 rounded-xl border border-purple-950/30 shadow-lg">
                    <div className="max-w-2xl">
                      <h3 className="text-base font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-400" />
                        Engine CO2 Emission & Fuel Restoration Assistant
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Hydrogen Carbon Cleaning (HHO) acts as a preventive maintenance procedure. Introducing HHO gas into the engine combustion path removes accumulated hard carbon scale, restoring vehicle fuel combustion optimization back by approximately 10% to 15%.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Annual Distance Driven (Kilometers)</label>
                          <input
                            type="range"
                            min="5000"
                            max="50000"
                            step="1000"
                            value={annualKm}
                            onChange={(e) => setAnnualKm(parseInt(e.target.value))}
                            className="w-full accent-purple-500"
                          />
                          <div className="flex justify-between text-xs font-mono mt-1 text-slate-300">
                            <span>5,000 km</span>
                            <span className="font-bold text-purple-400">{annualKm.toLocaleString()} km</span>
                            <span>50,000 km</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Average Vehicle Fuel Consumption (L/100km)</label>
                          <input
                            type="range"
                            min="5"
                            max="15"
                            step="0.5"
                            value={averageFuelEfficiency}
                            onChange={(e) => setAverageFuelEfficiency(parseFloat(e.target.value))}
                            className="w-full accent-purple-500"
                          />
                          <div className="flex justify-between text-xs font-mono mt-1 text-slate-300">
                            <span>5.0 L/100km</span>
                            <span className="font-bold text-purple-400">{averageFuelEfficiency} L/100km</span>
                            <span>15.0 L/100km</span>
                          </div>
                        </div>
                      </div>

                      {/* Carbon results calculations */}
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-purple-950/20 flex flex-col justify-between shadow-inner">
                        <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase border-b border-slate-800 pb-2">Estimated Annual Savings (12% restoration)</h4>

                        <div className="space-y-3 py-3">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-slate-400">Restored Fuel Savings:</span>
                            <span className="text-lg font-mono font-bold text-emerald-400">
                              RM {((annualKm * (averageFuelEfficiency / 100) * 0.12) * 2.05).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-slate-400">CO2 Emissions Preventive Impact:</span>
                            <span className="text-lg font-mono font-bold text-purple-400">
                              {((annualKm * (averageFuelEfficiency / 100) * 0.12) * 2.3).toFixed(1)} KG Saved
                            </span>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-500 bg-slate-950 p-2.5 rounded border border-slate-800 leading-relaxed font-mono">
                          *Calculation Metrics: Malaysian RON95 Fuel fixed average rate at RM 2.05/L. Gasoline chemical combustion emits ~2.3kg of carbon dioxide per litre consumed.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ==============================================
              SERVICE PROVIDER INTERFACES
              ============================================== */}

          {currentRole === 'provider' && (
            <>
              {/* TAB: PROVIDER DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* KPI Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-950 border border-purple-950/40 p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <span className="block text-[10px] text-slate-400 tracking-wider font-mono">MONTHLY EARNINGS</span>
                        <span className="text-2xl font-bold text-white">RM 3,120</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-purple-950 text-purple-400">
                        <DollarSign className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-purple-950/40 p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <span className="block text-[10px] text-slate-400 tracking-wider font-mono">COMPLETED RUNS</span>
                        <span className="text-2xl font-bold text-emerald-400">42 Jobs</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-purple-950/40 p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <span className="block text-[10px] text-slate-400 tracking-wider font-mono">PROVIDER RATING</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-5 w-5 text-purple-400 fill-purple-400" />
                          <span className="text-xl font-bold text-white">4.9</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-purple-950/40 p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <span className="block text-[10px] text-slate-400 tracking-wider font-mono">HHO REAGENT LEVEL</span>
                        <span className="text-2xl font-bold text-purple-400">82%</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-purple-950/50 text-purple-300">
                        <Droplet className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {/* Revenue Ledger charts */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-purple-950/30 shadow-lg">
                    <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-4">Historical Sales Performance (Monthly Trend)</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            { month: 'Jan', earnings: 1800, jobs: 20 },
                            { month: 'Feb', earnings: 2200, jobs: 24 },
                            { month: 'Mar', earnings: 2100, jobs: 22 },
                            { month: 'Apr', earnings: 2900, jobs: 35 },
                            { month: 'May', earnings: 3120, jobs: 42 },
                          ]}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                          <YAxis stroke="#64748b" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                          <Area type="monotone" dataKey="earnings" stroke="#9333ea" fillOpacity={1} fill="url(#colorEarnings)" name="Earnings (RM)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: MANAGE DAILY RUNS */}
              {activeTab === 'active_bookings' && (
                <div className="space-y-6">
                  <div className="bg-slate-950 rounded-xl border border-purple-950/30 p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
                      <Truck className="h-4.5 w-4.5 text-purple-400" />
                      Pending Assigned Dispatch & Action Center
                    </h3>

                    <div className="space-y-4">
                      {bookings.filter(b => b.status !== 'Completed').map(booking => (
                        <div key={booking.id} className="bg-slate-900 rounded-lg p-5 border border-purple-950/20">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-purple-400 font-bold">{booking.id}</span>
                                <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-850 rounded font-mono text-[10px]">
                                  Current Status: {booking.status}
                                </span>
                              </div>
                              <h4 className="font-semibold text-white text-sm mt-1">{booking.customerName}</h4>
                              <p className="text-slate-400 text-xs mt-0.5">{booking.address}</p>
                            </div>

                            <div className="text-right">
                              <span className="block text-[10px] text-slate-500 font-mono">Assigned Asset</span>
                              <span className="text-white text-xs font-semibold">{booking.vehiclePlate}</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                              <div className="text-xs">
                                <span className="text-slate-400 block">Payout Value:</span>
                                <strong className="text-white font-mono">RM {(booking.totalPrice * 0.88).toFixed(2)}</strong>
                                <span className="text-[9px] text-slate-500 block">(12% Platform Comm. Retained)</span>
                              </div>
                            </div>

                            {/* Simulated workflow state trigger transitions */}
                            <div className="flex gap-2">
                              {booking.status === 'Paid' && (
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'En Route', 50)}
                                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded uppercase tracking-wider transition"
                                >
                                  Dispatch: En Route
                                </button>
                              )}
                              {booking.status === 'En Route' && (
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'In Progress', 80)}
                                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded uppercase tracking-wider transition"
                                >
                                  Arrived & Start Service
                                </button>
                              )}
                              {booking.status === 'In Progress' && (
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'Completed', 100)}
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded uppercase tracking-wider transition"
                                >
                                  Complete & Upload Proof
                                </button>
                              )}
                              <span className="text-slate-555 text-xs font-mono">Time Constraint: Active session locked</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SMART PRICING ASSISTANT */}
              {activeTab === 'smart_pricing' && (
                <div className="space-y-6">
                  {/* Heatmap & competitive helper */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-purple-950/30 shadow-lg">
                    <div className="max-w-xl mb-4">
                      <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-1 flex items-center gap-2">
                        <TrendingUp className="h-4.5 w-4.5 text-purple-400" />
                        Dynamic Smart Pricing Assistant & Hotspots
                      </h3>
                      <p className="text-xs text-slate-400">
                        Our enterprise analytical engine checks the density of vehicle owners inside sub-regions. Expand your operational radius to captures these zones.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <span className="block text-[10px] text-slate-400 font-mono uppercase">Geographical Demand Heatmap</span>
                        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300">Shah Alam (Central Zone)</span>
                            <span className="px-2 py-0.5 bg-fuchsia-950/40 text-fuchsia-400 border border-fuchsia-800 font-bold text-[9px] rounded uppercase">Critical Demand</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300">Subang Jaya</span>
                            <span className="px-2 py-0.5 bg-purple-950/40 text-purple-400 border border-purple-800 font-bold text-[9px] rounded uppercase">High Demand</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300">Seri Iskandar (UTP Surroundings)</span>
                            <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-800 font-bold text-[9px] rounded uppercase">Steady</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-4 rounded-xl border border-purple-950/20 flex flex-col justify-between shadow-inner">
                        <span className="block text-[10px] text-purple-400 font-mono font-bold">ENTERPRISE SYSTEM INSIGHT:</span>
                        <p className="text-xs text-slate-300 leading-relaxed py-2">
                          "Based on May 2026 scheduling logs, raising carbon cleaning package rates by <strong className="text-purple-400">10%</strong> in Shah Alam retains booking consistency due to low direct competition."
                        </p>
                        <button className="w-full py-2 bg-purple-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-purple-500 transition shadow-lg shadow-purple-500/10">
                          Adopt Recommended Price Grid
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ==============================================
              SYSTEM ADMINISTRATOR INTERFACES
              ============================================== */}

          {currentRole === 'admin' && (
            <>
              {/* TAB: SYSTEM ADMIN DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Administrative KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-950 border border-purple-950/40 p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <span className="block text-[10px] text-slate-400 tracking-wider font-mono">GROSS TRANSACTION</span>
                        <span className="text-xl font-bold text-white">RM 500,000</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-purple-950/40 p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <span className="block text-[10px] text-slate-400 tracking-wider font-mono">COMMISSION GTV CUT (12%)</span>
                        <span className="text-xl font-bold text-purple-400 font-mono">RM 60,000</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-purple-950/40 text-purple-300">
                        <DollarSign className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-purple-950/40 p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <span className="block text-[10px] text-slate-400 tracking-wider font-mono">VETTED PROVIDERS</span>
                        <span className="text-xl font-bold text-white">50 Active</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-purple-950 text-purple-400">
                        <Award className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-purple-950/40 p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <span className="block text-[10px] text-slate-400 tracking-wider font-mono">ACTIVE SYSTEM ALERTS</span>
                        <span className="text-xl font-bold text-emerald-400">0 Safe</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400">
                        <Shield className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {/* Operational Ledger Analysis */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-purple-950/30 shadow-lg">
                    <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-4">Financial Ledger Distribution (Platform Splits)</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { tier: 'Tier 1 (15%)', platform: 1500, technicians: 8500 },
                            { tier: 'Tier 2 (12%)', platform: 1200, technicians: 8800 },
                            { tier: 'Tier 3 (10%)', platform: 1000, technicians: 9000 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="tier" stroke="#64748b" fontSize={11} />
                          <YAxis stroke="#64748b" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                          <Legend />
                          <Bar dataKey="platform" fill="#8b5cf6" name="Platform Revenue Cut (RM)" />
                          <Bar dataKey="technicians" fill="#3b82f6" name="Direct Technician Payout (RM)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: VENDOR VETTING */}
              {activeTab === 'vendor_vetting' && (
                <div className="space-y-6">
                  <div className="bg-slate-950 rounded-xl border border-purple-950/30 p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">Vendor Quality & Machine Certification Audit</h3>
                    <div className="space-y-4">
                      {providers.map(prov => (
                        <div key={prov.id} className="bg-slate-900 rounded-lg p-4 border border-purple-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-white text-sm">{prov.name}</h4>
                            <p className="text-slate-400 text-xs mt-0.5">Assigned Operator: <strong>{prov.owner}</strong></p>
                            <p className="text-[11px] text-slate-500 font-mono mt-1">HHO Machine Class: <strong className="text-purple-400">{prov.hhoMachineModel}</strong></p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-300">
                              Certification Status:
                            </span>
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase ${prov.certified ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-rose-950 text-rose-400'}`}>
                              {prov.certified ? 'Verified Standard' : 'Vetting Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: COMMISSION SPLIT LEDGER */}
              {activeTab === 'commission_split' && (
                <div className="bg-slate-950 rounded-xl border border-purple-950/30 p-5 space-y-4 shadow-lg">
                  <h3 className="text-sm font-bold text-white tracking-wider uppercase">Projected Annual Platform Profitability</h3>
                  <div className="bg-slate-900 p-4 rounded-xl border border-purple-950/10 space-y-3 text-xs leading-relaxed">
                    <p>
                       <strong></strong><strong></strong>:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                      <li>Active Mobile Service Providers: <strong>50 providers</strong></li>
                      <li>Average Monthly Bookings per Provider: <strong>40 jobs/month</strong></li>
                      <li>Average Booking Value: <strong>RM 250</strong></li>
                      <li>Assumed Average Commission Rate: <strong>12% (Tier 2)</strong></li>
                    </ul>

                    <div className="h-px bg-slate-800 my-2"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-3 bg-slate-950 rounded border border-purple-950/25 text-xs">
                        <span className="text-slate-400 block font-mono">MONTHLY TRANSACTION VOLUME</span>
                        <strong className="text-lg text-white font-mono">2,000 Bookings / Month</strong>
                      </div>
                      <div className="p-3 bg-slate-950 rounded border border-purple-950/25 text-xs">
                        <span className="text-slate-400 block font-mono">GROSS TRANSACTION VOLUME (GTV)</span>
                        <strong className="text-lg text-purple-400 font-mono">RM 500,000 / Month</strong>
                      </div>
                      <div className="p-3 bg-slate-950 rounded border border-purple-950/25 text-xs">
                        <span className="text-slate-400 block font-mono">MONTHLY PLATFORM COMMISSION</span>
                        <strong className="text-lg text-emerald-400 font-mono">RM 60,000 / Month</strong>
                      </div>
                      <div className="p-3 bg-slate-950 rounded border border-purple-950/25 text-xs">
                        <span className="text-slate-400 block font-mono">ANNUAL GROSS REVENUE CAP</span>
                        <strong className="text-lg text-indigo-400 font-mono">RM 720,000 / Year</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ==============================================
              COMMON SECTION: ENTERPRISE AUDIT LOGS PANEL
              ============================================== */}

          {activeTab === 'audit_logs' && (
            <div className="bg-slate-950 rounded-xl border border-purple-950/30 p-5 space-y-4 shadow-lg">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-purple-400" />
                    System Immutable Security Audit Logs
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Records user sessions, workflow state updates, and Stripe checkout transactions.</p>
                </div>
                <button
                  onClick={() => setAuditLogs(prev => [
                    { id: `L-${Math.floor(1000 + Math.random() * 9000)}`, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + 'Z', category: "AUDIT", user: "admin", event: "Admin manually verified security checksum integrity of Group 1 Mobile Vehicle Detailing & Carbon Cleaning Marketplace Report.docx workflow compliance records", status: "SUCCESS" },
                    ...prev
                  ])}
                  className="px-2.5 py-1 bg-slate-900 border border-purple-950/40 text-purple-300 font-mono text-[10px] rounded hover:text-white transition"
                >
                  Force Integrity Check
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left text-slate-300 font-mono">
                  <thead className="bg-slate-900 text-slate-500 uppercase font-mono border-b border-purple-950/20">
                    <tr>
                      <th className="px-3 py-2">Log ID</th>
                      <th className="px-3 py-2">Timestamp</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">User Index</th>
                      <th className="px-3 py-2">Event Action Context</th>
                      <th className="px-3 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-900/40">
                        <td className="px-3 py-2 text-purple-400 font-bold">{log.id}</td>
                        <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                        <td className="px-3 py-2">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${log.category === 'SECURITY' ? 'bg-red-950 text-red-400 border border-red-850' :
                            log.category === 'TRANSACTION' ? 'bg-emerald-950 text-emerald-400 border border-emerald-850' : 'bg-slate-850 text-slate-400'
                            }`}>
                            {log.category}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-200">{log.user}</td>
                        <td className="px-3 py-2 text-slate-300 max-w-[250px] truncate" title={log.event}>{log.event}</td>
                        <td className="px-3 py-2 text-right text-emerald-400 font-bold">{log.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================
              CUSTOMER FEEDBACK & COMPLETED JOBS (Dynamic Reviews Trigger)
              ============================================== */}

          {currentRole === 'customer' && bookings.some(b => b.status === 'Completed' && !b.reviewRating) && (
            <div className="bg-slate-950 p-5 rounded-xl border border-purple-950/30 space-y-4 shadow-lg animate-pulse">
              <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase flex items-center gap-1.5">
                <Star className="h-4.5 w-4.5 text-purple-400 fill-purple-400" />
                Pending Customer Satisfaction Feedback Review
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide feedback to ensure consistent on-site chemical application and technician safety standards.
              </p>

              {bookings.filter(b => b.status === 'Completed' && !b.reviewRating).map(booking => (
                <div key={booking.id} className="bg-slate-900/60 p-4 rounded-lg border border-purple-950/10">
                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className="font-bold text-white">{booking.providerName} ({booking.vehiclePlate})</span>
                    <span className="text-slate-555 font-mono">{booking.date}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-slate-400">Your Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(stars => (
                        <button
                          key={stars}
                          onClick={() => handleSubmitReview(booking.id, stars, "Terrific service! Clean engine and sparkling paint correction.")}
                          className="hover:scale-110 transition duration-150"
                        >
                          <Star className="h-5 w-5 text-purple-400 fill-purple-400 hover:fill-purple-300" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-purple-950/30 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono">
          <div>
            <p>© 2026 Universiti Teknologi Petronas (UTP). Built for Enterprise System Development [TEB3323].</p>
          </div>
          <div className="flex gap-4">
            <span>Student ID: 22005760 / 22005830</span>
            <span>May Semester 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}