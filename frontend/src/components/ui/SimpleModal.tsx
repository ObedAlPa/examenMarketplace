import React from 'react'

type Props = {
  visible: boolean
  title?: string
  children?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

export default function SimpleModal({ visible, title, children, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar' }: Props){
  if (!visible) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow max-w-lg w-full p-4">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end space-x-2">
          <button className="px-3 py-2 border border-border rounded" onClick={onCancel}>{cancelText}</button>
          <button className="px-3 py-2 bg-primary text-white rounded" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
