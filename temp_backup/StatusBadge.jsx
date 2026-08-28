import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  FileCheck,
  CheckCircle,
  XCircle,
  UserCheck,
  AlertCircle,
} from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Menunggu Verifikasi',
    variant: 'outline',
    icon: Clock,
    className: 'text-amber-600 border-amber-300 bg-amber-50',
  },
  verified: {
    label: 'Terverifikasi',
    variant: 'outline',
    icon: FileCheck,
    className: 'text-blue-600 border-blue-300 bg-blue-50',
  },
  accepted: {
    label: 'Diterima',
    variant: 'outline',
    icon: CheckCircle,
    className: 'text-green-600 border-green-300 bg-green-50',
  },
  rejected: {
    label: 'Ditolak',
    variant: 'outline',
    icon: XCircle,
    className: 'text-red-600 border-red-300 bg-red-50',
  },
  reserve: {
    label: 'Cadangan',
    variant: 'outline',
    icon: UserCheck,
    className: 'text-purple-600 border-purple-300 bg-purple-50',
  },
  'in-review': {
    label: 'Sedang Diverifikasi',
    variant: 'outline',
    icon: AlertCircle,
    className: 'text-indigo-600 border-indigo-300 bg-indigo-50',
  },
  'doc-incomplete': {
    label: 'Berkas Tidak Lengkap',
    variant: 'outline',
    icon: AlertCircle,
    className: 'text-orange-600 border-orange-300 bg-orange-50',
  },
};

const StatusBadge = ({ status, showIcon = true, className = '' }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 px-2.5 py-1 ${config.className} ${className}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;