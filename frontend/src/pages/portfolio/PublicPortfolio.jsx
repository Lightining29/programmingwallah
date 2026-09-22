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
    <div className="min-h-screen w-full font-sans antialiased bg-[#FFF7F3]">
      <PortfolioModernView
        data={portfolio}
        showWindowMockup={false}
      />
    </div>
  );
}
