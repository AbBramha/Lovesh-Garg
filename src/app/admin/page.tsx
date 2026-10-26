'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiLock,
  FiLogOut,
  FiGlobe,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiUpload,
  FiCheck,
  FiX,
  FiLayers,
  FiSliders,
  FiFileText,
  FiPhone,
  FiImage,
  FiGrid,
  FiExternalLink,
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiMail,
  FiArrowLeft
} from 'react-icons/fi';

interface Project {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  area: string;
  year: string;
  status: string;
  image: string;
  gallery: string[];
  description: string;
  concept: string;
  highlights: string[];
  materials: string[];
}

interface SiteContent {
  header?: {
    logo: string;
    brandName: string;
    brandSubtitle: string;
    navLinks: Array<{
      id: string;
      label: string;
      href: string;
    }>;
    ctaText?: string;
    ctaLink?: string;
  };
  hero: {
    headline: string;
    button1Text: string;
    button1Link?: string;
    button2Text: string;
    button2Link?: string;
    desktopVideo: string;
    mobileVideo: string;
  };
  philosophy: {
    sectionTitle: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
    architectTitle: string;
    architectName: string;
    desktopImage: string;
    mobileImage: string;
  };
  expertise: Array<{
    id: string;
    title: string;
    image: string;
  }>;
  studio?: {
    badge: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
    image: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
  };
  estimator: {
    rates: {
      Essential: {
        Architecture: { sqft: number; sqm: number };
        Interior: { sqft: number; sqm: number };
      };
      Premium: {
        Architecture: { sqft: number; sqm: number };
        Interior: { sqft: number; sqm: number };
      };
      Luxury: {
        Architecture: { sqft: number; sqm: number };
        Interior: { sqft: number; sqm: number };
      };
    };
  };
  contact: {
    inquiryEmail: string;
    inquiryPhone: string;
    consultationLink: string;
    studioAddress: string;
    instagram?: string;
    whatsapp?: string;
    linkedin?: string;
    socialLinks?: Array<{
      id: string;
      platform: string;
      url: string;
    }>;
    copyright: string;
  };
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'projects' | 'homepage' | 'matrix' | 'estimator' | 'contact'>('projects');

  // Loaded data
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [matrixData, setMatrixData] = useState<any>(null);
  const [selectedMatrixStep, setSelectedMatrixStep] = useState<number | 'results'>(1);
  const [loadingData, setLoadingData] = useState(true);

  // Feedback notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Project modal / editing state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Check auth on load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      if (res.ok) {
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        setAuthError(data.message || 'Invalid email or passcode');
      }
    } catch (err: any) {
      setAuthError('Authentication request failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [projRes, contentRes, matrixRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/content'),
        fetch('/api/admin/matrix')
      ]);

      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData);
      }
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setSiteContent(contentData);
      }
      if (matrixRes.ok) {
        const mData = await matrixRes.json();
        setMatrixData(mData);
      }
    } catch (err) {
      showToast('Error loading studio data', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  // Save Design Matrix Data
  const saveMatrixData = async (dataToSave = matrixData) => {
    if (!dataToSave) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMatrixData(dataToSave);
        showToast(data.message || 'Design Matrix published to repository', 'success');
      } else {
        showToast(data.message || 'Failed to save matrix', 'error');
      }
    } catch {
      showToast('Error saving Design Matrix', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Image Upload Handler
  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Image uploaded successfully', 'success');
        return data.url;
      } else {
        showToast(data.message || 'Image upload failed', 'error');
        return null;
      }
    } catch (err) {
      showToast('Upload network error', 'error');
      return null;
    }
  };

  // Save Projects
  const saveProjects = async (updatedProjects: Project[]) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProjects)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(updatedProjects);
        showToast(data.message || 'Projects saved to repository', 'success');
      } else {
        showToast(data.message || 'Failed to save projects', 'error');
      }
    } catch (err) {
      showToast('Error saving projects', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Site Content
  const saveSiteContent = async () => {
    if (!siteContent) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteContent)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Website content published to repository', 'success');
      } else {
        showToast(data.message || 'Failed to save content', 'error');
      }
    } catch (err) {
      showToast('Error updating website content', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Project management handlers
  const openNewProjectModal = () => {
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    setEditingProject({
      id: newId,
      slug: '',
      title: '',
      subtitle: '',
      category: 'Residential Estate',
      location: '',
      area: '',
      year: new Date().getFullYear().toString(),
      status: 'Completed',
      image: '',
      gallery: [],
      description: '',
      concept: '',
      highlights: [''],
      materials: ['']
    });
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setEditingProject(JSON.parse(JSON.stringify(project)));
    setIsProjectModalOpen(true);
  };

  const handleSaveModalProject = async () => {
    if (!editingProject) return;

    if (!editingProject.title.trim()) {
      showToast('Project title is required', 'error');
      return;
    }

    // Auto-generate slug if empty
    const slug = editingProject.slug.trim() || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const sanitizedProject: Project = {
      ...editingProject,
      slug,
      highlights: editingProject.highlights.filter(h => h.trim() !== ''),
      materials: editingProject.materials.filter(m => m.trim() !== '')
    };

    const exists = projects.some(p => p.id === sanitizedProject.id);
    let updatedList: Project[];
    if (exists) {
      updatedList = projects.map(p => (p.id === sanitizedProject.id ? sanitizedProject : p));
    } else {
      updatedList = [sanitizedProject, ...projects];
    }

    setIsProjectModalOpen(false);
    await saveProjects(updatedList);
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project? This will remove it from the website and repo.')) {
      const updatedList = projects.filter(p => p.id !== id);
      await saveProjects(updatedList);
    }
  };

  const handleAddSocialLink = () => {
    if (!siteContent) return;
    const current = siteContent.contact.socialLinks || [];
    const newLink = {
      id: Date.now().toString(),
      platform: '',
      url: ''
    };
    setSiteContent({
      ...siteContent,
      contact: {
        ...siteContent.contact,
        socialLinks: [...current, newLink]
      }
    });
  };

  const handleUpdateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    if (!siteContent) return;
    const current = [...(siteContent.contact.socialLinks || [])];
    current[index] = { ...current[index], [field]: value };
    const updatedContact = { ...siteContent.contact, socialLinks: current };
    if (current[index].platform.toLowerCase() === 'instagram') {
      updatedContact.instagram = value;
    }
    if (current[index].platform.toLowerCase() === 'whatsapp') {
      updatedContact.whatsapp = value;
    }
    setSiteContent({
      ...siteContent,
      contact: updatedContact
    });
  };

  const handleRemoveSocialLink = (index: number) => {
    if (!siteContent) return;
    const current = (siteContent.contact.socialLinks || []).filter((_, i) => i !== index);
    setSiteContent({
      ...siteContent,
      contact: {
        ...siteContent.contact,
        socialLinks: current
      }
    });
  };

  // ----------------------------------------------------
  // RENDER LOGIN SCREEN
  // ----------------------------------------------------
  if (isAuthenticated === false) {
    return (
      <main className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-center p-6 selection:bg-amber-500/30 selection:text-amber-200">
        <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative text-center mb-8 flex flex-col items-center">
            <div className="relative w-20 h-14 rounded-xl bg-white p-1 overflow-hidden border border-white/20 shadow-xl mb-3 flex items-center justify-center">
              <Image
                src="/nidhivan-tree-logo.png"
                alt="Nidhivan Design Studio Logo"
                fill
                sizes="80px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-semibold mb-1 block">
              Architectural Portal
            </span>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight font-medium text-white mb-2">
              Nidhivan Design Studio
            </h1>
            <p className="text-xs text-white/50 tracking-wider">
              Content & Project Management Console
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/60 font-medium mb-2">
                Studio Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. loveshgarg@gmail.com"
                  required
                  autoComplete="email"
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/80 transition-all duration-200 pr-12"
                />
                <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/60 font-medium mb-2">
                Studio Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter studio access passcode"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/80 transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? "Hide passcode" : "Show passcode"}
                >
                  {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300">
                <FiAlertCircle className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs tracking-widest uppercase py-3.5 rounded-xl shadow-lg shadow-amber-500/10 transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? 'Verifying Credentials...' : 'Authenticate Studio Access'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
            >
              <FiArrowLeft /> Return to Main Portfolio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isAuthenticated === null || loadingData) {
    return (
      <main className="min-h-screen bg-[#070707] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-white/50">Initializing Studio CMS...</p>
        </div>
      </main>
    );
  }

  // ----------------------------------------------------
  // RENDER AUTHENTICATED DASHBOARD
  // ----------------------------------------------------
  return (
    <main className="min-h-screen bg-[#090909] text-white selection:bg-amber-500/30 selection:text-amber-200 font-sans pb-24">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/90 border-red-500/40 text-red-200'
          }`}
        >
          {toast.type === 'success' ? <FiCheckCircle className="text-lg" /> : <FiAlertCircle className="text-lg" />}
          <span className="text-xs tracking-wide font-medium">{toast.message}</span>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-3.5">
              <div className="relative w-12 h-9 rounded-lg bg-white p-0.5 overflow-hidden shrink-0 border border-white/20 shadow-sm flex items-center justify-center group-hover:border-amber-400/60 transition-all">
                <Image
                  src="/nidhivan-tree-logo.png"
                  alt="Nidhivan Design Studio Logo"
                  fill
                  sizes="48px"
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-sm font-serif tracking-wider font-semibold text-white group-hover:text-amber-300 transition-colors">
                  NIDHIVAN DESIGN STUDIO
                </h1>
                <p className="text-[10px] tracking-widest uppercase text-white/40">Studio Control Hub</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 transition-all"
            >
              <FiGlobe className="text-amber-400" />
              <span>Live Website</span>
              <FiExternalLink className="text-[10px] text-white/40" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 text-xs text-white/60 transition-all cursor-pointer"
            >
              <FiLogOut />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-header / Tabs */}
      <div className="bg-[#111111] border-b border-white/5 px-6 sticky top-[69px] z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 sm:space-x-3 py-2.5">
            {[
              { id: 'projects', label: 'Selected Works', icon: FiLayers, count: projects.length },
              { id: 'homepage', label: 'Homepage Sections', icon: FiFileText },
              { id: 'matrix', label: 'Design Matrix Quiz', icon: FiGrid },
              { id: 'estimator', label: 'Budget Estimator Rates', icon: FiSliders },
              { id: 'contact', label: 'Studio & Socials', icon: FiPhone }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-400 text-black font-semibold shadow-md shadow-amber-400/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {activeTab === 'projects' && (
            <button
              onClick={openNewProjectModal}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-amber-400 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-sm"
            >
              <FiPlus />
              <span>Add New Project</span>
            </button>
          )}

          {activeTab !== 'projects' && (
            <button
              onClick={() => {
                if (activeTab === 'matrix') {
                  saveMatrixData();
                } else {
                  saveSiteContent();
                }
              }}
              disabled={isSaving}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <FiSave />
              <span>{isSaving ? 'Publishing...' : 'Publish Changes'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* ======================================================== */}
        {/* TAB 1: SELECTED WORKS (PROJECTS) */}
        {/* ======================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <h2 className="text-xl font-serif font-medium text-white">Portfolio Projects</h2>
                <p className="text-xs text-white/50 mt-1">
                  Manage projects featured in the Selected Works carousel and individual showcase pages (`/projects/[slug]`).
                </p>
              </div>
              <div className="text-xs text-white/40">
                Total Projects: <span className="text-white font-medium">{projects.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#121212] border border-white/10 hover:border-amber-400/40 rounded-xl overflow-hidden flex flex-col group transition-all duration-300"
                >
                  <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <FiImage className="text-3xl" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] tracking-widest uppercase text-amber-300 border border-white/10">
                      {project.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white/80">
                      {project.year}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-serif font-medium text-white mb-1 group-hover:text-amber-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-white/50 line-clamp-2 mb-3">
                        {project.subtitle || project.description}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-white/40">
                        <span>{project.location || 'Location unassigned'}</span>
                        <span>•</span>
                        <span>{project.area || 'Area N/A'}</span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
                      >
                        <FiEye className="text-sm" />
                        <span>Preview</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProjectModal(project)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          <FiEdit2 className="text-xs" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1.5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: HOMEPAGE SECTIONS */}
        {/* ======================================================== */}
        {activeTab === 'homepage' && siteContent && (
          <div className="space-y-10">
            {/* HEADER & BRANDING SECTION */}
            {(() => {
              const headerData = siteContent.header || {
                logo: '/nidhivan-tree-logo.png',
                brandName: 'Nidhivan',
                brandSubtitle: 'Design Studio',
                navLinks: [
                  { id: 'philosophy', label: 'Philosophy', href: '/#philosophy' },
                  { id: 'works', label: 'Works', href: '/#works' },
                  { id: 'matrix', label: 'Matrix', href: '/#design-matrix' },
                  { id: 'estimator', label: 'Estimator', href: '/#project-estimator' },
                  { id: 'contact', label: 'Contact', href: '/#contact' }
                ],
                ctaText: 'Estimate Project',
                ctaLink: '/estimate'
              };

              return (
                <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-lg font-serif font-medium text-white">Header & Studio Branding</h3>
                      <p className="text-xs text-white/50 mt-0.5">
                        Top fixed navigation bar, official logo mark, studio branding typography, and menu tabs.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Header Logo Uploader */}
                    <div className="md:col-span-2 bg-[#181818] p-4 rounded-xl border border-white/5 space-y-3">
                      <label className="block text-xs uppercase tracking-widest text-white/70 font-semibold">
                        Website Header Logo Mark
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="relative w-16 h-12 bg-white rounded-lg overflow-hidden border border-white/20 shrink-0 p-1 flex items-center justify-center">
                          <Image
                            src={headerData.logo || '/nidhivan-tree-logo.png'}
                            alt="Header Logo Preview"
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 w-full flex gap-2">
                          <input
                            type="text"
                            value={headerData.logo}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                header: { ...headerData, logo: e.target.value }
                              })
                            }
                            placeholder="Logo path e.g. /nidhivan-tree-logo.png"
                            className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                          <label className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                            <FiUpload />
                            <span>Upload New Logo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleFileUpload(file);
                                  if (url) {
                                    setSiteContent({
                                      ...siteContent,
                                      header: { ...headerData, logo: url }
                                    });
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                        Studio Brand Name
                      </label>
                      <input
                        type="text"
                        value={headerData.brandName}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            header: { ...headerData, brandName: e.target.value }
                          })
                        }
                        placeholder="e.g. Nidhivan"
                        className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                        Studio Brand Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        value={headerData.brandSubtitle}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            header: { ...headerData, brandSubtitle: e.target.value }
                          })
                        }
                        placeholder="e.g. Design Studio"
                        className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                        Header CTA Button Label (Optional)
                      </label>
                      <input
                        type="text"
                        value={headerData.ctaText || ''}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            header: { ...headerData, ctaText: e.target.value }
                          })
                        }
                        placeholder="e.g. Estimate Project (Leave empty to hide)"
                        className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                        Header CTA Destination Link
                      </label>
                      <input
                        type="text"
                        value={headerData.ctaLink || ''}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            header: { ...headerData, ctaLink: e.target.value }
                          })
                        }
                        placeholder="e.g. /estimate or /#contact"
                        className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Navigation Menu Labels */}
                    <div className="md:col-span-2 bg-[#181818] p-4 rounded-xl border border-white/5 space-y-3">
                      <div className="border-b border-white/5 pb-2">
                        <span className="text-xs uppercase tracking-widest text-white/70 font-semibold block">
                          Navigation Menu Tabs
                        </span>
                        <p className="text-[11px] text-white/40 mt-0.5">
                          Customize the display label of each navigation tab in the header.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
                        {(headerData.navLinks || []).map((link, idx) => (
                          <div key={link.id || link.href} className="bg-[#121212] p-2.5 rounded-lg border border-white/10">
                            <span className="block text-[10px] uppercase tracking-wider text-amber-400 font-mono mb-1">
                              {link.href}
                            </span>
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => {
                                const updated = [...(headerData.navLinks || [])];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                setSiteContent({
                                  ...siteContent,
                                  header: { ...headerData, navLinks: updated }
                                });
                              }}
                              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* HERO SECTION */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-medium text-white">Hero Section</h3>
                  <p className="text-xs text-white/50 mt-0.5">Top-of-fold visual statement, primary headlines, and background video loops.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Hero Headline (Use line breaks to control layout)
                  </label>
                  <textarea
                    rows={3}
                    value={siteContent.hero.headline}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        hero: { ...siteContent.hero, headline: e.target.value }
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/80"
                  />
                </div>

                {/* Primary Button */}
                <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-3">
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block">
                    Primary Hero Button
                  </span>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={siteContent.hero.button1Text}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, button1Text: e.target.value }
                        })
                      }
                      placeholder="e.g. Find Your Design Style"
                      className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                      Button Destination Link (Anchor or URL)
                    </label>
                    <input
                      type="text"
                      value={siteContent.hero.button1Link || '#design-matrix'}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, button1Link: e.target.value }
                        })
                      }
                      placeholder="e.g. #design-matrix or /matrix"
                      className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                {/* Secondary Button */}
                <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-3">
                  <span className="text-xs uppercase tracking-widest text-white/70 font-semibold block">
                    Secondary Hero Button
                  </span>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={siteContent.hero.button2Text}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, button2Text: e.target.value }
                        })
                      }
                      placeholder="e.g. Estimate Your Project"
                      className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                      Button Destination Link (Anchor or URL)
                    </label>
                    <input
                      type="text"
                      value={siteContent.hero.button2Link || '#project-estimator'}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, button2Link: e.target.value }
                        })
                      }
                      placeholder="e.g. #project-estimator or /estimate"
                      className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Desktop Hero Video (16:9 MP4 Path)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={siteContent.hero.desktopVideo}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, desktopVideo: e.target.value }
                        })
                      }
                      className="flex-1 bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/80"
                    />
                    <label className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center shrink-0">
                      <FiUpload />
                      <input
                        type="file"
                        accept="video/mp4,video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setSiteContent({
                                ...siteContent,
                                hero: { ...siteContent.hero, desktopVideo: url }
                              });
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Mobile Hero Video (9:16 MP4 Path)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={siteContent.hero.mobileVideo}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, mobileVideo: e.target.value }
                        })
                      }
                      className="flex-1 bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/80"
                    />
                    <label className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center shrink-0">
                      <FiUpload />
                      <input
                        type="file"
                        accept="video/mp4,video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setSiteContent({
                                ...siteContent,
                                hero: { ...siteContent.hero, mobileVideo: url }
                              });
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* PHILOSOPHY SECTION */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-medium text-white">Philosophy & Architect Profile</h3>
                  <p className="text-xs text-white/50 mt-0.5">The founder statement, philosophical manifesto, and featured portrait artwork.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Architect Name
                  </label>
                  <input
                    type="text"
                    value={siteContent.philosophy.architectName}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        philosophy: { ...siteContent.philosophy, architectName: e.target.value }
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/80"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Architect Title / Designation
                  </label>
                  <input
                    type="text"
                    value={siteContent.philosophy.architectTitle}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        philosophy: { ...siteContent.philosophy, architectTitle: e.target.value }
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/80"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Philosophy Heading Quote
                  </label>
                  <textarea
                    rows={2}
                    value={siteContent.philosophy.heading}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        philosophy: { ...siteContent.philosophy, heading: e.target.value }
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/80"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Philosophy Narrative (Paragraph 1)
                  </label>
                  <textarea
                    rows={3}
                    value={siteContent.philosophy.paragraph1}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        philosophy: { ...siteContent.philosophy, paragraph1: e.target.value }
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/80"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Philosophy Narrative (Paragraph 2)
                  </label>
                  <textarea
                    rows={3}
                    value={siteContent.philosophy.paragraph2}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        philosophy: { ...siteContent.philosophy, paragraph2: e.target.value }
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/80"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Desktop Philosophy Artwork / Portrait
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={siteContent.philosophy.desktopImage}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          philosophy: { ...siteContent.philosophy, desktopImage: e.target.value }
                        })
                      }
                      className="flex-1 bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/80"
                    />
                    <label className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center shrink-0">
                      <FiUpload />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setSiteContent({
                                ...siteContent,
                                philosophy: { ...siteContent.philosophy, desktopImage: url }
                              });
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Mobile Philosophy Artwork (9:16)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={siteContent.philosophy.mobileImage}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          philosophy: { ...siteContent.philosophy, mobileImage: e.target.value }
                        })
                      }
                      className="flex-1 bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/80"
                    />
                    <label className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center shrink-0">
                      <FiUpload />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setSiteContent({
                                ...siteContent,
                                philosophy: { ...siteContent.philosophy, mobileImage: url }
                              });
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* EXPERTISE PILLARS */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-serif font-medium text-white">Areas of Expertise</h3>
                <p className="text-xs text-white/50 mt-0.5">The 4 core architectural sectors rendered in the marquee accordion.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {siteContent.expertise.map((item, index) => (
                  <div key={item.id} className="bg-[#181818] border border-white/5 rounded-xl p-4 space-y-3">
                    <div className="relative aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden border border-white/10">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <FiImage />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                        Pillar Name
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...siteContent.expertise];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setSiteContent({ ...siteContent, expertise: updated });
                        }}
                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <label className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                      <FiUpload className="text-xs" />
                      <span>Replace Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              const updated = [...siteContent.expertise];
                              updated[index] = { ...updated[index], image: url };
                              setSiteContent({ ...siteContent, expertise: updated });
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* THE STUDIO SECTION */}
            {(() => {
              const studioData = siteContent.studio || {
                badge: 'The Studio',
                heading: 'Designing with Context',
                paragraph1: 'Founded on the principle that architecture should be a profound response to its environment, the studio focuses on creating spaces that harmonize with their surroundings.',
                paragraph2: 'From the rugged landscapes of Ladakh to the dense urban fabric of modern cities, every project is an exploration of materiality, light, and human scale.',
                image: '/5th section.png',
                stat1Value: '15+',
                stat1Label: 'Years Exp',
                stat2Value: '40+',
                stat2Label: 'Projects'
              };

              return (
                <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-lg font-serif font-medium text-white">The Studio Section</h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      Context-driven studio manifesto with featured photography and milestone metrics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                        Pre-title Badge
                      </label>
                      <input
                        type="text"
                        value={studioData.badge}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            studio: { ...studioData, badge: e.target.value }
                          })
                        }
                        placeholder="e.g. The Studio"
                        className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                        Main Section Heading
                      </label>
                      <input
                        type="text"
                        value={studioData.heading}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            studio: { ...studioData, heading: e.target.value }
                          })
                        }
                        placeholder="e.g. Designing with Context"
                        className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                        Studio Narrative (Paragraph 1)
                      </label>
                      <textarea
                        rows={3}
                        value={studioData.paragraph1}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            studio: { ...studioData, paragraph1: e.target.value }
                          })
                        }
                        className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                        Studio Narrative (Paragraph 2)
                      </label>
                      <textarea
                        rows={3}
                        value={studioData.paragraph2}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            studio: { ...studioData, paragraph2: e.target.value }
                          })
                        }
                        className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Studio Image Uploader */}
                    <div className="md:col-span-2 bg-[#181818] p-4 rounded-xl border border-white/5 space-y-3">
                      <label className="block text-xs uppercase tracking-widest text-white/70 font-semibold">
                        Featured Studio Photography / On-site Visual
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="relative w-24 h-24 bg-neutral-900 rounded-lg overflow-hidden border border-white/10 shrink-0">
                          {studioData.image ? (
                            <Image src={studioData.image} alt="Studio Visual" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <FiImage className="text-2xl" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 w-full flex gap-2">
                          <input
                            type="text"
                            value={studioData.image}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                studio: { ...studioData, image: e.target.value }
                              })
                            }
                            placeholder="Image path e.g. /5th section.png"
                            className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                          <label className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                            <FiUpload />
                            <span>Replace Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleFileUpload(file);
                                  if (url) {
                                    setSiteContent({
                                      ...siteContent,
                                      studio: { ...studioData, image: url }
                                    });
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Milestone Stats */}
                    <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-3">
                      <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block">
                        Milestone Metric 1
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase text-white/40 mb-1">Value (e.g. 15+)</label>
                          <input
                            type="text"
                            value={studioData.stat1Value}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                studio: { ...studioData, stat1Value: e.target.value }
                              })
                            }
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-white/40 mb-1">Label (e.g. Years Exp)</label>
                          <input
                            type="text"
                            value={studioData.stat1Label}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                studio: { ...studioData, stat1Label: e.target.value }
                              })
                            }
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-3">
                      <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block">
                        Milestone Metric 2
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase text-white/40 mb-1">Value (e.g. 40+)</label>
                          <input
                            type="text"
                            value={studioData.stat2Value}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                studio: { ...studioData, stat2Value: e.target.value }
                              })
                            }
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-white/40 mb-1">Label (e.g. Projects)</label>
                          <input
                            type="text"
                            value={studioData.stat2Label}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                studio: { ...studioData, stat2Label: e.target.value }
                              })
                            }
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* DESIGN MATRIX BANNER */}
            {matrixData?.banner && (
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-lg font-serif font-medium text-white">Design Matrix Teaser Banner</h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      Homepage full-screen invitation section leading users into the visual quiz.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                      Section Headline
                    </label>
                    <input
                      type="text"
                      value={matrixData.banner.headline}
                      onChange={(e) => {
                        const updated = {
                          ...matrixData,
                          banner: { ...matrixData.banner, headline: e.target.value }
                        };
                        setMatrixData(updated);
                      }}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                      Philosophical Quote / Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={matrixData.banner.quote}
                      onChange={(e) => {
                        const updated = {
                          ...matrixData,
                          banner: { ...matrixData.banner, quote: e.target.value }
                        };
                        setMatrixData(updated);
                      }}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                      Feature Badge (e.g. 5 questions · 60 seconds)
                    </label>
                    <input
                      type="text"
                      value={matrixData.banner.badge}
                      onChange={(e) => {
                        const updated = {
                          ...matrixData,
                          banner: { ...matrixData.banner, badge: e.target.value }
                        };
                        setMatrixData(updated);
                      }}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                      Action Button Text
                    </label>
                    <input
                      type="text"
                      value={matrixData.banner.buttonText}
                      onChange={(e) => {
                        const updated = {
                          ...matrixData,
                          banner: { ...matrixData.banner, buttonText: e.target.value }
                        };
                        setMatrixData(updated);
                      }}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: DESIGN MATRIX QUIZ */}
        {/* ======================================================== */}
        {activeTab === 'matrix' && matrixData && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <h2 className="text-xl font-serif font-medium text-white">Interactive Style Matrix Quiz</h2>
                <p className="text-xs text-white/50 mt-1">
                  Customize the quiz questions, architectural insights, and upload replacement visuals for all option photos and final result styles.
                </p>
              </div>
              <Link
                href="/matrix"
                target="_blank"
                className="shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-semibold"
              >
                <FiExternalLink />
                <span>Test Live Quiz (/matrix)</span>
              </Link>
            </div>

            {/* Matrix Step Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {[1, 2, 3, 4, 5].map((qNum) => (
                <button
                  key={qNum}
                  onClick={() => setSelectedMatrixStep(qNum)}
                  className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    selectedMatrixStep === qNum
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/10 font-bold'
                      : 'bg-[#161616] hover:bg-[#202020] text-white/70 border border-white/5'
                  }`}
                >
                  Question {qNum}
                </button>
              ))}
              <button
                onClick={() => setSelectedMatrixStep('results')}
                className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  selectedMatrixStep === 'results'
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/10 font-bold'
                    : 'bg-[#161616] hover:bg-[#202020] text-white/70 border border-white/5'
                }`}
              >
                Result Styles (9)
              </button>
            </div>

            {/* QUESTIONS EDITOR (Q1 to Q5) */}
            {typeof selectedMatrixStep === 'number' && (() => {
              const qIndex = selectedMatrixStep - 1;
              const question = matrixData.questions?.[qIndex];
              if (!question) return null;

              return (
                <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold block mb-1">
                      Step {question.id} of 5
                    </span>
                    <h3 className="text-lg font-serif font-medium text-white">{question.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                        Question Title
                      </label>
                      <input
                        type="text"
                        value={question.title}
                        onChange={(e) => {
                          const updated = [...matrixData.questions];
                          updated[qIndex] = { ...updated[qIndex], title: e.target.value };
                          setMatrixData({ ...matrixData, questions: updated });
                        }}
                        className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                        Question Subtitle / Guidance
                      </label>
                      <textarea
                        rows={2}
                        value={question.subtitle}
                        onChange={(e) => {
                          const updated = [...matrixData.questions];
                          updated[qIndex] = { ...updated[qIndex], subtitle: e.target.value };
                          setMatrixData({ ...matrixData, questions: updated });
                        }}
                        className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                        Architectural Insight / End Note
                      </label>
                      <textarea
                        rows={2}
                        value={question.endNote}
                        onChange={(e) => {
                          const updated = [...matrixData.questions];
                          updated[qIndex] = { ...updated[qIndex], endNote: e.target.value };
                          setMatrixData({ ...matrixData, questions: updated });
                        }}
                        className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-serif font-medium text-white">
                        Visual Options ({question.options?.length || 0})
                      </h4>
                      <span className="text-[10px] tracking-wider uppercase text-white/40">
                        {question.multiSelect ? 'Multi-select (Up to 2)' : 'Single Select'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {(question.options || []).map((opt: any, optIdx: number) => (
                        <div key={opt.id || optIdx} className="bg-[#181818] border border-white/5 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-amber-300 border border-white/10">
                              Option {opt.id}
                            </span>
                            <span className="text-[10px] text-white/40 truncate max-w-[200px]">
                              Contributes: {Object.keys(opt.scores || {}).join(', ')}
                            </span>
                          </div>

                          {/* Image preview & upload */}
                          <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-white/10 group">
                            {opt.img ? (
                              <Image src={opt.img} alt={opt.label} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20">
                                <FiImage className="text-2xl" />
                              </div>
                            )}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs cursor-pointer">
                              <FiUpload />
                              <span>Replace Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const url = await handleFileUpload(file);
                                    if (url) {
                                      const updatedQuestions = [...matrixData.questions];
                                      const updatedOpts = [...updatedQuestions[qIndex].options];
                                      updatedOpts[optIdx] = { ...updatedOpts[optIdx], img: url };
                                      updatedQuestions[qIndex].options = updatedOpts;
                                      setMatrixData({ ...matrixData, questions: updatedQuestions });
                                    }
                                  }
                                }}
                              />
                            </label>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                              Option Label
                            </label>
                            <input
                              type="text"
                              value={opt.label}
                              onChange={(e) => {
                                const updatedQuestions = [...matrixData.questions];
                                const updatedOpts = [...updatedQuestions[qIndex].options];
                                updatedOpts[optIdx] = { ...updatedOpts[optIdx], label: e.target.value };
                                updatedQuestions[qIndex].options = updatedOpts;
                                setMatrixData({ ...matrixData, questions: updatedQuestions });
                              }}
                              className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={opt.desc}
                              onChange={(e) => {
                                const updatedQuestions = [...matrixData.questions];
                                const updatedOpts = [...updatedQuestions[qIndex].options];
                                updatedOpts[optIdx] = { ...updatedOpts[optIdx], desc: e.target.value };
                                updatedQuestions[qIndex].options = updatedOpts;
                                setMatrixData({ ...matrixData, questions: updatedQuestions });
                              }}
                              className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* RESULT STYLES SHOWCASE EDITOR */}
            {selectedMatrixStep === 'results' && matrixData.resultImages && (
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-lg font-serif font-medium text-white">9 Architectural Result Styles</h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    When visitors finish the Style Matrix quiz, their highest scoring architectural style is revealed with its hero imagery and details.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(matrixData.resultImages).map((styleName) => {
                    const imgUrl = matrixData.resultImages[styleName];
                    const details = matrixData.styleDetails?.[styleName] || {
                      subtitle: '',
                      description: '',
                      materials: [],
                      spatialVibe: ''
                    };

                    return (
                      <div key={styleName} className="bg-[#181818] border border-white/5 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-sm font-semibold text-white">{styleName}</span>
                            <span className="text-[10px] uppercase tracking-wider text-amber-400">Result Style</span>
                          </div>

                          <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-white/10 group">
                            {imgUrl ? (
                              <Image src={imgUrl} alt={styleName} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20">
                                <FiImage className="text-2xl" />
                              </div>
                            )}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs cursor-pointer">
                              <FiUpload />
                              <span>Replace Showcase Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const url = await handleFileUpload(file);
                                    if (url) {
                                      setMatrixData({
                                        ...matrixData,
                                        resultImages: {
                                          ...matrixData.resultImages,
                                          [styleName]: url
                                        }
                                      });
                                    }
                                  }
                                }}
                              />
                            </label>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                              Style Essence / Subtitle
                            </label>
                            <input
                              type="text"
                              value={details.subtitle}
                              onChange={(e) => {
                                setMatrixData({
                                  ...matrixData,
                                  styleDetails: {
                                    ...matrixData.styleDetails,
                                    [styleName]: {
                                      ...details,
                                      subtitle: e.target.value
                                    }
                                  }
                                });
                              }}
                              className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                              Narrative Description
                            </label>
                            <textarea
                              rows={3}
                              value={details.description}
                              onChange={(e) => {
                                setMatrixData({
                                  ...matrixData,
                                  styleDetails: {
                                    ...matrixData.styleDetails,
                                    [styleName]: {
                                      ...details,
                                      description: e.target.value
                                    }
                                  }
                                });
                              }}
                              className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ESTIMATOR RATES */}
        {/* ======================================================== */}
        {activeTab === 'estimator' && siteContent && (
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-lg font-serif font-medium text-white">Project Budget Estimator Rates</h3>
              <p className="text-xs text-white/50 mt-0.5">
                Configure baseline pricing rates per SQ FT and SQ M for each tier. These values dynamically power the live calculator at <Link href="/estimate" target="_blank" className="text-amber-400 underline">/estimate</Link>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {(['Essential', 'Premium', 'Luxury'] as const).map((tier) => {
                const tierRates = siteContent.estimator?.rates?.[tier] || {
                  Architecture: { sqft: 1300, sqm: 13988 },
                  Interior: { sqft: 1200, sqm: 12912 }
                };

                return (
                  <div key={tier} className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="font-serif text-base font-medium text-white">{tier} Tier</span>
                      <span className="text-[10px] tracking-widest uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded">
                        {tier === 'Premium' ? 'Recommended' : 'Standard'}
                      </span>
                    </div>

                    {/* Architecture Rates */}
                    <div className="space-y-3">
                      <span className="text-xs font-semibold tracking-wider uppercase text-white/70 block">
                        Architecture Scope
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase text-white/40 mb-1">Rate / SQ FT (₹)</label>
                          <input
                            type="number"
                            value={tierRates.Architecture.sqft}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setSiteContent({
                                ...siteContent,
                                estimator: {
                                  rates: {
                                    ...siteContent.estimator.rates,
                                    [tier]: {
                                      ...tierRates,
                                      Architecture: { ...tierRates.Architecture, sqft: val }
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-white/40 mb-1">Rate / SQ M (₹)</label>
                          <input
                            type="number"
                            value={tierRates.Architecture.sqm}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setSiteContent({
                                ...siteContent,
                                estimator: {
                                  rates: {
                                    ...siteContent.estimator.rates,
                                    [tier]: {
                                      ...tierRates,
                                      Architecture: { ...tierRates.Architecture, sqm: val }
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Interior Rates */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <span className="text-xs font-semibold tracking-wider uppercase text-white/70 block">
                        Interior Scope
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase text-white/40 mb-1">Rate / SQ FT (₹)</label>
                          <input
                            type="number"
                            value={tierRates.Interior.sqft}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setSiteContent({
                                ...siteContent,
                                estimator: {
                                  rates: {
                                    ...siteContent.estimator.rates,
                                    [tier]: {
                                      ...tierRates,
                                      Interior: { ...tierRates.Interior, sqft: val }
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-white/40 mb-1">Rate / SQ M (₹)</label>
                          <input
                            type="number"
                            value={tierRates.Interior.sqm}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setSiteContent({
                                ...siteContent,
                                estimator: {
                                  rates: {
                                    ...siteContent.estimator.rates,
                                    [tier]: {
                                      ...tierRates,
                                      Interior: { ...tierRates.Interior, sqm: val }
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CONTACT & SOCIALS */}
        {/* ======================================================== */}
        {activeTab === 'contact' && siteContent && (
          <div className="space-y-8">
            {/* DIRECT CONTACT COORDINATES */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-serif font-medium text-white">Studio Inquiries & Booking Coordinates</h3>
                <p className="text-xs text-white/50 mt-0.5">Primary email, studio phone, consultation calendar, and physical office address.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Direct Inquiry Email
                  </label>
                  <input
                    type="email"
                    value={siteContent.contact.inquiryEmail}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, inquiryEmail: e.target.value }
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Inquiry Phone / Mobile
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact.inquiryPhone}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, inquiryPhone: e.target.value }
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Cal.com Online Booking Link
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact.consultationLink}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, consultationLink: e.target.value }
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                    Studio Physical Address
                  </label>
                  <textarea
                    rows={2}
                    value={siteContent.contact.studioAddress}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, studioAddress: e.target.value }
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC SOCIAL MEDIA & CUSTOM FOOTER LINKS */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-medium text-white">Social Media & Custom Footer Links</h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Add any platform or custom web link (Instagram, WhatsApp, Pinterest, LinkedIn, YouTube, Behance, Google Maps). These render live across the website footer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSocialLink}
                  className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <FiPlus />
                  <span>Add New Link</span>
                </button>
              </div>

              {(!siteContent.contact.socialLinks || siteContent.contact.socialLinks.length === 0) ? (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-white/40 text-xs">
                  No social or external links added yet. Click &quot;Add New Link&quot; above to add your first channel.
                </div>
              ) : (
                <div className="space-y-3">
                  {siteContent.contact.socialLinks.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="bg-[#181818] border border-white/5 rounded-xl p-3.5 flex flex-col md:flex-row items-stretch md:items-center gap-3 transition-colors hover:border-white/10"
                    >
                      <div className="w-full md:w-1/3">
                        <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                          Platform / Title
                        </label>
                        <input
                          type="text"
                          value={item.platform}
                          onChange={(e) => handleUpdateSocialLink(index, 'platform', e.target.value)}
                          placeholder="e.g. Pinterest, LinkedIn, YouTube"
                          className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                          Destination URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.url}
                            onChange={(e) => handleUpdateSocialLink(index, 'url', e.target.value)}
                            placeholder="e.g. https://pinterest.com/nidhivandesign"
                            className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                          {item.url && item.url.startsWith('http') && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-xs flex items-center justify-center transition-colors"
                              title="Test link"
                            >
                              <FiExternalLink />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-end md:self-end pt-2 md:pt-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveSocialLink(index)}
                          className="w-full md:w-auto p-2 bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-500/20 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          title="Delete link"
                        >
                          <FiTrash2 />
                          <span className="md:hidden">Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* PROJECT ADD / EDIT MODAL */}
      {/* ======================================================== */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#111111] border border-white/15 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#161616]">
              <div>
                <h3 className="text-base font-serif font-medium text-white">
                  {editingProject.id && projects.some(p => p.id === editingProject.id)
                    ? `Edit Project: ${editingProject.title || 'Untitled'}`
                    : 'Create New Architectural Project'}
                </h3>
                <p className="text-[11px] text-white/40">Provide project specs, photography, and concept narrative.</p>
              </div>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block uppercase tracking-wider text-white/60 mb-1.5 font-medium">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingProject({ ...editingProject, title, slug });
                    }}
                    placeholder="e.g. Concrete Oasis"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1.5 font-medium">
                    URL Slug (/projects/...)
                  </label>
                  <input
                    type="text"
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    placeholder="e.g. concrete-oasis"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white/80 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block uppercase tracking-wider text-white/60 mb-1.5 font-medium">
                    Subtitle / Essence
                  </label>
                  <input
                    type="text"
                    value={editingProject.subtitle}
                    onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                    placeholder="e.g. Subtropical Architecture Balanced with Modern Geometry"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1.5 font-medium">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    placeholder="e.g. Residential Estate, Nordic Residence"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1.5 font-medium">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingProject.location}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    placeholder="e.g. Berlin, Germany or New Delhi"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1.5 font-medium">
                    Built-up Area
                  </label>
                  <input
                    type="text"
                    value={editingProject.area}
                    onChange={(e) => setEditingProject({ ...editingProject, area: e.target.value })}
                    placeholder="e.g. 9,100 sq ft"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1.5 font-medium">
                    Completion Year
                  </label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    placeholder="e.g. 2025"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1.5 font-medium">
                    Project Status
                  </label>
                  <input
                    type="text"
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                    placeholder="e.g. Completed, In Progress"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-3">
                <label className="block uppercase tracking-wider text-white/70 font-semibold">
                  Main Cover Image
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {editingProject.image && (
                    <div className="relative w-28 h-20 bg-neutral-900 rounded-lg overflow-hidden border border-white/10 shrink-0">
                      <Image src={editingProject.image} alt="Cover Preview" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 w-full flex gap-2">
                    <input
                      type="text"
                      value={editingProject.image}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      placeholder="Image URL or upload a file"
                      className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <label className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                      <FiUpload />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setEditingProject({ ...editingProject, image: url });
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Gallery Photos */}
              <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="uppercase tracking-wider text-white/70 font-semibold">
                    Gallery Showcase Photos ({editingProject.gallery.length})
                  </label>
                  <label className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                    <FiPlus />
                    <span>Upload Gallery Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingProject({
                              ...editingProject,
                              gallery: [...editingProject.gallery, url]
                            });
                          }
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {editingProject.gallery.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-white/10 group">
                      <Image src={imgUrl} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                      <button
                        onClick={() => {
                          const updated = editingProject.gallery.filter((_, i) => i !== idx);
                          setEditingProject({ ...editingProject, gallery: updated });
                        }}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Narratives: Description & Concept */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1.5 font-medium">
                    Overview Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="Detailed introduction of the project..."
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1.5 font-medium">
                    Architectural Concept
                  </label>
                  <textarea
                    rows={4}
                    value={editingProject.concept}
                    onChange={(e) => setEditingProject({ ...editingProject, concept: e.target.value })}
                    placeholder="Core design philosophy, structural response, light studies..."
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Highlights & Materials Chips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Highlights */}
                <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-wider text-white/70 font-semibold">Key Highlights</span>
                    <button
                      onClick={() => setEditingProject({ ...editingProject, highlights: [...editingProject.highlights, ''] })}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <FiPlus /> Add Item
                    </button>
                  </div>
                  {editingProject.highlights.map((hl, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => {
                          const updated = [...editingProject.highlights];
                          updated[i] = e.target.value;
                          setEditingProject({ ...editingProject, highlights: updated });
                        }}
                        placeholder="e.g. Green roof gardens integrated with rainwater system"
                        className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => {
                          const updated = editingProject.highlights.filter((_, idx) => idx !== i);
                          setEditingProject({ ...editingProject, highlights: updated });
                        }}
                        className="text-white/40 hover:text-red-400 px-2 cursor-pointer"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Materials */}
                <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-wider text-white/70 font-semibold">Material Palette</span>
                    <button
                      onClick={() => setEditingProject({ ...editingProject, materials: [...editingProject.materials, ''] })}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <FiPlus /> Add Material
                    </button>
                  </div>
                  {editingProject.materials.map((mat, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={mat}
                        onChange={(e) => {
                          const updated = [...editingProject.materials];
                          updated[i] = e.target.value;
                          setEditingProject({ ...editingProject, materials: updated });
                        }}
                        placeholder="e.g. Architectural Concrete, Calacatta Gold Marble"
                        className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => {
                          const updated = editingProject.materials.filter((_, idx) => idx !== i);
                          setEditingProject({ ...editingProject, materials: updated });
                        }}
                        className="text-white/40 hover:text-red-400 px-2 cursor-pointer"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3 bg-[#161616] shrink-0">
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModalProject}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save & Publish Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
