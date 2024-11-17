'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  MoreVertical, 
  FileDown, 
  Eye,
  DollarSign,
  Building2,
  Users2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import type { ContractWithParties } from '@/lib/types/dashboard';
import { getContractPDF } from '@/lib/actions/contractor';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

// Rest of the file remains the same...