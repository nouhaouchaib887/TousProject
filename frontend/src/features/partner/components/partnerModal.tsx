import * as React from 'react';
import {
  Modal
} from '@/components/ui/modal';
import { PartnerForm } from './partnerForm';

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (partner: any) => void;
  partner?: any;
}

export default function AddPartnerModal({ isOpen, onClose, onSuccess,partner}: AddPartnerModalProps) {
  return (
     <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    title="Nouveau Tiers"
                    maxSizeClass="max-w-xl"
                   
                  >
                    <div className="px-6 py-4">
                       <PartnerForm partner = {partner} onPartnerCreate={onSuccess} />
                    </div>
    </Modal>
  );
}