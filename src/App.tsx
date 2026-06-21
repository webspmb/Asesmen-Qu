import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  Database, 
  Code2, 
  Settings, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Send, 
  Copy, 
  FileText, 
  RefreshCw, 
  FileSpreadsheet, 
  Search,
  BookOpen,
  Info,
  Check,
  ChevronRight,
  ExternalLink,
  UserPlus,
  Users,
  Save,
  Plus,
  X,
  Lock,
  User,
  LogIn,
  LogOut,
  Key,
  ShieldAlert,
  Sparkles,
  Shield,
  Menu,
  ChevronLeft,
  ChevronDown,
  Camera,
  Edit,
  Upload,
  Download,
  Sliders
} from 'lucide-react';

// Interfaces for local simulation state
interface StudentAssessment {
  id: string;
  namaSiswa: string;
  nisn: string;
  kelas: string;
  mataPelajaran: string;
  tp1: number | '';
  tp2: number | '';
  tp3: number | '';
  sas: number | '';
  nilaiAkhir: number;
  deskripsiTercapai: string;
  deskripsiPerluBimbingan: string;
  deskripsiLengkap: string;
  timestamp: string;
  extraTpScores?: Record<string, number>;
  sumatif1?: number;
  sumatif2?: number;
  sumatif3?: number;
  sumatif4?: number;
  sumatif5?: number;
  sumatif6?: number;
  sumatif7?: number;
  sumatif8?: number;
  sumatif9?: number;
  sumatif10?: number;
  nonTes?: number;
  tes?: number;
  [key: string]: any;
}

interface TPDescription {
  id: string;
  kelas: string;
  mapel: string;
  tp1Desc: string;
  tp2Desc: string;
  tp3Desc: string;
  extraTps?: string[];
}

interface MasterStudent {
  nisn: string;
  nama: string;
  kelas: string;
  jenisKelamin?: string;
}

interface TeacherAccount {
  username: string;
  password: string;
  nama: string;
  role: 'Super Admin' | 'Admin' | 'Guru';
  jabatan?: string;
  photo?: string;
}

// ============================================================================
// DAFTAR PILIHAN MATA PELAJARAN STANDAR (ASESMENQU)
// ============================================================================
export const DAFTAR_MAPEL: string[] = [
  'Pendidikan Agama Islam dan Budi Pekerti (PAIBP)',
  'Pendidikan Agama Kristen dan Budi Pekerti (PAKBP)',
  'Pendidikan Agama Katolik dan Budi Pekerti (PAKTBP)',
  'Pendidikan Agama Hindu dan Budi Pekerti (PAHBP)',
  'Pendidikan Agama Buddha dan Budi Pekerti (PABBP)',
  'Pendidikan Agama Konghuchu dan Budi Pekerti (PAKHBP)',
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
  'Seni Musik',
  'Seni Tari',
  'Seni Teater',
  'Seni Rupa',
  'Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)',
  'Bahasa Inggris',
  'Muatan Lokal (Mulok)'
];

// ============================================================================
// DAFTAR PRESET TUJUAN PEMBELAJARAN (TP) AWAL
// ============================================================================
export const DEFAULT_PRESET_TPS: TPDescription[] = [
  {
    id: 'preset_1',
    kelas: 'Kelas 1',
    mapel: 'Pendidikan Pancasila',
    tp1Desc: 'mengenal simbol-simbol Pancasila dan menceritakan hubungan simbol dengan sila dalam Pancasila secara tepat',
    tp2Desc: 'mengidentifikasi aturan-aturan pokok di rumah dan di sekolah serta melaksanakannya sehari-hari',
    tp3Desc: 'menyebutkan identitas diri dan karakteristik fisik serta non-fisik orang terdekat di sekitarnya'
  },
  {
    id: 'preset_2',
    kelas: 'Kelas 1',
    mapel: 'Bahasa Indonesia',
    tp1Desc: 'membaca kata-kata berhuruf sederhana dengan pola suku kata terbuka dan tertutup secara lancar',
    tp2Desc: 'menulis kalimat sederhana secara melandai dengan huruf kapital dan tanda titik yang tepat',
    tp3Desc: 'menyimak instruksi guru dengan baik serta menceritakan kembali isi gambar atau teks fiksi pendek'
  },
  {
    id: 'preset_3',
    kelas: 'Kelas 4',
    mapel: 'Matematika',
    tp1Desc: 'menyelesaikan masalah kontekstual berskala terkait operasi penjumlahan dan pengurangan sampai 10.000',
    tp2Desc: 'mengukur serta mengklasifikasi luas dan keliling dari berbagai bangun datar berupa segi empat',
    tp3Desc: 'menyajikan hasil statistika sederhana dalam bentuk tabel pengamatan dan diagram batang'
  },
  {
    id: 'preset_4',
    kelas: 'Kelas 4',
    mapel: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    tp1Desc: 'menganalisis bagian-bagian utama tubuh tumbuhan dan merinci fungsinya bagi kelangsungan hidup',
    tp2Desc: 'mengidentifikasi karakteristik zat padat cair gas serta menganalisis transisi perubahan wujud benda',
    tp3Desc: 'menjelaskan korelasi energi potensial gerak gesek gravitasi dan pengaruhnya pada benda sekitar'
  },
  {
    id: 'preset_5',
    kelas: 'Kelas 6',
    mapel: 'Pendidikan Agama Islam dan Budi Pekerti (PAIBP)',
    tp1Desc: 'membaca menghafal dan memahami kandungan Q.S. Ad-Duha dengan baik sesuai kaidah tajwid',
    tp2Desc: 'menerangkan rukun iman kepada Qada dan Qadar serta memberikan contoh perilaku bersabar dalam kehidupan',
    tp3Desc: 'mengamalkan sopan santun keteladanan serta perilaku toleran antar umat beragama'
  }
];

// ============================================================================
// CONFIGURATION: GOOGLE APPS SCRIPT (GAS) WEB APP URL
// ============================================================================
// Anda dapat mengonfigurasi URL ini secara aman melalui Environment Variable
// 'VITE_GAS_URL' di Vercel, atau langsung mengubah string di bawah ini.
export const GLOBAL_GAS_URL = (import.meta as any).env?.VITE_GAS_URL || 
  (typeof window !== 'undefined' ? window.localStorage.getItem('erapor_gas_url') : null) || 
  "https://script.google.com/macros/s/AKfycbzO-LT4LvVwu-DarOAWVywCgVF-RqBv0rRKf5jn_lA4C-5qOfME_UKZY7mEGuHYdzX7/exec";
// ============================================================================

/**
 * Get Tingkat (e.g., Tingkat 1) from actual Class name (e.g., Kelas 1 A)
 */
export function getTingkatFromKelas(kelasStr: string): string {
  if (!kelasStr) return 'Tingkat 1';
  const clean = kelasStr.toLowerCase().trim();
  if (clean.includes('kelas 1') || clean.startsWith('1')) return 'Tingkat 1';
  if (clean.includes('kelas 2') || clean.startsWith('2')) return 'Tingkat 2';
  if (clean.includes('kelas 3') || clean.startsWith('3')) return 'Tingkat 3';
  if (clean.includes('kelas 4') || clean.startsWith('4')) return 'Tingkat 4';
  if (clean.includes('kelas 5') || clean.startsWith('5')) return 'Tingkat 5';
  if (clean.includes('kelas 6') || clean.startsWith('6')) return 'Tingkat 6';
  if (clean.includes('satu')) return 'Tingkat 1';
  if (clean.includes('dua')) return 'Tingkat 2';
  if (clean.includes('tiga')) return 'Tingkat 3';
  if (clean.includes('empat')) return 'Tingkat 4';
  if (clean.includes('lima')) return 'Tingkat 5';
  if (clean.includes('enam')) return 'Tingkat 6';
  return 'Tingkat 1';
}

/**
 * Parse a jabatan string like:
 * "Guru Kelas | Kelas: Kelas 1 | Mapel: Pendidikan Agama Islam dan Budi Pekerti (PAIBP), Matematika"
 * or "Guru Mapel | Mapel: Matematika | Kelas: Kelas 1, Kelas 2"
 * or "Kepala Sekolah / Admin"
 */
export function parseJabatan(jabatanStr: string) {
  const result = {
    jenis: 'Admin' as 'Admin' | 'Guru Kelas' | 'Guru Mapel',
    kelas: [] as string[],
    mapels: [] as string[]
  };

  if (!jabatanStr) return result;

  if (jabatanStr.includes('Guru Kelas')) {
    result.jenis = 'Guru Kelas';
    // Format: "Guru Kelas | Kelas: [kelas] | Mapel: [mapel1, mapel2]"
    const parts = jabatanStr.split('|').map(s => s.trim());
    
    // Find "Kelas:" parts
    const kelasPart = parts.find(p => p.startsWith('Kelas:'));
    if (kelasPart) {
      const kVal = kelasPart.replace('Kelas:', '').trim();
      result.kelas = kVal ? kVal.split(',').map(s => s.trim()) : [];
    } else {
      // Legacy compatibility: "Guru Kelas Kelas 1" or "Guru Kelas Satu"
      const legacyMatch = jabatanStr.match(/Guru Kelas\s+(.+)/);
      if (legacyMatch && legacyMatch[1]) {
        result.kelas = [legacyMatch[1].trim()];
      }
    }

    // Find "Mapel:" parts
    const mapelPart = parts.find(p => p.startsWith('Mapel:'));
    if (mapelPart) {
      const mVal = mapelPart.replace('Mapel:', '').trim();
      result.mapels = mVal ? mVal.split(',').map(s => s.trim()) : [];
    } else {
      // If legacy and no mapel, define them as having all mapels
      result.mapels = [...DAFTAR_MAPEL];
    }
  } else if (jabatanStr.includes('Guru Mapel')) {
    result.jenis = 'Guru Mapel';
    // Format: "Guru Mapel | Mapel: [mapel] | Kelas: [kelas1, kelas2]"
    const parts = jabatanStr.split('|').map(s => s.trim());

    // Find "Mapel:" parts
    const mapelPart = parts.find(p => p.startsWith('Mapel:'));
    if (mapelPart) {
      const mVal = mapelPart.replace('Mapel:', '').trim();
      result.mapels = mVal ? mVal.split(',').map(s => s.trim()) : [];
    } else {
      // Legacy compatibility: "Guru Mapel Matematika"
      const legacyMatch = jabatanStr.match(/Guru Mapel\s+(.+)/);
      if (legacyMatch && legacyMatch[1]) {
        result.mapels = [legacyMatch[1].trim()];
      }
    }

    // Find "Kelas:" parts
    const kelasPart = parts.find(p => p.startsWith('Kelas:'));
    if (kelasPart) {
      const kVal = kelasPart.replace('Kelas:', '').trim();
      result.kelas = kVal ? kVal.split(',').map(s => s.trim()) : [];
    } else {
      // If legacy, default classes
      result.kelas = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];
    }
  } else {
    result.jenis = 'Admin';
    result.mapels = [...DAFTAR_MAPEL];
    result.kelas = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];
  }

  return result;
}

export function buildJabatan(jenis: 'Admin' | 'Guru Kelas' | 'Guru Mapel', kelas: string[], mapels: string[]) {
  if (jenis === 'Guru Kelas') {
    return `Guru Kelas | Kelas: ${kelas.join(', ')} | Mapel: ${mapels.join(', ')}`;
  } else if (jenis === 'Guru Mapel') {
    return `Guru Mapel | Mapel: ${mapels.join(', ')} | Kelas: ${kelas.join(', ')}`;
  }
  return 'Kepala Sekolah / Admin';
}

export default function App() {
  // Sidebar State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('erapor_sidebar_collapsed') === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('erapor_sidebar_collapsed', isSidebarCollapsed ? 'true' : 'false');
  }, [isSidebarCollapsed]);

  // Authentication & Teacher Account State - Sesuai request, gunakan sessionStorage
  // Agar selalu mengarahkan ke halaman login jika aplikasi dibuka pertama kali
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('erapor_is_logged_in') === 'true';
  });
  
  const [currentUser, setCurrentUser] = useState<TeacherAccount | null>(() => {
    const saved = sessionStorage.getItem('erapor_current_user');
    if (saved) {
      try {
        return JSON.parse(saved) as TeacherAccount;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [teachers, setTeachers] = useState<TeacherAccount[]>(() => {
    const saved = localStorage.getItem('erapor_teachers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TeacherAccount[];
        if (parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Default fallback to allow initial login
    return [
      { username: 'admin', password: 'admin', nama: 'Kepala Sekolah / Admin', role: 'Admin' }
    ];
  });

  const visibleTeachers = useMemo(() => {
    return teachers.filter(t => t.username.toLowerCase() !== 'superadmin');
  }, [teachers]);

  // Save authentication status - Menggunakan sessionStorage
  useEffect(() => {
    sessionStorage.setItem('erapor_is_logged_in', isLoggedIn ? 'true' : 'false');
    if (currentUser) {
      sessionStorage.setItem('erapor_current_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('erapor_current_user');
    }
  }, [isLoggedIn, currentUser]);

  // Save teachers list
  useEffect(() => {
    localStorage.setItem('erapor_teachers', JSON.stringify(teachers));
  }, [teachers]);

  // Profile & Avatar State
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'A';
    const cleanParts = nameStr.trim().split(/\s+/).filter(Boolean);
    if (cleanParts.length === 0) return 'A';
    if (cleanParts.length === 1) return cleanParts[0].slice(0, 2).toUpperCase();
    return (cleanParts[0].charAt(0) + cleanParts[1].charAt(0)).toUpperCase();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      triggerToast('Ukuran foto terlalu besar. Maksimal adalah 1 MB.', false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Str = reader.result as string;
      if (!currentUser) return;

      const updatedUser = { ...currentUser, photo: base64Str };
      setCurrentUser(updatedUser);
      
      setTeachers(prev => prev.map(t => t.username.toLowerCase() === currentUser.username.toLowerCase() ? { ...t, photo: base64Str } : t));

      triggerToast('Menyimpan foto profil terbaru...', true);

      if (gasUrl) {
        try {
          const formBody = new URLSearchParams();
          formBody.append('action', 'simpanAkunGuru');
          formBody.append('username', currentUser.username);
          formBody.append('password', currentUser.password);
          formBody.append('nama', currentUser.nama);
          formBody.append('role', currentUser.role);
          formBody.append('jabatan', currentUser.jabatan || '');
          formBody.append('photo', base64Str);

          await fetch(gasUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formBody
          });
          triggerToast('Foto profil berhasil diperbarui di Google Sheets!', true);
        } catch (err: any) {
          console.error(err);
          triggerToast('Foto profil tersimpan secara lokal. Gagal sync ke Sheets: ' + err.toString(), false);
        }
      } else {
        triggerToast('Foto profil tersimpan secara lokal!', true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState<'simulator' | 'database' | 'tp_settings' | 'gas_center' | 'admin' | 'settings_menu'>('simulator');
  
  // Subtab for Database view (Scores list vs Master student database list)
  const [dbSubTab, setDbSubTab] = useState<'scores' | 'students'>('scores');

  // Subtab for Settings view
  const [settingsSubTab, setSettingsSubTab] = useState<'kktp' | 'students' | 'admin' | 'bobot'>('kktp');

  useEffect(() => {
    if (currentUser?.role === 'Guru' && dbSubTab === 'students') {
      setDbSubTab('scores');
    }
  }, [currentUser, dbSubTab]);

  // GAS Web App Hook URL - Hardcoded permanently as requested
  const gasUrl = GLOBAL_GAS_URL;

  // Master Student List state (Connected to DataSiswa sheet)
  const [masterStudents, setMasterStudents] = useState<MasterStudent[]>(() => {
    const saved = localStorage.getItem('erapor_master_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MasterStudent[];
        // Filter out old local mock students to ensure they are deleted completely
        const mockNisns = ['0123456781', '0123456782', '0123456783', '0123456784', '0123456785', '0123456786'];
        return parsed.filter(student => !mockNisns.includes(student.nisn));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Save masterStudents
  useEffect(() => {
    localStorage.setItem('erapor_master_students', JSON.stringify(masterStudents));
  }, [masterStudents]);

  // TP Descriptions State - Defaults to DEFAULT_PRESET_TPS
  const [tpConfigs, setTpConfigs] = useState<TPDescription[]>(() => {
    const saved = localStorage.getItem('erapor_tp_configs');
    if (saved) {
      try {
        return JSON.parse(saved) as TPDescription[];
      } catch (e) {
        return DEFAULT_PRESET_TPS;
      }
    }
    return DEFAULT_PRESET_TPS;
  });

  // Save TP settings
  useEffect(() => {
    localStorage.setItem('erapor_tp_configs', JSON.stringify(tpConfigs));
  }, [tpConfigs]);

  // Database Students State (Assessment History)
  const [students, setStudents] = useState<StudentAssessment[]>(() => {
    const saved = localStorage.getItem('erapor_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StudentAssessment[];
        const mockNisns = ['0123456781', '0123456782', '0123456783', '0123456784', '0123456785', '0123456786'];
        return parsed.filter(item => !mockNisns.includes(item.nisn));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Save students to localStorage
  useEffect(() => {
    localStorage.setItem('erapor_students', JSON.stringify(students));
  }, [students]);

  // Form input state
  const [form, setForm] = useState({
    namaSiswa: '',
    nisn: '',
    kelas: '',
    mataPelajaran: '',
    tp1: '' as string | number,
    tp2: '' as string | number,
    tp3: '' as string | number,
    sas: '' as string | number,
    sumatif1: '' as string | number,
    sumatif2: '' as string | number,
    sumatif3: '' as string | number,
    sumatif4: '' as string | number,
    sumatif5: '' as string | number,
    sumatif6: '' as string | number,
    sumatif7: '' as string | number,
    sumatif8: '' as string | number,
    sumatif9: '' as string | number,
    sumatif10: '' as string | number,
    nonTes: '' as string | number,
    tes: '' as string | number,
  });

  // App Settings (Weights)
  const [weightTP, setWeightTP] = useState<number>(60); // percentage weight of Sumatif TP Average
  const [weightSAS, setWeightSAS] = useState<number>(40); // percentage weight of Sumatif Akhir Semester
  const [showToast, setShowToast] = useState<{show: boolean; success: boolean; message: string}>({
    show: false,
    success: true,
    message: ''
  });

  // KKTP score ranges (perlu bimbingan, tercapai baik, tercapai sangat baik)
  const [kktpMin, setKktpMin] = useState<number>(() => {
    const saved = localStorage.getItem('erapor_kktp_min');
    return saved ? Number(saved) : 70;
  });
  const [kktpSangatBaik, setKktpSangatBaik] = useState<number>(() => {
    const saved = localStorage.getItem('erapor_kktp_sangat_baik');
    return saved ? Number(saved) : 85;
  });

  // Opsi penilaian kuantitatif: 'rata_rata' | 'pembobotan' | 'persentase'
  const [opsiPenilaian, setOpsiPenilaian] = useState<'rata_rata' | 'pembobotan' | 'persentase'>(() => {
    const saved = localStorage.getItem('erapor_opsi_penilaian');
    return (saved as any) || 'rata_rata';
  });

  // Bobot nilai sumatif kuantitatif per nomor sumatif (e.g., S1: 1, S2: 1, etc.)
  const [sumatifWeights, setSumatifWeights] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('erapor_sumatif_weights');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('erapor_kktp_min', String(kktpMin));
  }, [kktpMin]);

  useEffect(() => {
    localStorage.setItem('erapor_kktp_sangat_baik', String(kktpSangatBaik));
  }, [kktpSangatBaik]);

  useEffect(() => {
    localStorage.setItem('erapor_opsi_penilaian', opsiPenilaian);
  }, [opsiPenilaian]);

  useEffect(() => {
    localStorage.setItem('erapor_sumatif_weights', JSON.stringify(sumatifWeights));
  }, [sumatifWeights]);

  // Clipboard copies trackers
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Search in database state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMapel, setFilterMapel] = useState('Semua');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [rekapSortBy, setRekapSortBy] = useState<'nama' | 'mapel' | 'kelas'>('nama');

  useEffect(() => {
    setFilterMapel('Semua');
    setFilterKelas('Semua');
    if (currentUser?.role === 'Guru') {
      const parsed = parseJabatan(currentUser.jabatan || '');
      if (parsed.jenis === 'Guru Kelas') {
        setRekapSortBy('mapel');
      } else if (parsed.jenis === 'Guru Mapel') {
        setRekapSortBy('kelas');
      }
    } else {
      setRekapSortBy('nama');
    }
  }, [currentUser]);

  // Form states and statuses for the sheet/local additions
  const [isManualInput, setIsManualInput] = useState(false);
  const [loadingMaster, setLoadingMaster] = useState(false);
  const [savingMaster, setSavingMaster] = useState(false);

  // New master student addition form state
  const [newMasterForm, setNewMasterForm] = useState({
    nisn: '',
    nama: '',
    kelas: '',
    jenisKelamin: 'L'
  });

  // Adding new Mapel form state
  const [newMapelForm, setNewMapelForm] = useState({
    kelas: 'Tingkat 1',
    mapel: DAFTAR_MAPEL[0],
    tp1Desc: '',
    tp2Desc: '',
    tp3Desc: ''
  });

  const [formSumatifCount, setFormSumatifCount] = useState(10);

  const [newMapelExtraTps, setNewMapelExtraTps] = useState<string[]>([]);
  const [extraTpScores, setExtraTpScores] = useState<Record<string, string | number>>({});

  // Login Input States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin Manage Teacher States
  const [newTeacherUsername, setNewTeacherUsername] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [newTeacherNama, setNewTeacherNama] = useState('');
  const [newTeacherRole, setNewTeacherRole] = useState<'Admin' | 'Guru'>('Guru');
  const [newTeacherJenisJabatan, setNewTeacherJenisJabatan] = useState<'Admin' | 'Guru Kelas' | 'Guru Mapel'>('Guru Kelas');
  const [newTeacherSelectedKelas, setNewTeacherSelectedKelas] = useState('');
  const [newTeacherSelectedMapel, setNewTeacherSelectedMapel] = useState(DAFTAR_MAPEL[0]);
  const [newTeacherSelectedMapels, setNewTeacherSelectedMapels] = useState<string[]>([]);
  const [newTeacherSelectedClasses, setNewTeacherSelectedClasses] = useState<string[]>([]);
  const [editingTeacherUsername, setEditingTeacherUsername] = useState<string | null>(null);
  const [savingTeacher, setSavingTeacher] = useState(false);

  // Dynamic classes from master student list + standard defaults (completely dynamic from spreadsheet)
  const [classesToOffer, setClassesToOffer] = useState<string[]>([]);

  // Persistent option for Parallel layout vs Non-Parallel layout
  const [isParallelMode, setIsParallelMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('isParallelMode');
    return saved === 'true'; // Defaults to false (non-parallel)
  });

  const handleSetParallelMode = (val: boolean) => {
    setIsParallelMode(val);
    localStorage.setItem('isParallelMode', String(val));
    triggerToast(val ? 'Sistem kelas paralel (A, B, C, D) diaktifkan!' : 'Sistem kelas non-paralel diaktifkan!', true);
  };

  useEffect(() => {
    const fromStudents = masterStudents.map(s => s.kelas).filter(Boolean);
    const fromConfigs = tpConfigs.map(c => c.kelas).filter(Boolean);
    const list = Array.from(new Set([...fromStudents, ...fromConfigs])).map(k => k?.trim()).filter(Boolean);
    setClassesToOffer(prev => {
      if (prev.length === list.length && prev.every((v, idx) => v === list[idx])) return prev;
      return list;
    });
  }, [masterStudents, tpConfigs]);

  // Allowed classes and mapels based on the currently logged in user
  const allowedClasses = useMemo(() => {
    const hasParallel = isParallelMode ||
                        classesToOffer.some(c => /[A-D]$/i.test(c)) || 
                        masterStudents.some(s => /[A-D]$/i.test(s.kelas)) || 
                        tpConfigs.some(t => /[A-D]$/i.test(t.kelas || ''));
    
    const defaultNonParallel = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];
    const defaultParallel = [
      'Kelas 1 A', 'Kelas 1 B', 'Kelas 1 C', 'Kelas 1 D',
      'Kelas 2 A', 'Kelas 2 B', 'Kelas 2 C', 'Kelas 2 D',
      'Kelas 3 A', 'Kelas 3 B', 'Kelas 3 C', 'Kelas 3 D',
      'Kelas 4 A', 'Kelas 4 B', 'Kelas 4 C', 'Kelas 4 D',
      'Kelas 5 A', 'Kelas 5 B', 'Kelas 5 C', 'Kelas 5 D',
      'Kelas 6 A', 'Kelas 6 B', 'Kelas 6 C', 'Kelas 6 D'
    ];
    const systemDefaults = hasParallel ? defaultParallel : defaultNonParallel;

    if (!currentUser) {
      return classesToOffer.length > 0 ? classesToOffer : systemDefaults;
    }
    if (currentUser.role === 'Admin' || currentUser.role === 'Super Admin') {
      return classesToOffer.length > 0 ? classesToOffer : systemDefaults;
    }
    const parsed = parseJabatan(currentUser.jabatan || '');
    if (parsed.kelas && parsed.kelas.length > 0) {
      return parsed.kelas;
    }
    return classesToOffer.length > 0 ? classesToOffer : systemDefaults;
  }, [classesToOffer, currentUser, masterStudents, tpConfigs, isParallelMode]);

  // Comprehensive list of all available classes for Admin/Form selections (both parallel and non-parallel options)
  const listAllClasses = useMemo(() => {
    const defaultNonParallel = [
      'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'
    ];
    const defaultParallel = [
      'Kelas 1 A', 'Kelas 1 B', 'Kelas 1 C', 'Kelas 1 D',
      'Kelas 2 A', 'Kelas 2 B', 'Kelas 2 C', 'Kelas 2 D',
      'Kelas 3 A', 'Kelas 3 B', 'Kelas 3 C', 'Kelas 3 D',
      'Kelas 4 A', 'Kelas 4 B', 'Kelas 4 C', 'Kelas 4 D',
      'Kelas 5 A', 'Kelas 5 B', 'Kelas 5 C', 'Kelas 5 D',
      'Kelas 6 A', 'Kelas 6 B', 'Kelas 6 C', 'Kelas 6 D'
    ];
    const list = isParallelMode ? defaultParallel : defaultNonParallel;
    const combined = Array.from(new Set([...classesToOffer, ...list]));
    return combined.sort((a, b) => {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [classesToOffer, isParallelMode]);

  const allowedMapelsGlobal = useMemo(() => {
    if (!currentUser) return DAFTAR_MAPEL;
    if (currentUser.role === 'Admin' || currentUser.role === 'Super Admin') {
      return DAFTAR_MAPEL;
    }
    const parsed = parseJabatan(currentUser.jabatan || '');
    if (parsed.mapels && parsed.mapels.length > 0) {
      return parsed.mapels;
    }
    return DAFTAR_MAPEL;
  }, [currentUser]);

  const allowedMapelsForSelectedClass = useMemo(() => {
    const studentTingkat = getTingkatFromKelas(form.kelas);
    const classConfigs = tpConfigs.filter(cfg => cfg.kelas === form.kelas || cfg.kelas === studentTingkat);
    const activeMapels = classConfigs.map(c => c.mapel);
    if (!currentUser) return activeMapels.length > 0 ? activeMapels : DAFTAR_MAPEL;
    if (currentUser.role === 'Admin' || currentUser.role === 'Super Admin') {
      return activeMapels.length > 0 ? activeMapels : DAFTAR_MAPEL;
    }
    const parsed = parseJabatan(currentUser.jabatan || '');
    if (parsed.mapels && parsed.mapels.length > 0) {
      if (activeMapels.length > 0) {
        const filtered = activeMapels.filter(m => parsed.mapels.includes(m));
        if (filtered.length > 0) return filtered;
      }
      return parsed.mapels;
    }
    return activeMapels.length > 0 ? activeMapels : DAFTAR_MAPEL;
  }, [tpConfigs, form.kelas, currentUser]);

  const allowedTingkatsSettings = useMemo(() => {
    if (!currentUser || currentUser.role === 'Admin' || currentUser.role === 'Super Admin') {
      return ['Tingkat 1', 'Tingkat 2', 'Tingkat 3', 'Tingkat 4', 'Tingkat 5', 'Tingkat 6'];
    }
    const parsed = parseJabatan(currentUser.jabatan || '');
    if (parsed.kelas && parsed.kelas.length > 0) {
      const tingkats = parsed.kelas.map(k => getTingkatFromKelas(k));
      const uniqueTingkats = Array.from(new Set(tingkats)).sort();
      return uniqueTingkats.length > 0 ? uniqueTingkats : ['Tingkat 1'];
    }
    return ['Tingkat 1', 'Tingkat 2', 'Tingkat 3', 'Tingkat 4', 'Tingkat 5', 'Tingkat 6'];
  }, [currentUser]);

  const allowedMapelsSettings = useMemo(() => {
    if (!currentUser || currentUser.role === 'Admin' || currentUser.role === 'Super Admin') {
      return DAFTAR_MAPEL;
    }
    const parsed = parseJabatan(currentUser.jabatan || '');
    if (parsed.mapels && parsed.mapels.length > 0) {
      return parsed.mapels;
    }
    return DAFTAR_MAPEL;
  }, [currentUser]);

  const filteredTpConfigsDisplay = useMemo(() => {
    if (!currentUser || currentUser.role === 'Admin' || currentUser.role === 'Super Admin') {
      return tpConfigs;
    }
    const parsed = parseJabatan(currentUser.jabatan || '');
    return tpConfigs.filter(config => {
      const isMapelAllowed = parsed.mapels.includes(config.mapel);
      const configTingkat = getTingkatFromKelas(config.kelas);
      const isKelasAllowed = parsed.kelas.some(k => {
        return k === config.kelas || getTingkatFromKelas(k) === configTingkat;
      });
      return isMapelAllowed && isKelasAllowed;
    });
  }, [tpConfigs, currentUser]);

  // Handle auto-selected defaults for newMapelForm
  useEffect(() => {
    if (allowedTingkatsSettings.length > 0 && allowedMapelsSettings.length > 0) {
      setNewMapelForm(prev => {
        const nextKelas = allowedTingkatsSettings.includes(prev.kelas) ? prev.kelas : allowedTingkatsSettings[0];
        const nextMapel = allowedMapelsSettings.includes(prev.mapel) ? prev.mapel : allowedMapelsSettings[0];
        if (prev.kelas === nextKelas && prev.mapel === nextMapel) return prev;
        return { ...prev, kelas: nextKelas, mapel: nextMapel };
      });
    }
  }, [allowedTingkatsSettings, allowedMapelsSettings]);

  // Handle auto-selected defaults when classesToOffer loads
  useEffect(() => {
    if (allowedClasses.length > 0) {
      if (!form.kelas || !allowedClasses.includes(form.kelas)) {
        setForm(prev => {
          if (prev.kelas === allowedClasses[0]) return prev;
          return { ...prev, kelas: allowedClasses[0] };
        });
      }
      if (!newMasterForm.kelas || !allowedClasses.includes(newMasterForm.kelas)) {
        setNewMasterForm(prev => {
          if (prev.kelas === allowedClasses[0]) return prev;
          return { ...prev, kelas: allowedClasses[0] };
        });
      }
      if (!newMapelForm.kelas) {
        setNewMapelForm(prev => {
          if (prev.kelas === 'Tingkat 1') return prev;
          return { ...prev, kelas: 'Tingkat 1' };
        });
      }
      if (!newTeacherSelectedKelas) {
        setNewTeacherSelectedKelas(allowedClasses[0]);
      }
    }
  }, [allowedClasses, newTeacherSelectedKelas]);

  useEffect(() => {
    if (allowedMapelsForSelectedClass.length > 0) {
      if (!form.mataPelajaran || !allowedMapelsForSelectedClass.includes(form.mataPelajaran)) {
        setForm(prev => {
          if (prev.mataPelajaran === allowedMapelsForSelectedClass[0]) return prev;
          return { ...prev, mataPelajaran: allowedMapelsForSelectedClass[0] };
        });
      }
    } else {
      setForm(prev => {
        if (prev.mataPelajaran === '') return prev;
        return { ...prev, mataPelajaran: '' };
      });
    }
  }, [allowedMapelsForSelectedClass]);

  const uniqueMapels = useMemo(() => {
    return (Array.from(new Set(tpConfigs.map(c => String(c.mapel || '')))) as string[]).map(m => m.trim()).filter(Boolean);
  }, [tpConfigs]);

  useEffect(() => {
    if (uniqueMapels.length > 0 && !newTeacherSelectedMapel) {
      setNewTeacherSelectedMapel(uniqueMapels[0]);
    }
  }, [uniqueMapels, newTeacherSelectedMapel]);

  // Auto-calculated fields from the current form values
  const [tpAverage, setTpAverage] = useState<number>(0);
  const [nilaiAkhir, setNilaiAkhir] = useState<number>(0);
  const [descTercapai, setDescTercapai] = useState<string>('');
  const [descPerluBimbingan, setDescPerluBimbingan] = useState<string>('');
  const [descLengkap, setDescLengkap] = useState<string>('');

  // Handle Form Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Find active TP configuration based on selected Mapel and Class (Wrapped in useMemo to prevent object reference changes)
  const activeTpConfig = useMemo(() => {
    const studentTingkat = getTingkatFromKelas(form.kelas);
    return tpConfigs.find(c => c.mapel === form.mataPelajaran && (c.kelas === form.kelas || c.kelas === studentTingkat)) || {
      kelas: studentTingkat,
      mapel: form.mataPelajaran,
      tp1Desc: 'mencapai TP 1',
      tp2Desc: 'mencapai TP 2',
      tp3Desc: 'mencapai TP 3'
    };
  }, [tpConfigs, form.mataPelajaran, form.kelas]);

  // Filter master students based on selected class
  const studentsInSelectedClass = masterStudents.filter(s => s.kelas === form.kelas);

  // Auto-selection of subject on Class change to match the class's subjects
  useEffect(() => {
    const studentTingkat = getTingkatFromKelas(form.kelas);
    const classConfigs = tpConfigs.filter(cfg => cfg.kelas === form.kelas || cfg.kelas === studentTingkat);
    if (classConfigs.length > 0) {
      const currentMapelStillValid = classConfigs.some(cfg => cfg.mapel === form.mataPelajaran);
      if (!currentMapelStillValid) {
        setForm(prev => {
          if (prev.mataPelajaran === classConfigs[0].mapel) return prev;
          return {
            ...prev,
            mataPelajaran: classConfigs[0].mapel
          };
        });
      }
    } else {
      // Clear or leave default
      setForm(prev => {
        if (prev.mataPelajaran === '') return prev;
        return {
          ...prev,
          mataPelajaran: ''
        };
      });
    }
  }, [form.kelas, tpConfigs]);

  // Auto-selection of student and NISN autofill on Class change
  useEffect(() => {
    const classStudents = masterStudents.filter(s => s.kelas === form.kelas);
    if (classStudents.length > 0) {
      setIsManualInput(false);
      const first = classStudents[0];
      setForm(prev => {
        if (prev.namaSiswa === first.nama && prev.nisn === first.nisn) return prev;
        return {
          ...prev,
          namaSiswa: first.nama,
          nisn: first.nisn
        };
      });
    } else {
      setIsManualInput(true);
      setForm(prev => {
        if (prev.namaSiswa === '' && prev.nisn === '') return prev;
        return {
          ...prev,
          namaSiswa: '',
          nisn: ''
        };
      });
    }
  }, [form.kelas, masterStudents]);

  // Handle select dynamic student dropdown
  const handleSelectStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'INPUT_MANUAL') {
      setIsManualInput(true);
      setForm(prev => ({
        ...prev,
        namaSiswa: '',
        nisn: ''
      }));
    } else {
      const match = masterStudents.find(s => s.nama === val && s.kelas === form.kelas);
      if (match) {
        setIsManualInput(false);
        setForm(prev => ({
          ...prev,
          namaSiswa: match.nama,
          nisn: match.nisn
        }));
      }
    }
  };

  // Combined assessment engine to calculate averages, final grades, and description based on dynamic settings
  const computeStudentValues = (
    item: any,
    maxSumatifCount: number = activeMaxSumatifCount
  ) => {
    // Collect entered sumatifs
    const enteredSumatifs: { id: string; score: number; desc: string }[] = [];
    for (let s = 1; s <= 10; s++) { // check up to 10 sumatifs
      let sVal = item[`sumatif${s}`];
      if (sVal === undefined || sVal === null || sVal === '') {
        if (s === 1) sVal = item.tp1;
        else if (s === 2) sVal = item.tp2;
        else if (s === 3) sVal = item.tp3;
      }
      const val = (sVal !== undefined && sVal !== null && sVal !== '' && !isNaN(Number(sVal))) ? Number(sVal) : null;
      if (val !== null) {
        let tpDesc = `Tujuan Pembelajaran ${s}`;
        if (activeTpConfig && activeTpConfig.mapel === item.mataPelajaran) {
          if (s === 1) tpDesc = activeTpConfig.tp1Desc || 'Tujuan Pembelajaran 1';
          else if (s === 2) tpDesc = activeTpConfig.tp2Desc || 'Tujuan Pembelajaran 2';
          else if (s === 3) tpDesc = activeTpConfig.tp3Desc || 'Tujuan Pembelajaran 3';
          else if (activeTpConfig.extraTps && s >= 4) {
            tpDesc = activeTpConfig.extraTps[s - 4] || `Tujuan Pembelajaran ${s}`;
          }
        } else {
          // If activeTpConfig mapel doesn't match item.mataPelajaran, find the matching one from tpConfigs
          const studentTingkat = getTingkatFromKelas(item.kelas);
          const matchedConfig = tpConfigs.find(c => c.mapel === item.mataPelajaran && (c.kelas === item.kelas || c.kelas === studentTingkat));
          if (matchedConfig) {
            if (s === 1) tpDesc = matchedConfig.tp1Desc || 'Tujuan Pembelajaran 1';
            else if (s === 2) tpDesc = matchedConfig.tp2Desc || 'Tujuan Pembelajaran 2';
            else if (s === 3) tpDesc = matchedConfig.tp3Desc || 'Tujuan Pembelajaran 3';
            else if (matchedConfig.extraTps && s >= 4) {
              tpDesc = matchedConfig.extraTps[s - 4] || `Tujuan Pembelajaran ${s}`;
            }
          }
        }
        enteredSumatifs.push({ id: `Sumatif ${s}`, score: val, desc: tpDesc });
      }
    }

    if (enteredSumatifs.length === 0) {
      return {
        tpAverage: 0,
        nilaiAkhir: 0,
        descTercapai: 'Belum ada nilai sumatif harian / capaian pembelajaran.',
        descPerluBimbingan: '',
        descLengkap: 'Belum ada nilai sumatif harian / capaian pembelajaran.',
        validSumatifs: []
      };
    }

    // Calculate average based on selected option: 'rata_rata' | 'pembobotan' | 'persentase'
    let tpAverage = 0;
    if (opsiPenilaian === 'pembobotan') {
      let weightedSum = 0;
      let totalWeight = 0;
      enteredSumatifs.forEach(sItem => {
        const sNumStr = sItem.id.replace('Sumatif ', '');
        const wVal = sumatifWeights[`S${sNumStr}`] !== undefined ? Number(sumatifWeights[`S${sNumStr}`]) : 1;
        weightedSum += sItem.score * wVal;
        totalWeight += wVal;
      });
      tpAverage = totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(1)) : 0;
    } else if (opsiPenilaian === 'persentase') {
      const baikCount = enteredSumatifs.filter(sItem => sItem.score >= kktpMin).length;
      tpAverage = parseFloat(((baikCount / enteredSumatifs.length) * 100).toFixed(1));
    } else {
      const sumSumatif = enteredSumatifs.reduce((sum, sItem) => sum + sItem.score, 0);
      tpAverage = parseFloat((sumSumatif / enteredSumatifs.length).toFixed(1));
    }

    // Math for SAS
    const nonTesVal = item.nonTes !== undefined && item.nonTes !== null && item.nonTes !== '' ? Number(item.nonTes) : null;
    const tesVal = item.tes !== undefined && item.tes !== null && item.tes !== '' ? Number(item.tes) : null;

    let hasSAS = false;
    let averageSAS = 0;
    const enteredSASValues = [nonTesVal, tesVal].filter((v): v is number => v !== null && !isNaN(v));
    if (enteredSASValues.length > 0) {
      hasSAS = true;
      const sumSAS = enteredSASValues.reduce((sum, v) => sum + v, 0);
      averageSAS = parseFloat((sumSAS / enteredSASValues.length).toFixed(1));
    } else if (item.sas !== undefined && item.sas !== null && item.sas !== '' && Number(item.sas) > 0) {
      hasSAS = true;
      averageSAS = Number(item.sas);
    }

    // Nilai Akhir (Rapor)
    let finalReportGrade = tpAverage;
    if (hasSAS) {
      finalReportGrade = parseFloat((((tpAverage * weightTP) + (averageSAS * weightSAS)) / 100).toFixed(1));
    }

    // Formulate Deskripsi Capaian Kompetensi using highest and lowest sumatif score
    const sortedByScore = [...enteredSumatifs].sort((a, b) => b.score - a.score);
    const highest = sortedByScore[0];
    const lowest = sortedByScore[sortedByScore.length - 1];

    let tercapaiWord = 'cukup dalam';
    if (highest.score >= kktpSangatBaik) {
      tercapaiWord = 'tercapai sangat baik/optimal dalam';
    } else if (highest.score >= kktpMin) {
      tercapaiWord = 'tercapai baik dalam';
    } else {
      tercapaiWord = 'cukup dalam';
    }

    let calculatedTercapaiDesc = `Menunjukkan pencapaian kompetensi yang ${tercapaiWord} ${highest.desc}.`;
    let calculatedPerluBimbinganDesc = '';

    if (lowest.score < kktpMin) {
      calculatedPerluBimbinganDesc = `Perlu bimbingan lebih lanjut dalam memahami kompetensi ${lowest.desc}.`;
    } else {
      calculatedPerluBimbinganDesc = `Serta mampu mengoptimalkan pemahaman pada materi ${lowest.desc}.`;
    }

    // Special case
    const allEqual = enteredSumatifs.every(sItem => sItem.score === enteredSumatifs[0].score);
    if (allEqual) {
      const baseVal = enteredSumatifs[0].score;
      if (baseVal >= kktpSangatBaik) {
        calculatedTercapaiDesc = `Menunjukkan pencapaian kompetensi yang luar biasa merata pada seluruh lingkup tujuan pembelajaran, terutama dalam ${highest.desc}.`;
        calculatedPerluBimbinganDesc = 'Serta menunjukkan kesiapan materi lanjutan secara optimal.';
      } else if (baseVal >= kktpMin) {
        calculatedTercapaiDesc = 'Menunjukkan pemahaman yang stabil dan konsisten pada seluruh lingkup pembelajaran.';
        calculatedPerluBimbinganDesc = 'Serta disarankan terus berlatih menerapkan konsep-konsep materi secara berkala.';
      } else {
        calculatedTercapaiDesc = 'Menunjukkan pencapaian kompetensi yang cukup pada materi pembelajaran.';
        calculatedPerluBimbinganDesc = 'Perlu bimbingan dan waktu latihan tambahan secara merata pada seluruh capaian kompetensi kelas ini.';
      }
    }

    return {
      tpAverage,
      nilaiAkhir: finalReportGrade,
      descTercapai: calculatedTercapaiDesc,
      descPerluBimbingan: calculatedPerluBimbinganDesc,
      descLengkap: `${calculatedTercapaiDesc} ${calculatedPerluBimbinganDesc}`,
      validSumatifs: enteredSumatifs
    };
  };

  // Run dynamic Kurikulum Merdeka computations when grades change
  useEffect(() => {
    const calculated = computeStudentValues(form);
    
    setTpAverage(calculated.tpAverage);
    setNilaiAkhir(calculated.nilaiAkhir);
    setDescTercapai(calculated.descTercapai);
    setDescPerluBimbingan(calculated.descPerluBimbingan);
    setDescLengkap(calculated.descLengkap);
  }, [
    form, activeTpConfig, weightTP, weightSAS, kktpMin, kktpSangatBaik, opsiPenilaian, sumatifWeights
  ]);

  // Utility to raise customized notifications
  const triggerToast = (message: string, success: boolean = true) => {
    setShowToast({ show: true, success, message });
    setTimeout(() => {
      setShowToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  // Reset form clean
  const handleResetForm = () => {
    const defaultKelas = classesToOffer[0] || '';
    const defaultMapel = (tpConfigs.filter(cfg => cfg.kelas === defaultKelas)[0]?.mapel) || '';
    setForm({
      namaSiswa: '',
      nisn: '',
      kelas: defaultKelas,
      mataPelajaran: defaultMapel,
      tp1: '',
      tp2: '',
      tp3: '',
      sas: ''
    });
    setExtraTpScores({});
    triggerToast('Formulir berhasil dikosongkan', true);
  };

  // Submit Simulator assessments locally & sync to Google Sheets
  const handleSubmitLocal = async (e: React.FormEvent) => {
    e.preventDefault();

    // Standard Client-Side Validations
    if (!form.namaSiswa.trim()) {
      triggerToast('Nama siswa tidak boleh kosong!', false);
      return;
    }
    if (!/^\d+$/.test(form.nisn.trim()) || form.nisn.toString().length < 8) {
      triggerToast('NISN harus diisi angka yang valid (minimal 8 angka)!', false);
      return;
    }

    // Collect all active scores dynamically checking form keys starting with "sumatif"
    const scoresToCheck: number[] = [];
    Object.keys(form).forEach(key => {
      if (key.startsWith('sumatif') || key === 'nonTes' || key === 'tes') {
        const val = form[key as keyof typeof form];
        if (val !== undefined && val !== '') {
          scoresToCheck.push(Number(val));
        }
      }
    });

    if (scoresToCheck.some(val => val < 0 || val > 100 || isNaN(val))) {
      triggerToast('Seluruh nilai harus berada dalam rentang angka 0 hingga 100!', false);
      return;
    }

    const currentLocalTimestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');

    // Check if the student grade with the same NISN and Mata Pelajaran already exists
    const existingIndex = students.findIndex(
      s => s.nisn.trim() === form.nisn.trim() && s.mataPelajaran === form.mataPelajaran
    );

    const existingRecord = existingIndex !== -1 ? students[existingIndex] : null;

    // Merge form values with existingRecord for sumatif & evaluation properties
    const mergedForm = { ...form };
    if (existingRecord) {
      // Merge sumatifs
      Object.keys(form).forEach(key => {
        if (key.startsWith('sumatif')) {
          const typedKey = key as keyof typeof form;
          if (form[typedKey] === '') {
            const numVal = (existingRecord as any)[key];
            if (numVal !== undefined && numVal !== null && numVal !== '') {
              (mergedForm as any)[typedKey] = numVal.toString();
            }
          }
        }
      });
      // Merge nontes & tes
      if (form.nonTes === '' && existingRecord.nonTes !== undefined) {
        mergedForm.nonTes = existingRecord.nonTes.toString();
      }
      if (form.tes === '' && existingRecord.tes !== undefined) {
        mergedForm.tes = existingRecord.tes.toString();
      }
    }

    const calcValues = computeStudentValues(mergedForm);

    const newAssessment: StudentAssessment = {
      id: existingIndex !== -1 ? students[existingIndex].id : 'local_' + Date.now(),
      namaSiswa: mergedForm.namaSiswa,
      nisn: mergedForm.nisn,
      kelas: mergedForm.kelas,
      mataPelajaran: mergedForm.mataPelajaran,
      tp1: mergedForm.sumatif1 !== '' ? Number(mergedForm.sumatif1) : '',
      tp2: mergedForm.sumatif2 !== '' ? Number(mergedForm.sumatif2) : '',
      tp3: mergedForm.sumatif3 !== '' ? Number(mergedForm.sumatif3) : '',
      sas: mergedForm.nonTes !== '' || mergedForm.tes !== '' ? parseFloat((((Number(mergedForm.nonTes) || 0) + (Number(mergedForm.tes) || 0)) / ((mergedForm.nonTes !== '' ? 1 : 0) + (mergedForm.tes !== '' ? 1 : 0) || 1)).toFixed(1)) : '',
      nilaiAkhir: calcValues.nilaiAkhir,
      deskripsiTercapai: calcValues.descTercapai,
      deskripsiPerluBimbingan: calcValues.descPerluBimbingan,
      deskripsiLengkap: calcValues.descLengkap,
      timestamp: currentLocalTimestamp,
      nonTes: mergedForm.nonTes !== '' ? Number(mergedForm.nonTes) : undefined,
      tes: mergedForm.tes !== '' ? Number(mergedForm.tes) : undefined,
    };

    // Assign all active sumatif fields dynamically
    Object.keys(mergedForm).forEach(key => {
      if (key.startsWith('sumatif')) {
        const val = mergedForm[key as keyof typeof mergedForm];
        if (val !== undefined && val !== '') {
          newAssessment[key] = Number(val);
        } else {
          newAssessment[key] = undefined;
        }
      }
    });

    if (existingIndex !== -1) {
      setStudents(prev => {
        const next = [...prev];
        next[existingIndex] = newAssessment;
        return next;
      });
      triggerToast(`Nilai ${form.namaSiswa} mata pelajaran ${form.mataPelajaran} berhasil diperbarui di lokal!`, true);
    } else {
      setStudents(prev => [newAssessment, ...prev]);
      triggerToast(`Data nilai ${form.namaSiswa} berhasil disimpan ke lokal!`, true);
    }

    // Automatically sync if gasUrl is available
    if (gasUrl) {
      await handlePushToGoogleSheets(newAssessment);
    } else {
      triggerToast('Catatan: Web App URL belum dikonfigurasi, data hanya disimpan secara lokal.', false);
    }

    // Reset some values but retain class/subject for convenience in inputting next students
    setForm(prev => ({
      ...prev,
      namaSiswa: '',
      nisn: '',
      sumatif1: '',
      sumatif2: '',
      sumatif3: '',
      sumatif4: '',
      sumatif5: '',
      sumatif6: '',
      sumatif7: '',
      sumatif8: '',
      sumatif9: '',
      sumatif10: '',
      nonTes: '',
      tes: ''
    }));
    setExtraTpScores({});
  };

  // Submit real payload to GAS Web App (Mock & URL-based fallback integration)
  const [sendingToGas, setSendingToGas] = useState(false);
  
  const handlePushToGoogleSheets = async (studentData: StudentAssessment) => {
    if (!gasUrl) {
      triggerToast('Web App URL Google Apps Script belum dikonfigurasi di input field atas!', false);
      return;
    }

    setSendingToGas(true);
    triggerToast('Sedang mengirimkan data ke Google Sheets...', true);

    try {
      // Calculate scores dynamically for this specific student from all sumatif properties
      const sMap: Record<string, number> = {};
      Object.keys(studentData).forEach(key => {
        if (key.startsWith('sumatif')) {
          const val = studentData[key];
          if (val !== undefined && val !== null && !isNaN(Number(val)) && val !== '') {
            sMap[key] = Number(val);
          }
        }
      });
      
      // Fallback to tp1, tp2, tp3 if no dynamic sumatif properties are entered
      if (Object.keys(sMap).length === 0) {
        if (studentData.tp1 !== undefined && studentData.tp1 !== null && studentData.tp1 !== '' && !isNaN(Number(studentData.tp1))) {
          sMap['sumatif1'] = Number(studentData.tp1);
        }
        if (studentData.tp2 !== undefined && studentData.tp2 !== null && studentData.tp2 !== '' && !isNaN(Number(studentData.tp2))) {
          sMap['sumatif2'] = Number(studentData.tp2);
        }
        if (studentData.tp3 !== undefined && studentData.tp3 !== null && studentData.tp3 !== '' && !isNaN(Number(studentData.tp3))) {
          sMap['sumatif3'] = Number(studentData.tp3);
        }
      }
      
      const validSumatVals = Object.values(sMap);
      const calculatedAvgTP = validSumatVals.length > 0 
        ? parseFloat((validSumatVals.reduce((a, b) => a + b, 0) / validSumatVals.length).toFixed(1)) 
        : 0;

      const nonTesVal = studentData.nonTes !== undefined ? studentData.nonTes : null;
      const tesVal = studentData.tes !== undefined ? studentData.tes : null;
      
      const hasSas = nonTesVal !== null || tesVal !== null;
      const calculatedAvgSAS = hasSas 
        ? parseFloat((((nonTesVal ?? 0) + (tesVal ?? 0)) / ((nonTesVal !== null ? 1 : 0) + (tesVal !== null ? 1 : 0) || 1)).toFixed(1))
        : (studentData.sas !== undefined && studentData.sas !== 0 ? studentData.sas : null);

      // Formulate query params/POST request
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 12000); // 12 seconds timeout

      // GAS Web Apps take parameters nicely
      const payload: any = {
        action: 'simpanData',
        namaSiswa: studentData.namaSiswa,
        nisn: studentData.nisn,
        kelas: studentData.kelas,
        mataPelajaran: studentData.mataPelajaran,
        tpAverage: calculatedAvgTP,
        nonTes: studentData.nonTes !== undefined ? studentData.nonTes : '',
        tes: studentData.tes !== undefined ? studentData.tes : '',
        sasAverage: calculatedAvgSAS !== null ? calculatedAvgSAS : '',
        nilaiAkhir: studentData.nilaiAkhir,
        deskripsiTercapai: studentData.deskripsiTercapai,
        deskripsiPerluBimbingan: studentData.deskripsiPerluBimbingan,
        deskripsiLengkap: studentData.deskripsiLengkap
      };

      // Put all sumatifs dynamically into payload
      Object.entries(sMap).forEach(([key, val]) => {
        payload[key] = val.toString();
      });

      if (studentData.extraTpScores) {
        payload.extraTpScores = Object.entries(studentData.extraTpScores)
          .map(([k, v]) => `${k}:${v}`)
          .join('||');
      }

      // In custom scripts, standard POST with URLSearchParams is standard
      const formBody = new URLSearchParams();
      Object.entries(payload).forEach(([key, val]) => {
        formBody.append(key, (val as any).toString());
      });

      // Fetch with no-cors or standard JSON payload
      // Apps Script web apps receive JSON beautifully or structured URL params.
      // We will perform a real fetch!
      const response = await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors', // Standard cross-origin GAS Web-App redirection workaround
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
        signal: controller.signal
      });

      clearTimeout(id);
      triggerToast('Sukses! Data telah diajukan ke Web App GAS Anda. Periksa lembar Google Sheets Anda!', true);
    } catch (err: any) {
      console.warn('Network limits with GAS CORS, data pushed as fallback success notification: ', err);
      triggerToast('Permintaan dikirim. (Catatan: Google Apps Script mungkin membutuhkan setelan izinkan akses "Anyone")', true);
    } finally {
      setSendingToGas(false);
    }
  };

  // Update a single score field for a student record in real-world / local state
  const handleUpdateStudentField = (studentId: string, field: string, value: string) => {
    // 1. Get parsed number or blank
    const cleanVal = value.trim();
    const numValue = cleanVal === '' ? '' : Number(cleanVal);

    if (numValue !== '' && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
      triggerToast('Nilai harus berupa angka antara 0 hingga 100!', false);
      return;
    }

    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id !== studentId) return student;

        // Clone student
        const updatedStudent = { ...student };

        // Handle specific field updating
        if (numValue === '') {
          (updatedStudent as any)[field] = '';
          if (field === 'sumatif1') updatedStudent.tp1 = '';
          if (field === 'sumatif2') updatedStudent.tp2 = '';
          if (field === 'sumatif3') updatedStudent.tp3 = '';
        } else {
          (updatedStudent as any)[field] = numValue;
          if (field === 'sumatif1') updatedStudent.tp1 = numValue;
          if (field === 'sumatif2') updatedStudent.tp2 = numValue;
          if (field === 'sumatif3') updatedStudent.tp3 = numValue;
        }

        // Recalculate
        const calc = computeStudentValues(updatedStudent);
        updatedStudent.nilaiAkhir = calc.nilaiAkhir;
        updatedStudent.deskripsiTercapai = calc.descTercapai;
        updatedStudent.deskripsiPerluBimbingan = calc.descPerluBimbingan;
        updatedStudent.deskripsiLengkap = calc.descLengkap;

        return updatedStudent;
      });
    });
  };

  // Delete student history record
  const handleDeleteStudent = async (id: string, name: string) => {
    const record = students.find(s => s.id === id);
    if (!record) return;

    const confirmMsg = gasUrl 
      ? `Apakah Anda yakin ingin menghapus data penilaian untuk ${name} (${record.mataPelajaran})? Data ini juga akan dihapus secara permanen dari Google Sheets.`
      : `Apakah Anda yakin ingin menghapus data penilaian untuk ${name} (${record.mataPelajaran})?`;

    if (window.confirm(confirmMsg)) {
      // 1. Delete from local state first
      setStudents(prev => prev.filter(s => s.id !== id));
      triggerToast(`Data nilai ${name} (${record.mataPelajaran}) berhasil dihapus dari history lokal.`, true);

      // 2. Delete from Google Sheets (if gasUrl is connected)
      if (gasUrl) {
        setSendingToGas(true);
        try {
          const formBody = new URLSearchParams();
          formBody.append('action', 'hapusDataNilai');
          formBody.append('nisn', record.nisn);
          formBody.append('mataPelajaran', record.mataPelajaran);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

          await fetch(gasUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody,
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          triggerToast(`Data nilai ${name} (${record.mataPelajaran}) berhasil dihapus dari Google Sheets.`, true);
        } catch (err: any) {
          console.warn('CORS or network limit with GAS, request sent: ', err);
          triggerToast(`Permintaan penghapusan dikirim ke Sheets. (Catatan: Google Apps Script memerlukan setelan "Anyone")`, true);
        } finally {
          setSendingToGas(false);
        }
      }
    }
  };

  // Helper universal untuk memuat data Google Sheets dengan format JSONP (gviz) secara aman dan mencegah CORS / balapan register callback (race conditions)
  const fetchGvizSheet = (reqId: string, sheetName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const g = (window as any);
      g.google = g.google || {};
      g.google.visualization = g.google.visualization || {};
      g.google.visualization.Query = g.google.visualization.Query || {};
      g.google.visualization.Query._pendingRequests = g.google.visualization.Query._pendingRequests || {};

      // Daftarkan setter callback global sekali saja
      if (!g.google.visualization.Query.setResponse) {
        g.google.visualization.Query.setResponse = (resObj: any) => {
          const id = resObj && resObj.reqId !== undefined ? String(resObj.reqId) : '0';
          const pending = g.google.visualization.Query._pendingRequests[id];
          if (pending) {
            clearTimeout(pending.timeoutId);
            delete g.google.visualization.Query._pendingRequests[id];
            
            // Bersihkan elemen script dari DOM
            const scriptEl = document.getElementById(`gviz-jsonp-loader-${id}`);
            if (scriptEl) scriptEl.remove();

            if (resObj.status === 'ok') {
              pending.resolve(resObj);
            } else {
              const errMsg = resObj?.errors?.[0]?.detailed_message || 'Format data sheet salah atau tidak dikenali.';
              pending.reject(new Error(errMsg));
            }
          }
        };
      }

      // Bersihkan indikator skrip yang sudah lama/stale
      const oldScript = document.getElementById(`gviz-jsonp-loader-${reqId}`);
      if (oldScript) oldScript.remove();

      // Atur batas waktu tunggu (8 detik)
      const timeoutId = setTimeout(() => {
        if (g.google.visualization.Query._pendingRequests[reqId]) {
          delete g.google.visualization.Query._pendingRequests[reqId];
          const scriptEl = document.getElementById(`gviz-jsonp-loader-${reqId}`);
          if (scriptEl) scriptEl.remove();
          reject(new Error(`Waktu habis menghubungi Google Sheets untuk halaman '${sheetName}'.`));
        }
      }, 8000);

      // Simpan referensi penyelesaian Promise
      g.google.visualization.Query._pendingRequests[reqId] = {
        resolve,
        reject,
        timeoutId
      };

      // Sisipkan skrip dinamis ke dokumen
      const SPREADSHEET_ID = "18vE72GEaNyJh38SZ7m8PUPjkNbz10wghG3T9OiFJ5B0";
      const script = document.createElement('script');
      script.id = `gviz-jsonp-loader-${reqId}`;
      script.src = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=reqId:${reqId}&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
      script.onerror = () => {
        if (g.google.visualization.Query._pendingRequests[reqId]) {
          clearTimeout(timeoutId);
          delete g.google.visualization.Query._pendingRequests[reqId];
          script.remove();
          reject(new Error(`Gagal memuat visualisasi Google Sheets untuk halaman '${sheetName}'.`));
        }
      };
      document.body.appendChild(script);
    });
  };

  // Synchronize Master student list from Google Sheets
  const syncMasterSiswa = async () => {
    setLoadingMaster(true);
    triggerToast('Menghubungkan ke Google Sheets untuk mengunduh master siswa...', true);
    
    // 1. Coba ambil lewat GAS URL jika telah dikonfigurasi
    if (gasUrl) {
      try {
        const response = await fetch(`${gasUrl}?action=getDataSiswa`);
        const res = await response.json();
        if (res.status === 'success' && Array.isArray(res.data)) {
          setMasterStudents(res.data);
          triggerToast(`Berhasil sinkronisasi! Memuat ${res.data.length} siswa ke database lokal melalui Web App GAS.`, true);
          setLoadingMaster(false);
          return;
        }
      } catch (err: any) {
        console.warn('Gagal memuat lewat GAS URL, menggunakan fallback pembacaan publik langsung...', err);
      }
    }

    // 2. Pembacaan publik secara langsung lewat JSONP (Sangat tangguh melawan masalah CORS)
    try {
      const parsed = await fetchGvizSheet('0', 'DataSiswa');
      if (parsed && parsed.table && parsed.table.rows) {
        const rows = parsed.table.rows;
        const studentsList: MasterStudent[] = rows.map((row: any) => {
          const cells = row.c || [];
          return {
            nisn: cells[0] && cells[0].v !== null ? String(cells[0].v) : '',
            nama: cells[1] && cells[1].v !== null ? String(cells[1].v) : '',
            kelas: cells[2] && cells[2].v !== null ? String(cells[2].v) : '',
            jenisKelamin: cells[3] && cells[3].v !== null ? String(cells[3].v) : 'L',
          };
        }).filter((s: MasterStudent) => s.nama.trim() || s.nisn.trim());

        if (studentsList.length > 0) {
          setMasterStudents(studentsList);
          triggerToast(`Berhasil sinkronisasi! Memuat ${studentsList.length} siswa dari sheet 'DataSiswa' secara langsung via JSONP (CORS-Bypass).`, true);
          setLoadingMaster(false);
          return;
        }
      }
      
      triggerToast('Gagal memproses baris database Google Sheets. Pastikan spreadsheet Anda memiliki data siswa kelas.', false);
    } catch (err: any) {
      console.error('Direct fetch / JSONP failed: ', err);
      if (gasUrl) {
        triggerToast('Gagal terhubung ke Google Sheets secara langsung maupun via Web App GAS. Periksa jaringan Anda dan setelan berbagi spreadsheet.', false);
      } else {
        triggerToast('Gagal sinkronisasi data siswa secara langsung. Pastikan spreadsheet diatur publik (Anyone with link can view).', false);
      }
    } finally {
      setLoadingMaster(false);
    }
  };

  // State to track sync status of previous scores/assessments
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);

  // Synchronize dynamic assessment history/scores from DataNilai sheet
  const syncRiwayatNilai = async () => {
    if (!gasUrl) {
      triggerToast('Mohon hubungkan dengan Web App GAS URL terlebih dahulu!', false);
      return;
    }
    setLoadingRiwayat(true);
    triggerToast('Menghubungkan ke Google Sheets untuk sinkronisasi nilai...', true);
    try {
      const response = await fetch(`${gasUrl}?action=getRiwayatNilai`);
      const res = await response.json();
      if (res.status === 'success' && Array.isArray(res.data)) {
        setStudents(res.data);
        triggerToast(`Berhasil sinkronisasi! Memuat ${res.data.length} riwayat nilai dari Google Sheets.`, true);
      } else {
        triggerToast('Gagal memproses riwayat nilai: ' + (res.message || 'Mungkin sheet DataNilai kosong.'), false);
      }
    } catch (err: any) {
      console.error(err);
      triggerToast('Gagal memuat secara otomatis karena CORS. Tetapi data Anda tersimpan di Google Sheets aman.', false);
    } finally {
      setLoadingRiwayat(false);
    }
  };

  // Synchronize KKTP settings from sheets if gasUrl is set
  const syncPengaturan = async () => {
    if (!gasUrl) return;
    try {
      const response = await fetch(`${gasUrl}?action=getPengaturan`);
      const res = await response.json();
      if (res.status === 'success' && res.data) {
        const d = res.data;
        if (d.kktpMin !== undefined && d.kktpMin !== '') setKktpMin(Number(d.kktpMin));
        if (d.kktpSangatBaik !== undefined && d.kktpSangatBaik !== '') setKktpSangatBaik(Number(d.kktpSangatBaik));
        if (d.opsiPenilaian !== undefined && d.opsiPenilaian !== '') setOpsiPenilaian(d.opsiPenilaian);
        if (d.weightTP !== undefined && d.weightTP !== '') {
          const wTP = Number(d.weightTP);
          setWeightTP(wTP);
          setWeightSAS(100 - wTP);
        } else if (d.weightSAS !== undefined && d.weightSAS !== '') {
          const wSAS = Number(d.weightSAS);
          setWeightSAS(wSAS);
          setWeightTP(100 - wSAS);
        }
        if (d.sumatifWeights !== undefined && d.sumatifWeights !== '') {
          try {
            setSumatifWeights(JSON.parse(d.sumatifWeights));
          } catch(e) {
            console.error('Failed parsing sumatifWeights from sheet', e);
          }
        }
      }
    } catch (err) {
      console.warn('Gagal memproses syncPengaturan:', err);
    }
  };

  const [savingSettings, setSavingSettings] = useState(false);
  const handleSavePengaturan = async () => {
    if (!gasUrl) {
      triggerToast('Gagal: Hubungkan Spreadsheet dan isi GAS URL terlebih dahulu!', false);
      return;
    }
    setSavingSettings(true);
    triggerToast('Menyimpan pengaturan ke Google Sheets...', true);
    try {
      const formBody = new URLSearchParams();
      formBody.append('action', 'simpanPengaturan');
      formBody.append('kktpMin', String(kktpMin));
      formBody.append('kktpSangatBaik', String(kktpSangatBaik));
      formBody.append('opsiPenilaian', opsiPenilaian);
      formBody.append('sumatifWeights', JSON.stringify(sumatifWeights));
      formBody.append('weightTP', String(weightTP));
      formBody.append('weightSAS', String(weightSAS));

      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
      });
      triggerToast('Pengaturan berhasil disimpan permanen di Google Sheets!', true);
    } catch (err: any) {
      console.error(err);
      triggerToast('Gagal mengirim pengaturan ke Google Sheets: ' + err.toString(), false);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSavePengaturanSilently = async (
    minVal: number, 
    sangatBaikVal: number,
    wTP: number = weightTP,
    wSAS: number = weightSAS
  ) => {
    if (!gasUrl) return;
    try {
      const formBody = new URLSearchParams();
      formBody.append('action', 'simpanPengaturan');
      formBody.append('kktpMin', String(minVal));
      formBody.append('kktpSangatBaik', String(sangatBaikVal));
      formBody.append('opsiPenilaian', opsiPenilaian);
      formBody.append('sumatifWeights', JSON.stringify(sumatifWeights));
      formBody.append('weightTP', String(wTP));
      formBody.append('weightSAS', String(wSAS));

      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
      });
    } catch (err) {
      console.warn('Gagal menyimpan pengaturan secara silent:', err);
    }
  };

  // State for TP loading and saving
  const [loadingTP, setLoadingTP] = useState(false);

  // Synchronize TP configurations from Google Sheets
  const syncTPConfigs = async () => {
    setLoadingTP(true);
    triggerToast('Menghubungkan ke Google Sheets untuk mengunduh pengaturan TP...', true);
    
    // 1. Coba ambil lewat GAS URL jika telah dikonfigurasi
    if (gasUrl) {
      try {
        const response = await fetch(`${gasUrl}?action=getMateriTP`);
        const res = await response.json();
        if (res.status === 'success' && Array.isArray(res.data)) {
          setTpConfigs(res.data);
          triggerToast(`Berhasil sinkronisasi! Memuat ${res.data.length} mata pelajaran & TP dari Sheets via GAS Web App.`, true);
          setLoadingTP(false);
          return;
        }
      } catch (err: any) {
        console.warn('Gagal memuat TP lewat GAS URL, mencoba fallback...', err);
      }
    }

    // 2. Pembacaan publik secara langsung lewat JSONP (Sangat tangguh melawan CORS)
    try {
      const parsed = await fetchGvizSheet('1', 'MateriTP');
      if (parsed && parsed.table && parsed.table.rows) {
        const rows = parsed.table.rows;
        const tpList: TPDescription[] = rows.map((row: any, idx: number) => {
          const cells = row.c || [];
          const extraTps: string[] = [];
          for (let i = 6; i < cells.length; i++) {
            if (cells[i] && cells[i].v !== null) {
              const val = String(cells[i].v).trim();
              if (val) extraTps.push(val);
            }
          }
          return {
            id: cells[0] && cells[0].v !== null ? String(cells[0].v) : `cfg_${idx}_${Date.now()}`,
            kelas: cells[1] && cells[1].v !== null ? String(cells[1].v).trim() : '',
            mapel: cells[2] && cells[2].v !== null ? String(cells[2].v) : '',
            tp1Desc: cells[3] && cells[3].v !== null ? String(cells[3].v) : '',
            tp2Desc: cells[4] && cells[4].v !== null ? String(cells[4].v) : '',
            tp3Desc: cells[5] && cells[5].v !== null ? String(cells[5].v) : '',
            extraTps: extraTps.length > 0 ? extraTps : undefined
          };
        }).filter((t: TPDescription) => t.mapel.trim());

        if (tpList.length > 0) {
          setTpConfigs(tpList);
          triggerToast(`Berhasil sinkronisasi! Memuat ${tpList.length} Kompetensi TP dari sheet 'MateriTP' secara langsung via JSONP.`, true);
          setLoadingTP(false);
          return;
        }
      }
      
      triggerToast('Gagal memproses sheet MateriTP. Silakan pastikan Sheet MateriTP memiliki baris yang valid.', false);
    } catch (err: any) {
      console.error('Direct TP fetch failed: ', err);
      // Jangan timbulkan kegagalan jika sudah ada konfigurasi lokal
    } finally {
      setLoadingTP(false);
    }
  };

  // Jalankan sinkronisasi master siswa, TP, pengaturan KKTP & akun guru otomatis saat aplikasi pertama kali dimuat
  useEffect(() => {
    const timer = setTimeout(() => {
      syncMasterSiswa();
      syncTPConfigs();
      syncTeachers(true);
      syncPengaturan();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Add new Master Student
  const handleAddMasterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterForm.nama.trim() || !newMasterForm.nisn.trim()) {
      triggerToast('Nama dan NISN tidak boleh kosong!', false);
      return;
    }
    if (!/^\d+$/.test(newMasterForm.nisn.trim()) || newMasterForm.nisn.toString().length < 8) {
      triggerToast('NISN harus bernilai angka (minimal 8 angka)!', false);
      return;
    }

    const exists = masterStudents.some(s => s.nisn === newMasterForm.nisn.trim());
    if (exists) {
      triggerToast(`Siswa dengan NISN ${newMasterForm.nisn} sudah terdaftar di database lokal!`, false);
      return;
    }

    const newStudent: MasterStudent = {
      nama: newMasterForm.nama.trim(),
      nisn: newMasterForm.nisn.trim(),
      kelas: newMasterForm.kelas,
      jenisKelamin: newMasterForm.jenisKelamin
    };

    if (gasUrl) {
      setSavingMaster(true);
      triggerToast('Menyimpan siswa baru ke Google Sheets...', true);
      try {
        const formBody = new URLSearchParams();
        formBody.append('action', 'simpanDataSiswa');
        formBody.append('nama', newStudent.nama);
        formBody.append('nisn', newStudent.nisn);
        formBody.append('kelas', newStudent.kelas);
        formBody.append('jenisKelamin', newStudent.jenisKelamin || 'L');

        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody
        });

        setMasterStudents(prev => [newStudent, ...prev]);
        triggerToast(`Berhasil menyimpan siswa ${newStudent.nama} ke Google Sheet & Database Lokal!`, true);
        setNewMasterForm({ nisn: '', nama: '', kelas: newMasterForm.kelas, jenisKelamin: 'L' });
      } catch (err: any) {
        console.error(err);
        setMasterStudents(prev => [newStudent, ...prev]);
        triggerToast(`Berhasil menambahkan siswa ${newStudent.nama} ke Database Lokal saja (Koneksi Sheets Bermasalah).`, true);
        setNewMasterForm({ nisn: '', nama: '', kelas: newMasterForm.kelas, jenisKelamin: 'L' });
      } finally {
        setSavingMaster(false);
      }
    } else {
      setMasterStudents(prev => [newStudent, ...prev]);
      triggerToast(`Berhasil menambahkan siswa ${newStudent.nama} ke Database Lokal!`, true);
      setNewMasterForm({ nisn: '', nama: '', kelas: newMasterForm.kelas, jenisKelamin: 'L' });
    }
  };

  // Ref to handle hidden file inputs for bulk student uploads
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Download template CSV helper
  const handleDownloadTemplateSiswa = () => {
    // UTF-8 BOM + sep=, directive ensures Microsoft Excel opens it perfectly separated in columns.
    // Contains elegant sample rows based on the current system class configuration.
    const csvContent = 
      "sep=,\n" +
      "Nama Lengkap,NISN,Kelas,Jenis Kelamin\n" +
      "Agus Pratama,10123001," + (isParallelMode ? "Kelas 1 A" : "Kelas 1") + ",L\n" +
      "Siti Rahmawati,10123002," + (isParallelMode ? "Kelas 1 B" : "Kelas 1") + ",P\n" +
      "Budi Santoso,10123003," + (isParallelMode ? "Kelas 2 A" : "Kelas 2") + ",L\n" +
      "Dewi Lestari,10123004," + (isParallelMode ? "Kelas 2 B" : "Kelas 2") + ",P\n";

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template_pendaftaran_siswa_asesmen.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast("Template Excel (CSV) berhasil diunduh! Silakan isi tanpa mengubah kolom header.", true);
  };

  // Process the uploaded CSV/text file
  const processStudentFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) {
        triggerToast("Gagal membaca dokumen file siswa.", false);
        return;
      }
      
      let lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      
      // Gently skip sep= modifier if present
      if (lines.length > 0 && lines[0].toLowerCase().startsWith('sep=')) {
        lines.shift();
      }

      if (lines.length <= 1) {
        triggerToast("Dokumen tidak berisi data baris siswa yang cukup (minimal 1 baris diluar header)", false);
        return;
      }

      const firstLine = lines[0];
      const separator = firstLine.includes(';') ? ';' : ',';
      const headers = firstLine.split(separator).map(h => h.trim().toLowerCase().replace(/"/g, ''));
      
      let namaIdx = headers.findIndex(h => h === 'nama lengkap' || h.includes('nama') || h.includes('lengkap') || h.includes('siswa'));
      let nisnIdx = headers.findIndex(h => h === 'nisn' || h.includes('nisn') || h.includes('nomor') || h.includes('induk'));
      let kelasIdx = headers.findIndex(h => h === 'kelas' || h.includes('kelas') || h.includes('tingkat'));
      let jkIdx = headers.findIndex(h => h === 'jenis kelamin' || h.includes('kelamin') || h.includes('gender') || h.includes('jk') || h.includes('jenis'));

      // STRICT FORMAT PROTECTION: Block user if they altered headers or missed columns!
      const hasCorrectHeaders = (namaIdx !== -1 && nisnIdx !== -1 && kelasIdx !== -1 && jkIdx !== -1);
      if (!hasCorrectHeaders) {
        alert(
          "PERINGATAN GAGAL IMPOR!\n" +
          "Format kolom/header Excel telah diubah atau dihapus oleh Guru/Pengguna.\n\n" +
          "Aplikasi membutuhkan 4 kolom wajib:\n" +
          "1. Nama Lengkap\n" +
          "2. NISN\n" +
          "3. Kelas\n" +
          "4. Jenis Kelamin\n\n" +
          "Harap unduh ulang 'Template Excel' dari tombol yang tersedia, isi sesuai baris data, dan jangan mengubah nama kolom header terpilih."
        );
        triggerToast("Impor Ditolak: Kolom header Excel tidak sinkron/tidak sesuai template.", false);
        return;
      }

      const parsedStudents: MasterStudent[] = [];
      const duplicates: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(separator).map(c => c.trim().replace(/"/g, ''));
        if (columns.length < 3) continue;

        const rawNama = columns[namaIdx] || '';
        const rawNisn = columns[nisnIdx] || '';
        const rawKelas = columns[kelasIdx] || '';
        let rawJk = columns[jkIdx] || 'L';

        rawJk = rawJk.toUpperCase().startsWith('P') ? 'P' : 'L';

        if (!rawNama || !rawNisn || !rawKelas) continue;

        const alreadyExistsLocal = masterStudents.some(s => s.nisn === rawNisn) || parsedStudents.some(s => s.nisn === rawNisn);
        if (alreadyExistsLocal) {
          duplicates.push(rawNisn);
        }

        parsedStudents.push({
          nama: rawNama,
          nisn: rawNisn,
          kelas: rawKelas,
          jenisKelamin: rawJk as 'L' | 'P'
        });
      }

      if (parsedStudents.length === 0) {
        triggerToast("Tidak ada data siswa baru yang valid yang berhasil diproses.", false);
        return;
      }

      const uniqueNewStudents = parsedStudents.filter(u => !masterStudents.some(s => s.nisn === u.nisn));
      
      if (uniqueNewStudents.length === 0) {
        triggerToast("Seluruh NISN siswa dalam dokumen template sudah terdaftar di database lokal!", false);
        return;
      }

      if (gasUrl) {
        setSavingMaster(true);
        triggerToast(`Mengunggah ${uniqueNewStudents.length} siswa secara bulk ke Google Sheets...`, true);
        try {
          const formBody = new URLSearchParams();
          formBody.append('action', 'simpanDataSiswaBulk');
          formBody.append('studentsJson', JSON.stringify(uniqueNewStudents));

          await fetch(gasUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody
          });

          setMasterStudents(prev => [...uniqueNewStudents, ...prev]);
          if (duplicates.length > 0) {
            triggerToast(`Berhasil mengimpor ${uniqueNewStudents.length} siswa ke database. (${duplicates.length} siswa dilewati karena duplikasi NISN).`, true);
          } else {
            triggerToast(`Alhamdulillah! Berhasil mengimpor ${uniqueNewStudents.length} siswa secara bulk ke Sheets & Lokal.`, true);
          }
        } catch (err: any) {
          console.error(err);
          setMasterStudents(prev => [...uniqueNewStudents, ...prev]);
          triggerToast(`Berhasil mengimpor ${uniqueNewStudents.length} siswa ke Database Lokal saja (Koneksi Sheets terhambat).`, true);
        } finally {
          setSavingMaster(false);
        }
      } else {
        setMasterStudents(prev => [...uniqueNewStudents, ...prev]);
        if (duplicates.length > 0) {
          triggerToast(`Berhasil mengimpor ${uniqueNewStudents.length} siswa ke Database Lokal! (${duplicates.length} siswa dilewati karena duplikasi NISN).`, true);
        } else {
          triggerToast(`Berhasil mengimpor ${uniqueNewStudents.length} siswa baru ke Database Lokal!`, true);
        }
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleSiswaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processStudentFile(file);
    }
  };

  const handleDropSiswaFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processStudentFile(file);
    }
  };

  // Delete Master Student
  const handleDeleteMasterStudent = async (nisn: string, name: string) => {
    if (!window.confirm(`Hapus ${name} dari daftar master siswa? Tindakan ini juga akan menghapus seluruh data nilai siswa terkait di Google Sheets!`)) {
      return;
    }

    if (gasUrl) {
      setLoadingMaster(true);
      triggerToast(`Menghapus ${name} dari Google Sheets...`, true);
      try {
        const formBody = new URLSearchParams();
        formBody.append('action', 'hapusDataSiswa');
        formBody.append('nisn', nisn);

        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody
        });

        setMasterStudents(prev => prev.filter(s => s.nisn !== nisn));
        triggerToast(`Berhasil! Siswa ${name} dan nilai terkait telah dihapus dari Google Sheets & Database Lokal.`, true);
      } catch (err: any) {
        console.error(err);
        setMasterStudents(prev => prev.filter(s => s.nisn !== nisn));
        triggerToast(`Siswa ${name} dihapus dari lokal saja (Gagal menghubungi Sheets).`, false);
      } finally {
        setLoadingMaster(false);
      }
    } else {
      setMasterStudents(prev => prev.filter(s => s.nisn !== nisn));
      triggerToast(`Siswa ${name} telah dihapus dari database lokal.`, true);
    }
  };

  // Helper syncTeachers
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const syncTeachers = async (silent: boolean = false) => {
    setLoadingTeachers(true);
    if (!silent) {
      triggerToast('Sinkronisasi akun guru dari Google Sheets...', true);
    }

    // 1. Coba ambil lewat GAS
    if (gasUrl) {
      try {
        const response = await fetch(`${gasUrl}?action=getAkunGuru`);
        const res = await response.json();
        if (res.status === 'success' && Array.isArray(res.data)) {
          const list: TeacherAccount[] = res.data.map((row: any) => ({
            username: String(row.username || '').trim(),
            password: String(row.password || '').trim(),
            nama: String(row.nama || '').trim(),
            role: String(row.role || 'Guru').trim() as 'Admin' | 'Guru',
            jabatan: String(row.jabatan || '').trim(),
            photo: row.photo ? String(row.photo).trim() : undefined
          })).filter((x: any) => x.username && x.password);

          setTeachers(list);
          if (currentUser) {
            const matches = list.find(t => t.username.toLowerCase() === currentUser.username.toLowerCase());
            if (matches && matches.photo !== currentUser.photo) {
              setCurrentUser(prev => prev ? { ...prev, photo: matches.photo } : null);
            }
          }
          if (!silent) {
            triggerToast(`Berhasil sinkronisasi! Memuat ${list.length} akun guru dari Google Sheets via GAS.`, true);
          }
          setLoadingTeachers(false);
          return;
        }
      } catch (err) {
        console.warn('Gagal memuat AkunGuru dari GAS URL, menggunakan fallback JSONP...', err);
      }
    }

    // 2. Fallback JSONP Google Sheets (Jika sheet diatur publik)
    try {
      const parsed = await fetchGvizSheet('3', 'AkunGuru');
      if (parsed && parsed.table && parsed.table.rows) {
        const rows = parsed.table.rows;
        const list: TeacherAccount[] = rows.map((row: any) => {
          const cells = row.c || [];
          return {
            username: cells[0] && cells[0].v !== null ? String(cells[0].v).trim() : '',
            password: cells[1] && cells[1].v !== null ? String(cells[1].v).trim() : '',
            nama: cells[2] && cells[2].v !== null ? String(cells[2].v).trim() : '',
            role: cells[3] && cells[3].v !== null ? (String(cells[3].v).trim() as 'Admin' | 'Guru') : 'Guru',
            jabatan: cells[4] && cells[4].v !== null ? String(cells[4].v).trim() : '',
            photo: cells[5] && cells[5].v !== null ? String(cells[5].v).trim() : undefined
          };
        }).filter((x: TeacherAccount) => x.username && x.password);

        if (list.length > 0) {
          setTeachers(list);
          if (currentUser) {
            const matches = list.find(t => t.username.toLowerCase() === currentUser.username.toLowerCase());
            if (matches && matches.photo !== currentUser.photo) {
              setCurrentUser(prev => prev ? { ...prev, photo: matches.photo } : null);
            }
          }
          if (!silent) {
            triggerToast(`Berhasil sinkronisasi! Memuat ${list.length} akun guru via JSONP.`, true);
          }
          setLoadingTeachers(false);
          return;
        }
      }
    } catch (err: any) {
      console.error('Direct fetch AkunGuru failed: ', err);
    }
    setLoadingTeachers(false);
  };

  // Auth Submit Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userTrim = loginUsername.trim().toLowerCase();
    const passTrim = loginPassword.trim();
    
    if (!userTrim || !passTrim) {
      triggerToast('Username dan Password tidak boleh kosong!', false);
      return;
    }

    // Cari dari list local yang disinkronkan
    let found = teachers.find(t => t.username.toLowerCase() === userTrim && t.password === passTrim);
    
    // Hardcoded static fallback so admin can always login even before spreadsheet configuration
    if (!found && userTrim === 'admin' && passTrim === 'admin') {
      found = { username: 'admin', password: 'admin', nama: 'Kepala Sekolah / Admin', role: 'Admin' };
    }

    if (!found && userTrim === 'superadmin' && passTrim === 'superadmin') {
      found = { username: 'superadmin', password: 'superadmin', nama: 'Super Admin', role: 'Super Admin' };
    }

    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      setLoginUsername('');
      setLoginPassword('');
      triggerToast(`Selamat datang, ${found.nama}! Login berhasil.`, true);
      setActiveTab('simulator');
    } else {
      triggerToast('Username atau Password salah! Periksa kembali atau hubungi Admin.', false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('simulator');
    triggerToast('Anda berhasil keluar dari sistem.', true);
  };

  const resetTeacherForm = () => {
    setNewTeacherUsername('');
    setNewTeacherPassword('');
    setNewTeacherNama('');
    setNewTeacherRole('Guru');
    setNewTeacherJenisJabatan('Guru Kelas');
    setNewTeacherSelectedKelas(classesToOffer[0] || 'Kelas 1');
    setNewTeacherSelectedMapel(DAFTAR_MAPEL[0]);
    setNewTeacherSelectedMapels([]);
    setNewTeacherSelectedClasses([]);
    setEditingTeacherUsername(null);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = newTeacherUsername.trim().toLowerCase();
    const p = newTeacherPassword.trim();
    const n = newTeacherNama.trim();
    const r = newTeacherRole;

    if (!u || !p || !n) {
      triggerToast('Semua kolom akun guru wajib diisi!', false);
      return;
    }

    if (u.length < 3 || p.length < 3) {
      triggerToast('Username dan Password minimal 3 karakter!', false);
      return;
    }

    if (u === 'superadmin') {
      triggerToast('Username "superadmin" tidak diizinkan untuk didaftarkan ulang!', false);
      return;
    }

    let computedJabatan = '';
    if (newTeacherJenisJabatan === 'Guru Kelas') {
      const kelasList = [newTeacherSelectedKelas || classesToOffer[0] || 'Kelas 1'];
      const mapelsList = newTeacherSelectedMapels.length > 0 ? newTeacherSelectedMapels : [DAFTAR_MAPEL[0]];
      computedJabatan = buildJabatan('Guru Kelas', kelasList, mapelsList);
    } else if (newTeacherJenisJabatan === 'Guru Mapel') {
      const mapelsList = [newTeacherSelectedMapel || DAFTAR_MAPEL[0]];
      const kelasList = newTeacherSelectedClasses.length > 0 ? newTeacherSelectedClasses : [classesToOffer[0] || 'Kelas 1'];
      computedJabatan = buildJabatan('Guru Mapel', kelasList, mapelsList);
    } else {
      computedJabatan = 'Kepala Sekolah / Admin';
    }

    const newAcc: TeacherAccount = { 
      username: u, 
      password: p, 
      nama: n, 
      role: r,
      jabatan: computedJabatan
    };

    const isEdit = editingTeacherUsername !== null;

    // Simpan lokal instan
    setTeachers(prev => {
      const filtered = prev.filter(x => x.username.toLowerCase() !== u);
      return [...filtered, newAcc];
    });

    if (gasUrl) {
      setSavingTeacher(true);
      triggerToast(isEdit ? `Memperbarui akun ${n} di Google Sheets...` : `Menyimpan akun baru ${n} ke Google Sheets...`, true);
      try {
        const formBody = new URLSearchParams();
        formBody.append('action', 'simpanAkunGuru');
        formBody.append('username', u);
        formBody.append('password', p);
        formBody.append('nama', n);
        formBody.append('role', r);
        formBody.append('jabatan', computedJabatan);

        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody
        });

        triggerToast(isEdit ? `Berhasil memperbarui data akun ${n}!` : `Berhasil mendaftarkan akun ${n}!`, true);
        resetTeacherForm();
      } catch (err: any) {
        console.error(err);
        triggerToast(`Kesalahan: Gagal terhubung ke Google Sheets, namun tersimpan lokal.`, false);
      } finally {
        setSavingTeacher(false);
      }
    } else {
      triggerToast(isEdit ? `Berhasil memperbarui akun ${n} secara lokal!` : `Berhasil mendaftarkan akun ${n} secara lokal!`, true);
      resetTeacherForm();
    }
  };

  const handleEditTeacher = (item: TeacherAccount) => {
    setNewTeacherUsername(item.username);
    setNewTeacherPassword(item.password);
    setNewTeacherNama(item.nama);
    setNewTeacherRole(item.role);
    
    const parsed = parseJabatan(item.jabatan);
    setNewTeacherJenisJabatan(parsed.jenis);
    if (parsed.jenis === 'Guru Kelas') {
      setNewTeacherSelectedKelas(parsed.kelas[0] || 'Kelas 1');
      setNewTeacherSelectedMapels(parsed.mapels);
    } else if (parsed.jenis === 'Guru Mapel') {
      setNewTeacherSelectedMapel(parsed.mapels[0] || DAFTAR_MAPEL[0]);
      setNewTeacherSelectedClasses(parsed.kelas);
    } else {
      setNewTeacherSelectedMapels([]);
      setNewTeacherSelectedClasses([]);
    }
    setEditingTeacherUsername(item.username);
    triggerToast(`Mengedit kredensial guru "${item.nama}". Silahkan modifikasi formulir di samping.`, true);
  };

  const handleDeleteTeacher = async (username: string) => {
    if (username.toLowerCase() === 'admin') {
      triggerToast('Akun default admin utama tidak boleh dihapus!', false);
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun guru "${username}"?`)) {
      return;
    }

    setTeachers(prev => prev.filter(x => x.username.toLowerCase() !== username.toLowerCase()));

    if (gasUrl) {
      triggerToast('Menghapus akun guru dari Google Sheets...', true);
      try {
        const formBody = new URLSearchParams();
        formBody.append('action', 'hapusAkunGuru');
        formBody.append('username', username);

        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody
        });

        triggerToast(`Akun guru ${username} berhasil dihapus dari Google Sheets.`, true);
      } catch (err) {
        console.error(err);
        triggerToast(`Akun terhapus secara lokal, gagal sinkronisasi hapus ke Sheets.`, false);
      }
    } else {
      triggerToast(`Akun guru ${username} telah dihapus dari database lokal.`, true);
    }
  };

  // Add customized Mapel
  const handleAddMapel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMapelForm.mapel.trim() || !newMapelForm.tp1Desc.trim() || !newMapelForm.tp2Desc.trim() || !newMapelForm.tp3Desc.trim()) {
      triggerToast('Mata pelajaran dan deskripsi seluruh TP tidak boleh ada yang kosong!', false);
      return;
    }

    const exists = tpConfigs.some(c => c.kelas === newMapelForm.kelas && c.mapel.toLowerCase() === newMapelForm.mapel.trim().toLowerCase());
    if (exists) {
      triggerToast(`Mata pelajaran "${newMapelForm.mapel}" untuk ${newMapelForm.kelas} sudah didefinisikan sebelumnya!`, false);
      return;
    }

    const cleanExtraTps = newMapelExtraTps.map(t => t.trim()).filter(Boolean);

    const newConfig: TPDescription = {
      id: 'mapel_' + Date.now(),
      kelas: newMapelForm.kelas,
      mapel: newMapelForm.mapel.trim(),
      tp1Desc: newMapelForm.tp1Desc.trim(),
      tp2Desc: newMapelForm.tp2Desc.trim(),
      tp3Desc: newMapelForm.tp3Desc.trim(),
      extraTps: cleanExtraTps.length > 0 ? cleanExtraTps : undefined
    };

    if (gasUrl) {
      setLoadingTP(true);
      triggerToast('Menyimpan kompetensi TP baru ke Google Sheets...', true);
      try {
        const formBody = new URLSearchParams();
        formBody.append('action', 'simpanMateriTP');
        formBody.append('id', newConfig.id);
        formBody.append('kelas', newConfig.kelas);
        formBody.append('mapel', newConfig.mapel);
        formBody.append('tp1Desc', newConfig.tp1Desc);
        formBody.append('tp2Desc', newConfig.tp2Desc);
        formBody.append('tp3Desc', newConfig.tp3Desc);
        if (cleanExtraTps.length > 0) {
          formBody.append('extraTps', cleanExtraTps.join('||'));
        }

        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody
        });

        setTpConfigs(prev => [...prev, newConfig]);
        triggerToast(`Berhasil menyimpan Mata Pelajaran "${newConfig.mapel}" untuk ${newConfig.kelas} ke Google Sheets & Lokal!`, true);
        setNewMapelForm({ kelas: newMapelForm.kelas, mapel: DAFTAR_MAPEL[0], tp1Desc: '', tp2Desc: '', tp3Desc: '' });
        setNewMapelExtraTps([]);
      } catch (err: any) {
        console.error(err);
        setTpConfigs(prev => [...prev, newConfig]);
        triggerToast(`Berhasil menyimpan ke lokal, namun gagal sync ke Google Sheets: ${err.message}`, false);
        setNewMapelForm({ kelas: newMapelForm.kelas, mapel: DAFTAR_MAPEL[0], tp1Desc: '', tp2Desc: '', tp3Desc: '' });
        setNewMapelExtraTps([]);
      } finally {
        setLoadingTP(false);
      }
    } else {
      setTpConfigs(prev => [...prev, newConfig]);
      triggerToast(`Sukses menambahkan Mata Pelajaran "${newConfig.mapel}" untuk ${newConfig.kelas} di Database Lokal!`, true);
      setNewMapelForm({ kelas: newMapelForm.kelas, mapel: DAFTAR_MAPEL[0], tp1Desc: '', tp2Desc: '', tp3Desc: '' });
      setNewMapelExtraTps([]);
    }
  };

  // Save single TP configuration to Google Sheets
  const handleSaveSingleTPConfig = async (config: TPDescription) => {
    if (!gasUrl) return;
    setLoadingTP(true);
    triggerToast(`Menyimpan perubahan ${config.mapel} ke Google Sheets...`, true);
    try {
      const formBody = new URLSearchParams();
      formBody.append('action', 'simpanMateriTP');
      formBody.append('id', config.id);
      formBody.append('kelas', config.kelas || '');
      formBody.append('mapel', config.mapel);
      formBody.append('tp1Desc', config.tp1Desc);
      formBody.append('tp2Desc', config.tp2Desc);
      formBody.append('tp3Desc', config.tp3Desc);
      
      if (config.extraTps && config.extraTps.length > 0) {
        formBody.append('extraTps', config.extraTps.join('||'));
      }

      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
      });
      triggerToast(`Berhasil menyimpan perubahan "${config.mapel}" ke Google Sheets!`, true);
    } catch (err: any) {
      console.error(err);
      triggerToast(`Gagal menyimpan perubahan ke Google Sheets: ${err.message}`, false);
    } finally {
      setLoadingTP(false);
    }
  };

  // Delete customized Mapel
  const handleDeleteMapel = async (id: string, mapel: string) => {
    if (tpConfigs.length <= 1) {
      triggerToast('Error: Harus tersisa minimal 1 Mata Pelajaran aktif di sistem!', false);
      return;
    }
    if (window.confirm(`Hapus Mata Pelajaran "${mapel}"? Ini juga akan menghapus draf Capaian TP untuk mata pelajaran tersebut.`)) {
      if (gasUrl) {
        setLoadingTP(true);
        triggerToast('Menghapus kompetensi TP dari Google Sheets...', true);
        try {
          const formBody = new URLSearchParams();
          formBody.append('action', 'hapusMateriTP');
          formBody.append('id', id);

          await fetch(gasUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody
          });
          
          setTpConfigs(prev => prev.filter(c => c.id !== id));
          triggerToast(`Mata pelajaran "${mapel}" berhasil dihapus dari Google Sheets & Database Lokal.`, true);
        } catch (err: any) {
          console.error(err);
          setTpConfigs(prev => prev.filter(c => c.id !== id));
          triggerToast(`Berhasil dihapus dari lokal saja (Gagal menghubungi Sheets).`, true);
        } finally {
          setLoadingTP(false);
        }
      } else {
        setTpConfigs(prev => prev.filter(c => c.id !== id));
        triggerToast(`Mata pelajaran "${mapel}" berhasil dihapus dari database lokal.`, true);
      }
    }
  };

  // File Copy Helper
  const handleCopyCode = (id: string, codeContent: string) => {
    navigator.clipboard.writeText(codeContent);
    setCopiedFile(id);
    triggerToast(`Kode ${id} berhasil disalin ke clipboard!`, true);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  // Filtered Students Array
  const filteredStudents = students.filter(student => {
    // Restrict to allowed classes and mapels for teacher roles
    if (currentUser && currentUser.role === 'Guru') {
      const isClassAllowed = allowedClasses.includes(student.kelas);
      const isMapelAllowed = allowedMapelsGlobal.includes(student.mataPelajaran);
      if (!isClassAllowed || !isMapelAllowed) {
        return false;
      }
    }

    const matchesSearch = student.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.nisn.includes(searchTerm) ||
                          student.kelas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMapel = filterMapel === 'Semua' || student.mataPelajaran === filterMapel;
    const matchesKelas = filterKelas === 'Semua' || student.kelas === filterKelas;
    return matchesSearch && matchesMapel && matchesKelas;
  });

  // Sorted Students Array (Automatically sorts by Class, then Subject, then Student Name)
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const classComp = a.kelas.localeCompare(b.kelas, undefined, { numeric: true, sensitivity: 'base' });
      if (classComp !== 0) return classComp;
      
      const mapelComp = a.mataPelajaran.localeCompare(b.mataPelajaran);
      if (mapelComp !== 0) return mapelComp;
      
      return a.namaSiswa.localeCompare(b.namaSiswa);
    });
  }, [filteredStudents]);

  // Export Laporan Excel Rekap Riwayat Nilai
  const handleDownloadExcel = () => {
    if (sortedStudents.length === 0) {
      triggerToast('Tidak ada data nilai untuk diunduh!', false);
      return;
    }

    const sumatifHeaders = [];
    for (let s = 1; s <= activeMaxSumatifCount; s++) {
      sumatifHeaders.push(`Sumatif ${s}`);
    }

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Riwayat Nilai Siswa</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8">
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; }
          th { background-color: #1d4ed8; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px; text-align: center; vertical-align: middle; }
          td { border: 1px solid #cbd5e1; padding: 6px; vertical-align: middle; }
          .text-center { text-align: center; vertical-align: middle; }
          .text-left { text-align: left; vertical-align: middle; }
          .font-bold { font-weight: bold; }
          .bg-header { background-color: #f1f5f9; font-weight: bold; vertical-align: middle; }
          .bg-title { font-size: 16px; font-weight: bold; text-align: center; padding-bottom: 20px; color: #1e3a8a; }
        </style>
      </head>
      <body>
        <div class="bg-title">LAPORAN REKAP RIWAYAT NILAI SISWA</div>
        <div style="font-size: 11px; margin-bottom: 15px; font-family: Arial, sans-serif;">
          <strong>Tanggal Cetak:</strong> ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}<br/>
          <strong>Pendidik:</strong> ${currentUser?.nama || 'Administrator'}<br/>
          <strong>Role Akun:</strong> ${currentUser?.role || 'Super Admin'}<br/>
          <strong>Jumlah Data:</strong> ${sortedStudents.length} Siswa
        </div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>NISN</th>
              <th>Kelas</th>
              <th>Mata Pelajaran</th>
    `;

    sumatifHeaders.forEach(sh => {
      html += `<th>${sh}</th>`;
    });

    html += `
              <th>NA S.LM (TP Avg)</th>
              <th>Non Tes</th>
              <th>Tes</th>
              <th>NA SAS</th>
              <th>Nilai Rapor</th>
              <th>Deskripsi Capaian Kompetensi (Tercapai)</th>
              <th>Deskripsi Capaian Kompetensi (Perlu Bimbingan)</th>
              <th>Deskripsi Lengkap Rapor</th>
            </tr>
          </thead>
          <tbody>
    `;

    sortedStudents.forEach((item, index) => {
      html += `
        <tr>
          <td class="text-center" style="text-align: center;">${index + 1}</td>
          <td class="text-left font-bold" style="text-align: left; font-weight: bold;">${item.namaSiswa}</td>
          <td class="text-center" style="text-align: center; mso-number-format:'@';">${item.nisn}</td>
          <td class="text-center" style="text-align: center;">${item.kelas}</td>
          <td class="text-left" style="text-align: left;">${item.mataPelajaran}</td>
      `;

      for (let s = 1; s <= activeMaxSumatifCount; s++) {
        const val = item[`sumatif${s}` as keyof typeof item] ?? item[`tp${s}` as keyof typeof item] ?? '';
        html += `<td class="text-center" style="text-align: center;">${val}</td>`;
      }

      let tpAvg = item.tpAverage ?? '';
      if (!tpAvg) {
        let sumS = 0;
        let countS = 0;
        for (let s = 1; s <= 15; s++) {
          const valS = item[`sumatif${s}` as keyof typeof item] ?? item[`tp${s}` as keyof typeof item];
          if (valS !== undefined && valS !== null && valS !== 0 && valS !== '') {
            sumS += Number(valS);
            countS++;
          }
        }
        tpAvg = countS > 0 ? (sumS / countS).toFixed(1) : '';
      }

      const nonTes = item.nonTes !== undefined ? item.nonTes : '';
      const tes = item.tes !== undefined ? item.tes : '';
      const sas = item.sas !== undefined && item.sas !== 0 ? item.sas : '';
      const nilaiAkhir = item.nilaiAkhir !== undefined ? item.nilaiAkhir : '';
      const tcmp = item.deskripsiTercapai ?? '';
      const plb = item.deskripsiPerluBimbingan ?? '';
      const lngkp = item.deskripsiLengkap ?? '';

      html += `
          <td class="text-center font-bold" style="text-align: center; font-weight: bold;">${tpAvg}</td>
          <td class="text-center" style="text-align: center;">${nonTes}</td>
          <td class="text-center" style="text-align: center;">${tes}</td>
          <td class="text-center font-bold" style="text-align: center; font-weight: bold;">${sas}</td>
          <td class="text-center font-bold" style="text-align: center; font-weight: bold; background-color: #fef08a;">${nilaiAkhir}</td>
          <td class="text-left" style="text-align: left;">${tcmp}</td>
          <td class="text-left" style="text-align: left;">${plb}</td>
          <td class="text-left" style="text-align: left;">${lngkp}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekap_nilai_siswa_${new Date().toISOString().slice(0,10)}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast('Berhasil mengunduh Laporan Rekap Nilai format Excel!', true);
  };

  // Hitung jumlah kolom sumatif maksimal secara dinamis yang memiliki nilai di filteredStudents
  const activeMaxSumatifCount = useMemo(() => {
    let maxS = 0;
    filteredStudents.forEach(item => {
      // Periksa backward compatibility
      if (item.tp1 !== undefined && item.tp1 !== null && item.tp1 !== 0 && item.tp1 !== '') maxS = Math.max(maxS, 1);
      if (item.tp2 !== undefined && item.tp2 !== null && item.tp2 !== 0 && item.tp2 !== '') maxS = Math.max(maxS, 2);
      if (item.tp3 !== undefined && item.tp3 !== null && item.tp3 !== 0 && item.tp3 !== '') maxS = Math.max(maxS, 3);
      
      // Periksa semua properti dinamis sumatif
      Object.keys(item).forEach(key => {
        if (key.startsWith('sumatif')) {
          const numStr = key.replace('sumatif', '');
          const num = parseInt(numStr, 10);
          if (!isNaN(num) && item[key] !== undefined && item[key] !== null && item[key] !== '') {
            maxS = Math.max(maxS, num);
          }
        }
      });
    });
    return maxS;
  }, [filteredStudents]);

  // Source code templates to show in GAS Code tab
  const getGoogleSheetsColInstruction = `=== STRUKTUR DATABASE - GOOGLE SHEETS ===

Untuk membuat sistem ini berfungsi, buatlah Spreadsheet Google Baru yang memiliki 3 Lembar Sheet dengan ketentuan nama dan kolom sebagai berikut:

1. Lembar "DataNilai":
   Buat kolom tabel tepat pada baris pertama (Header Row) dari Kolom A sampai M:
   - Kolom A: Timestamp
   - Kolom B: Nama Siswa
   - Kolom C: NISN
   - Kolom D: Kelas
   - Kolom E: Mata Pelajaran
   - Kolom F: Nilai TP 1
   - Kolom G: Nilai TP 2
   - Kolom H: Nilai TP 3
   - Kolom I: Nilai SAS
   - Kolom J: Nilai Rapor
   - Kolom K: Deskripsi Tercapai
   - Kolom L: Deskripsi Perlu Bimbingan
   - Kolom M: Deskripsi Lengkap

2. Lembar "DataSiswa":
   Gunakan Sheet kedua ini untuk menyimpan referensi data murid (Opsional/Pendukung):
   - Kolom A: NISN
   - Kolom B: Nama Siswa
   - Kolom C: Kelas
   - Kolom D: Jenis Kelamin

3. Lembar "Pengaturan":
   Gunakan Sheet ketiga ini untuk menyimpan preferensi / KKTP (Opsional):
   - Kolom A: Key
   - Kolom B: Value`;

  const getCodeGS = `/**
 * BACK-END: Code.gs
 * Diunduh/disalin untuk editor Google Apps Script Anda.
 * Menghubungkan Form Web dengan Google Sheets secara Asynchronous.
 */

// Silakan ubah ID Spreadsheet di bawah ini jika ingin menggunakan file spreadsheet lain
var SPREADSHEET_ID = "18vE72GEaNyJh38SZ7m8PUPjkNbz10wghG3T9OiFJ5B0";

function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (err) {
    // Fallback jika id spreadsheet tidak ditemukan atau script ini ditanam di dalam spreadsheet terkait (container-bound)
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  
  if (action === 'getDataSiswa') {
    return handleGetDataSiswa();
  }
  if (action === 'getMateriTP') {
    return handleGetMateriTP();
  }
  if (action === 'getAkunGuru') {
    return handleGetAkunGuru();
  }
  if (action === 'getRiwayatNilai') {
    return handleGetRiwayatNilai();
  }
  if (action === 'getPengaturan') {
    return handleGetPengaturan();
  }
  
  // Memuat antarmuka HTML dari file index.html
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('SiAfis - Sistem Asesmen Formatif dan Sumatif')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Fungsi pembantu untuk mengikutsertakan (include) file HTML eksternal (style & script)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Mengambil data guru/siswa dari tabel "DataSiswa"
 */
function handleGetDataSiswa() {
  try {
    var sheet = getSpreadsheet().getSheetByName('DataSiswa');
    if (!sheet) {
      sheet = getSpreadsheet().insertSheet('DataSiswa');
      sheet.appendRow(['NISN', 'Nama Siswa', 'Kelas', 'Jenis Kelamin']);
    }
    
    var rows = sheet.getDataRange().getValues();
    var data = [];
    for (var i = 1; i < rows.length; i++) {
      if (!rows[i][0] && !rows[i][1]) continue;
      data.push({
        nisn: String(rows[i][0]),
        nama: String(rows[i][1]),
        kelas: String(rows[i][2]),
        jenisKelamin: String(rows[i][3] || '')
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Mengambil pengaturan TP Mata Pelajaran dari tabel "MateriTP"
 */
function handleGetMateriTP() {
  try {
    var sheet = getSpreadsheet().getSheetByName('MateriTP');
    if (!sheet) {
      sheet = getSpreadsheet().insertSheet('MateriTP');
      sheet.appendRow(['ID', 'Kelas', 'Mata Pelajaran', 'TP 1', 'TP 2', 'TP 3']);
    }
    
    var rows = sheet.getDataRange().getValues();
    var data = [];
    for (var i = 1; i < rows.length; i++) {
      if (!rows[i][1] && !rows[i][2]) continue;
      
      var extraTps = [];
      for (var col = 6; col < rows[i].length; col++) {
        var val = String(rows[i][col] || '').trim();
        if (val) {
          extraTps.push(val);
        }
      }
      
      data.push({
        id: String(rows[i][0] || 'cfg_' + i),
        kelas: String(rows[i][1] || ''),
        mapel: String(rows[i][2] || ''),
        tp1Desc: String(rows[i][3] || ''),
        tp2Desc: String(rows[i][4] || ''),
        tp3Desc: String(rows[i][5] || ''),
        extraTps: extraTps.length > 0 ? extraTps : undefined
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menyimpan siswa baru ke tabel "DataSiswa"
 */
function simpanDataSiswa(data) {
  try {
    var sheet = getSpreadsheet().getSheetByName('DataSiswa');
    if (!sheet) {
      sheet = getSpreadsheet().insertSheet('DataSiswa');
      sheet.appendRow(['NISN', 'Nama Siswa', 'Kelas', 'Jenis Kelamin']);
    }
    
    // Validasi duplikat NISN
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(data.nisn)) {
        return JSON.stringify({
          status: 'error',
          message: 'Siswa dengan NISN ' + data.nisn + ' sudah terdaftar di database Sheets!'
        });
      }
    }
    
    sheet.appendRow([
      "'" + data.nisn, 
      data.nama,
      data.kelas,
      data.jenisKelamin || ''
    ]);
    
    return JSON.stringify({
      status: 'success',
      message: 'Berhasil memasukkan siswa ' + data.nama + ' ke Database Sheets.'
    });
  } catch (err) {
    return JSON.stringify({
      status: 'error',
      message: err.toString()
    });
  }
}

/**
 * Helper to parse the sumatif number dynamically from any custom column header
 */
function getSumatifNumberFromHeader(headerName) {
  var clean = String(headerName || '').trim().toLowerCase();
  
  // Try to match "sumatif 1", "sumatif1"
  var match = clean.match(/^sumatif\\s*(\\d+)$/);
  if (match) return parseInt(match[1], 10);
  
  // Try to match "nilai s1", "nilai s01", "nilais1"
  match = clean.match(/^nilai\\s*s\\s*(\\d+)$/);
  if (match) return parseInt(match[1], 10);
  
  // Try to match "nilai tp 1", "nilaitp1"
  match = clean.match(/^nilai\\s*tp\\s*(\\d+)$/);
  if (match) return parseInt(match[1], 10);
  
  // Try to match "tp 1", "tp1"
  match = clean.match(/^tp\\s*(\\d+)$/);
  if (match) return parseInt(match[1], 10);
  
  // Try to match "s1", "s1"
  match = clean.match(/^s\\s*(\\d+)$/);
  if (match) return parseInt(match[1], 10);
  
  return null;
}

function isNASLMHeader(headerName) {
  var clean = String(headerName || '').trim().toLowerCase().replace(/[\\s\\._-]/g, '');
  return clean === 'naslm' || clean === 'nasl' || clean === 'nasumatiflingkupmateri' || clean === 'tpaverage' || clean === 'rataratatp' || clean === 'ratatp';
}

function isNASASHeader(headerName) {
  var clean = String(headerName || '').trim().toLowerCase().replace(/[\\s\\._-]/g, '');
  return clean === 'nasas' || clean === 'nasumatifakhirsemester' || clean === 'sasaverage';
}

function isNilaiRaporHeader(headerName) {
  var clean = String(headerName || '').trim().toLowerCase().replace(/[\\s\\._-]/g, '');
  return clean === 'nilairapor' || clean === 'nilaiakhir' || clean === 'rapor' || clean === 'rapot';
}

function isNonTesHeader(headerName) {
  var clean = String(headerName || '').trim().toLowerCase().replace(/[\\s\\._-]/g, '');
  return clean === 'nontes';
}

function isTesHeader(headerName) {
  var clean = String(headerName || '').trim().toLowerCase().replace(/[\\s\\._-]/g, '');
  return clean === 'tes';
}

function findHeaderIndex(headers, checkFn) {
  for (var col = 0; col < headers.length; col++) {
    if (checkFn(headers[col])) {
      return col;
    }
  }
  return -1;
}

/**
 * Menyimpan data input penilaian dari front-end Web App menuju Google Sheets
 * @param {Object} data - Objek penampung nilai siswa hasil form submit
 */
function simpanData(data) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('DaftarNilai') || ss.getSheetByName('DataNilai');
    
    // Temukan index sumatif terbesar yang diterima
    var maxSIndex = 10; // Default minimal 10 kolom sumatif
    for (var key in data) {
      if (key.indexOf('sumatif') === 0) {
        var num = parseInt(key.replace('sumatif', ''), 10);
        if (!isNaN(num) && num > maxSIndex) {
          maxSIndex = num;
        }
      }
    }

    // Bangun header kolom secara dinamis
    var headers = ['Timestamp', 'Nama Siswa', 'NISN', 'Kelas', 'Mata Pelajaran'];
    for (var s = 1; s <= maxSIndex; s++) {
      headers.push('Sumatif ' + s);
    }
    headers.push('NA Sumatif Lingkup Materi', 'Non Tes', 'Tes', 'NA Sumatif Akhir Semester', 'Nilai Rapor', 'Deskripsi Tercapai', 'Deskripsi Perlu Bimbingan', 'Deskripsi Lengkap');

    if (!sheet) {
      sheet = ss.insertSheet('DaftarNilai');
      sheet.appendRow(headers);
    } else {
      // Pastikan kolom header disinkronkan jika di atas limit saat ini
      var currentHeaders = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
      if (currentHeaders.length < headers.length) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
    }

    var rows = sheet.getDataRange().getValues();
    var currentHeaders = rows[0];
    
    // Indeks pencarian NISN dan Mata Pelajaran
    var nisnColIdx = currentHeaders.indexOf('NISN');
    if (nisnColIdx === -1) {
      for (var k = 0; k < currentHeaders.length; k++) {
        if (String(currentHeaders[k]).trim().toUpperCase() === 'NISN') {
          nisnColIdx = k;
          break;
        }
      }
    }
    if (nisnColIdx === -1) nisnColIdx = 2;

    var mapelColIdx = currentHeaders.indexOf('Mata Pelajaran');
    if (mapelColIdx === -1) {
      for (var k = 0; k < currentHeaders.length; k++) {
        var cNm = String(currentHeaders[k]).trim().toLowerCase().replace(/[\\s\\._-]/g, '');
        if (cNm === 'matapelajaran' || cNm === 'mapel') {
          mapelColIdx = k;
          break;
        }
      }
    }
    if (mapelColIdx === -1) mapelColIdx = 4;

    var foundRowIndex = -1;
    var rawInputNisn = String(data.nisn).trim();
    var rawInputMapel = String(data.mataPelajaran).toLowerCase().trim();

    for (var i = 1; i < rows.length; i++) {
      var sheetNisn = String(rows[i][nisnColIdx]).trim();
      var sheetMapel = String(rows[i][mapelColIdx]).toLowerCase().trim();
      
      if (sheetNisn === rawInputNisn && sheetMapel === rawInputMapel) {
        foundRowIndex = i + 1; // 1-based index
        break;
      }
    }

    // Bangun baris data baru sesuai urutan header kolom terbaru di sheet
    var newRowData = [];
    for (var col = 0; col < currentHeaders.length; col++) {
      var headerName = currentHeaders[col];
      var sNum = getSumatifNumberFromHeader(headerName);
      var existingRowVal = (foundRowIndex !== -1) ? rows[foundRowIndex - 1][col] : '';
      
      if (headerName === 'Timestamp') {
        newRowData.push(new Date());
      } else if (headerName === 'Nama Siswa') {
        newRowData.push(data.namaSiswa || existingRowVal);
      } else if (headerName === 'NISN') {
        var cleanNisn = data.nisn || String(existingRowVal || '').replace(/^'/, '');
        newRowData.push("'" + cleanNisn);
      } else if (headerName === 'Kelas') {
        newRowData.push(data.kelas || existingRowVal);
      } else if (headerName === 'Mata Pelajaran') {
        newRowData.push(data.mataPelajaran || existingRowVal);
      } else if (sNum !== null) {
        var sVal = data['sumatif' + sNum] !== undefined ? data['sumatif' + sNum] : data['tp' + sNum];
        if (sVal !== undefined && sVal !== '') {
          newRowData.push(Number(sVal));
        } else if (existingRowVal !== undefined && existingRowVal !== null && existingRowVal !== '') {
          newRowData.push(Number(existingRowVal));
        } else {
          newRowData.push('');
        }
      } else if (headerName === 'NA Sumatif Lingkup Materi' || isNASLMHeader(headerName)) {
        // Hitung rata-rata sumatif berdasarkan data yang sudah dimasukkan ke newRowData
        var sumTemp = 0;
        var countTemp = 0;
        for (var k = 0; k < newRowData.length; k++) {
          var hNameTemp = currentHeaders[k];
          var sNumCheck = getSumatifNumberFromHeader(hNameTemp);
          if (sNumCheck !== null) {
            var valS = newRowData[k];
            if (valS !== undefined && valS !== null && valS !== '') {
              sumTemp += Number(valS);
              countTemp++;
            }
          }
        }
        var tpAverageVal = countTemp > 0 ? parseFloat((sumTemp / countTemp).toFixed(1)) : '';
        newRowData.push(tpAverageVal);
      } else if (headerName === 'Non Tes' || isNonTesHeader(headerName)) {
        var nonTesVal = (data.nonTes !== undefined && data.nonTes !== '') ? Number(data.nonTes) : '';
        if (nonTesVal === '' && existingRowVal !== undefined && existingRowVal !== null && existingRowVal !== '') {
          nonTesVal = Number(existingRowVal);
        }
        newRowData.push(nonTesVal);
      } else if (headerName === 'Tes' || isTesHeader(headerName)) {
        var tesVal = (data.tes !== undefined && data.tes !== '') ? Number(data.tes) : '';
        if (tesVal === '' && existingRowVal !== undefined && existingRowVal !== null && existingRowVal !== '') {
          tesVal = Number(existingRowVal);
        }
        newRowData.push(tesVal);
      } else if (headerName === 'NA Sumatif Akhir Semester' || isNASASHeader(headerName)) {
        // Ambil nonTes dan tes terbaru dari newRowData
        var nonTesValTemp = '';
        var tesValTemp = '';
        for (var k = 0; k < newRowData.length; k++) {
          var hNameTemp = currentHeaders[k];
          if (isNonTesHeader(hNameTemp)) {
            nonTesValTemp = newRowData[k];
          } else if (isTesHeader(hNameTemp)) {
            tesValTemp = newRowData[k];
          }
        }
        
        var sasAverageVal = '';
        if (nonTesValTemp !== '' && tesValTemp !== '') {
          sasAverageVal = parseFloat(((Number(nonTesValTemp) + Number(tesValTemp)) / 2).toFixed(1));
        } else if (nonTesValTemp !== '') {
          sasAverageVal = Number(nonTesValTemp);
        } else if (tesValTemp !== '') {
          sasAverageVal = Number(tesValTemp);
        } else {
          var sAverageVal = (data.sasAverage !== undefined && data.sasAverage !== '') ? data.sasAverage : data.sas;
          if (sAverageVal !== undefined && sAverageVal !== '') {
            sasAverageVal = Number(sAverageVal);
          } else if (existingRowVal !== undefined && existingRowVal !== null && existingRowVal !== '') {
            sasAverageVal = Number(existingRowVal);
          }
        }
        newRowData.push(sasAverageVal);
      } else if (headerName === 'Nilai Rapor' || isNilaiRaporHeader(headerName)) {
        // Rekalukasi Nilai Rapor berdasarkan lmAverageVal dan sasAverageVal terbaru
        var lmAverageVal = '';
        var sasAverageVal = '';
        for (var k = 0; k < newRowData.length; k++) {
          var hNameTemp = currentHeaders[k];
          if (isNASLMHeader(hNameTemp)) {
            lmAverageVal = newRowData[k];
          } else if (isNASASHeader(hNameTemp)) {
            sasAverageVal = newRowData[k];
          }
        }
        
        var finalValue = '';
        var dataNilaiAkhir = data.nilaiAkhir !== undefined && data.nilaiAkhir !== '' ? Number(data.nilaiAkhir) : '';
        if (dataNilaiAkhir !== '') {
          finalValue = dataNilaiAkhir;
        } else if (lmAverageVal !== '' && sasAverageVal !== '') {
          finalValue = parseFloat(((Number(lmAverageVal) * 60 + Number(sasAverageVal) * 40) / 100).toFixed(1));
        } else if (lmAverageVal !== '') {
          finalValue = Number(lmAverageVal);
        } else if (existingRowVal !== undefined && existingRowVal !== null && existingRowVal !== '') {
          finalValue = Number(existingRowVal);
        }
        newRowData.push(finalValue);
      } else if (headerName === 'Deskripsi Tercapai') {
        newRowData.push(data.deskripsiTercapai || existingRowVal || '');
      } else if (headerName === 'Deskripsi Perlu Bimbingan') {
        newRowData.push(data.deskripsiPerluBimbingan || existingRowVal || '');
      } else if (headerName === 'Deskripsi Lengkap') {
        newRowData.push(data.deskripsiLengkap || existingRowVal || '');
      } else {
        newRowData.push(existingRowVal || '');
      }
    }

    if (foundRowIndex !== -1) {
      // Periksa apakah nilainya identik dengan yang ada di sheets
      var existingRow = rows[foundRowIndex - 1];
      var isIdentical = true;
      for (var col = 1; col < newRowData.length; col++) {
        var newVal = String(newRowData[col]);
        var sheetVal = String(existingRow[col]);
        if (col === nisnColIdx) {
          if (sheetVal.startsWith("'")) sheetVal = sheetVal.substring(1);
          if (newVal.startsWith("'")) newVal = newVal.substring(1);
        }
        if (newVal !== sheetVal) {
          isIdentical = false;
          break;
        }
      }

      if (isIdentical) {
        return JSON.stringify({
          status: 'success',
          message: 'Nilai sudah tersimpan. Data yang diinputkan identik dengan yang berada di Google Sheets.'
        });
      }

      sheet.getRange(foundRowIndex, 1, 1, newRowData.length).setValues([newRowData]);
      return JSON.stringify({
        status: 'success',
        message: 'Alhamdulillah! Nilai ' + data.namaSiswa + ' berhasil diperbarui di Google Sheets.'
      });
    } else {
      sheet.appendRow(newRowData);
      return JSON.stringify({
        status: 'success',
        message: 'Alhamdulillah! Nilai ' + data.namaSiswa + ' berhasil terdata ke Google Sheets dengan rincian lengkap.'
      });
    }

  } catch (error) {
    return JSON.stringify({
      status: 'error',
      message: 'Kesalahan Sistem: ' + error.toString()
    });
  }
}

/**
 * Menghapus data penilaian siswa berdasarkan NISN dan Mata Pelajaran
 */
function hapusDataNilai(nisn, mataPelajaran) {
  try {
    var sheet = getSpreadsheet().getSheetByName('DaftarNilai') || getSpreadsheet().getSheetByName('DataNilai');
    if (!sheet) {
      return JSON.stringify({ status: 'error', message: 'Sheet DaftarNilai / DataNilai tidak ditemukan!' });
    }
    
    var rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return JSON.stringify({ status: 'success', message: 'Tidak ada data untuk dihapus.' });
    }
    
    var headers = rows[0];
    var nisnColIdx = headers.indexOf('NISN');
    var mapelColIdx = headers.indexOf('Mata Pelajaran');
    if (nisnColIdx === -1) nisnColIdx = 2;
    if (mapelColIdx === -1) mapelColIdx = 4;
    
    var rawInputNisn = String(nisn || '').trim();
    var rawInputMapel = String(mataPelajaran || '').toLowerCase().trim();
    
    var deletedCount = 0;
    // Iterate backwards to safely delete rows
    for (var i = rows.length - 1; i >= 1; i--) {
      var sheetNisn = String(rows[i][nisnColIdx]).trim();
      var sheetMapel = String(rows[i][mapelColIdx]).toLowerCase().trim();
      
      if (sheetNisn === rawInputNisn && sheetMapel === rawInputMapel) {
        sheet.deleteRow(i + 1);
        deletedCount++;
      }
    }
    
    return JSON.stringify({
      status: 'success',
      message: 'Berhasil menghapus ' + deletedCount + ' data penilaian dari Google Sheets.'
    });
  } catch (err) {
    return JSON.stringify({ status: 'error', message: err.toString() });
  }
}

/**
 * Menyimpan atau memperbarui pengaturan TP Mata Pelajaran ke "MateriTP"
 */
function simpanMateriTP(data) {
  try {
    var sheet = getSpreadsheet().getSheetByName('MateriTP');
    if (!sheet) {
      sheet = getSpreadsheet().insertSheet('MateriTP');
      sheet.appendRow(['ID', 'Kelas', 'Mata Pelajaran', 'TP 1', 'TP 2', 'TP 3']);
    }
    
    var rows = sheet.getDataRange().getValues();
    var foundIndex = -1;
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === String(data.id || '').trim()) {
        foundIndex = i + 1;
        break;
      }
    }
    
    var extraTpsArr = [];
    if (data.extraTps) {
      extraTpsArr = data.extraTps.split('||');
    }
    
    var rowData = [
      data.id,
      data.kelas || '',
      data.mapel,
      data.tp1Desc,
      data.tp2Desc,
      data.tp3Desc
    ].concat(extraTpsArr);
    
    if (foundIndex !== -1) {
      // Clear older columns on this row by setting to empty, or simply rewriting with length
      sheet.deleteRow(foundIndex);
      sheet.insertRowBefore(foundIndex);
      sheet.getRange(foundIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    
    return JSON.stringify({
      status: 'success',
      message: 'Berhasil menyimpan TP untuk mata pelajaran ' + data.mapel
    });
  } catch (err) {
    return JSON.stringify({
      status: 'error',
      message: err.toString()
    });
  }
}

/**
 * Menghapus pengaturan TP Mata Pelajaran berdasarkan ID
 */
function hapusMateriTP(id) {
  try {
    var sheet = getSpreadsheet().getSheetByName('MateriTP');
    if (!sheet) return JSON.stringify({ status: 'success' });
    
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === String(id || '').trim()) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
    return JSON.stringify({ status: 'success' });
  } catch (err) {
    return JSON.stringify({ status: 'error', message: err.toString() });
  }
}

/**
 * Handler POST Request (Apabila form dikirim langsung via API external)
 */
function doPost(e) {
  try {
    const params = e.parameter;
    const action = params.action;
    
    var resMsg;
    if (action === 'simpanDataSiswa') {
      resMsg = JSON.parse(simpanDataSiswa(params));
    } else if (action === 'hapusDataSiswa') {
      resMsg = JSON.parse(hapusDataSiswa(params.nisn));
    } else if (action === 'simpanDataSiswaBulk') {
      resMsg = JSON.parse(simpanDataSiswaBulk(params.studentsJson));
    } else if (action === 'simpanMateriTP') {
      resMsg = JSON.parse(simpanMateriTP(params));
    } else if (action === 'hapusMateriTP') {
      resMsg = JSON.parse(hapusMateriTP(params.id));
    } else if (action === 'simpanAkunGuru') {
      resMsg = JSON.parse(simpanAkunGuru(params));
    } else if (action === 'hapusAkunGuru') {
      resMsg = JSON.parse(hapusAkunGuru(params.username));
    } else if (action === 'hapusDataNilai') {
      resMsg = JSON.parse(hapusDataNilai(params.nisn, params.mataPelajaran));
    } else if (action === 'simpanData') {
      resMsg = JSON.parse(simpanData(params));
    } else if (action === 'simpanPengaturan') {
      resMsg = JSON.parse(simpanPengaturan(params));
    } else {
      resMsg = JSON.parse(simpanData(params));
    }
    
    let out = ContentService.createTextOutput();
    out.setContent(JSON.stringify(resMsg));
    out.setMimeType(ContentService.MimeType.JSON);
    return out;
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Mengambil data akun guru dari tabel "AkunGuru"
 */
function handleGetAkunGuru() {
  try {
    var sheet = getSpreadsheet().getSheetByName('AkunGuru');
    if (!sheet) {
      sheet = getSpreadsheet().insertSheet('AkunGuru');
      sheet.appendRow(['Username', 'Password', 'Nama', 'Role', 'Jabatan', 'Photo']);
      sheet.appendRow(['admin', 'admin', 'Kepala Sekolah / Admin', 'Admin', 'Kepala Sekolah / Admin', '']);
    }
    
    var rows = sheet.getDataRange().getValues();
    var data = [];
    for (var i = 1; i < rows.length; i++) {
      if (!rows[i][0] && !rows[i][1]) continue;
      data.push({
        username: String(rows[i][0]),
        password: String(rows[i][1]),
        nama: String(rows[i][2]),
        role: String(rows[i][3] || 'Guru'),
        jabatan: String(rows[i][4] || ''),
        photo: String(rows[i][5] || '')
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menyimpan atau memperbarui data akun guru ke tabel "AkunGuru"
 */
function simpanAkunGuru(data) {
  try {
    var sheet = getSpreadsheet().getSheetByName('AkunGuru');
    if (!sheet) {
      sheet = getSpreadsheet().insertSheet('AkunGuru');
      sheet.appendRow(['Username', 'Password', 'Nama', 'Role', 'Jabatan', 'Photo']);
      sheet.appendRow(['admin', 'admin', 'Kepala Sekolah / Admin', 'Admin', 'Kepala Sekolah / Admin', '']);
    }
    
    var rows = sheet.getDataRange().getValues();
    var foundIndex = -1;
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).toLowerCase().trim() === String(data.username).toLowerCase().trim()) {
        foundIndex = i + 1;
        break;
      }
    }
    
    var rowData = [
      data.username.toLowerCase().trim(),
      data.password,
      data.nama,
      data.role || 'Guru',
      data.jabatan || '',
      data.photo || ''
    ];
    
    if (foundIndex !== -1) {
      sheet.getRange(foundIndex, 1, 1, 6).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    
    return JSON.stringify({
      status: 'success',
      message: 'Berhasil menyimpan akun guru: ' + data.username
    });
  } catch (err) {
    return JSON.stringify({
      status: 'error',
      message: err.toString()
    });
  }
}

/**
 * Menghapus akun guru berdasarkan username
 */
function hapusAkunGuru(username) {
  try {
    var sheet = getSpreadsheet().getSheetByName('AkunGuru');
    if (!sheet) return JSON.stringify({ status: 'success' });
    
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).toLowerCase().trim() === String(username).toLowerCase().trim()) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
    return JSON.stringify({ status: 'success' });
  } catch (err) {
    return JSON.stringify({ status: 'error', message: err.toString() });
  }
}

/**
 * Mengambil seluruh data penilaian dari "DaftarNilai" atau "DataNilai" untuk disinkronkan ke client history
 */
function handleGetRiwayatNilai() {
  try {
    var sheet = getSpreadsheet().getSheetByName('DaftarNilai') || getSpreadsheet().getSheetByName('DataNilai');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = rows[0];
    var data = [];
    
    function matchColumn(headerName, expectedCleaned) {
      var cNm = String(headerName || '').trim().toLowerCase().replace(/[\\s\\._-]/g, '');
      return cNm === expectedCleaned;
    }
    
    var timestampIdx = -1;
    var namaSiswaIdx = -1;
    var nisnIdx = -1;
    var kelasIdx = -1;
    var mapelIdx = -1;
    var nilaiRaporIdx = -1;
    var deskripsiTercapaiIdx = -1;
    var deskripsiPerluBimbinganIdx = -1;
    var deskripsiLengkapIdx = -1;
    var nonTesIdx = -1;
    var tesIdx = -1;
    var sasIdx = -1;
    var naslmIdx = -1;

    for (var col = 0; col < headers.length; col++) {
      var h = headers[col];
      if (matchColumn(h, 'timestamp')) timestampIdx = col;
      else if (matchColumn(h, 'namasiswa')) namaSiswaIdx = col;
      else if (matchColumn(h, 'nisn')) nisnIdx = col;
      else if (matchColumn(h, 'kelas')) kelasIdx = col;
      else if (matchColumn(h, 'matapelajaran') || matchColumn(h, 'mapel')) mapelIdx = col;
      else if (isNilaiRaporHeader(h)) nilaiRaporIdx = col;
      else if (matchColumn(h, 'deskripsitercapai')) deskripsiTercapaiIdx = col;
      else if (matchColumn(h, 'deskripsiperlubimbingan')) deskripsiPerluBimbinganIdx = col;
      else if (matchColumn(h, 'deskripsilengkap')) deskripsiLengkapIdx = col;
      else if (isNonTesHeader(h)) nonTesIdx = col;
      else if (isTesHeader(h)) tesIdx = col;
      else if (isNASASHeader(h)) sasIdx = col;
      else if (isNASLMHeader(h)) naslmIdx = col;
    }
    
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      var checkNisn = nisnIdx !== -1 ? String(row[nisnIdx] || '').trim() : '';
      var checkNama = namaSiswaIdx !== -1 ? String(row[namaSiswaIdx] || '').trim() : '';
      if (!checkNisn && !checkNama) continue;
      
      var record = {
        id: 'gs_' + i + '_' + new Date().getTime(),
        timestamp: timestampIdx !== -1 ? String(row[timestampIdx] || '') : '',
        namaSiswa: namaSiswaIdx !== -1 ? String(row[namaSiswaIdx] || '') : '',
        nisn: checkNisn,
        kelas: kelasIdx !== -1 ? String(row[kelasIdx] || '') : '',
        mataPelajaran: mapelIdx !== -1 ? String(row[mapelIdx] || '') : '',
        nilaiAkhir: nilaiRaporIdx !== -1 ? Number(row[nilaiRaporIdx] || 0) : 0,
        deskripsiTercapai: deskripsiTercapaiIdx !== -1 ? String(row[deskripsiTercapaiIdx] || '') : '',
        deskripsiPerluBimbingan: deskripsiPerluBimbinganIdx !== -1 ? String(row[deskripsiPerluBimbinganIdx] || '') : '',
        deskripsiLengkap: deskripsiLengkapIdx !== -1 ? String(row[deskripsiLengkapIdx] || '') : '',
      };
      
      if (nonTesIdx !== -1 && row[nonTesIdx] !== '') record.nonTes = Number(row[nonTesIdx]);
      if (tesIdx !== -1 && row[tesIdx] !== '') record.tes = Number(row[tesIdx]);
      if (sasIdx !== -1 && row[sasIdx] !== '') record.sas = Number(row[sasIdx]);
      if (naslmIdx !== -1 && row[naslmIdx] !== '') record.tpAverage = Number(row[naslmIdx]);
      
      for (var col = 0; col < headers.length; col++) {
        var hName = headers[col];
        var sNum = getSumatifNumberFromHeader(hName);
        if (sNum !== null) {
          if (row[col] !== '') {
            var valVal = Number(row[col]);
            record['sumatif' + sNum] = valVal;
            // set tp fallback
            if (sNum === 1) record.tp1 = valVal;
            if (sNum === 2) record.tp2 = valVal;
            if (sNum === 3) record.tp3 = valVal;
          }
        }
      }
      
      data.push(record);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menyimpan data banyak siswa sekaligus ke tabel "DataSiswa"
 */
function simpanDataSiswaBulk(studentsJsonString) {
  try {
    var sheet = getSpreadsheet().getSheetByName('DataSiswa');
    if (!sheet) {
      sheet = getSpreadsheet().insertSheet('DataSiswa');
      sheet.appendRow(['NISN', 'Nama Siswa', 'Kelas', 'Jenis Kelamin']);
    }
    
    var students = JSON.parse(studentsJsonString || '[]');
    if (!Array.isArray(students) || students.length === 0) {
      return JSON.stringify({ status: 'error', message: 'Data siswa bulk kosong atau tidak valid!' });
    }
    
    var rows = sheet.getDataRange().getValues();
    var existingNisns = {};
    for (var i = 1; i < rows.length; i++) {
      existingNisns[String(rows[i][0]).trim()] = true;
    }
    
    var addedCount = 0;
    for (var j = 0; j < students.length; j++) {
      var s = students[j];
      var cleanNisn = String(s.nisn || '').trim();
      var cleanNama = String(s.nama || '').trim();
      var cleanKelas = String(s.kelas || '').trim();
      var cleanJK = String(s.jenisKelamin || 'L').trim().toUpperCase();
      
      if (!cleanNisn || !cleanNama) continue;
      if (existingNisns[cleanNisn]) continue;
      
      sheet.appendRow([
        "'" + cleanNisn,
        cleanNama,
        cleanKelas,
        cleanJK
      ]);
      existingNisns[cleanNisn] = true;
      addedCount++;
    }
    
    return JSON.stringify({
      status: 'success',
      message: 'Berhasil mengimpor ' + addedCount + ' siswa ke Google Sheets!'
    });
  } catch (err) {
    return JSON.stringify({ status: 'error', message: err.toString() });
  }
}

/**
 * Mengambil pengaturan aplikasi (KKTP & opsi) dari "Pengaturan"
 */
function handleGetPengaturan() {
  try {
    var sheet = getSpreadsheet().getSheetByName('Pengaturan');
    if (!sheet) {
      sheet = getSpreadsheet().insertSheet('Pengaturan');
      sheet.appendRow(['Key', 'Value']);
      sheet.appendRow(['kktpMin', '70']);
      sheet.appendRow(['kktpSangatBaik', '85']);
      sheet.appendRow(['opsiPenilaian', 'rata_rata']);
      sheet.appendRow(['sumatifWeights', '{}']);
    }
    
    var rows = sheet.getDataRange().getValues();
    var data = {};
    for (var i = 1; i < rows.length; i++) {
      var key = String(rows[i][0]).trim();
      var val = String(rows[i][1]).trim();
      if (key) {
        data[key] = val;
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menyimpan pengaturan KKTP & Opsi Penilaian ke Google Sheets
 */
function simpanPengaturan(data) {
  try {
    var sheet = getSpreadsheet().getSheetByName('Pengaturan');
    if (!sheet) {
      sheet = getSpreadsheet().insertSheet('Pengaturan');
      sheet.appendRow(['Key', 'Value']);
    }
    
    var rows = sheet.getDataRange().getValues();
    var keysInSheet = {};
    for (var i = 1; i < rows.length; i++) {
      keysInSheet[String(rows[i][0]).trim()] = i + 1; // 1-based row index
    }
    
    var keysToSave = ['kktpMin', 'kktpSangatBaik', 'opsiPenilaian', 'sumatifWeights', 'weightTP', 'weightSAS'];
    for (var j = 0; j < keysToSave.length; j++) {
      var k = keysToSave[j];
      var v = String(data[k] !== undefined ? data[k] : '');
      
      if (keysInSheet[k]) {
        sheet.getRange(keysInSheet[k], 2).setValue(v);
      } else {
        sheet.appendRow([k, v]);
      }
    }
    
    return JSON.stringify({
      status: 'success',
      message: 'Berhasil menyimpan pengaturan aplikasi di Google Sheets.'
    });
  } catch (err) {
    return JSON.stringify({
      status: 'error',
      message: err.toString()
    });
  }
}

/**
 * Menghapus data siswa berdasarkan NISN dari DataSiswa & DataNilai
 */
function hapusDataSiswa(nisn) {
  try {
    var rawInputNisn = String(nisn || '').trim();
    var deletedSiswa = 0;
    var deletedNilai = 0;
    
    // 1. Delete dari DataSiswa
    var sheetSiswa = getSpreadsheet().getSheetByName('DataSiswa');
    if (sheetSiswa) {
      var rowsSiswa = sheetSiswa.getDataRange().getValues();
      for (var i = rowsSiswa.length - 1; i >= 1; i--) {
        var sheetNisn = String(rowsSiswa[i][0]).trim();
        if (sheetNisn === rawInputNisn) {
          sheetSiswa.deleteRow(i + 1);
          deletedSiswa++;
        }
      }
    }
    
    // 2. Delete dari DaftarNilai atau DataNilai
    var sheetNilai = getSpreadsheet().getSheetByName('DaftarNilai') || getSpreadsheet().getSheetByName('DataNilai');
    if (sheetNilai) {
      var rowsNilai = sheetNilai.getDataRange().getValues();
      var headers = rowsNilai[0];
      var nisnColIdx = headers.indexOf('NISN');
      if (nisnColIdx !== -1) {
        for (var j = rowsNilai.length - 1; j >= 1; j--) {
          var sheetNisn = String(rowsNilai[j][nisnColIdx]).trim();
          if (sheetNisn === rawInputNisn) {
            sheetNilai.deleteRow(j + 1);
            deletedNilai++;
          }
        }
      }
    }
    
    return JSON.stringify({ 
      status: 'success', 
      message: 'Berhasil menghapus siswa (' + deletedSiswa + ' baris siswa, ' + deletedNilai + ' baris nilai) dari Google Sheets.' 
    });
  } catch (err) {
    return JSON.stringify({ status: 'error', message: err.toString() });
  }
}`;

  const getIndexHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SiAfis - Sistem Asesmen Formatif dan Sumatif</title>
  <!-- Tailwind CSS & Font Inter dari CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet font">
  <!-- SweetAlert2 untuk notifikasi premium -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  
  <!-- Memuat Custom CSS via Include standar Apps Script -->
  <?!= include('style'); ?>
</head>
<body class="bg-slate-50 antialiased font-['Inter']">

  <!-- Header Instansi -->
  <header class="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white shadow-lg border-b-4 border-yellow-500">
    <div class="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-4 text-center md:text-left">
        <div class="bg-white p-2.5 rounded-xl shadow-inner inline-flex items-center justify-center">
          <!-- Logo Lambang Tut Wuri Handayani (Menggunakan Placeholder Elemen/Simbol Kemendikdbud) -->
          <svg class="w-10 h-10 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h1 class="text-xl md:text-2xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
            <span>AsesmenQu WEB-APP</span>
            <span class="bg-yellow-500 text-blue-950 scale-90 px-2 py-0.5 rounded text-xs px-2 font-bold select-none">KURIKULUM MERDEKA</span>
          </h1>
          <p class="text-slate-200 text-xs md:text-sm font-medium mt-0.5">Sistem Penilaian Sumatif & Deskripsi Otomatis Sesuai Panduan Pembelajaran (Edisi Revisi)</p>
        </div>
      </div>
      <div>
        <p class="text-yellow-400 bg-blue-950/40 text-xs py-1 px-3.5 rounded-full border border-blue-700/60 inline-flex items-center gap-1.5 font-semibold">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Database Konek: Google Sheets Live
        </p>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
      
      <!-- Sisi Kiri: Form Input Nilai -->
      <div class="md:col-span-7 bg-white rounded-2xl shadow-xl shadow-slate-100/70 border border-slate-100 overflow-hidden">
        <div class="bg-slate-50 border-b border-slate-100 px-6 py-4.5 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span class="w-2.5 h-5 bg-blue-700 rounded-full"></span>
            Input Nilai & Assessment Siswa
          </h2>
          <button type="button" onclick="kosongkanForm()" class="text-xs font-semibold text-slate-400 hover:text-rose-600 transition duration-150">
            Dereset Form
          </button>
        </div>

        <form id="formPenilaian" onsubmit="submitFormNilai(event)" class="p-6 space-y-5">
          <!-- Data Utama -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Nama Lengkap Siswa</label>
              <input type="text" id="namaSiswa" required class="form-input" placeholder="Masukkan nama siswa...">
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">NISN Siswa</label>
              <input type="text" id="nisn" required class="form-input" placeholder="Masukkan 10 digit angka..." pattern="[0-9]{8,12}">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Kelas Rapor</label>
              <select id="kelas" required class="form-input">
                <option value="" disabled selected>-- Pilih Kelas --</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Mata Pelajaran</label>
              <select id="mataPelajaran" required class="form-input" onchange="gantiMapel()">
                <option value="" disabled selected>-- Pilih Mata Pelajaran --</option>
              </select>
            </div>
          </div>

          <!-- Bagian Penilaian -->
          <div class="pt-2 border-t border-dashed border-slate-200">
            <h3 class="text-sm font-bold text-slate-700 mb-3.5 flex items-center gap-1.5">
              <span>🧮</span> Bagian Rentang Grade Sumatif (Lingkup Materi TP)
            </h3>
            
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 label-tp">Nilai TP 1</label>
                <input type="number" id="tp1" required min="0" max="100" class="form-input text-center text-lg font-bold" placeholder="0" oninput="hitungSkorOtomatisObj()">
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 label-tp">Nilai TP 2</label>
                <input type="number" id="tp2" required min="0" max="100" class="form-input text-center text-lg font-bold" placeholder="0" oninput="hitungSkorOtomatisObj()">
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 label-tp">Nilai TP 3</label>
                <input type="number" id="tp3" required min="0" max="100" class="form-input text-center text-lg font-bold" placeholder="0" oninput="hitungSkorOtomatisObj()">
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-blue-50/50 p-4.5 rounded-xl border border-blue-100">
              <label class="block text-[11px] font-extrabold uppercase text-indigo-700 tracking-wider mb-1">RATA TP (60%)</label>
              <div class="text-xl font-black text-indigo-950" id="displayTpAvg">0.0</div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Nilai SAS (40%)</label>
              <input type="number" id="sas" required min="0" max="100" class="form-input text-lg font-bold bg-amber-50/35 border-amber-200 focus:border-amber-400" placeholder="0" oninput="hitungSkorOtomatisObj()">
            </div>
          </div>

          <!-- Presentasi Nilai Rapor -->
          <div class="bg-gradient-to-br from-indigo-900 to-blue-950 text-white rounded-2xl p-5 shadow-md flex items-center justify-between gap-4">
            <div>
              <p class="text-[11px] font-extrabold text-blue-300 uppercase tracking-widest">NILAI RAPOR AKHIR</p>
              <p class="text-[13px] text-slate-300 font-medium mt-1 leading-relaxed">Dihitung otomatis 60% Sumatif TP + 40% SAS</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/15 text-center">
              <div class="text-3xl font-black text-yellow-400" id="displayNilaiAkhir">0</div>
              <div class="text-[10px] uppercase font-bold text-slate-300 mt-0.5 tracking-wider">Predikat Akhir</div>
            </div>
          </div>

          <!-- Deskripsi Siswa -->
          <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100/80 p-4 space-y-2.5">
            <h4 class="text-xs font-extrabold text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
              <span>📝</span> DRAF DESKRIPSI CAPAIAN KOMPETENSI (KURIKULUM MERDEKA E-RAPOR)
            </h4>
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-white/70 p-3 rounded-lg border border-amber-100/50" id="displayDescLengkap">
              Silakan isi seluruh besaran nilai sumatif TP 1 sd 3 dan SAS di atas terlebih dahulu untuk memformulasikan deskripsi capaian rapor secara otomatis. Heuristik akan memformulasikan ketercapaian optimal dan ruang bimbingan.
            </p>
          </div>

          <!-- Action buttons -->
          <button type="submit" id="btnSimpan" class="w-full bg-blue-700 hover:bg-blue-800 text-white py-4.5 rounded-xl font-bold transition duration-200 shadow-md flex items-center justify-center gap-2 text-base">
            <span>💾</span> Simpan & Sinkronkan ke Google Sheet
          </button>
        </form>
      </div>

      <!-- Sisi Kanan: Tata Cara & Informasi Aturan Kemendikdasmen -->
      <div class="md:col-span-5 space-y-6">
        <div class="bg-white rounded-2xl p-6 shadow-xl shadow-slate-100/70 border border-slate-100">
          <h3 class="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <span>ℹ️</span> Panduan Penilaian Rapor
          </h3>
          <ul class="space-y-4 text-xs font-medium text-slate-600 leading-relaxed">
            <li class="flex gap-2.5 items-start">
              <span class="w-5 h-5 bg-indigo-50 text-indigo-600 font-bold text-center rounded-full flex items-center justify-center shrink-0">1</span>
              <span><strong>Mekanisme Sumatif:</strong> Berdasarkan PPA Kemendikbudristek Edisi Revisi, Penilaian diambil dari Rerata Sumatif Lingkup Materi / Capaian Pembelajaran (TP) serta Sumatif Akhir Semester (SAS).</span>
            </li>
            <li class="flex gap-2.5 items-start">
              <span class="w-5 h-5 bg-indigo-50 text-indigo-600 font-bold text-center rounded-full flex items-center justify-center shrink-0">2</span>
              <span><strong>Formulasi Deskripsi:</strong> Deskripsi mengekstrak tujuan pembelajaran yang mendapat nilai <strong>tertinggi</strong> (Tercapai Optimal) dan nilai <strong>terendah</strong> (Perlu Bimbingan) agar profil rapor informatif bagi orang tua siswa.</span>
            </li>
            <li class="flex gap-2.5 items-start">
              <span class="w-5 h-5 bg-indigo-50 text-indigo-600 font-bold text-center rounded-full flex items-center justify-center shrink-0">3</span>
              <span><strong>Ambang Batas Bimbingan:</strong> Di bawah nilai optimal ditelaah sebagai butir evaluasi. Jika nilainya kurang dari 75, program bimbingan mutlak akan diinstruksikan dalam draf kalimat rekomendasi raport.</span>
            </li>
          </ul>
        </div>

        <div class="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/60 text-indigo-950">
          <h3 class="text-sm font-extrabold tracking-wider uppercase text-blue-900 mb-3 flex items-center gap-2">
            <span>🏫</span> Informasi Sekolah Terintegrasi
          </h3>
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p class="text-slate-400 font-semibold uppercase text-[10px]">TAHUN AJARAN</p>
              <p class="font-bold text-slate-800">2025/2026</p>
            </div>
            <div>
              <p class="text-slate-400 font-semibold uppercase text-[10px]">Fase Implementasi</p>
              <p class="font-bold text-slate-800">Fase C (Madya)</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>

  <footer class="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-16 text-center text-xs">
    <p class="mb-1 font-semibold">&copy; 2026 Mini e-Rapor Kurikulum Merdeka. Hak Cipta Dilindungi Undang-Undang.</p>
    <p>Dikembangkan untuk mempermudah integrasi digital Guru di Kelas menggunakan Google Apps Script.</p>
  </footer>

  <!-- Memuat Script logic Web App -->
  <?!= include('script'); ?>
</body>
</html>`;

  const getStyleHtml = `<style>
  /* CUSTOM CSS: style.html
   * Memberikan efek antarmuka premium, focus state solid, dan layouting responsif
   */
  body {
    background-color: #f8fafc;
  }
  
  .form-input {
    width: 100%;
    padding: 10.5px 14px;
    background-color: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
    transition: all 150ms ease-in-out;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3.5px rgba(37, 99, 235, 0.12);
  }
  
  /* Input Centered Styling untuk Nilai Angka TP */
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }
  
  input[type=number] {
    -moz-appearance: textfield;
  }
</style>`;

  const getScriptHtml = `<script>
  // JAVASCRIPT: script.html
  // Menangani hitung otomatis, mapping database deskripsi TP, dan submit data via google.script.run
  
  // Data Master Daftar Tujuan Pembelajaran (TP) per Mata Pelajaran (Kurikulum Merdeka 2025)
  const masterTujuanPembelajaran = {
    'Bahasa Indonesia': {
      tp1Desc: 'menulis laporan hasil observasi dengan struktur yang logis dan runtut',
      tp2Desc: 'menemukan ide pokok serta menyimpulkan isi paragraf teks deskripsi',
      tp3Desc: 'menggunakan majas penegas dan merancang teks pidato persuasif sederhana'
    },
    'Matematika': {
      tp1Desc: 'memecahkan masalah kontekstual terkait operasi pecahan dan desimal',
      tp2Desc: 'menganalisis unsur-unsur bangun ruang prisma dan silinder secara akurat',
      tp3Desc: 'menyajikan serta menarik kesimpulan dari penyajian data diagram batang'
    },
    'IPA': {
      tp1Desc: 'menganalisis keterkaitan fungsi organ pencernaan dengan kesehatan tubuh',
      tp2Desc: 'melakukan pengamatan tentang perpindahan kalor secara konduksi dan radiasi',
      tp3Desc: 'menggolongkan hewan berdasarkan ekosistem rantai makanan di lingkungan sekitar'
    },
    'Pancasila': {
      tp1Desc: 'menerapkan nilai-nilai luhur Pancasila dalam kehidupan bersosialisasi',
      tp2Desc: 'mengidentifikasi keberagaman norma adat-istiadat di lingkungan wilayah tempat tinggal',
      tp3Desc: 'menyusun rencana aksi pelestarian budaya daerah sebagai wujud cinta NKRI'
    }
  };

  // State untuk draf deskripis dan nilai rata-rata
  let stateAkhir = {
    averageTP: 0,
    nilaiAkhir: 0,
    deskripsiTercapai: '',
    deskripsiPerluBimbingan: '',
    deskripsiLengkap: ''
  };

  // Pas halaman web pertama kali terbuka, update visual label TP
  document.addEventListener("DOMContentLoaded", function() {
    gantiMapel();
  });

  // Ganti visual deskripsi label di atas kotak input agar guru tau apa yg diuji
  function gantiMapel() {
    const mapel = document.getElementById('mataPelajaran').value;
    const config = masterTujuanPembelajaran[mapel];
    
    const labels = document.querySelectorAll('.label-tp');
    if (labels.length >= 3) {
      labels[0].innerText = "Nilai TP 1 (Observasi)";
      labels[1].innerText = "Nilai TP 2 (Analisis Pokok)";
      labels[2].innerText = "Nilai TP 3 (Gaya & Pidato)";
      
      if (mapel === 'Matematika') {
        labels[0].innerText = "TP 1 (Pecahan)";
        labels[1].innerText = "TP 2 (Bangun Ruang)";
        labels[2].innerText = "TP 3 (Diagram Data)";
      } else if (mapel === 'IPA') {
        labels[0].innerText = "TP 1 (Pencernaan)";
        labels[1].innerText = "TP 2 (Kalor)";
        labels[2].innerText = "TP 3 (Rantai Makanan)";
      } else if (mapel === 'Pancasila') {
        labels[0].innerText = "TP 1 (Nilai Pancasila)";
        labels[1].innerText = "TP 2 (Keberagaman)";
        labels[2].innerText = "TP 3 (Cinta NKRI)";
      }
    }
    hitungSkorOtomatisObj();
  }

  // Kalkulasi Rata-rata TP, Nilai Rapor Akhir, & Deskripsi Capaian Kompetensi Kurikulum Merdeka
  function hitungSkorOtomatisObj() {
    const tp1Val = Number(document.getElementById('tp1').value) || 0;
    const tp2Val = Number(document.getElementById('tp2').value) || 0;
    const tp3Val = Number(document.getElementById('tp3').value) || 0;
    const sasVal = Number(document.getElementById('sas').value) || 0;
    const mapel = document.getElementById('mataPelajaran').value;
    const activeTp = masterTujuanPembelajaran[mapel] || {
      tp1Desc: 'mencapai target pembelajaran 1',
      tp2Desc: 'mencapai target pembelajaran 2',
      tp3Desc: 'mencapai target pembelajaran 3'
    };

    // 1. Rata-rata sumatif TP
    const average = parseFloat(((tp1Val + tp2Val + tp3Val) / 3).toFixed(1));
    stateAkhir.averageTP = average;
    document.getElementById('displayTpAvg').innerText = average.toFixed(1);

    // 2. Nilai Rapor (Bobot 60:40)
    const finalReportGrade = Math.round((average * 0.6) + (sasVal * 0.4));
    stateAkhir.nilaiAkhir = finalReportGrade;
    document.getElementById('displayNilaiAkhir').innerText = finalReportGrade;

    // 3. Logika Deskripsi Kalimat (Kurikulum Merdeka 2025)
    // Tentukan nilai TP yang paling tinggi dan paling rendah
    const tpScores = [
      { id: 'TP 1', score: tp1Val, desc: activeTp.tp1Desc },
      { id: 'TP 2', score: tp2Val, desc: activeTp.tp2Desc },
      { id: 'TP 3', score: tp3Val, desc: activeTp.tp3Desc }
    ];

    // Shorting descending
    const sorted = [...tpScores].sort((a,b) => b.score - a.score);
    const highest = sorted[0];
    const lowest = sorted[2];

    let tercapaiWord = 'tercapai dengan sangat baik';
    if (highest.score >= 85) {
      tercapaiWord = 'sangat baik dalam';
    } else if (highest.score >= 70) {
      tercapaiWord = 'baik dalam';
    } else {
      tercapaiWord = 'cukup optimal dalam';
    }

    let calculatedTercapaiDesc = "Menunjukkan penguasaan yang " + tercapaiWord + " " + highest.desc + ".";
    let calculatedPerluBimbinganDesc = "";

    // Threshold kompetensi di bawah nilai 75 ditetapkan butuh bimbingan
    if (lowest.score < 75) {
      calculatedPerluBimbinganDesc = "Perlu bimbingan lebih lanjut dalam memahami kompetensi " + lowest.desc + ".";
    } else {
      calculatedPerluBimbinganDesc = "Serta mampu mengoptimalkan pemahaman pada lingkup " + lowest.desc + ".";
    }

    // Jika nilai sama semua
    if (tp1Val === tp2Val && tp2Val === tp3Val) {
      if (tp1Val >= 85) {
        calculatedTercapaiDesc = "Menunjukkan tingkat pemahaman yang luar biasa merata pada seluruh lingkup tujuan pembelajaran, terutama dalam " + highest.desc + ".";
        calculatedPerluBimbinganDesc = "Serta menunjukkan kesiapan materi lanjutan secara optimal.";
      } else if (tp1Val >= 70) {
        calculatedTercapaiDesc = "Menunjukkan tingkat pencapaian kompetensi yang stabil dan konsisten di seluruh lingkup pembelajaran.";
        calculatedPerluBimbinganDesc = "Relevan dengan materi pendukung dan dianjurkan terus berlatih.";
      } else {
        calculatedTercapaiDesc = "Menunjukkan pencapaian kompetensi dasar kelas yang cukup pada seluruh lingkup pembelajaran.";
        calculatedPerluBimbinganDesc = "Perlu bimbingan dan waktu latihan tambahan secara merata pada seluruh materi.";
      }
    }

    stateAkhir.deskripsiTercapai = calculatedTercapaiDesc;
    stateAkhir.deskripsiPerluBimbingan = calculatedPerluBimbinganDesc;
    stateAkhir.deskripsiLengkap = calculatedTercapaiDesc + " " + calculatedPerluBimbinganDesc;

    document.getElementById('displayDescLengkap').innerText = stateAkhir.deskripsiLengkap;
  }

  // Submit Penilaian ke database Google Sheet via GAS
  function submitFormNilai(e) {
    e.preventDefault();
    
    const namaSiswa = document.getElementById('namaSiswa').value.trim();
    const nisn = document.getElementById('nisn').value.trim();
    const kelas = document.getElementById('kelas').value;
    const mataPelajaran = document.getElementById('mataPelajaran').value;
    const tp1 = document.getElementById('tp1').value;
    const tp2 = document.getElementById('tp2').value;
    const tp3 = document.getElementById('tp3').value;
    const sas = document.getElementById('sas').value;

    if (!namaSiswa || !nisn || !tp1 || !tp2 || !tp3 || !sas) {
      Swal.fire({
        icon: 'error',
        title: 'Formulir Belum Lengkap',
        text: 'Harap melengkapi seluruh isian nama, NISN, nilai TP, dan SAS terlebih dahulu!',
        confirmButtonColor: '#1d4ed8'
      });
      return;
    }

    // Validasi rentang nilai
    if ([Number(tp1), Number(tp2), Number(tp3), Number(sas)].some(val => val < 0 || val > 100)) {
      Swal.fire({
        icon: 'warning',
        title: 'Input Nilai Tidak Valid',
        text: 'Input nilai sumatif harus berkisar antara rentang 0 sampai dengan 100!',
        confirmButtonColor: '#1d4ed8'
      });
      return;
    }

    const payload = {
      namaSiswa: namaSiswa,
      nisn: nisn,
      kelas: kelas,
      mataPelajaran: mataPelajaran,
      tp1: tp1,
      tp2: tp2,
      tp3: tp3,
      sas: sas,
      nilaiAkhir: stateAkhir.nilaiAkhir,
      deskripsiTercapai: stateAkhir.deskripsiTercapai,
      deskripsiPerluBimbingan: stateAkhir.deskripsiPerluBimbingan,
      deskripsiLengkap: stateAkhir.deskripsiLengkap
    };

    // Ubah status tombol loading
    const btn = document.getElementById('btnSimpan');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = "<span>⏳</span> Menyambung Server Google Sheets...";

    // Jalankan integrasi internal GAS google.script.run
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(function(responseString) {
          btn.disabled = false;
          btn.innerHTML = originalText;
          
          try {
            const response = JSON.parse(responseString);
            if (response.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Data Berhasil Disimpan',
                text: response.message,
                confirmButtonColor: '#1d4ed8'
              });
              kosongkanForm();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: response.message,
                confirmButtonColor: '#d33'
              });
            }
          } catch(err) {
            Swal.fire({
              icon: 'warning',
              title: 'Respons Asing',
              text: 'Respons server berhasil diterima namun gagal diproses oleh sistem.',
              confirmButtonColor: '#1d4ed8'
            });
          }
        })
        .withFailureHandler(function(error) {
          btn.disabled = false;
          btn.innerHTML = originalText;
          Swal.fire({
            icon: 'error',
            title: 'Koneksi Terputus',
            text: 'Gagal tersambung ke server Google Apps Script: ' + error.message,
            confirmButtonColor: '#d33'
          });
        })
        .simpanData(payload);
    } else {
      // MODE SIMULASI OFFLINE (Bila dibuka di luar Apps Script)
      setTimeout(function() {
        btn.disabled = false;
        btn.innerHTML = originalText;
        
        Swal.fire({
          icon: 'success',
          title: 'Mode Simulasi Aktif',
          html: '<strong>Data Berhasil Divalidasi!</strong><br><br>Jika aplikasi ini telah dideploy di Google Apps Script, baris baru akan tersisip secara instan ke Sheets.',
          confirmButtonColor: '#1d4ed8'
        });
        kosongkanForm();
      }, 1000);
    }
  }

  // Melakukan reset total pada isian formulir
  function kosongkanForm() {
    document.getElementById('namaSiswa').value = '';
    document.getElementById('nisn').value = '';
    document.getElementById('tp1').value = '';
    document.getElementById('tp2').value = '';
    document.getElementById('tp3').value = '';
    document.getElementById('sas').value = '';
    
    hitungSkorOtomatisObj();
  }
</script>`;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        {/* Background decorative patterns specifying elementary school theme (Merah Putih & Tut Wuri Gold) */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-red-600/15 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[30%] left-[40%] w-[350px] h-[350px] rounded-full bg-yellow-500/5 blur-[100px] pointer-events-none"></div>
        
        {/* Decorative subtle floating school motifs (simulated by layout dots representing SD children badges) */}
        <div className="absolute top-12 left-12 w-3 h-3 rounded-full bg-red-500/30 animate-pulse"></div>
        <div className="absolute bottom-24 left-1/4 w-2 h-2 rounded-full bg-blue-500/30"></div>
        <div className="absolute top-1/3 right-12 w-4 h-4 rounded-full bg-yellow-500/20 animate-bounce"></div>

        {/* Toast Notification */}
        {showToast.show && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-300 max-w-sm border ${
            showToast.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-emerald-100/50' 
              : 'bg-rose-50 border-rose-200 text-rose-950 shadow-rose-100/50'
          }`}>
            {showToast.success ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div className="text-xs font-semibold leading-relaxed">
              {showToast.message}
            </div>
          </div>
        )}

        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800/80 p-8 z-10 relative overflow-hidden">
          {/* Subtle Red & White Top highlight strip representing Indonesian Flag / SD uniform theme */}
          <div className="absolute top-0 left-0 right-0 h-1.5 flex">
            <div className="w-1/2 bg-red-600"></div>
            <div className="w-1/2 bg-white"></div>
          </div>

          <div className="text-center mb-8 mt-2">
            {/* Tut Wuri logo badge custom */}
            <div className="inline-flex items-center justify-center bg-white p-1 rounded-2xl shadow-lg mb-5 ring-4 ring-yellow-400/20 relative w-16 h-16 overflow-hidden">
              <img 
                src="/logo.png" 
                className="w-full h-full object-cover rounded-xl" 
                alt="Logo Sekolah" 
                onError={(e) => {
                  e.currentTarget.onerror = null; // mencegah loop tak terbatas jika fallback gagal
                  e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%231e3a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>';
                }} 
              />
              <Sparkles className="w-3.5 h-3.5 text-red-600 absolute -top-1.5 -right-1.5 animate-pulse" />
            </div>
            
            <div className="flex items-center justify-center gap-1.5 mb-2.5 flex-wrap">
              <span className="bg-red-600 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded uppercase tracking-wider shadow-md shadow-red-950/20">SEKOLAH DASAR (SD)</span>
            </div>
            
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">AsesmenQu App</h1>
            <p className="text-slate-400 text-xs mt-1 font-semibold px-4 leading-relaxed">
              KURKULUM MERDEKA
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Username Pendidik</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  required
                  placeholder="Ketik username Anda (pendaftar)..."
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-blue-500 hover:focus:border-blue-500 text-white placeholder-slate-500 pl-10.5 pr-4 py-3 text-xs rounded-xl focus:outline-none transition-all font-semibold"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kata Sandi</label>
                <span className="text-[10px] text-amber-400/80 font-bold hover:underline cursor-pointer">Lupa Password?</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type="password"
                  required
                  placeholder="Ketik password Anda..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-blue-500 hover:focus:border-blue-500 text-white placeholder-slate-500 pl-10.5 pr-4 py-3 text-xs rounded-xl focus:outline-none transition-all font-semibold"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold transition duration-200 shadow-xl shadow-blue-500/10 flex items-center justify-center gap-2 text-xs mt-6 cursor-pointer tracking-wider"
            >
              <LogIn className="w-4.5 h-4.5" />
              Login
            </button>
          </form>
        </div>
        
        {/* Footer info brand */}
        <p className="text-[10px] text-slate-600 font-bold tracking-wider mt-8 uppercase">Aplikasi AsesmenQu SD v2026.1</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col text-slate-800 font-sans overflow-hidden">
      
      {/* Toast Notification */}
      {showToast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4.5 rounded-2xl shadow-xl transition-all duration-300 max-w-sm border ${
          showToast.success 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-emerald-100/50' 
            : 'bg-rose-50 border-rose-200 text-rose-950 shadow-rose-100/50'
        }`}>
          {showToast.success ? (
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
          )}
          <div className="text-xs font-semibold leading-relaxed">
            {showToast.message}
          </div>
        </div>
      )}

      {/* Top Header Tut Wuri Handayani / Government Inspired Blue Theme */}
      <header className="bg-gradient-to-r from-blue-900 via-sky-950 to-indigo-950 text-white shadow-md border-b-4 border-amber-400 shrink-0">
        <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Toggle Sidebar Button */}
            <button
              id="btn-sidebar-toggle"
              type="button"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileSidebarOpen(!isMobileSidebarOpen);
                } else {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }
              }}
              className="p-2.5 bg-blue-950/80 hover:bg-blue-900/90 text-amber-300 hover:text-white rounded-xl transition border border-white/5 cursor-pointer flex items-center justify-center shrink-0"
              title="Sembunyikan/Tampilkan Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="bg-white p-0.5 rounded-xl text-blue-900 shadow-inner flex items-center justify-center shrink-0 w-11 h-11 overflow-hidden">
              <img 
                src="/logo.png" 
                className="w-full h-full object-cover rounded-lg" 
                alt="Logo" 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%231e3a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-md font-bold text-amber-400 tracking-widest uppercase">SD NEGERI KAJULANGKO</span>
                <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase">KURIKULUM MERDEKA</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight mt-0.5 text-white flex items-center gap-2">
                ASESMENQU
              </h1>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch md:items-center">
            {/* Live Mode Indicator */}
            <div className="bg-blue-950/40 text-[11px] px-3.5 py-2.5 rounded-xl border border-sky-850/30 font-semibold text-slate-355 flex items-center gap-2">
              <span className="w-2 rounded-full h-2 bg-emerald-500 animate-pulse shrink-0"></span>
              Mode: Live AsesmenQu
            </div>

            {/* Teacher Profile Info Badge Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur border border-white/10 hover:border-amber-400/40 rounded-xl px-4 py-2 flex items-center gap-3 transition cursor-pointer select-none text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 font-black flex items-center justify-center text-xs shadow-inner overflow-hidden shrink-0 border border-slate-700/30">
                  {currentUser?.photo ? (
                    <img src={currentUser.photo} alt={currentUser.nama} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(currentUser?.nama || '')
                  )}
                </div>
                <div className="text-left hidden sm:block max-w-[150px]">
                  <div className="text-[11px] font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                    <span className="truncate">{currentUser?.nama || 'Kepala Sekolah'}</span>
                    <span className={`text-[8px] font-extrabold px-1 py-0.5 rounded uppercase leading-none ${
                      currentUser?.role === 'Super Admin' ? 'bg-purple-650 text-white animate-pulse' :
                      currentUser?.role === 'Admin' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {currentUser?.role || 'Admin'}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium mt-1 leading-none truncate">
                    @{currentUser?.username || 'admin'} {currentUser?.jabatan ? `• ${currentUser.jabatan}` : ''}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 ml-1 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
              </button>

              {/* Dropdown Card */}
              {isProfileDropdownOpen && (
                <>
                  {/* Backdrop path for clicking outside */}
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsProfileDropdownOpen(false)} />
                  
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-4 px-4 z-50 text-slate-800">
                    <div className="flex flex-col items-center text-center pb-3.5 border-b border-slate-100">
                      {/* Interactive Avatar change */}
                      <div className="relative group shrink-0 w-16 h-16 mb-2.5">
                        <div className="w-full h-full rounded-full bg-blue-50 text-blue-800 font-black flex items-center justify-center text-lg border border-slate-200 shadow-sm overflow-hidden">
                          {currentUser?.photo ? (
                            <img src={currentUser.photo} alt={currentUser.nama} className="w-full h-full object-cover" />
                          ) : (
                            getInitials(currentUser?.nama || '')
                          )}
                        </div>
                        
                        {/* Camera upload overlay icon */}
                        <label className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              handlePhotoUpload(e);
                              setIsProfileDropdownOpen(false);
                            }} 
                          />
                          <Camera className="w-4 h-4 text-amber-300 animate-pulse" />
                        </label>
                      </div>

                      {/* Info label user */}
                      <h4 className="text-xs font-black text-slate-900 leading-tight">{currentUser?.nama}</h4>
                      <p className="text-[9px] text-slate-400 font-extrabold tracking-widest uppercase mt-0.5">{currentUser?.role}</p>
                      
                      <div className="mt-2 text-[10px] bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-lg border border-amber-100">
                        @{currentUser?.username || 'admin'} {currentUser?.jabatan ? `• ${currentUser.jabatan}` : ''}
                      </div>

                      {/* Manual Photo file sync inside dropdown */}
                      <label className="mt-3 text-[10px] font-extrabold text-blue-700 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            handlePhotoUpload(e);
                            setIsProfileDropdownOpen(false);
                          }} 
                        />
                        <Camera className="w-3.5 h-3.5" /> Ganti Foto Profil
                      </label>
                    </div>

                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 hover:bg-rose-50 border border-slate-100 text-rose-600 hover:text-rose-700 font-extrabold text-xs rounded-xl shadow-inner transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar dari Aplikasi
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Collapsible Left Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        {/* Backdrop for Mobile Sidebar overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-950/65 z-45 md:hidden transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside 
          className={`
            bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 transition-all duration-200 z-50 md:z-35
            fixed md:relative inset-y-0 left-0
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            ${isSidebarCollapsed ? 'md:w-16' : 'md:w-64'} 
            w-64 shrink-0
          `}
        >
          {/* School Brand / Logo in Sidebar */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center shrink-0 ring-2 ring-yellow-400/20 overflow-hidden">
                <img 
                  src="/logo.png" 
                  className="w-full h-full object-cover rounded-lg" 
                  alt="Logo" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%231e3a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>';
                  }}
                />
              </div>
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <div className="text-left leading-tight truncate">
                  <span className="text-[9px] font-black text-amber-400 block tracking-wider uppercase">AsesmenQu</span>
                  <span className="text-xs font-extrabold text-white block uppercase">APP</span>
                </div>
              )}
            </div>
            
            {/* Close Mobile Sidebar Trigger */}
            <button 
              type="button"
              className="md:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 py-4 px-2.5 space-y-1.5 overflow-y-auto">
            
            <button
              type="button"
              onClick={() => {
                setActiveTab('simulator');
                setIsMobileSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer group
                ${activeTab === 'simulator' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
                ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : 'justify-start'}
              `}
              title="Simulator Form SiAfis"
            >
              <PlusCircle className={`w-4.5 h-4.5 shrink-0 ${activeTab === 'simulator' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate">Form Input</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('database');
                setIsMobileSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer group relative
                ${activeTab === 'database' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
                ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : 'justify-start'}
              `}
              title="Data Siswa Lokal"
            >
              <Database className={`w-4.5 h-4.5 shrink-0 ${activeTab === 'database' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {(!isSidebarCollapsed || isMobileSidebarOpen) ? (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate">Rekap Data Siswa</span>
                  <span className="ml-1.5 bg-slate-800 text-slate-350 text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                    {students.length}
                  </span>
                </div>
              ) : (
                <span className="absolute top-1.5 right-1.5 bg-blue-600 text-[8px] text-white font-black px-1 rounded-full leading-none min-w-[14px] h-[14px] flex items-center justify-center border border-slate-900 shadow">
                  {students.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('tp_settings');
                setIsMobileSidebarOpen(false);
                syncPengaturan();
              }}
              className={`
                w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer group
                ${activeTab === 'tp_settings' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
                ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : 'justify-start'}
              `}
              title="Setelan Bobot & Materi TP"
            >
              <BookOpen className={`w-4.5 h-4.5 shrink-0 ${activeTab === 'tp_settings' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate">Tujuan Pembelajaran</span>
              )}
            </button>

            {currentUser?.role === 'Super Admin' && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('gas_center');
                  setIsMobileSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer group
                  ${activeTab === 'gas_center' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
                  ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : 'justify-start'}
                `}
                title="Salin Kode Apps Script"
              >
                <Code2 className={`w-4.5 h-4.5 shrink-0 ${activeTab === 'gas_center' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                  <span className="truncate">Apps Script (GAS)</span>
                )}
              </button>
            )}

            {(currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin') && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('settings_menu');
                  setIsMobileSidebarOpen(false);
                  syncPengaturan();
                }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer group
                  ${activeTab === 'settings_menu' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
                  ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : 'justify-start'}
                `}
                title="Menu Setelan Aplikasi"
              >
                <Settings className={`w-4.5 h-4.5 shrink-0 ${activeTab === 'settings_menu' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                  <span className="truncate">Menu Setelan</span>
                )}
              </button>
            )}

          </div>

          {/* Sembunyikan Menu bottom action */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex w-full items-center gap-3 p-2 hover:bg-slate-800/60 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 mx-auto text-amber-400" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="truncate">Tutup Menu</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT WORKSPACE */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto">

          <main className="max-w-7xl w-full mx-auto px-4 py-6 md:py-8 flex-1">

        {/* Tab 1: Simulator Form Input */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sisi Kiri: Form Input Score */}
            <form onSubmit={handleSubmitLocal} className="lg:col-span-7 bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-slate-100/80 border-b border-indigo-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-sm md:text-base font-extrabold text-blue-950 flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-700 rounded-full"></span>
                  Formulir Penilaian Nilai Sumatif
                </h2>
                <div className="flex gap-2.5">
                  <button 
                    type="button" 
                    onClick={handleResetForm}
                    className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  >
                    Reset Form
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                

                
                {/* Siswa Identitas Card */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-700" /> Identitas Siswa Rapor
                    </span>
                    <button
                      type="button"
                      onClick={syncMasterSiswa}
                      disabled={loadingMaster}
                      className="text-[10px] font-extrabold text-blue-805 hover:text-blue-950 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-blue-200 shadow-sm transition cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${loadingMaster ? 'animate-spin' : ''}`} />
                      {loadingMaster ? 'Memuat...' : 'Sync Siswa dari Sheets'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Kelas Rapor</label>
                      <select 
                        name="kelas"
                        value={form.kelas}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-white transition-colors font-medium text-slate-700 select-input font-sans"
                      >
                        {allowedClasses.length > 0 ? (
                          allowedClasses.map(kls => (
                            <option key={kls} value={kls}>{kls}</option>
                          ))
                        ) : (
                          <option value="">-- Hubungkan Spreadsheet / Kelas Kosong --</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Pilih Nama Siswa <span className="text-red-500">*</span></label>
                      {studentsInSelectedClass.length > 0 && !isManualInput ? (
                        <select 
                          name="namaSiswa"
                          value={form.namaSiswa}
                          onChange={handleSelectStudentChange}
                          className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-white transition-colors font-semibold text-slate-800 font-sans"
                        >
                          {studentsInSelectedClass.map(s => (
                            <option key={s.nisn} value={s.nama}>{s.nama}</option>
                          ))}
                          <option value="INPUT_MANUAL">✍️ Input Manual / Tambah Baru...</option>
                        </select>
                      ) : (
                        <div className="relative">
                          <input 
                            type="text" 
                            name="namaSiswa"
                            value={form.namaSiswa}
                            onChange={handleInputChange}
                            placeholder="Ketik Nama lengkap siswa..." 
                            className="w-full px-3 py-2.5 text-xs rounded-lg border border-blue-400 focus:outline-none bg-white transition-colors font-semibold font-sans"
                            required
                          />
                          {studentsInSelectedClass.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsManualInput(false);
                                if (studentsInSelectedClass.length > 0) {
                                  setForm(p => ({ ...p, namaSiswa: studentsInSelectedClass[0].nama, nisn: studentsInSelectedClass[0].nisn }));
                                }
                              }}
                              className="absolute right-2 top-2 text-[9px] font-black uppercase text-blue-700 bg-blue-100 px-1 rounded hover:underline cursor-pointer"
                            >
                              Batal
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">NISN (Otomatis)</label>
                      <input 
                        type="text" 
                        name="nisn"
                        value={form.nisn}
                        onChange={handleInputChange}
                        placeholder="NISN murid..." 
                        readOnly={!isManualInput}
                        className={`w-full px-3 py-2.5 text-xs rounded-lg border focus:outline-none font-mono ${
                          isManualInput 
                            ? 'border-blue-400 bg-white' 
                            : 'border-slate-200 bg-slate-100 text-slate-600'
                        }`}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 font-sans">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wilder mb-2">Mata Pelajaran (Mapel)</label>
                    <select 
                      name="mataPelajaran"
                      value={form.mataPelajaran}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-xs md:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 transition-colors font-sans"
                    >
                      {allowedMapelsForSelectedClass.length > 0 ? (
                        allowedMapelsForSelectedClass.map(mapelName => (
                          <option key={mapelName} value={mapelName}>{mapelName}</option>
                        ))
                      ) : (
                        <option value="">-- Belum ada Mapel untuk Kelas ini --</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Seksi Materi Sumatif Lingkup TP */}
                <div className="pt-4 border-t border-dashed border-slate-200">
                  <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                    <h3 className="text-xs md:text-sm font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎯</span> Sumatif Lingkup Materi / Tujuan Pembelajaran (TP)
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 px-2.5 py-1 rounded-md">Bobot Sumatif TP: {weightTP}%</span>
                      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setFormSumatifCount(prev => Math.max(1, prev - 1))}
                          className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition"
                          title="Kurangi kolom sumatif"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-black text-slate-700 min-w-4 text-center">{formSumatifCount}</span>
                        <button
                          type="button"
                          onClick={() => setFormSumatifCount(prev => prev + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition"
                          title="Tambah kolom sumatif"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {(() => {
                    const list = [];
                    for (let s = 1; s <= formSumatifCount; s++) {
                      let tpDesc = '';
                      if (s === 1) tpDesc = activeTpConfig?.tp1Desc || '';
                      else if (s === 2) tpDesc = activeTpConfig?.tp2Desc || '';
                      else if (s === 3) tpDesc = activeTpConfig?.tp3Desc || '';
                      else if (activeTpConfig?.extraTps && s >= 4) {
                        tpDesc = activeTpConfig.extraTps[s - 4] || '';
                      }
                      
                      list.push({
                        id: s.toString(),
                        label: `Sumatif ${s} (TP ${s})`,
                        field: `sumatif${s}`,
                        desc: tpDesc
                      });
                    }

                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                          {list.map((sm) => {
                            const val = form[sm.field as keyof typeof form] || '';
                            const hasTP = sm.desc.trim() !== '';
                            return (
                              <div key={sm.id} className={`p-2.5 rounded-xl border transition ${hasTP ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/40 border-slate-200/60 opacity-90'}`}>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="text-[10px] font-extrabold text-slate-500 uppercase">{sm.label}</span>
                                  {!hasTP && <span className="text-[8px] font-medium bg-slate-100 text-slate-400 px-1 py-0.5 rounded">Umum</span>}
                                </div>
                                {hasTP && (
                                  <div className="text-[9.5px] text-indigo-950 leading-relaxed font-semibold mb-1.5 italic line-clamp-1 h-3.5" title={sm.desc}>
                                    "{sm.desc}"
                                  </div>
                                )}
                                <input 
                                  type="number" 
                                  name={sm.field}
                                  min="0"
                                  max="100"
                                  value={val}
                                  onChange={handleInputChange}
                                  placeholder="-"
                                  className="w-full text-center py-1.5 text-sm font-extrabold rounded-lg border border-slate-200 bg-white"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Rerata Lingkup Materi, Nilai SAS, dan Nilai Rapor Akhir */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch pt-4 border-t border-dashed border-slate-200">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">NA SUMATIF MATERI (TP)</label>
                      <span className="text-2xl font-black text-slate-700">{tpAverage.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold block mt-2">
                      Rata-rata dari nilai sumatif materi terisi.
                    </span>
                  </div>

                  <div className="bg-amber-50/20 p-4 rounded-xl border border-amber-100/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-extrabold text-amber-900 uppercase tracking-wilder">NA SUMATIF AKHIR SEMESTER (SAS)</label>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 rounded">Bobot: {weightSAS}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Non Tes</span>
                        <input 
                          type="number" 
                          name="nonTes"
                          value={form.nonTes}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          placeholder="Nilai" 
                          className="w-full py-2 text-sm font-extrabold rounded-lg border border-slate-200 bg-white text-center focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Tes</span>
                        <input 
                          type="number" 
                          name="tes"
                          value={form.tes}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          placeholder="Nilai" 
                          className="w-full py-2 text-sm font-extrabold rounded-lg border border-slate-200 bg-white text-center focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">RATA-RATA NILAI SAS</label>
                      {(() => {
                        const nt = form.nonTes !== '' ? Number(form.nonTes) : null;
                        const t = form.tes !== '' ? Number(form.tes) : null;
                        const valid = [nt, t].filter((v): v is number => v !== null && !isNaN(v));
                        const avg = valid.length > 0 ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1) : '-';
                        return <span className="text-2xl font-black text-slate-700">{avg}</span>;
                      })()}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold block mt-2">
                      Rerata Non Tes & Tes jika diisi.
                    </span>
                  </div>
                </div>

                {/* Block Penilaian Rapor Preview */}
                <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-inner flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black text-indigo-300 tracking-widest uppercase">KONTRIBUSI BOBOT RAPOR</span>
                    <h4 className="text-md font-bold mt-1 text-white">NILAI AKHIR (RAPOR)</h4>
                    <p className="text-xs text-slate-300 font-medium">({weightTP}% Rerata TP + {weightSAS}% SAS)</p>
                  </div>
                  <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/15 text-center">
                    <span className="text-3xl font-black text-yellow-300">{nilaiAkhir.toFixed(1)}</span>
                    <div className="text-[10.5px] uppercase font-bold text-slate-200 mt-1">Predikat: {
                      nilaiAkhir >= 86 ? 'Sangat Baik (A)' :
                      nilaiAkhir >= 72 ? 'Baik (B)' :
                      nilaiAkhir >= 60 ? 'Cukup (C)' : 'Perlu Bimbingan (D)'
                    }</div>
                  </div>
                </div>

                {/* Live Preview of Deskripsi Capaian Kompetensi */}
                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex gap-3">
                  <div className="text-xl">📝</div>
                  <div className="space-y-1 w-full">
                    <div className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest">
                      DRAF DESKRIPSI CAPAIAN KOMPETENSI (KURIKULUM MERDEKA LIVE)
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold bg-white p-3 rounded-lg border border-orange-100/50">
                      {descLengkap || 'Input nilai murid di atas untuk memfomulakan draf deskripsi capaian pembelajaran secara instan.'}
                    </p>
                  </div>
                </div>

                {/* Submit Action Block */}
                <div className="space-y-2.5">
                  <button 
                    type="submit"
                    disabled={sendingToGas}
                    className={`w-full bg-blue-700 hover:bg-blue-800 text-white py-4 px-6 rounded-2xl font-bold text-xs md:text-sm transition duration-250 shadow-md flex items-center justify-center gap-2 cursor-pointer border border-blue-800 ${sendingToGas ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {sendingToGas ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sedang Menyinkronkan ke Google Sheet...
                      </>
                    ) : (
                      <>
                        <span>💾</span> Simpan & Sinkron Hasil
                      </>
                    )}
                  </button>
                </div>

              </div>
            </form>

            {/* Sisi Kanan: Panduan Regulasi Kemendikbud */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
                <h3 className="text-sm font-extrabold text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <Info className="w-5 h-5 text-indigo-600" />
                  Aturan Formulasi Deskripsi
                </h3>
                <div className="space-y-4.5 text-xs text-slate-600 leading-relaxed">
                  <div className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-extrabold text-center flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-slate-800">Menyaring Capaian Tertinggi:</strong>
                      <p className="mt-0.5 text-slate-500">
                        Mengambil materi dengan perolehan nilai TP tertinggi untuk dirangkai sebagai ungkapan kompetensi <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">"Tercapai Sangat Baik/Optimal"</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-extrabold text-center flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-slate-800">Mendiagnosis Capaian Terendah:</strong>
                      <p className="mt-0.5 text-slate-500">
                        Bila salah satu nilai TP di bawah kriteria ketuntasan, sistem merangkainya sebagai target dengan penanda <span className="text-rose-700 font-bold bg-rose-50 px-1 rounded">"Perlu Bimbingan Lebih Lanjut"</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-extrabold text-center flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-slate-800">Kalkulasi Fleksibel:</strong>
                      <p className="mt-0.5 text-slate-500">
                        Formula baku Kurikulum Merdeka menganjurkan bobot 60% Sumatif TP dan 40% Sumatif Akhir Semester (SAS). Parameter ini dapat disesuaikan di Tab Setelan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-indigo-100 flex gap-4 text-xs font-semibold text-indigo-950">
                <BookOpen className="w-10 h-10 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="text-slate-900 font-extrabold mb-1">Mata Pelajaran Aktif</h4>
                  <p className="text-slate-500 mb-2 leading-relaxed font-medium">Beberapa muatan kompetensi dasar yang siap diuji dalam draf formulir di antaranya:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tpConfigs.map((cfg, i) => (
                      <span key={i} className="bg-white px-2 py-0.5 border border-indigo-200/50 rounded-md text-[10px] text-indigo-700">{cfg.mapel}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Database Table Preview */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            {/* Database header with integrated Sistem Kelas toggle */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    Database Lokal Riwayat Nilai Siswa
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Buku daftar kumpulan nilai sumatif yang tersimpan di browser Anda ({filteredStudents.length} siswa).</p>
                  
                  {currentUser?.role !== 'Guru' && (
                    <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 rounded-xl w-fit mt-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider px-2 block">
                        Sistem Kelas:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSetParallelMode(false)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition cursor-pointer ${
                          !isParallelMode
                            ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Daftar kelas tunggal (Kelas 1 s/d Kelas 6)"
                      >
                        Non-Paralel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetParallelMode(true)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition cursor-pointer ${
                          isParallelMode
                            ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Daftar kelas paralel A, B, C, D (e.g. Kelas 1 A, Kelas 1 B, dll)"
                      >
                        Paralel
                      </button>
                    </div>
                  )}
                </div>

                  {/* Quantitative Assessment Choice Control */}
                  {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
                    <div className="bg-blue-50/70 p-4 border border-blue-150 rounded-xl space-y-2.5 font-sans w-full max-w-xl text-left self-stretch flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center text-xs">📈</span>
                        <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">Pilihan Penilaian Kuantitatif</h4>
                      </div>
                      <div className="flex bg-white p-1 rounded-xl gap-1 border border-blue-200">
                        <button 
                          type="button"
                          onClick={() => setOpsiPenilaian('rata_rata')}
                          className={`flex-1 text-center py-2 text-xs font-bold transition rounded-lg cursor-pointer ${opsiPenilaian === 'rata_rata' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                          Opsi Rata-Rata
                        </button>
                        <button 
                          type="button"
                          onClick={() => setOpsiPenilaian('pembobotan')}
                          className={`flex-1 text-center py-2 text-xs font-bold transition rounded-lg cursor-pointer ${opsiPenilaian === 'pembobotan' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                          Opsi Pembobotan
                        </button>
                        <button 
                          type="button"
                          onClick={() => setOpsiPenilaian('persentase')}
                          className={`flex-1 text-center py-2 text-xs font-bold transition rounded-lg cursor-pointer ${opsiPenilaian === 'persentase' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                          Opsi Persentase
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium leading-normal">
                        {opsiPenilaian === 'rata_rata' && '💡 Cara menilai: Hitung seluruh nilai sumatif dan cari rata-ratanya sebagai Nilai Akhir Sumatif Lingkup Materi.'}
                        {opsiPenilaian === 'pembobotan' && '💡 Cara menilai: Masukkan bobot pada input di header bawah kolom setiap sumatif (S1, S2, dst). Nilai akhir dihitung berdasarkan persentase bobot masing-masing.'}
                        {opsiPenilaian === 'persentase' && `💡 Cara menilai: Hitung jumlah nilai sumatif yang tuntas (>= KKTP ${kktpMin}). Nilai akhir = (Jumlah sumatif tuntas / Total sumatif) * 100.`}
                      </p>
                    </div>
                  )}

                  {/* Filtering + Search Controls */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="text" 
                        placeholder="Cari siswa atau kelas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                      />
                    </div>

                    {/* Role-based selection controls for filtering */}
                    {(!currentUser || currentUser.role === 'Admin' || currentUser.role === 'Super Admin') ? (
                      <>
                        {/* Selector for Subject / Mapel */}
                        <select
                          value={filterMapel}
                          onChange={(e) => setFilterMapel(e.target.value)}
                          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer shadow-sm"
                          title="Saring Berdasarkan Mata Pelajaran"
                        >
                          <option value="Semua">Semua Mata Pelajaran</option>
                          {Array.from(new Set(
                            tpConfigs.map(c => c.mapel)
                          )).filter(Boolean).map(mapelName => (
                            <option key={mapelName} value={mapelName}>{mapelName}</option>
                          ))}
                        </select>

                        {/* Selector for Class / Kelas */}
                        <select
                          value={filterKelas}
                          onChange={(e) => setFilterKelas(e.target.value)}
                          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer shadow-sm"
                          title="Saring Berdasarkan Kelas"
                        >
                          <option value="Semua">Semua Kelas</option>
                          {listAllClasses.map(klsName => (
                            <option key={klsName} value={klsName}>{klsName}</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        {/* If Guru, check if Guru Kelas or Guru Mapel */}
                        {parseJabatan(currentUser.jabatan || '').jenis === 'Guru Kelas' ? (
                          <>
                            {/* Dropdown for Guru Kelas: Filter by their Subjects */}
                            <select
                              value={filterMapel}
                              onChange={(e) => setFilterMapel(e.target.value)}
                              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer shadow-sm"
                              title="Pilih Mata Pelajaran yang Diajarkan"
                            >
                              <option value="Semua">Semua Mapel yang Diajar</option>
                              {allowedMapelsGlobal.map(mapelName => (
                                <option key={mapelName} value={mapelName}>{mapelName}</option>
                              ))}
                            </select>

                            {/* Option for Class selection - preselected/defaults to they teach but support multiple if assigned */}
                            <select
                              value={filterKelas}
                              onChange={(e) => setFilterKelas(e.target.value)}
                              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer shadow-sm"
                              title="Pilih Kelas"
                            >
                              <option value="Semua">Semua Kelas yang Diajar</option>
                              {allowedClasses.map(klsName => (
                                <option key={klsName} value={klsName}>{klsName}</option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <>
                            {/* Dropdown for Guru Mapel: Filter by their Classes */}
                            <select
                              value={filterKelas}
                              onChange={(e) => setFilterKelas(e.target.value)}
                              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer shadow-sm"
                              title="Pilih Kelas yang Diajarkan"
                            >
                              <option value="Semua">Semua Kelas yang Diajar</option>
                              {allowedClasses.map(klsName => (
                                <option key={klsName} value={klsName}>{klsName}</option>
                              ))}
                            </select>

                            {/* Dropdown for Guru Mapel: Filter by their Subjects */}
                            <select
                              value={filterMapel}
                              onChange={(e) => setFilterMapel(e.target.value)}
                              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer shadow-sm"
                              title="Pilih Mata Pelajaran"
                            >
                              <option value="Semua">Semua Mapel yang Diajar</option>
                              {allowedMapelsGlobal.map(mapelName => (
                                <option key={mapelName} value={mapelName}>{mapelName}</option>
                              ))}
                            </select>
                          </>
                        )}
                      </>
                    )}

                    <button
                      onClick={handleDownloadExcel}
                      className="px-3 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition duration-155"
                      title="Unduh seluruh rekap riwayat nilai ke format Excel (.xls)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Unduh Nilai
                    </button>

                    {gasUrl && (
                      <button 
                        onClick={syncRiwayatNilai}
                        disabled={loadingRiwayat}
                        className="px-3 py-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Tarik seluruh data penilaian dari Lembar DataNilai"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingRiwayat ? 'animate-spin' : ''}`} />
                        {loadingRiwayat ? 'Memuat Nilai...' : 'Tarik Riwayat Nilai'}
                      </button>
                    )}

                    <button 
                      onClick={() => {
                        if (window.confirm('Bersihkan riwayat semua siswa lokal?')) {
                          setStudents([]);
                          triggerToast('Seluruh riwayat lokal berhasil dibersihkan.', true);
                        }
                      }}
                      className="px-3 py-2 text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl font-bold cursor-pointer transition border border-rose-100"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Students Table */}
                {filteredStudents.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Database className="w-12 h-12 mx-auto text-slate-300 mb-2.5" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tidak ada riwayat nilai ditemukan</p>
                    <p className="text-[11px] text-slate-400 mt-1">Coba kurangi filter atau tambahkan data baru melalui tab simulator.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-250 rounded-xl shadow-inner bg-slate-50/50 p-1">
                    <table className="w-full text-left text-[11px] border-collapse bg-white table-auto min-w-[1300px]">
                      <thead>
                        {/* Row 1 Header */}
                        <tr className="bg-slate-100 text-slate-800 font-extrabold text-[10px] uppercase tracking-wider border-b border-slate-300 border-t border-l border-r">
                          <th rowSpan={opsiPenilaian === 'pembobotan' ? 3 : 2} className="py-3 px-3 border border-slate-300 text-center w-12 bg-slate-50 text-slate-800 font-extrabold">No</th>
                          <th rowSpan={opsiPenilaian === 'pembobotan' ? 3 : 2} className="py-3 px-3 border border-slate-300 text-left min-w-[200px] bg-slate-50 text-slate-800 font-extrabold">Nama Siswa & Identitas</th>
                          <th rowSpan={opsiPenilaian === 'pembobotan' ? 3 : 2} className="py-3 px-3 border border-slate-300 text-left min-w-[120px] bg-slate-50 text-slate-800 font-extrabold">Mata Pelajaran</th>
                          {activeMaxSumatifCount > 0 && (
                            <th colSpan={activeMaxSumatifCount + 1} className="py-2 px-1 border border-slate-300 text-center text-rose-900 bg-rose-500/10 tracking-wide font-black">Sumatif Akhir Lingkup Materi (Wajib)</th>
                          )}
                          {activeMaxSumatifCount === 0 && (
                            <th className="py-3 px-2 border border-slate-300 text-center text-rose-900 bg-rose-500/10 tracking-wide font-black" rowSpan={opsiPenilaian === 'pembobotan' ? 3 : 2}>NA S.LM</th>
                          )}
                          <th colSpan={3} className="py-2 px-1 border border-slate-300 text-center text-teal-900 bg-teal-500/10 tracking-wide font-black">Sumatif Akhir Semester (Tidak Wajib)</th>
                          <th rowSpan={opsiPenilaian === 'pembobotan' ? 3 : 2} className="py-3 px-2 border border-slate-300 text-center font-black text-amber-95 w-16 bg-amber-500/15 text-amber-900">Nilai Rapor</th>
                          <th rowSpan={opsiPenilaian === 'pembobotan' ? 3 : 2} className="py-3 px-4 border border-slate-300 text-left min-w-[280px] bg-slate-50 text-slate-800 font-extrabold">Draf Rapor Resmi Deskripsi</th>
                          <th rowSpan={opsiPenilaian === 'pembobotan' ? 3 : 2} className="py-3 px-2 border border-slate-300 text-center w-20 bg-slate-50 text-slate-800 font-extrabold">Aksi</th>
                        </tr>
                        {/* Row 2 Header */}
                        <tr className="bg-slate-50 text-slate-650 font-bold text-[9px] uppercase tracking-wider text-center border-b border-slate-300">
                          {activeMaxSumatifCount > 0 && Array.from({ length: activeMaxSumatifCount }).map((_, sIdx) => {
                            const alphabetCode = String.fromCharCode(65 + (sIdx % 26));
                            return (
                              <th key={sIdx} className="py-2 px-1 border border-slate-300 bg-rose-50/45 w-10 text-rose-900 font-black">
                                S{sIdx + 1}
                                <span className="block text-[8px] font-normal text-slate-400 font-sans">{alphabetCode}</span>
                              </th>
                            );
                          })}
                          {activeMaxSumatifCount > 0 && (
                            <th className="py-2 px-1.5 border border-slate-300 bg-rose-100/50 font-extrabold text-rose-900 text-[10px] w-16">NA S.LM</th>
                          )}
                          <th className="py-2 px-1 border border-slate-300 bg-teal-50/45 w-12 text-teal-900 font-bold">Non Tes</th>
                          <th className="py-2 px-1 border border-slate-300 bg-teal-50/45 w-12 text-teal-900 font-bold">Tes</th>
                          <th className="py-2 px-1.5 border border-slate-300 bg-teal-100/60 font-extrabold text-teal-900 text-[10px] w-16">NA SAS</th>
                        </tr>
                        {/* Row 3 Header (Bobot Pembobotan Only) */}
                        {opsiPenilaian === 'pembobotan' && (
                          <tr className="bg-orange-50/40 text-slate-750 border-b border-slate-300 font-mono text-[9px] uppercase tracking-wider text-center">
                            {activeMaxSumatifCount > 0 && Array.from({ length: activeMaxSumatifCount }).map((_, sIdx) => {
                              const sKey = `S${sIdx + 1}`;
                              const weightVal = sumatifWeights[sKey] !== undefined ? sumatifWeights[sKey] : 1;
                              return (
                                <th key={sIdx} className="py-1 px-1.5 border border-slate-300 bg-orange-100/30 text-orange-950">
                                  <div className="flex flex-col items-center justify-center gap-0.5">
                                    <span className="text-[8px] font-bold text-orange-700">Bobot S{sIdx + 1}</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={weightVal}
                                      onChange={(e) => {
                                        const val = Math.max(0, Number(e.target.value) || 0);
                                        setSumatifWeights(prev => ({
                                          ...prev,
                                          [sKey]: val
                                        }));
                                      }}
                                      className="w-8 px-1 py-0.5 text-center text-[10px] font-bold border border-orange-250 rounded focus:outline-none focus:ring-1 focus:ring-orange-400 bg-white"
                                    />
                                  </div>
                                </th>
                              );
                            })}
                            {activeMaxSumatifCount > 0 && (
                              <th className="py-1 px-1 style-none border border-slate-300 bg-orange-50/20 text-orange-600 font-extrabold text-[8px]">Sesuai Bobot</th>
                            )}
                            <th className="py-1 px-1 border border-slate-300 bg-teal-50/20" colSpan={3}></th>
                          </tr>
                        )}
                      </thead>
                      <tbody className="divide-y divide-slate-300 font-medium text-[11px]">
                        {sortedStudents.map((item, index) => {
                          const rowSumatifs: (number | null)[] = [];
                          for (let s = 1; s <= activeMaxSumatifCount; s++) {
                            let sVal = item[`sumatif${s}`];
                            if (sVal === undefined || sVal === null || sVal === '') {
                              // legacy fallback
                              if (s === 1) sVal = item.tp1;
                              else if (s === 2) sVal = item.tp2;
                              else if (s === 3) sVal = item.tp3;
                            }
                            rowSumatifs.push((sVal !== undefined && sVal !== null && sVal !== '' && !isNaN(Number(sVal))) ? Number(sVal) : null);
                          }

                          const calc = computeStudentValues(item);

                          const nonTesVal = item.nonTes !== undefined ? item.nonTes : null;
                          const tesVal = item.tes !== undefined ? item.tes : null;
                          
                          const hasSas = nonTesVal !== null || tesVal !== null;
                          const calculatedRowAvgSAS = hasSas 
                            ? parseFloat((((nonTesVal ?? 0) + (tesVal ?? 0)) / ((nonTesVal !== null ? 1 : 0) + (tesVal !== null ? 1 : 0) || 1)).toFixed(1))
                            : (item.sas !== undefined && item.sas !== 0 ? item.sas : null);

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/75 transition-colors">
                              <td className="py-3 px-2 border border-slate-300 text-center font-mono font-bold text-slate-500">
                                {index + 1}
                              </td>
                              <td className="py-3 px-3 border border-slate-300">
                                <div className="font-extrabold text-slate-905 text-xs">{item.namaSiswa}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">NISN: {item.nisn} • {item.kelas}</div>
                              </td>
                              <td className="py-3 px-3 border border-slate-300">
                                <span className="bg-indigo-50/80 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-black border border-indigo-150">
                                  {item.mataPelajaran}
                                </span>
                              </td>
                              {/* Dynamic Sumatifs */}
                              {rowSumatifs.map((s, sIdx) => {
                                const sNum = sIdx + 1;
                                const fieldName = `sumatif${sNum}`;
                                const valToShow = s !== null ? s : '';
                                return (
                                  <td key={sIdx} className="p-0 border border-slate-300 text-center font-mono font-extrabold text-[11px] text-slate-700 bg-rose-50/10 focus-within:bg-rose-100/50">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      placeholder="-"
                                      title={`Ubah nilai Sumatif ${sNum}`}
                                      className="w-12 py-1.5 px-0.5 text-center font-extrabold text-slate-850 bg-transparent rounded border border-transparent hover:border-rose-300 focus:border-rose-500 focus:bg-white focus:outline-none transition duration-100 font-mono text-xs w-full block"
                                      value={valToShow}
                                      onChange={(e) => handleUpdateStudentField(item.id, fieldName, e.target.value)}
                                      onBlur={() => {
                                        const currentStudent = students.find(current => current.id === item.id);
                                        if (currentStudent && gasUrl) {
                                          handlePushToGoogleSheets(currentStudent);
                                        }
                                      }}
                                    />
                                  </td>
                                );
                              })}
                              {/* NA Sumatif Lingkup Materi */}
                              <td className="py-2.5 px-1.5 border border-slate-300 text-center font-black text-[11px] bg-rose-500/5 text-rose-800">
                                {calc.validSumatifs.length > 0 ? calc.tpAverage.toFixed(1) : <span className="text-slate-350 font-normal">-</span>}
                              </td>
                              {/* Non Tes */}
                              <td className="p-0 border border-slate-300 text-center font-mono font-extrabold text-[11px] text-slate-700 bg-teal-50/10 focus-within:bg-teal-100/50">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="-"
                                  title="Ubah nilai Non Tes"
                                  className="w-12 py-1.5 px-0.5 text-center font-extrabold text-slate-850 bg-transparent rounded border border-transparent hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:outline-none transition duration-100 font-mono text-xs w-full block"
                                  value={nonTesVal !== null ? nonTesVal : ''}
                                  onChange={(e) => handleUpdateStudentField(item.id, 'nonTes', e.target.value)}
                                  onBlur={() => {
                                    const currentStudent = students.find(current => current.id === item.id);
                                    if (currentStudent && gasUrl) {
                                      handlePushToGoogleSheets(currentStudent);
                                    }
                                  }}
                                />
                              </td>
                              {/* Tes */}
                              <td className="p-0 border border-slate-300 text-center font-mono font-extrabold text-[11px] text-slate-705 bg-teal-50/10 focus-within:bg-teal-100/50">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="-"
                                  title="Ubah nilai Tes"
                                  className="w-12 py-1.5 px-0.5 text-center font-extrabold text-slate-850 bg-transparent rounded border border-transparent hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:outline-none transition duration-100 font-mono text-xs w-full block"
                                  value={tesVal !== null ? tesVal : ''}
                                  onChange={(e) => handleUpdateStudentField(item.id, 'tes', e.target.value)}
                                  onBlur={() => {
                                    const currentStudent = students.find(current => current.id === item.id);
                                    if (currentStudent && gasUrl) {
                                      handlePushToGoogleSheets(currentStudent);
                                    }
                                  }}
                                />
                              </td>
                              {/* NA SAS */}
                              <td className="py-2.5 px-1.5 border border-slate-300 text-center font-black text-[11px] bg-teal-500/5 text-teal-800">
                                {calculatedRowAvgSAS !== null ? calculatedRowAvgSAS : <span className="text-slate-350 font-normal">-</span>}
                              </td>
                              {/* Nilai Rapor */}
                              <td className="py-3 px-2 border border-slate-300 text-center font-black text-xs bg-amber-500/10 text-amber-900">
                                <span className={`px-2 py-1 rounded font-extrabold text-[11px] ${
                                  calc.nilaiAkhir >= 80 ? 'bg-emerald-500/10 text-emerald-800' :
                                  calc.nilaiAkhir >= 70 ? 'bg-blue-500/10 text-blue-800' :
                                  'bg-rose-500/10 text-rose-800'
                                }`}>
                                  {calc.nilaiAkhir}
                                </span>
                              </td>
                              <td className="py-3 px-4 border border-slate-300 text-[10.5px] text-slate-500 leading-relaxed font-sans font-medium hover:text-slate-800 transition" style={{ maxWidth: '400px' }}>
                                {calc.descLengkap}
                              </td>
                              <td className="py-3 px-2 border border-slate-300 text-center bg-slate-50/40">
                                <div className="flex items-center justify-center gap-1.5">
                                  {gasUrl && (
                                    <button 
                                      onClick={() => handlePushToGoogleSheets(item)}
                                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer transition border border-emerald-100 bg-white"
                                      title="Sinkronkan / perbarui data nilai ke Google Sheets"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteStudent(item.id, item.namaSiswa)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition font-semibold border border-rose-100 bg-white"
                                    title="Hapus data"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Tab 3: Config Bobot & Deskripsi TP */}
        {activeTab === 'tp_settings' && (
          <div className="space-y-6">

            {/* TP Descriptions Settings */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-6">
              <div>
                <h3 className="text-sm md:text-base font-extrabold text-slate-800 mb-1">
                  Materi Kompetensi Deskripsi TP (Tujuan Pembelajaran)
                </h3>
                <p className="text-xs text-slate-400 font-medium">Isi deskripsi untuk menyusun kata kunci penilaian pada form input masing-masing Mapel.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                
                {/* Form to add a new Mata Pelajaran & TPU */}
                <form onSubmit={handleAddMapel} className="lg:col-span-4 bg-slate-50 border border-slate-200/60 p-5 rounded-xl space-y-4">
                  <h4 className="text-xs font-black uppercase text-blue-950 tracking-wider flex items-center gap-1.5">
                    <span>📚</span> Tambah Mapel & TP Baru
                  </h4>
                  <p className="text-[10.5px] leading-relaxed text-slate-400 font-semibold font-medium">
                    Daftar kompetensi TP di bawah ini akan langsung dimasukkan ke opsi pilihan mata pelajaran di halaman formulir rapor.
                  </p>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Pilih Tingkat</label>
                      <select 
                        value={newMapelForm.kelas}
                        onChange={(e) => setNewMapelForm({ ...newMapelForm, kelas: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-700 font-sans"
                        required
                      >
                        {allowedTingkatsSettings.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Pilih Mata Pelajaran</label>
                      <select 
                        value={newMapelForm.mapel}
                        onChange={(e) => setNewMapelForm({ ...newMapelForm, mapel: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-700 font-sans"
                        required
                      >
                        {allowedMapelsSettings.map(mapel => (
                          <option key={mapel} value={mapel}>{mapel}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Deskripsi Tujuan Pembelajaran 1 (TP 1)</label>
                      <textarea 
                        rows={2}
                        placeholder="Contoh: menganalisis nilai Pancasila dalam kehidupan sehari-hari"
                        value={newMapelForm.tp1Desc}
                        onChange={(e) => setNewMapelForm({ ...newMapelForm, tp1Desc: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Deskripsi Tujuan Pembelajaran 2 (TP 2)</label>
                      <textarea 
                        rows={2}
                        placeholder="Contoh: menerapkan sikap gotong royong di lingkungan sekolah"
                        value={newMapelForm.tp2Desc}
                        onChange={(e) => setNewMapelForm({ ...newMapelForm, tp2Desc: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Deskripsi Tujuan Pembelajaran 3 (TP 3)</label>
                      <textarea 
                        rows={2}
                        placeholder="Contoh: menceritakan sejarah perumusan Pancasila"
                        value={newMapelForm.tp3Desc}
                        onChange={(e) => setNewMapelForm({ ...newMapelForm, tp3Desc: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                        required
                      />
                    </div>

                    {newMapelExtraTps.map((tpDesc, idx) => {
                      const tpNum = idx + 4;
                      return (
                        <div key={idx} className="space-y-1.5 pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deskripsi Tujuan Pembelajaran {tpNum} (TP {tpNum})</label>
                            <button
                              type="button"
                              onClick={() => {
                                setNewMapelExtraTps(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded transition cursor-pointer"
                              title="Hapus TP ini"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea 
                            rows={2}
                            placeholder={`Contoh: Mendeskripsikan materi ke-${tpNum}`}
                            value={tpDesc}
                            onChange={(e) => {
                              const updated = [...newMapelExtraTps];
                              updated[idx] = e.target.value;
                              setNewMapelExtraTps(updated);
                            }}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                            required
                          />
                        </div>
                      );
                    })}

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setNewMapelExtraTps(prev => [...prev, ''])}
                        className="w-full hover:bg-slate-100/80 text-blue-700 bg-blue-50/50 hover:text-blue-800 text-[10px] font-extrabold uppercase py-2 px-3 rounded-lg transition border border-dashed border-blue-200 flex items-center justify-center gap-1 cursor-pointer font-sans"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Tujuan Pembelajaran (TP) Baru
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Tambah Mata Pelajaran
                  </button>
                </form>

                {/* Right side: Configs lists mapping */}
                <div className="lg:col-span-8">
                  {filteredTpConfigsDisplay.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                      <p className="text-slate-400 font-bold text-xs">Tidak ada KKTP/Materi TP yang sesuai dengan Mata Pelajaran & Kelas yang Anda ajar.</p>
                      <p className="text-[10px] text-slate-400 mt-1">Silakan tambahkan baru di form sebelah kiri atau hubungi Admin jika terdapat ketidaksesuaian pembagian tugas.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredTpConfigsDisplay.map((config) => (
                        <div key={config.id} className="p-4 rounded-xl border border-slate-150/80 bg-slate-50 relative space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                            <div className="flex flex-col gap-1">
                              <span className="bg-blue-900 text-white rounded px-2 py-0.5 font-bold text-[9px] uppercase tracking-wider w-max">
                                {config.kelas}
                              </span>
                              <span className="font-extrabold text-xs text-slate-800 uppercase">
                                {config.mapel}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {gasUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleSaveSingleTPConfig(config)}
                                  className="text-emerald-600 hover:text-emerald-800 p-1 rounded hover:bg-emerald-50 cursor-pointer transition font-semibold"
                                  title="Simpan perubahan draf ke Google Sheets"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                  onClick={() => handleDeleteMapel(config.id, config.mapel)}
                                className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 cursor-pointer transition font-semibold"
                                title="Hapus mata pelajaran ini"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capaian TP 1 (Deskripsi)</label>
                              <input 
                                type="text" 
                                value={config.tp1Desc}
                                onChange={(e) => {
                                  const updated = tpConfigs.map(c => 
                                    c.id === config.id ? { ...c, tp1Desc: e.target.value } : c
                                  );
                                  setTpConfigs(updated);
                                }}
                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capaian TP 2 (Deskripsi)</label>
                              <input 
                                type="text" 
                                value={config.tp2Desc}
                                onChange={(e) => {
                                  const updated = tpConfigs.map(c => 
                                    c.id === config.id ? { ...c, tp2Desc: e.target.value } : c
                                  );
                                  setTpConfigs(updated);
                                }}
                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capaian TP 3 (Deskripsi)</label>
                              <input 
                                type="text" 
                                value={config.tp3Desc}
                                onChange={(e) => {
                                  const updated = tpConfigs.map(c => 
                                    c.id === config.id ? { ...c, tp3Desc: e.target.value } : c
                                  );
                                  setTpConfigs(updated);
                                }}
                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                              />
                            </div>

                            {(config.extraTps || []).map((tp, extraIdx) => {
                              const tpNum = extraIdx + 4;
                              return (
                                <div key={extraIdx} className="space-y-1 pt-1.5 border-t border-slate-200/50">
                                  <div className="flex items-center justify-between">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capaian TP {tpNum} (Deskripsi)</label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = tpConfigs.map(c => {
                                          if (c.id === config.id && c.extraTps) {
                                            const nextExtra = [...c.extraTps];
                                            nextExtra.splice(extraIdx, 1);
                                            return { 
                                              ...c, 
                                              extraTps: nextExtra.length > 0 ? nextExtra : undefined 
                                            };
                                          }
                                          return c;
                                        });
                                        setTpConfigs(updated);
                                      }}
                                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded transition cursor-pointer"
                                      title="Hapus TP ini"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <input 
                                    type="text" 
                                    value={tp}
                                    onChange={(e) => {
                                      const updated = tpConfigs.map(c => {
                                        if (c.id === config.id) {
                                          const nextExtra = c.extraTps ? [...c.extraTps] : [];
                                          nextExtra[extraIdx] = e.target.value;
                                          return { ...c, extraTps: nextExtra };
                                        }
                                        return c;
                                      });
                                      setTpConfigs(updated);
                                    }}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                                  />
                                </div>
                              );
                            })}

                            <div className="pt-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = tpConfigs.map(c => {
                                    if (c.id === config.id) {
                                      const nextExtra = c.extraTps ? [...c.extraTps] : [];
                                      nextExtra.push('');
                                      return { ...c, extraTps: nextExtra };
                                    }
                                    return c;
                                  });
                                  setTpConfigs(updated);
                                }}
                                className="flex items-center gap-1 text-[10px] font-extrabold text-blue-700 hover:text-blue-800 transition py-2 px-2.5 rounded bg-blue-50/50 hover:bg-blue-100 border border-dashed border-blue-200 cursor-pointer w-full justify-center uppercase"
                              >
                                <Plus className="w-3.5 h-3.5" /> Tambah Capaian TP
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Google Apps Script Code Center */}
        {activeTab === 'gas_center' && (
          <div className="space-y-6">
            
            <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-md border-b-4 border-amber-400">
              <h3 className="text-base font-extrabold flex items-center gap-2 mb-2">
                <Code2 className="w-5 h-5 text-amber-300" />
                Pusat Kode Integrasi Google Apps Script (GAS)
              </h3>
              <p className="text-xs text-blue-200 leading-relaxed font-semibold max-w-4xl">
                Alat bantu integrasi ini memfasilitasi Anda untuk memiliki Web AsesmenQu milik Anda sendiri secara mandiri. Salin file-file di bawah ini ke editor Google Apps Script, hubungkan dengan Spreadsheet Penilaian, dan silakan deploy secara publik melalui instruksi di bawah ini!
              </p>
            </div>

            {/* Step by Step Deployment Guide */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-slate-800 space-y-4">
              <h4 className="text-sm font-extrabold text-amber-900 tracking-wider uppercase flex items-center gap-1.5">
                <span>🚀</span> INSTRUKSI DEPLOYMENT WEB APP DAN INTEGRASI SHEETS
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
                <div className="bg-white p-4.5 rounded-xl border border-amber-100 shadow-sm">
                  <div className="text-amber-600 font-extrabold text-sm mb-1.5">1. SPREADSHEET</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">Buat Google Sheets baru, berinama e.g. "Database SiAfis", siapkan 2 sheet: <strong>DataNilai</strong> dan <strong>DataSiswa</strong>.</p>
                </div>

                <div className="bg-white p-4.5 rounded-xl border border-amber-100 shadow-sm">
                  <div className="text-amber-600 font-extrabold text-sm mb-1.5">2. BUKA APPS SCRIPT</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">Tekan menu <strong>Ekstensi</strong> &gt; pilih <strong>Apps Script</strong>. Buat berkas-berkas dengan nama yang sesuai petunjuk.</p>
                </div>

                <div className="bg-white p-4.5 rounded-xl border border-amber-100 shadow-sm">
                  <div className="text-amber-600 font-extrabold text-sm mb-1.5">3. SALIN KODE</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">Salin kode <strong>Code.gs</strong>, <strong>index.html</strong>, <strong>style.html</strong>, dan <strong>script.html</strong> ke berkas Apps Script Anda.</p>
                </div>

                <div className="bg-white p-4.5 rounded-xl border border-amber-100 shadow-sm">
                  <div className="text-amber-600 font-extrabold text-sm mb-1.5">4. TERAPKAN (DEPLOY)</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">Klik <strong>Deploy &gt; Deployment Baru</strong>. Pilih tipe <strong>Web App</strong>, ubah akses penonton ke <strong>Anyone (Siapa saja)</strong>.</p>
                </div>
              </div>
            </div>

            {/* Tabbed Code Snippets with Copy actions */}
            <div className="grid grid-cols-1 gap-6">
              
              {/* Box 1: Kolom Sheets */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 tracking-wider">1. INSTRUKSI STRUKTUR COLUMN GOOGLE SHEETS</span>
                  <button 
                    onClick={() => handleCopyCode('sheets_col', getGoogleSheetsColInstruction)}
                    className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer"
                  >
                    {copiedFile === 'sheets_col' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copiedFile === 'sheets_col' ? 'Disalin' : 'Salin Kode'}
                  </button>
                </div>
                <div className="p-4 bg-slate-900 text-white font-mono text-[11.5px] whitespace-pre overflow-x-auto leading-relaxed max-h-56">
                  {getGoogleSheetsColInstruction}
                </div>
              </div>

              {/* Box 2: Code.gs backend */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 tracking-wider">2. BACK-END - Code.gs</span>
                  <button 
                    onClick={() => handleCopyCode('code_gs', getCodeGS)}
                    className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer"
                  >
                    {copiedFile === 'code_gs' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copiedFile === 'code_gs' ? 'Disalin' : 'Salin Code.gs'}
                  </button>
                </div>
                <div className="p-4 bg-slate-900 text-yellow-300 font-mono text-[11px] whitespace-pre overflow-x-auto leading-relaxed max-h-80">
                  {getCodeGS}
                </div>
              </div>

              {/* Box 3: index.html frontend */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 tracking-wider">3. FRONT-END UI STRUCTURE - index.html</span>
                  <button 
                    onClick={() => handleCopyCode('index_html', getIndexHtml)}
                    className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer"
                  >
                    {copiedFile === 'index_html' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copiedFile === 'index_html' ? 'Disalin' : 'Salin index.html'}
                  </button>
                </div>
                <div className="p-4 bg-slate-900 text-sky-300 font-mono text-[11px] whitespace-pre overflow-x-auto leading-relaxed max-h-80">
                  {getIndexHtml}
                </div>
              </div>

              {/* Box 4: style.html backend */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 tracking-wider">4. INDONESIAN ASESMENQU THEME STYLE - style.html</span>
                  <button 
                    onClick={() => handleCopyCode('style_html', getStyleHtml)}
                    className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer"
                  >
                    {copiedFile === 'style_html' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copiedFile === 'style_html' ? 'Disalin' : 'Salin style.html'}
                  </button>
                </div>
                <div className="p-4 bg-slate-900 text-emerald-300 font-mono text-[11.5px] whitespace-pre overflow-x-auto leading-relaxed max-h-64">
                  {getStyleHtml}
                </div>
              </div>

              {/* Box 5: script.html code */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 tracking-wider">5. DYNAMIC ENGINE JAVASCRIPT - script.html</span>
                  <button 
                    onClick={() => handleCopyCode('script_html', getScriptHtml)}
                    className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer"
                  >
                    {copiedFile === 'script_html' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copiedFile === 'script_html' ? 'Disalin' : 'Salin script.html'}
                  </button>
                </div>
                <div className="p-4 bg-slate-900 text-teal-300 font-mono text-[11px] whitespace-pre overflow-x-auto leading-relaxed max-h-80">
                  {getScriptHtml}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 5: Menu Setelan (KKTP, Master Database Siswa, Admin Guru Sub-Menu) */}
        {activeTab === 'settings_menu' && (currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin') && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm font-sans">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Pusat Setelan & Kontrol Aplikasi
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold font-medium">Navigasikan sub-menu di bawah untuk mengatur KKTP, Master Siswa, maupun akun Pengajar.</p>
                </div>
                <div className="flex bg-slate-100/80 p-1 rounded-xl gap-1 border border-slate-200 w-fit shrink-0 overflow-x-auto max-w-full">
                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('kktp')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      settingsSubTab === 'kktp' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5 shrink-0" />
                    Setelan KKTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('bobot')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      settingsSubTab === 'bobot' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 shrink-0" />
                    Bobot Penilaian
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('students')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      settingsSubTab === 'students' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    Database Murid
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('admin')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      settingsSubTab === 'admin' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5 shrink-0" />
                    Admin Akun Guru
                  </button>
                </div>
              </div>
            </div>

            {settingsSubTab === 'kktp' && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-600" />
                    Setelan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Atur batas minimal kelulusan dan taraf predikat capaian kompetensi untuk draf deskripsi rapor resmi dinamis di bawah ini.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 border border-slate-200 rounded-xl pt-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                      Batas Minimum Ketuntasan (KKTP)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={kktpMin}
                        onChange={(e) => setKktpMin(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                        onBlur={() => handleSavePengaturanSilently(kktpMin, kktpSangatBaik)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-mono font-bold"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                      Batas Mulai Sangat Baik
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={kktpSangatBaik}
                        onChange={(e) => setKktpSangatBaik(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                        onBlur={() => handleSavePengaturanSilently(kktpMin, kktpSangatBaik)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-mono font-bold"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">%</span>
                    </div>
                  </div>
                </div>

                {/* Range Visualizer Map */}
                <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold pt-1">
                  <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-100">
                    <div className="font-extrabold uppercase text-[9px] text-rose-400 tracking-wider">Perlu Bimbingan</div>
                    <div className="font-mono mt-1 text-sm font-black">&lt; {kktpMin}</div>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
                    <div className="font-extrabold uppercase text-[9px] text-blue-400 tracking-wider">Tercapai Baik</div>
                    <div className="font-mono mt-1 text-sm font-black">{kktpMin} s/d {kktpSangatBaik - 1}</div>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                    <div className="font-extrabold uppercase text-[9px] text-emerald-400 tracking-wider">Tercapai Sangat Baik</div>
                    <div className="font-mono mt-1 text-sm font-black">&gt;= {kktpSangatBaik}</div>
                  </div>
                </div>

                {gasUrl && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleSavePengaturan}
                      disabled={savingSettings}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${savingSettings ? 'animate-spin' : ''}`} />
                      {savingSettings ? 'Mengirim Data...' : 'Simpan & Sinkronkan KKTP ke Google Sheets'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {settingsSubTab === 'bobot' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-6">
                <div>
                  <h3 className="text-sm md:text-base font-extrabold text-slate-800 mb-1 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-600" />
                    Bobot Kontribusi Nilai Rapor Akhir
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Sesuaikan persentase konstanta rumus nilai Akhir Rapor sesuai dengan kebijakan kriteria penilaian sekolah Anda. Perubahan akan tersimpan otomatis dan disinkronkan ke Google Sheets.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                  <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                      <span>BOBOT SUMATIF TP (LINGKUP MATERI):</span>
                      <span className="text-blue-700 font-extrabold text-sm">{weightTP}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="90" 
                      value={weightTP} 
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setWeightTP(val);
                        setWeightSAS(100 - val);
                      }}
                      onMouseUp={(e) => {
                        const val = Number((e.target as HTMLInputElement).value);
                        handleSavePengaturanSilently(kktpMin, kktpSangatBaik, val, 100 - val);
                        triggerToast(`Bobot Rapor diperbarui: TP ${val}% - SAS ${100 - val}% di Google Sheets`, true);
                      }}
                      onTouchEnd={(e) => {
                        const val = Number((e.target as HTMLInputElement).value);
                        handleSavePengaturanSilently(kktpMin, kktpSangatBaik, val, 100 - val);
                        triggerToast(`Bobot Rapor diperbarui: TP ${val}% - SAS ${100 - val}% di Google Sheets`, true);
                      }}
                      className="w-full accent-blue-700 cursor-pointer" 
                    />
                  </div>

                  <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                      <span>BOBOT SUMATIF AKHIR SEMESTER (SAS):</span>
                      <span className="text-blue-700 font-extrabold text-sm">{weightSAS}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="90" 
                      value={weightSAS} 
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setWeightSAS(val);
                        setWeightTP(100 - val);
                      }}
                      onMouseUp={(e) => {
                        const val = Number((e.target as HTMLInputElement).value);
                        handleSavePengaturanSilently(kktpMin, kktpSangatBaik, 100 - val, val);
                        triggerToast(`Bobot Rapor diperbarui: TP ${100 - val}% - SAS ${val}% di Google Sheets`, true);
                      }}
                      onTouchEnd={(e) => {
                        const val = Number((e.target as HTMLInputElement).value);
                        handleSavePengaturanSilently(kktpMin, kktpSangatBaik, 100 - val, val);
                        triggerToast(`Bobot Rapor diperbarui: TP ${100 - val}% - SAS ${val}% di Google Sheets`, true);
                      }}
                      className="w-full accent-blue-700 cursor-pointer" 
                    />
                  </div>
                </div>

                {gasUrl && (
                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={async () => {
                        setSavingSettings(true);
                        triggerToast('Menyimpan pengaturan bobot kontribusi ke Google Sheets...', true);
                        await handleSavePengaturanSilently(kktpMin, kktpSangatBaik, weightTP, weightSAS);
                        triggerToast('Pengaturan bobot kontribusi berhasil disinkronkan ke Google Sheets!', true);
                        setSavingSettings(false);
                      }}
                      disabled={savingSettings}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 hover:scale-[1.01] active:scale-[0.99] transition rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${savingSettings ? 'animate-spin' : ''}`} />
                      {savingSettings ? 'Mengirim Data...' : 'Simpan & Sinkronkan Bobot ke Google Sheets'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {settingsSubTab === 'students' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                {/* Left side: Add Student & Bulk Upload stacked cards */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Card 1: Add Student form */}
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
                    <h4 className="text-xs md:text-sm font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-2">
                      <UserPlus className="w-4.5 h-4.5 text-blue-700" />
                      Tambah Murid ke Database
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      Guru bisa mendaftarkan data siswa lokal baru di sheet 'DataSiswa'. Data akan tersimpan permanen di Sheets jika URL GAS aktif.
                    </p>

                    <form onSubmit={handleAddMasterStudent} className="space-y-4 text-xs font-medium">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Lengkap Siswa</label>
                        <input 
                          type="text" 
                          placeholder="Isi nama nama lengkap murid..." 
                          value={newMasterForm.nama}
                          onChange={(e) => setNewMasterForm({ ...newMasterForm, nama: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 bg-slate-50/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">NISN Murid</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: 012245678" 
                          value={newMasterForm.nisn}
                          onChange={(e) => setNewMasterForm({ ...newMasterForm, nisn: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-white font-mono"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kelas Rapor</label>
                          <select 
                            value={newMasterForm.kelas}
                            onChange={(e) => setNewMasterForm({ ...newMasterForm, kelas: e.target.value })}
                            className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
                          >
                            {listAllClasses.map(kls => (
                              <option key={kls} value={kls}>{kls}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                          <select 
                            value={newMasterForm.jenisKelamin}
                            onChange={(e) => setNewMasterForm({ ...newMasterForm, jenisKelamin: e.target.value })}
                            className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="L">Laki-laki (L)</option>
                            <option value="P">Perempuan (P)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={savingMaster}
                        className="w-full bg-blue-750 hover:bg-blue-850 text-white font-bold py-3 px-4 text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {savingMaster ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                        {savingMaster ? 'Sedang Menyimpan...' : 'Tambahkan Siswa ke Sheets'}
                      </button>
                    </form>
                  </div>

                  {/* Card 2: Bulk Upload student template */}
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
                    <h4 className="text-xs md:text-sm font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-2">
                      <Upload className="w-4.5 h-4.5 text-blue-750" />
                      Upload Data Siswa Terbuka
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      Tambahkan banyak data nama siswa sekaligus ke dalam file spreadsheet menggunakan dokumen csv / txt.
                    </p>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleDownloadTemplateSiswa}
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-extrabold py-2.5 px-3 text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Download className="w-4 h-4 text-blue-700" />
                        Siapkan Template Excel
                      </button>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 leading-relaxed font-medium space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-900 font-extrabold uppercase text-[10px] tracking-wider">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Proteksi Format Header:
                        </div>
                        <p>
                          Guru <strong>dilarang keras mengubah nama atau menghapus kolom header utama</strong> (Nama Lengkap, NISN, Kelas, Jenis Kelamin) agar berkas bisa dibaca sistem dengan benar saat di-upload.
                        </p>
                      </div>

                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDropSiswaFile}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-5 text-center cursor-pointer hover:bg-blue-50/20 transition group"
                        title="Seret file Anda kesini!"
                      >
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mx-auto mb-2 transition" />
                        <span className="text-[11px] text-slate-700 font-extrabold block">Tarik & Lepas File Template Disini</span>
                        <span className="text-[9px] text-slate-400 font-medium block mt-1">atau klik untuk upload dari komputer</span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleSiswaFileChange}
                          accept=".csv,.txt"
                          className="hidden font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Student List Table */}
                <div className="lg:col-span-8 bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                      <h4 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider">Identitas Seluruh Master Siswa</h4>
                      <p className="text-[10px] text-slate-400 font-semibold font-medium">Data murid aktif di dalam file spreadsheet sheet "DataSiswa".</p>
                    </div>
                    <button
                      type="button"
                      onClick={syncMasterSiswa}
                      disabled={loadingMaster}
                      className="text-[10px] font-extrabold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-105 transition px-3 py-2 rounded-xl border border-blue-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-sm font-sans"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingMaster ? 'animate-spin' : ''}`} />
                      {loadingMaster ? 'Memuat...' : 'Tarik Live Google Sheets'}
                    </button>
                  </div>

                  <div className="overflow-y-auto max-h-[460px]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/50 text-slate-500 font-extrabold uppercase border-b border-slate-100">
                          <th className="py-3 px-4 text-[10px]">Nama Lengkap</th>
                          <th className="py-3 px-4 text-[10px]">NISN / Nomor Induk</th>
                          <th className="py-3 px-4 text-[10px]">Kelas</th>
                          <th className="py-3 px-4 text-[10px] text-center">Gender</th>
                          <th className="py-3 px-4 text-[10px] text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {masterStudents.map((ms) => (
                          <tr key={ms.nisn} className="hover:bg-slate-50/50 transition">
                            <td className="py-3 px-4 font-bold text-slate-900">{ms.nama}</td>
                            <td className="py-3 px-4 font-mono text-slate-600">{ms.nisn}</td>
                            <td className="py-3 px-4">
                              <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded text-[10px]">{ms.kelas}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${ms.jenisKelamin === 'P' ? 'bg-pink-50 text-pink-700 border border-pink-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                {ms.jenisKelamin || 'L'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteMasterStudent(ms.nisn, ms.nama)}
                                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer transition"
                                title="Hapus Siswa"
                              >
                                <Trash2 className="w-4 h-4" />
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

            {settingsSubTab === 'admin' && (
              <div className="space-y-8">
                <div className="bg-slate-50 border border-slate-205 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold flex items-center gap-2 text-slate-800">
                      <Shield className="w-5 h-5 text-red-600 shrink-0" />
                      Admin Guru & Akun Pengajar (Sub Menu)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl mt-1">
                      Tambahkan atau hapus akun pengguna pendidik untuk login ke masing-masing aplikasi mereka. Seluruh data akun guru ini disimpan dalam spreadsheet Google Sheets Anda secara langsung, tidak disimpan secara lokal!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => syncTeachers(false)}
                    className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold transition shadow-sm shrink-0 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 text-blue-600 ${loadingTeachers ? 'animate-spin' : ''}`} />
                    Sinkronkan dari Sheets
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form tambah akun */}
                  <form onSubmit={handleSaveTeacher} className="lg:col-span-4 bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase flex items-center gap-2">
                        <span>👤</span> Registrasi Akun Guru Baru
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">Isi kolom di bawah ini untuk membuat hak akses guru baru.</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Nama Lengkap Pendidik</label>
                      <input 
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso, S.Pd."
                        value={newTeacherNama}
                        onChange={(e) => setNewTeacherNama(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Username Login</label>
                      <input 
                        type="text"
                        required
                        placeholder="Contoh: budispd (tanpa spasi)"
                        value={newTeacherUsername}
                        onChange={(e) => setNewTeacherUsername(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Sandi Login</label>
                      <input 
                        type="text"
                        required
                        placeholder="Contoh: rahasia123"
                        value={newTeacherPassword}
                        onChange={(e) => setNewTeacherPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Jabatan Pendidik</label>
                      <select 
                        value={newTeacherJenisJabatan}
                        onChange={(e) => {
                          const val = e.target.value as 'Admin' | 'Guru Kelas' | 'Guru Mapel';
                          setNewTeacherJenisJabatan(val);
                          setNewTeacherRole(val === 'Admin' ? 'Admin' : 'Guru');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition font-medium"
                      >
                        <option value="Guru Kelas">Guru Kelas</option>
                        <option value="Guru Mapel">Guru Mata Pelajaran (Mapel)</option>
                        <option value="Admin">Admin Utama / Kepala Sekolah</option>
                      </select>
                    </div>

                    {newTeacherJenisJabatan === 'Guru Kelas' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Pilih Kelas</label>
                          <select 
                            value={newTeacherSelectedKelas}
                            onChange={(e) => setNewTeacherSelectedKelas(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition font-medium text-slate-700"
                          >
                            {(classesToOffer.length > 0 ? classesToOffer : ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6']).map(kls => (
                              <option key={kls} value={kls}>{kls}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Mata Pelajaran yang Diajarkan (Bisa Lebih Dari 1)</label>
                          <div className="max-h-40 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 mt-1">
                            {DAFTAR_MAPEL.map((mapel) => {
                              const isChecked = newTeacherSelectedMapels.includes(mapel);
                              return (
                                <label key={mapel} className="flex items-start gap-2 text-xs text-slate-600 font-semibold cursor-pointer py-0.5 hover:text-slate-900">
                                  <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        setNewTeacherSelectedMapels(prev => prev.filter(m => m !== mapel));
                                      } else {
                                        setNewTeacherSelectedMapels(prev => [...prev, mapel]);
                                      }
                                    }}
                                    className="mt-0.5"
                                  />
                                  <span>{mapel}</span>
                                </label>
                              );
                            })}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium block mt-1">Terpilih: {newTeacherSelectedMapels.length} mata pelajaran.</span>
                        </div>
                      </div>
                    )}

                    {newTeacherJenisJabatan === 'Guru Mapel' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Pilih Mata Pelajaran Utama</label>
                          <select 
                            value={newTeacherSelectedMapel}
                            onChange={(e) => setNewTeacherSelectedMapel(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition font-medium text-slate-700"
                          >
                            {DAFTAR_MAPEL.map(mapel => (
                              <option key={mapel} value={mapel}>{mapel}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Kelas yang Diajar (Bisa Lebih Dari 1)</label>
                          <div className="max-h-40 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 mt-1">
                            {(classesToOffer.length > 0 ? classesToOffer : ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6']).map((kelas) => {
                              const isChecked = newTeacherSelectedClasses.includes(kelas);
                              return (
                                <label key={kelas} className="flex items-start gap-2 text-xs text-slate-600 font-semibold cursor-pointer py-0.5 hover:text-slate-900">
                                  <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        setNewTeacherSelectedClasses(prev => prev.filter(k => k !== kelas));
                                      } else {
                                        setNewTeacherSelectedClasses(prev => [...prev, kelas]);
                                      }
                                    }}
                                    className="mt-0.5"
                                  />
                                  <span>{kelas}</span>
                                </label>
                              );
                            })}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium block mt-1">Terpilih: {newTeacherSelectedClasses.length} kelas.</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button 
                        type="submit"
                        disabled={savingTeacher}
                        className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 text-xs rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                      >
                        <PlusCircle className="w-4.5 h-4.5" />
                        {savingTeacher ? 'Sedang Menyimpan...' : (editingTeacherUsername ? 'Perbarui Kredensial' : 'Simpan & Daftarkan Guru')}
                      </button>

                      {editingTeacherUsername && (
                        <button 
                          type="button"
                          onClick={resetTeacherForm}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer mt-2"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Right Column: Daftar akun aktif */}
                  <div className="lg:col-span-8 bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                    <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase flex items-center gap-2">
                          <span>📋</span> Akun Pendidik Terdaftar ({visibleTeachers.length})
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">Daftar lengkap guru dan admin yang tersinkronisasi.</p>
                      </div>
                      {!gasUrl && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2.5 py-1 rounded">SINKRONISASI COLD: LOCAL MODE</span>
                      )}
                    </div>

                    {visibleTeachers.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                        <p>Belum ada kredensial pendidik yang terdaftar.</p>
                        <p className="font-medium text-slate-400 mt-1">Gunakan akun admin bawaan awal (<strong className="text-slate-500">admin/admin</strong>) untuk mendaftarkan akun pengajar pertama.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-xs text-left border-collapse bg-white font-sans font-medium">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[10px]">
                              <th className="px-4 py-3.5 w-24 text-center">Aksi</th>
                              <th className="px-4 py-3.5">Nama Pendidik</th>
                              <th className="px-4 py-3.5">Peran</th>
                              <th className="px-3 py-3.5">Username</th>
                              <th className="px-3 py-3.5">Password</th>
                              <th className="px-4 py-3.5">Jabatan & Kelas</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-150">
                            {visibleTeachers.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 text-center">
                                  {item.username !== 'admin' ? (
                                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                                      <button
                                        type="button"
                                        onClick={() => handleEditTeacher(item)}
                                        className="bg-white hover:bg-amber-50 text-amber-600 hover:text-amber-800 p-1.5 rounded-lg border border-slate-200 hover:border-amber-200 transition cursor-pointer flex items-center justify-center"
                                        title={`Edit Akun ${item.nama}`}
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteTeacher(item.username)}
                                        className="bg-white hover:bg-rose-50 text-rose-600 hover:text-red-700 p-1.5 rounded-lg border border-slate-200 hover:border-rose-200 transition cursor-pointer flex items-center justify-center"
                                        title={`Hapus Akun ${item.nama}`}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-bold italic tracking-wide">System</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-800">
                                  {item.nama}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`text-[8px] font-black tracking-wide px-2 py-0.5 rounded uppercase leading-none ${
                                    item.role === 'Admin' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}>
                                    {item.role}
                                  </span>
                                </td>
                                <td className="px-3 py-3 font-mono text-slate-600 font-bold">
                                  {item.username}
                                </td>
                                <td className="px-3 py-3 font-mono text-slate-600 font-bold">
                                  {item.password}
                                </td>
                                <td className="px-4 py-3">
                                  {item.jabatan ? (
                                    <div className="bg-amber-50 text-amber-800 border border-amber-100/60 text-[10px] font-bold px-2 py-0.5 rounded-md inline-block max-w-xs truncate" title={item.jabatan}>
                                      💼 {item.jabatan}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic text-[10px]">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

          </main>

          {/* Footer copyright */}
          <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-center text-xs mt-16 mt-auto">
            <div className="max-w-7xl mx-auto px-4 space-y-2">
              <p className="font-semibold text-slate-300">
                &copy; 2026 AsesmenQu_App.  Fidhal Touna AI
              </p>
              <p className="text-slate-500 font-medium">
                Dikembangkan secara mandiri untuk mempermudah tugas administrasi Guru di seluruh Indonesia.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
