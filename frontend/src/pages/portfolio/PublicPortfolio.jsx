import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Share2,
  ArrowLeft,
  ExternalLink,
  Layers,
  Copy
} from 'lucide-react';
import Swal from 'sweetalert2';
import PortfolioModernView from '../../components/portfolio/PortfolioModernView.jsx';

export default function PublicPortfolio() {
  const { id, studentSlug } = useParams();
  const slug = id || studentSlug;
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/portfolio/${encodeURIComponent(slug)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.portfolio) {
          setPortfolio(data.portfolio);
        } else {
          // Standard demo data matching Alex Morgan design
          setPortfolio({
            name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            role: 'Brand & Web Designer',
            location: 'Toronto, Canada',
            bio: 'I help startups and creative brands build thoughtful identities and digital experiences that connect.',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            availability: {
              status: 'Available for work',
              period: 'May 2026',
              description: "I'm currently accepting new projects and opportunities."
            },
            projects: [
              {
                id: 'proj-1',
                title: 'ROSE Skincare',
                category: 'Branding',
                subtitle: 'Visual Identity',
                screenshot: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
                description: 'Tactile minimalist brand identity and bespoke digital storefront for luxury organic skincare.',
                tags: ['React', 'Next.js', 'Tailwind CSS']
              },
              {
                id: 'proj-2',
                title: 'Helix SaaS',
                category: 'Web Design',
                subtitle: 'Website Design',
                screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                description: 'High-throughput analytics platform website featuring real-time interactive charts and conversion funnels.',
                tags: ['TypeScript', 'Vite', 'Node.js']
              },
              {
                id: 'proj-3',
                title: 'Momentum',
                category: 'UI/UX',
                subtitle: 'Mobile App',
                screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                description: 'An intuitive productivity companion designed to eliminate friction in daily sprint tracking and team boards.',
                tags: ['React Native', 'Figma']
              }
            ],
            slug: id
          });
        }
      })
      .catch(() => {
        setPortfolio(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleShare = () => {
    const shareUrl = `https://programmingwala.com/${slug}`;
    navigator.clipboard.writeText(shareUrl);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Copied: ${shareUrl}`,
      showConfirmButton: false,
      timer: 2000
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141211] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#E05A38] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-[#E05A38]">
            Loading Showcase...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#100E0D] text-[#EFECE6] font-sans py-6 px-3 sm:px-6 lg:px-8">
      {/* Top Floating Showcase Navigation */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <Link
          to="/arena"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C1817] border border-[#2D2724] text-[#A69B95] hover:text-white text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#E05A38]" />
          <span>Student Arena</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/student/portfolio"
            className="px-4 py-2 rounded-xl bg-[#E05A38] hover:bg-[#CF4E2C] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Create Your Portfolio</span>
          </Link>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-[#1C1817] hover:bg-[#282220] border border-[#2D2724] text-[#A69B95] hover:text-white transition cursor-pointer"
            title="Copy Share Link"
          >
            <Share2 className="w-4 h-4 text-[#E05A38]" />
          </button>
        </div>
      </div>

      {/* Main Modern Showcase Render */}
      <div className="max-w-6xl mx-auto">
        <PortfolioModernView
          data={portfolio}
          showWindowMockup={true}
        />
      </div>
    </div>
  );
}
