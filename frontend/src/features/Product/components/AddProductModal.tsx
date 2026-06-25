import * as React from 'react';
import {
  Modal
} from '@/components/ui/modal';
import { ProductForm } from './ProductForm';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (product: any) => void;
  product?: any;
}

export default function AddPartnerModal({ isOpen, onClose, onSuccess,product}: AddProductModalProps) {
  return (
     <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    title="Nouveau Produit"
                    maxSizeClass="max-w-xl"
                   
                  >
                    <div className="px-6 py-4">
                       <ProductForm product = {product} onProductCreate={onSuccess} />
                    </div>
    </Modal>
  );
}