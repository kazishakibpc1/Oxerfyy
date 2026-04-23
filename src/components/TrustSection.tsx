"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Avatar variables are local state now

const companies = [
  "RinishBD",
  "ShajAlo",
  "Aurazeh",
  "ApporLeader",
  "Nusrat Jahan",
  "Zayed Ahammed",
];

export function TrustSection() {
  const [avatars, setAvatars] = useState([
    "https://i.pravatar.cc/150?u=a1",
    "https://i.pravatar.cc/150?u=a2",
    "https://i.pravatar.cc/150?u=a3",
  ]);

  useEffect(() => {
    // We can fetch any keys starting with 'trust_avatar_'
    // But since Firestore doesn't support 'startsWith' easily without complex queries,
    // we fetch all site_assets and filter manually.
    const unsub = onSnapshot(collection(db, 'site_assets'), (snap) => {
      const allAssets = snap.docs.map(doc => doc.data());
      const customAvatars = [
        allAssets.find(a => a.key === 'trust_avatar_1')?.image_url || "https://i.pravatar.cc/150?u=a1",
        allAssets.find(a => a.key === 'trust_avatar_2')?.image_url || "https://i.pravatar.cc/150?u=a2",
        allAssets.find(a => a.key === 'trust_avatar_3')?.image_url || "https://i.pravatar.cc/150?u=a3",
      ];
      setAvatars(customAvatars);
    });
    return () => unsub();
  }, []);
  return (
    <section className="py-12 bg-black relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col xl:flex-row items-center justify-between gap-10 xl:gap-4"
        >
          {/* Left side: Avatars and Text */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt={`Client ${i + 1}`} 
                  className="w-12 h-12 rounded-full border-2 border-black object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-cream font-bold text-base">Trusted by CEO's and Founder</span>
              <span className="text-cream/50 text-sm font-light">50+ projects Complete!</span>
            </div>
          </div>

          {/* Right side: Animated Logos */}
          <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] xl:ml-8">
            <div className="flex animate-marquee whitespace-nowrap items-center w-max gap-12">
              {[...companies, ...companies, ...companies, ...companies].map((company, i) => (
                <div key={i} className="flex items-center gap-2 text-cream/70 hover:text-cream transition-colors cursor-default shrink-0">
                  <span className="font-display font-bold text-xl uppercase tracking-widest">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
