'use client';
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, Btn, Badge, Modal, Confirm, Empty, Spinner, useToast, Toast } from '@/components/ui';
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApi, useMutation } from '@/lib';
import { couponsApi } from '@/lib/endpoints/coupons';
import type { Coupon } from '@/lib/endpoints/coupons';

// ─── Coupon Form ──────────────────────────────────────────────────────────────
function CouponForm({ onSave, onClose, loading }: {
  onSave: (data: any) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [code, setCode]                 = useState('');
  const [discountType, setDiscountType] = useState('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [maxUses, setMaxUses]           = useState('0');
  const [expiryDate, setExpiryDate]     = useState('');
  const [isActive, setIsActive]         = useState(true);

  const handleSubmit = () => {
    const val = parseFloat(discountValue);
    if (!code.trim() || isNaN(val) || val <= 0) return;
    onSave({
        code:           code.trim().toUpperCase(),
        discount_type:  discountType,
        discount_value: val,
        max_uses:       parseInt(maxUses) || 0,
        expiry_date:    expiryDate ? `${expiryDate}T23:59:59` : null,
        is_active:      isActive,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Code */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Coupon Code *
        </label>
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. WELCOME15"
          className="px-3 py-2.5 rounded-xl text-sm border outline-none font-mono font-bold tracking-widest"
          style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
        />
      </div>

      {/* Discount Type + Value */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Discount Type *
          </label>
          <select
            value={discountType}
            onChange={e => setDiscountType(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <option value="percent">Percentage (%)</option>
            <option value="flat">Flat Amount ($)</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Discount Value *
          </label>
          <input
            type="number"
            min="0"
            value={discountValue}
            onChange={e => setDiscountValue(e.target.value)}
            placeholder={discountType === 'percent' ? 'e.g. 15' : 'e.g. 10'}
            className="px-3 py-2.5 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
        </div>
      </div>

      {/* Max Uses */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Max Uses (0 = unlimited)
            </label>
            <input
            type="number"
            min="0"
            value={maxUses}
            onChange={e => setMaxUses(e.target.value)}
            placeholder="0"
            className="px-3 py-2.5 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
        </div>
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Expiry Date (optional)
            </label>
            <input
            type="date"
            value={expiryDate}
            onChange={e => setExpiryDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="px-3 py-2.5 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
        </div>
        </div>

      {/* Active toggle */}
      <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl border text-sm"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        <input
          type="checkbox"
          checked={isActive}
          onChange={e => setIsActive(e.target.checked)}
          className="accent-[var(--accent)]"
        />
        Active (students can use this coupon)
      </label>

      <div className="flex gap-2 justify-end pt-2">
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSubmit} loading={loading}>Create Coupon</Btn>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CouponsPage() {
  const { data: coupons, loading, refetch } = useApi(() => couponsApi.list());
  const { mutate: createCoupon, loading: creating } = useMutation(couponsApi.create);
  const { mutate: toggleCoupon } = useMutation(couponsApi.toggle);
  const { mutate: deleteCoupon } = useMutation(couponsApi.delete);

  const [modal, setModal]           = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const { toasts, add: toast }      = useToast();

  const handleSave = async (form: any) => {
    const res = await createCoupon(form);
    if (res) {
      toast('Coupon created successfully');
      setModal(false);
      refetch();
    } else {
      toast('Failed to create coupon', 'danger');
    }
  };

  const handleToggle = async (id: string) => {
    await toggleCoupon(id);
    toast('Coupon status updated');
    refetch();
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    await deleteCoupon(confirmDel);
    toast('Coupon deleted', 'danger');
    setConfirmDel(null);
    refetch();
  };

  const couponList: Coupon[] = coupons || [];

  return (
    <AdminLayout title="Coupons">
      <div className="animate-fade-in space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {couponList.length} coupon{couponList.length !== 1 ? 's' : ''} total
          </p>
          <Btn onClick={() => setModal(true)}>
            <Plus size={15} /> Add Coupon
          </Btn>
        </div>

        {/* Table */}
        {loading ? <Spinner center /> : couponList.length === 0 ? (
          <Empty icon="🏷️" text="No coupons yet. Create your first coupon code." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    {['Code', 'Discount', 'Uses', 'Expiry', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b"
                        style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {couponList.map((c: Coupon) => (
                    <tr key={c._id} className="border-b transition-colors"
                      style={{ borderColor: 'var(--border)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>

                      {/* Code */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                            <Tag size={13} />
                          </div>
                          <span className="font-mono font-bold tracking-widest text-sm"
                            style={{ color: 'var(--text)' }}>
                            {c.code}
                          </span>
                        </div>
                      </td>

                      {/* Discount */}
                      <td className="px-4 py-3">
                        <span className="font-bold text-sm" style={{ color: 'var(--accent)' }}>
                          {c.discount_type === 'percent'
                            ? `${c.discount_value}% off`
                            : `$${c.discount_value} off`}
                        </span>
                      </td>

                      {/* Uses */}
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {c.used_count} / {c.max_uses === 0 ? '∞' : c.max_uses}
                      </td>

                      {/* Expiry */}
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {c.expiry_date
                        ? new Date(c.expiry_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'No expiry'}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge type={c.is_active ? 'success' : 'default'}>
                          {c.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Btn size="sm" variant="secondary" onClick={() => handleToggle(c._id)}>
                            {c.is_active
                              ? <ToggleRight size={14} style={{ color: 'var(--success)' }} />
                              : <ToggleLeft size={14} />}
                          </Btn>
                          <Btn size="sm" variant="danger" onClick={() => setConfirmDel(c._id)}>
                            <Trash2 size={13} />
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="New Coupon">
        <CouponForm onSave={handleSave} onClose={() => setModal(false)} loading={creating} />
      </Modal>

      {/* Delete Confirm */}
      <Confirm
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        message="Delete this coupon? Students won't be able to use it anymore."
      />

      <Toast toasts={toasts} />
    </AdminLayout>
  );
}