import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Image as ImageIcon, Layers, MessageSquare, Trash2, UploadCloud, Loader2, Settings } from "lucide-react";

// --- CRITICAL FIRESTORE ERROR HANDLING SPEC ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: any[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
// --- END ERROR HANDLING ---

// Utility function to convert images to webp before uploading
export const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        }, 'image/webp', 0.85); // 85% quality
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export default function Admin() {
  const [session, setSession] = useState<User | null>(null);
  const [email, setEmail] = useState("oxerfy@gmail.com");
  const [password, setPassword] = useState("#0000oxerfy#0000");
  const [activeTab, setActiveTab] = useState("projects");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSession(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      // If the user doesn't exist yet, we automatically create it for convenience
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (registerErr: any) {
          alert("Login Failed: " + err.message + "\nRegister Fallback Failed: " + registerErr.message);
        }
      } else {
        alert("Login Failed: " + err.message);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-base flex flex-col items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-mint" /></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-base text-cream flex flex-col items-center justify-center p-6 bg-[#0B192C]">
        <div className="glass-card p-10 max-w-md w-full border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 bg-mint/20 blur-[80px] pointer-events-none rounded-full" />
          <h1 className="text-3xl font-display font-bold mb-2">Admin Panel</h1>
          <p className="text-sm text-cream/50 font-light mb-8">Sign in with Firebase Auth</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-cream/70 font-medium">Admin Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mint transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-cream/70 font-medium">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mint transition-colors"
                required
              />
            </div>
            <button type="submit" className="w-full bg-mint text-base font-bold py-3 rounded-xl hover:bg-white transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base text-cream flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col py-10 px-4 bg-[#0B192C] flex-shrink-0">
        <h2 className="text-xl px-4 font-display font-bold tracking-widest text-white mb-10">O<span className="text-mint">X</span>ERFY ADMIN</h2>
        
        <nav className="flex flex-col w-full gap-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'projects' ? 'bg-mint text-base' : 'hover:bg-white/5 text-cream/70'}`}
          >
            <Layers size={18} /> Projects
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'testimonials' ? 'bg-mint text-base' : 'hover:bg-white/5 text-cream/70'}`}
          >
            <MessageSquare size={18} /> Testimonials
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'gallery' ? 'bg-mint text-base' : 'hover:bg-white/5 text-cream/70'}`}
          >
            <ImageIcon size={18} /> Gallery
          </button>
          <button 
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'assets' ? 'bg-mint text-base' : 'hover:bg-white/5 text-cream/70'}`}
          >
            <ImageIcon size={18} /> Site Assets
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-mint text-base' : 'hover:bg-white/5 text-cream/70'}`}
          >
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className="mt-auto pt-6 w-full">
          <p className="text-xs text-center text-cream/40 mb-4 truncate w-full px-2" title={session.email || ""}>Logged in as: {session.email}</p>
          <button onClick={() => signOut(auth)} className="w-full py-3 text-sm font-medium text-cream/50 hover:text-white transition-colors rounded-lg hover:bg-white/5 border border-white/5">
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 p-10 bg-[#06101c] overflow-y-auto h-screen">
        {activeTab === 'projects' && <ProjectManager />}
        {activeTab === 'testimonials' && <TestimonialManager />}
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'assets' && <SiteAssetsManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR EACH TAB ---

const SettingsManager = () => {
  const [founderLinkedin, setFounderLinkedin] = useState("");
  const [founderWebsite, setFounderWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.founder_linkedin) setFounderLinkedin(data.founder_linkedin);
        if (data.founder_website) setFounderWebsite(data.founder_website);
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/global'));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        founder_linkedin: founderLinkedin,
        founder_website: founderWebsite,
        updated_at: new Date().toISOString()
      }, { merge: true });
      alert('Settings updated successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/global');
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-white mb-8">Global Settings</h1>
      
      <form onSubmit={handleSubmit} className="mb-10 p-6 glass-card border border-white/5 space-y-4 max-w-xl">
        <h3 className="text-lg font-bold mb-4">Founder Links</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">LinkedIn URL</label>
            <input 
              type="text" 
              placeholder="https://linkedin.com/in/..." 
              value={founderLinkedin} 
              onChange={e=>setFounderLinkedin(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-mint" 
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">Personal Website URL</label>
            <input 
              type="text" 
              placeholder="https://..." 
              value={founderWebsite} 
              onChange={e=>setFounderWebsite(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-mint" 
            />
          </div>
        </div>
        
        <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-mint text-base font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-white transition-colors">
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Settings size={18} />} Save Settings
        </button>
      </form>
    </div>
  );
};

const SiteAssetsManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [assetKey, setAssetKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common keys for predefined assets
  const predefinedKeys = [
    "logo_image", 
    "founder_image", 
    "why_choose_us_1",
    "trust_avatar_1",
    "trust_avatar_2",
    "trust_avatar_3"
  ];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'site_assets'), (snap) => {
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'site_assets'));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !assetKey) return alert("Image and Asset Key required");
    setIsSubmitting(true);
    try {
      const webpBlob = await convertToWebP(file);
      const storageRef = ref(storage, `site_assets/${Date.now()}_original.webp`);
      await uploadBytes(storageRef, webpBlob, { contentType: 'image/webp' });
      const url = await getDownloadURL(storageRef);
      // Let's delete the old one with the same key if it exists
      const existing = items.find(i => i.key === assetKey);
      if (existing) {
        await deleteDoc(doc(db, 'site_assets', existing.id));
      }
      await addDoc(collection(db, 'site_assets'), {
        key: assetKey, image_url: url, updated_at: new Date().toISOString()
      });
      setFile(null); setAssetKey("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'site_assets');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete asset?")) return;
    try {
      await deleteDoc(doc(db, 'site_assets', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `site_assets/${id}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-white mb-8">Site Assets Manager</h1>
      
      <form onSubmit={handleSubmit} className="mb-10 p-6 glass-card border border-white/5 space-y-4">
        <h3 className="text-lg font-bold mb-4">Upload Asset</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Asset Key (e.g. founder_image)" value={assetKey} onChange={e=>setAssetKey(e.target.value)} list="asset-keys" required className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-mint" />
          <datalist id="asset-keys">
            {predefinedKeys.map(k => <option key={k} value={k} />)}
          </datalist>
          <div className="p-2 border border-dashed border-white/20 rounded-lg flex items-center bg-white/5">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm w-full" required />
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-mint text-base font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-white transition-colors">
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />} Update/Add Asset
        </button>
      </form>

      <div className="grid grid-cols-3 gap-6">
        {items.map(a => (
          <div key={a.id} className="glass-card overflow-hidden group border border-white/5">
            <img src={a.image_url} alt={a.key} className="w-full h-40 object-cover" />
            <div className="p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white font-mono text-sm">{a.key}</h4>
              </div>
              <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-300 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects'));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Image required");
    setIsSubmitting(true);
    try {
      const webpBlob = await convertToWebP(file);
      const storageRef = ref(storage, `projects/${Date.now()}_original.webp`);
      await uploadBytes(storageRef, webpBlob, { contentType: 'image/webp' });
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'projects'), {
        title, type, description, link: link || "https://", image_url: url, created_at: new Date().toISOString()
      });
      setTitle(""); setType(""); setLink(""); setDescription(""); setFile(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'projects');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete project?")) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
       handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-white mb-8">Projects Manager</h1>
      
      <form onSubmit={handleSubmit} className="mb-10 p-6 glass-card border border-white/5 space-y-4">
        <h3 className="text-lg font-bold mb-4">Add New Project</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Project Title" value={title} onChange={e=>setTitle(e.target.value)} required className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-mint" />
          <input type="text" placeholder="Category (e.g. Web Design)" value={type} onChange={e=>setType(e.target.value)} required className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-mint" />
          <input type="url" placeholder="Project Link (Optional)" value={link} onChange={e=>setLink(e.target.value)} className="col-span-2 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-mint" />
          <textarea placeholder="Description (Optional)" value={description} onChange={e=>setDescription(e.target.value)} rows={3} className="col-span-2 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-mint resize-none" />
          <div className="col-span-2 p-4 border border-dashed border-white/20 rounded-lg flex items-center justify-center">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" required />
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-mint text-base font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-white transition-colors">
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />} Upload Project
        </button>
      </form>

      <div className="grid grid-cols-3 gap-6">
        {items.map(p => (
          <div key={p.id} className="glass-card overflow-hidden group border border-white/5">
            <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover" />
            <div className="p-4 flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white leading-tight">{p.title}</h4>
                <p className="text-xs text-mint mt-1">{p.type}</p>
              </div>
              <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'testimonials'), (snap) => {
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'testimonials'));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Client photo required");
    setIsSubmitting(true);
    try {
      const webpBlob = await convertToWebP(file);
      const storageRef = ref(storage, `testimonials/${Date.now()}_original.webp`);
      await uploadBytes(storageRef, webpBlob, { contentType: 'image/webp' });
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'testimonials'), {
        name, role, text, image_url: url, created_at: new Date().toISOString()
      });
      setName(""); setRole(""); setText(""); setFile(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'testimonials');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete testimonial?")) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `testimonials/${id}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-white mb-8">Testimonials</h1>
      
      <form onSubmit={handleSubmit} className="mb-10 p-6 glass-card border border-white/5 space-y-4">
        <h3 className="text-lg font-bold mb-4">Add Testimonial</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Client Name" value={name} onChange={e=>setName(e.target.value)} required className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-mint" />
          <input type="text" placeholder="Role / Company" value={role} onChange={e=>setRole(e.target.value)} required className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-mint" />
          <textarea placeholder="Testimonial text..." value={text} onChange={e=>setText(e.target.value)} required rows={3} className="col-span-2 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-mint resize-none" />
          <div className="col-span-2 p-4 border border-dashed border-white/20 rounded-lg flex items-center justify-center">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" title="Client Photo" required />
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-mint text-base font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-white transition-colors">
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />} Save Testimonial
        </button>
      </form>

      <div className="grid grid-cols-2 gap-6">
        {items.map(t => (
          <div key={t.id} className="glass-card p-5 border border-white/5 flex gap-4">
            <img src={t.image_url} alt="" className="w-16 h-16 rounded-full object-cover shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-white">{t.name}</h4>
              <p className="text-xs text-mint mb-2">{t.role}</p>
              <p className="text-sm text-cream/70 line-clamp-3 md:line-clamp-none">{t.text}</p>
            </div>
            <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300 p-1 self-start">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const GalleryManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'gallery'), (snap) => {
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'gallery'));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Image required");
    setIsSubmitting(true);
    try {
      const webpBlob = await convertToWebP(file);
      const storageRef = ref(storage, `gallery/${Date.now()}_original.webp`);
      await uploadBytes(storageRef, webpBlob, { contentType: 'image/webp' });
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'gallery'), {
        image_url: url, group_id: 'all', created_at: new Date().toISOString()
      });
      setFile(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'gallery');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete image?")) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-white mb-8">Image Gallery</h1>
      
      <form onSubmit={handleSubmit} className="mb-10 p-6 glass-card border border-white/5 flex gap-4 items-center">
        <div className="flex-1 p-4 border border-dashed border-white/20 rounded-lg flex items-center bg-white/5">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm w-full" required />
        </div>
        <button type="submit" disabled={isSubmitting} className="bg-mint text-base px-8 font-bold h-[58px] rounded-lg flex justify-center items-center gap-2 hover:bg-white transition-colors">
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />} Upload to Gallery
        </button>
      </form>

      <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
        {items.map(g => (
          <div key={g.id} className="relative group rounded-xl overflow-hidden aspect-square border border-white/10">
            <img src={g.image_url} alt="Gallery" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => handleDelete(g.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-transform hover:scale-110">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
