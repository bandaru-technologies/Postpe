import * as Dialog from '@radix-ui/react-dialog'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  loading?: boolean
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  loading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: 'bg-red-500 hover:bg-red-400 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-400 text-navy-900',
    info: 'bg-accent hover:bg-cyan-400 text-navy-900',
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm animate-slide-up">
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  variant === 'danger' ? 'bg-red-500/10' :
                  variant === 'warning' ? 'bg-yellow-500/10' :
                  'bg-accent/10'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    variant === 'danger' ? 'text-red-400' :
                    variant === 'warning' ? 'text-yellow-400' :
                    'text-accent'
                  }`} />
                </div>
                <Dialog.Title className="text-lg font-bold text-white">{title}</Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button className="w-8 h-8 rounded-full hover:bg-navy-600 flex items-center justify-center text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{description}</p>

            <div className="flex gap-3">
              <Dialog.Close asChild>
                <button className="btn-secondary flex-1">{cancelLabel}</button>
              </Dialog.Close>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 font-semibold rounded-lg active:scale-95 transition-all duration-200 disabled:opacity-50 ${variantStyles[variant]}`}
              >
                {loading ? 'Processing...' : confirmLabel}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
