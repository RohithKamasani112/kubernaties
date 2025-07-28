import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, MessageSquare } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const location = useLocation();
  
  // Generate breadcrumb items from current path if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'SAMWI Learn', href: '/' }
    ];

    if (pathSegments.includes('web-elevate')) {
      // Add specific page breadcrumbs (skip "Web Elevate" since we're already in the module)
      if (pathSegments.includes('paths')) {
        breadcrumbs.push({ label: 'Learning Paths', href: '/web-elevate/paths' });

        // If we're on a specific path
        const pathIndex = pathSegments.indexOf('paths');
        if (pathSegments[pathIndex + 1]) {
          const pathName = pathSegments[pathIndex + 1]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          breadcrumbs.push({ label: pathName });
        }
      } else if (pathSegments.includes('playground')) {
        breadcrumbs.push({ label: 'Playground' });
      } else if (pathSegments.includes('debug-projects')) {
        breadcrumbs.push({ label: 'Debug Challenges' });
      } else if (pathSegments.includes('blueprints')) {
        breadcrumbs.push({ label: 'Blueprints' });
      } else if (pathSegments.includes('collaboration')) {
        breadcrumbs.push({ label: 'Collaboration' });
      } else if (pathSegments.includes('portfolio')) {
        breadcrumbs.push({ label: 'Portfolio' });
      } else if (pathSegments.includes('settings')) {
        breadcrumbs.push({ label: 'Settings' });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
      <div className="flex items-center space-x-1 text-xs text-slate-500">
        <Home className="w-3 h-3" />
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {item.href && index < breadcrumbItems.length - 1 ? (
              <Link
                to={item.href}
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={index === breadcrumbItems.length - 1 ? 'text-slate-900 font-medium' : ''}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Feedback Button - Kubernetes Style */}
      <button className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors">
        <MessageSquare className="w-3 h-3" />
        <span>Give Feedback</span>
      </button>
    </nav>
  );
};

export default Breadcrumb;
