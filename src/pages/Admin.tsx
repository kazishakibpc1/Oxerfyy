import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Image as ImageIcon, Layers, MessageSquare, Trash2, UploadCloud, Loader2, Settings, Edit3, X, Check, Search, Plus, LayoutDashboard } from "lucide-react";
import { defaultProjects } from "../components/Portfolio";
import { defaultTestimonials } from "../components/Testimonials";

export const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Failed context'));
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Failed blob')), 'image/webp', 0.85);
      };
      img.onerror = () => reject(new Error('Image failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Read failed'));
    reader.readAsDataURL(file);
  });
};

export const convertToWebPDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Max dimension scaling for data URLs to save Firestore space
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 800;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          } else {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Failed context'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.8));
      };
      img.onerror = () => reject(new Error('Image failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Read failed'));
    reader.readAsDataURL(file);
  });
};

export default function Admin() {
  const [session, setSession] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setSession(user);
      setLoading(false);
    });
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err: any) {
      alert("Login Failed: " + err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-base flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-mint" /></div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0B192C] flex items-center justify-center p-6">
        <div className="bg-[#06101c] p-10 max-w-md w-full border border-white/10 text-center relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute top-0 right-0 p-16 bg-mint/20 blur-[100px] pointer-events-none rounded-full" />
          <h1 className="text-4xl font-display font-bold mb-3 text-white tracking-tight">Access Panel</h1>
          <p className="text-sm text-cream/50 mb-10">Secure workspace login required</p>
          <button onClick={handleLogin} className="w-full bg-mint text-base font-bold py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06101c] text-cream flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar - Simplified for mobile for now */}
      <div className="w-full md:w-72 border-r border-white/10 flex flex-col pt-6 md:pt-10 pb-6 px-4 md:px-6 bg-[#0B192C] shrink-0">
        <h2 className="text-2xl font-display font-bold tracking-widest text-white mb-2">
          O<span className="text-mint">X</span>ERFY
        </h2>
        <span className="text-[10px] uppercase tracking-widest text-mint px-1 mb-6 md:mb-10 block font-bold">Admin Workspace</span>
        
        <nav className="flex flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto pb-2 md:pb-0 flex-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'projects', icon: Layers, label: 'Projects' },
            { id: 'testimonials', icon: MessageSquare, label: 'Testimonials' },
            { id: 'assets', icon: ImageIcon, label: 'Images & Assets' },
            { id: 'gallery', icon: ImageIcon, label: 'Image Gallery' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3.5 rounded-xl text-xs md:text-sm font-semibold transition-all shrink-0 ${activeTab === tab.id ? 'bg-mint text-base shadow-lg shadow-mint/20' : 'hover:bg-white/5 text-cream/70 hover:text-white'}`}>
              <tab.icon size={16} md:size={18} /> {tab.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block mt-8 pt-6">
          <div className="px-4 mb-4">
            <p className="text-xs text-cream/40 truncate w-full" title={session.email || ""}>{session.email}</p>
          </div>
          <button onClick={() => signOut(auth)} className="w-full py-3 text-sm font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-red-500/20">
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full h-screen relative p-4 md:p-10">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'projects' && <ProjectManager />}
        {activeTab === 'testimonials' && <TestimonialManager />}
        {activeTab === 'assets' && <SiteAssetsManager />}
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </div>
    </div>
  );
}

const GalleryManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, 'gallery'), snap => setItems(snap.docs.map(d => ({id: d.id, ...d.data()}))));
  }, []);

  const save = async(e: any) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const url = await convertToWebPDataURL(file);
      await addDoc(collection(db, 'gallery'), { image_url: url });
      setFile(null);
    } catch(err: any) {
      console.error(err);
      setError(err.message || String(err));
    }
    setLoading(false);
  }

  const remove = async (id: string) => {
    if(confirm('Delete?')) {
      try {
        setError(null);
        await deleteDoc(doc(db, 'gallery', id));
      } catch(err: any) { 
        console.error(err);
        setError(err.message || String(err));
      }
    }
  }

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-display font-bold text-white mb-6">Image Gallery</h1>
      {error && <div className="p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-100 mb-6">{error}</div>}
      
      <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-6 items-center mb-10">
        <input required type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer" />
        <button type="submit" disabled={loading} className="w-full md:w-auto px-8 py-4 bg-mint text-base font-bold rounded-xl whitespace-nowrap flex items-center justify-center gap-2 hover:bg-white">{loading ? <Loader2 className="animate-spin" /> : "Upload Image"}</button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map(g => (
          <div key={g.id} className="relative group rounded-2xl overflow-hidden aspect-[4/5] md:aspect-square border border-white/10">
            <img src={g.image_url} alt="Gallery" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => remove(g.id)} className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-10 text-center text-cream/40">No gallery images uploaded yet.</div>}
      </div>
    </div>
  )
}

const Dashboard = ({ setActiveTab }: any) => {
  const [error, setError] = useState<string | null>(null);
  const seedDB = async () => {
    if(!confirm("Important: This will add default projects and testimonials to the live database if they don't exist. Proceed?")) return;
    try {
      for(const p of defaultProjects) await addDoc(collection(db, 'projects'), {...p, image_url: p.image});
      for(const t of defaultTestimonials) await addDoc(collection(db, 'testimonials'), {...t, image_url: t.image});
      setError('Seeded test data successfully!');
    } catch(err: any) { setError("Error: " + err.message); }
  }

  const cleanupDuplicates = async () => {
    if(!confirm("This will remove duplicate entries from your database based on their titles and text. Proceed?")) return;
    try {
      // Clean up projects
      const pSnap = await getDocs(collection(db, 'projects'));
      const seenProjects = new Set();
      for (const d of pSnap.docs) {
        const title = d.data().title;
        if (seenProjects.has(title)) {
          await deleteDoc(doc(db, 'projects', d.id));
        } else {
          seenProjects.add(title);
        }
      }

      // Clean up testimonials
      const tSnap = await getDocs(collection(db, 'testimonials'));
      const seenTestimonials = new Set();
      for (const d of tSnap.docs) {
        const text = d.data().text;
        if (seenTestimonials.has(text)) {
          await deleteDoc(doc(db, 'testimonials', d.id));
        } else {
          seenTestimonials.add(text);
        }
      }
      
      setError('Cleaned up duplicates successfully!');
    } catch(err: any) { setError("Error: " + err.message); }
  }

  return (
    <div className="p-10 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-cream/60 mt-3 text-lg">Manage your site's content dynamically from here.</p>
        {error && <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-100">{error}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => setActiveTab('projects')} className="bg-[#0B192C] border border-white/5 p-8 rounded-3xl hover:border-mint/30 cursor-pointer transition-all group">
          <Layers className="text-mint mb-4 w-8 h-8 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold text-white mb-2">Projects</h3>
          <p className="text-sm text-cream/60 mb-2">Create, edit, or remove portfolio projects.</p>
        </div>
        <div onClick={() => setActiveTab('testimonials')} className="bg-[#0B192C] border border-white/5 p-8 rounded-3xl hover:border-mint/30 cursor-pointer transition-all group">
          <MessageSquare className="text-mint mb-4 w-8 h-8 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold text-white mb-2">Testimonials</h3>
          <p className="text-sm text-cream/60 mb-2">Manage client reviews shown on the homepage.</p>
        </div>
        <div onClick={() => setActiveTab('assets')} className="bg-[#0B192C] border border-white/5 p-8 rounded-3xl hover:border-mint/30 cursor-pointer transition-all group">
          <ImageIcon className="text-mint mb-4 w-8 h-8 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold text-white mb-2">Site Images</h3>
          <p className="text-sm text-cream/60 mb-2">Change Founder, Global assets, and Background images.</p>
        </div>
        <div onClick={() => setActiveTab('gallery')} className="bg-[#0B192C] border border-white/5 p-8 rounded-3xl hover:border-mint/30 cursor-pointer transition-all group">
          <ImageIcon className="text-mint mb-4 w-8 h-8 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold text-white mb-2">Image Gallery</h3>
          <p className="text-sm text-cream/60 mb-2">Manage images for the infinite scrolling gallery.</p>
        </div>
      </div>

      <div className="bg-mint/10 border border-mint/20 p-8 rounded-3xl max-w-3xl">
        <h2 className="text-xl font-bold text-white mb-4">Migrate Old Data</h2>
        <p className="text-sm text-cream/80 mb-6">If the website is showing default projects that you cannot edit or delete in the admin panel, you can import them into the editable database below.</p>
        <button onClick={seedDB} className="bg-mint text-base font-bold px-6 py-3 rounded-xl hover:bg-white transition-colors">
          Import Old Hardcoded Data
        </button>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-3xl mt-6">
        <h2 className="text-xl font-bold text-white mb-4">Clean Up Duplicates</h2>
        <p className="text-sm text-cream/80 mb-6">If the database contains duplicate entries (e.g. from pressing the import button multiple times), you can automatically remove the duplicates based on their title and text.</p>
        <button onClick={cleanupDuplicates} className="bg-white text-red-500 text-base font-bold px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-red-500">
          Remove Duplicates
        </button>
      </div>
    </div>
  )
}

const ProjectManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', type: '', link: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, 'projects'), snap => setItems(snap.docs.map(d => ({id: d.id, ...d.data()}))));
  }, []);

  const save = async(e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let url = items.find(i=>i.id===editingId)?.image_url;
      if (file) {
        url = await convertToWebPDataURL(file);
      }
      if (editingId && editingId !== 'new') {
        await updateDoc(doc(db, 'projects', editingId), { ...form, image_url: url });
      } else {
        if(!url) throw new Error("Image needed");
        await addDoc(collection(db, 'projects'), { ...form, image_url: url, created_at: new Date().toISOString() });
      }
      setEditingId(null); setFile(null); setForm({title: '', type: '', link: '', description: ''});
    } catch(err: any) { 
      console.error(err);
      setError(err.message || String(err));
    }
    setLoading(false);
  }

  const edit = (p: any) => { setEditingId(p.id); setForm({title: p.title || '', type: p.type || '', link: p.link || '', description: p.description || ''}); setFile(null); setError(null); }
  const remove = async(id: string) => { 
    if(confirm("Are you sure?")) {
      try {
        setError(null);
        await deleteDoc(doc(db, 'projects', id)); 
      } catch(err: any) {
        console.error(err);
        setError(err.message || String(err));
      }
    }
  }

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-display font-bold text-white">Manage Projects</h1>
        {!editingId && <button onClick={()=>setEditingId('new')} className="bg-mint text-base font-bold px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white"><Plus size={18}/> Add Project</button>}
      </div>
      {error && <div className="p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-100 mb-6">{error}</div>}

      {editingId && (
        <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-mint/30 mb-10 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-white">{editingId === 'new' ? 'Create New Project' : 'Edit Project'}</h2>
            <button type="button" onClick={()=>setEditingId(null)} className="text-cream/50 hover:text-white"><X size={24}/></button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div><label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">Title</label><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-mint focus:outline-none" /></div>
            <div><label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">Category (e.g. Meta Ads)</label><input required value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-mint focus:outline-none" /></div>
            <div className="col-span-2"><label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">Project Link</label><input value={form.link} onChange={e=>setForm({...form, link: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-mint focus:outline-none" /></div>
            <div className="col-span-2"><label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">Description</label><textarea required value={form.description} rows={3} onChange={e=>setForm({...form, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-mint focus:outline-none resize-none" /></div>
            <div className="col-span-2 p-6 border border-dashed border-white/20 rounded-xl flex items-center justify-center bg-white/5"><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm cursor-pointer" /></div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={()=>setEditingId(null)} className="px-6 py-3 font-bold rounded-xl text-cream/70 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={loading} className="bg-mint text-base font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-white">{loading ? <Loader2 className="animate-spin" size={18}/> : <Check size={18}/>} Save Project</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => (
          <div key={p.id} className="bg-[#0B192C] border border-white/5 rounded-3xl overflow-hidden group">
            <div className="h-48 w-full bg-black/50 relative">
              <img src={p.image_url} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={()=>edit(p)} className="p-2 bg-black/60 rounded-lg text-white hover:bg-mint hover:text-base backdrop-blur-md transition-colors"><Edit3 size={16}/></button>
                <button onClick={()=>remove(p.id)} className="p-2 bg-black/60 rounded-lg text-red-400 hover:bg-red-500 hover:text-white backdrop-blur-md transition-colors"><Trash2 size={16}/></button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white">{p.title}</h3>
              <p className="text-sm text-mint mt-1 mb-4">{p.type}</p>
              <p className="text-sm text-cream/60 line-clamp-2">{p.description}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-20 text-center text-cream/40 border border-dashed border-white/10 rounded-3xl">No projects found. Add one or import defaults from Dashboard.</div>}
      </div>
    </div>
  )
}


const TestimonialManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', role: '', text: '' });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, 'testimonials'), snap => setItems(snap.docs.map(d => ({id: d.id, ...d.data()}))));
  }, []);

  const save = async(e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let url = items.find(i=>i.id===editingId)?.image_url;
      if (file) {
        url = await convertToWebPDataURL(file);
      }
      if (editingId && editingId !== 'new') {
        await updateDoc(doc(db, 'testimonials', editingId), { ...form, image_url: url });
      } else {
        if(!url) throw new Error("Image needed");
        await addDoc(collection(db, 'testimonials'), { ...form, image_url: url, created_at: new Date().toISOString() });
      }
      setEditingId(null); setFile(null); setForm({name: '', role: '', text: ''});
    } catch(err: any) { 
      console.error(err);
      setError(err.message || String(err));
    }
    setLoading(false);
  }

  const edit = (t: any) => { setEditingId(t.id); setForm({name: t.name || '', role: t.role || '', text: t.text || ''}); setFile(null); setError(null); }
  const remove = async(id: string) => { 
    if(confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")) {
      try {
        setError(null);
        await deleteDoc(doc(db, 'testimonials', id)); 
      } catch(err: any) {
        console.error(err);
        setError(err.message || String(err));
      }
    }
  }

  return (
    <div className="p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-display font-bold text-white">Manage Testimonials</h1>
        {!editingId && <button onClick={()=>setEditingId('new')} className="bg-mint text-base font-bold px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white"><Plus size={18}/> Add Client</button>}
      </div>
      {error && <div className="p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-100 mb-6">{error}</div>}

      {editingId && (
        <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-mint/30 mb-10 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-white">{editingId === 'new' ? 'New Testimonial' : 'Edit Testimonial'}</h2>
            <button type="button" onClick={()=>setEditingId(null)} className="text-cream/50 hover:text-white"><X size={24}/></button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div><label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">Client Name</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-mint focus:outline-none" /></div>
            <div><label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">Role/Company</label><input required value={form.role} onChange={e=>setForm({...form, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-mint focus:outline-none" /></div>
            <div className="col-span-2"><label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">Review Text</label><textarea required value={form.text} rows={4} onChange={e=>setForm({...form, text: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-mint focus:outline-none resize-none" /></div>
            <div className="col-span-2 p-6 border border-dashed border-white/20 rounded-xl flex items-center justify-center bg-white/5"><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm cursor-pointer" /></div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={()=>setEditingId(null)} className="px-6 py-3 font-bold rounded-xl text-cream/70 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={loading} className="bg-mint text-base font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-white">{loading ? <Loader2 className="animate-spin" size={18}/> : <Check size={18}/>} Save Review</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(t => (
          <div key={t.id} className="bg-[#0B192C] border border-white/5 rounded-3xl p-6 flex gap-6 hover:border-white/10 transition-colors">
            <img src={t.image_url || t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover shrink-0 bg-white/5" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{t.name}</h3>
              <p className="text-xs text-mint mb-3">{t.role}</p>
              <p className="text-sm text-cream/70 mb-4">{t.text}</p>
              <div className="flex gap-2">
                <button onClick={()=>edit(t)} className="text-xs font-bold text-cream/50 hover:text-mint transition-colors">Edit</button>
                <span className="text-cream/20">•</span>
                <button onClick={()=>remove(t.id)} className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const SiteAssetsManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [assetKey, setAssetKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, 'site_assets'), snap => setItems(snap.docs.map(d => ({id: d.id, ...d.data()}))));
  }, []);

  const save = async (e: any) => {
    e.preventDefault();
    if (!file || !assetKey) return;
    setLoading(true);
    setError(null);
    try {
      const url = await convertToWebPDataURL(file);
      const existing = items.find(i => i.key === assetKey);
      if (existing) await deleteDoc(doc(db, 'site_assets', existing.id));
      await addDoc(collection(db, 'site_assets'), { key: assetKey, image_url: url });
      setFile(null); setAssetKey("");
    } catch(err: any) {
      console.error(err);
      setError(err.message || String(err));
    }
    setLoading(false);
  }

  const keys = ["founder_image", "why_choose_us_1", "trust_avatar_1", "trust_avatar_2", "trust_avatar_3", "logo_image", "hero_image"];

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-display font-bold text-white mb-4">Site Images</h1>
      <p className="text-cream/60 text-lg mb-10">Manage distinct images shown throughout the website.</p>
      {error && <div className="p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-100 mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-white/5 space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Upload Image</h2>
          <div>
            <label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">Select Placement Key</label>
            <select required value={assetKey} onChange={e=>setAssetKey(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-mint focus:outline-none text-white appearance-none">
              <option value="" disabled>Select where this image should appear</option>
              {keys.map(k=><option key={k} value={k}>{k.replace(/_/g, ' ').toUpperCase()}</option>)}
            </select>
          </div>
          <div className="p-6 border border-dashed border-white/20 rounded-xl flex items-center justify-center bg-white/5">
            <input required type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-mint text-base font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-white">{loading ? <Loader2 className="animate-spin" /> : "Set Image"}</button>
        </form>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white px-2">Current Placements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(a => (
              <div key={a.id} className="bg-[#0B192C] rounded-2xl overflow-hidden border border-white/5 relative group">
                <img src={a.image_url} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="font-mono text-xs text-mint font-bold mb-2">{a.key}</h3>
                  <button onClick={async()=>{ if(confirm('Delete?')) await deleteDoc(doc(db, 'site_assets', a.id)); }} className="text-xs text-white bg-red-500 py-2 rounded-lg font-bold text-center">Delete Image</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const SettingsManager = () => {
  const [links, setLinks] = useState({ linkedin: "", website: "" });
  const [loading, setLoading] = useState(false);
  useEffect(() => { return onSnapshot(doc(db, 'settings', 'global'), snap => { if(snap.exists()) setLinks({ linkedin: snap.data().founder_linkedin || "", website: snap.data().founder_website || "" }); }); }, []);
  const save = async(e: any) => { e.preventDefault(); setLoading(true); try { await setDoc(doc(db, 'settings', 'global'), { founder_linkedin: links.linkedin, founder_website: links.website }, { merge: true }); alert('Saved!'); } catch(err) { alert(err) } setLoading(false); }
  return (
    <div className="p-10 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-display font-bold text-white mb-8">Global Variables</h1>
      <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-white/5 space-y-6">
        <div><label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">Founder LinkedIn</label><input type="url" value={links.linkedin} onChange={e=>setLinks({...links, linkedin: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-mint focus:outline-none" /></div>
        <div><label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">Founder Website</label><input type="url" value={links.website} onChange={e=>setLinks({...links, website: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-mint focus:outline-none" /></div>
        <button type="submit" disabled={loading} className="w-full bg-mint text-base font-bold py-4 rounded-xl hover:bg-white">{loading ? <Loader2 className="animate-spin inline mr-2" /> : "Save Requirements"}</button>
      </form>
    </div>
  )
}
