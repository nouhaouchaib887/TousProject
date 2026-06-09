'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {  CreditCard, ArrowDownLeft, FileText,Eye,X} from 'lucide-react'
import { TabsContent} from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FinancialDetails, TvaSelectValue, Transaction } from '@/types'


  
interface FinancialDetailsSectionProps {
  value: FinancialDetails
  onChange: (value: FinancialDetails) => void
  isSaved: boolean
  onViewReceipt?: (transaction: Transaction) => void

}
export default function FinancialDetailsSection({ value, onChange,isSaved , onViewReceipt,}: FinancialDetailsSectionProps) {
  
   const [receiptNumber, setReceiptNumber] = useState('')
   const [amountType, setAmountType] = useState<'HT' | 'TTC'>('HT')
  const [receiptDate, setReceiptDate] = useState('')
  const [newTransaction, setNewTransaction] = useState<any>({
    amount: 0,
    payment_mode: "Espèce",
    is_confirmed: true
  })


const getTvaSelectValue = (): TvaSelectValue => {
  if (value.is_tax_exempt) return 'EXEMPT'
  return String(value.vat_rate) as TvaSelectValue
}
const getAdvance = () => {
  return value.transactions.reduce((sum, t) => sum + t.amount, 0) 
}

  const handleGenerateReceipt = async () => {
    

    // Small delay to ensure state updates are reflected in the DOM before capture
    setTimeout(async () => {
      try {
        const { toCanvas } = await import('html-to-image');
      const { default: jsPDF } = await import('jspdf');

      const receiptElement = document.getElementById('receipt-template');
      if (!receiptElement) return;

      // Force render properties for capture
      const options = {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      };

      const canvas = await toCanvas(receiptElement, options);
      const dataUrl = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    }, 100);
  };

   const handleAddTransaction = () => {
   if (newTransaction.amount <= 0) return

  onChange({
    ...value,
    transactions: [...value.transactions, newTransaction],
  })

  setNewTransaction({
    amount: 0,
    payment_mode: 'Espèce',
    is_confirmed: true,
  })
  };

  const handleRemoveTransaction = (id: string) => {
    onChange({
      ...value,
      transactions: value.transactions.filter((t: any) => t.id !== id),
    })
  };



  return (
              <TabsContent value="finance" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Row 1: Amount & Type */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Type de Montant</Label>
                    <Select value={amountType}  onValueChange={(val) => {
                                            if (!val) return
                                              setAmountType(val)
                }}>
                      <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>  
                      <SelectContent>
                        <SelectItem value="HT">Montant HT</SelectItem>
                        <SelectItem value="TTC">Montant TTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Montant Base (DH)</Label>
                    <Input 
                      type="number" 
                      disabled={value.is_pro_bono}
                      value={amountType === 'HT' ? value.amount_ht : value.amount_ttc}
                      onChange={(e) => {
                      const amount = Number(e.target.value)

                      if (amountType === 'HT') {
                          onChange({
                             ...value,
                             amount_ht: amount,
                             amount_ttc: value.is_tax_exempt
                                  ? amount
                            : amount * (1 + value.vat_rate / 100),
                       })
                       } else {
                    onChange({
                      ...value,
                      amount_ttc: amount,
                      amount_ht: value.is_tax_exempt
                      ? amount
                      : amount / (1 + value.vat_rate / 100),
                    })
                      }
        }}
                      className="h-10 bg-slate-50/50 border-slate-200" 
                    />
                  </div>

                  {/* Row 2: TVA & Gratuit */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">TVA</Label>
                    <Select 
                      disabled={value.is_pro_bono}
                      value={getTvaSelectValue()} 
                      onValueChange={(val) => {
                            if (!val) return

                            if (val === 'EXEMPT') {
                            onChange({
                              ...value,
                              vat_rate: 0,
                              is_tax_exempt: true,
                              amount_ttc: value.amount_ht,
                })
                            return
    }

                            const vat_rate = Number(val)

                          onChange({
                          ...value,
                          vat_rate,
                          is_tax_exempt: false,
                          amount_ttc: value.amount_ht * (1 + vat_rate / 100),
                           })
                          }}
                    >
                      <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="EXEMPT">Exonéré</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end pb-2">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100/50 rounded-lg border border-slate-200 w-full h-10">
                      <Checkbox 
                        id="isFree" 
                        checked={value.is_pro_bono} 
                         onCheckedChange={(checked) => {
                           const is_pro_bono = !!checked

                           onChange({
                              ...value,
                              is_pro_bono,
                              amount_ht: is_pro_bono ? 0 : value.amount_ht,
                              amount_ttc: is_pro_bono ? 0 : value.amount_ttc,
                              vat_rate: is_pro_bono ? 0 : value.vat_rate,})
                  }}
                      />
                      <Label htmlFor="isFree" className="text-sm font-medium cursor-pointer">Projet Gratuit</Label>
                    </div>
                  </div>

                  {/* Row 3: Avance */}
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Avance (DH)</Label>
                    <Input 
                      type="number" 
                      disabled={value.is_pro_bono}
                      value={getAdvance()} 
                      className="h-10 bg-brand-50/30 border-brand-100 focus:ring-brand-500" 
                    />
                  </div>
                </div>

                {/* Calculation Summary */}
                {!value.is_pro_bono && (
                  <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3 shadow-xl">
                    <div className="flex justify-between items-center text-xs opacity-70">
                      <span>Montant HT</span>
                      <span className="font-mono">
                        {value.amount_ht.toLocaleString('fr-FR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} DH
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs opacity-70">
                      <span> TVA ({value.is_tax_exempt? 'Exonéré': `${value.vat_rate}%`})</span>
                      <span className="font-mono">
                        {(amountType === 'HT' 
                          ? (value.is_tax_exempt ? 0 : value.amount_ht * ((value.vat_rate) / 100))
                          : (value.amount_ttc - (value.is_tax_exempt ? value.amount_ttc : value.amount_ttc / (1 + ((value.vat_rate) / 100))))).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Total TTC</span>
                      <span className="text-lg font-black tracking-tight">
                        {value.amount_ttc.toLocaleString('fr-FR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} DH
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/20 pt-2 bg-brand-600/20 -mx-4 px-4 pb-2 rounded-b-xl">
                      <span className="text-xs font-bold text-brand-300 uppercase italic">Reste à payer</span>
                      <span className="text-xl font-black text-white">
                        {(() => {
                           const totalTTC = value.amount_ttc;
                           const totalTransactions = value.transactions.reduce((sum: number, t: any) => sum + t.amount, 0);
                           const reste = totalTTC - totalTransactions;
                           return reste.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        })()} DH
                      </span>
                    </div>
                  </div>
                )}

                {/* Detailed Transactions */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={18} className="text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Nouvelle Transaction</h4>
                  </div>
                  
                  <Card className="p-4 bg-slate-50/50 border-slate-200 rounded-2xl space-y-4 shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-slate-400">Montant (DH)</Label>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          value={newTransaction.amount || ''} 
                          onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})} 
                          className="h-10 bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-slate-400">Type</Label>
                        <Select 
                          value={newTransaction.payment_mode} 
                          onValueChange={(val) => setNewTransaction({...newTransaction, payment_mode: val})}
                        >
                          <SelectTrigger className="h-10 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Espèce">Espèce</SelectItem>
                            <SelectItem value="Chèque">Chèque</SelectItem>
                            <SelectItem value="Virement">Virement</SelectItem>
                            <SelectItem value="Versement">Versement</SelectItem>
                            <SelectItem value="Carte">Carte</SelectItem>

                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-slate-400">Justificatif (Document)</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="transaction-file"
                          type="file" 
                          onChange={(e) => setNewTransaction({...newTransaction, file: e.target.files?.[0] || null})}
                          className="h-10 bg-white pt-2 text-xs" 
                        />
                        <Button 
                          className="h-10 bg-slate-900 shadow-lg shadow-slate-200" 
                          onClick={handleAddTransaction}
                        >
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* List of Transactions */}
                  <div className="space-y-2">
                    {value.transactions.map((t: any) => (
                      <div key={t.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-brand-200 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                            <ArrowDownLeft size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{t.amount.toLocaleString()} DH</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {t.payment_mode} • {t.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                         {!!t.id &&(
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                onViewReceipt?.(t)
                                handleGenerateReceipt()
                              }}
                              className="h-8 text-[9px] font-black uppercase text-blue-600 border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-200 gap-1 rounded-lg transition-all shadow-sm shadow-blue-50"
                            >
                              <Eye size={12} />
                              Voir Reçu
                            </Button>
                          )}
                          {t.file && (
                            <Badge  className="bg-slate-50 text-slate-500 font-bold text-[9px] gap-1 px-2 py-0.5 border-slate-100">
                              <FileText size={10} /> PDF
                            </Badge>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-300 hover:text-rose-500 rounded-full"
                            onClick={() => handleRemoveTransaction(t.id)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
           
  )
}
