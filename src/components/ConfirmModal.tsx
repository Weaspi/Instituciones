export function ConfirmModal({ 
  isOpen, 
  mensaje, 
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean, 
  mensaje: string, 
  onConfirm: () => void, 
  onCancel: () => void 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar acción</h3>
        <p className="text-sm text-gray-600 mb-6">{mensaje}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 text-sm font-medium text-white bg-[#5c0a2e] rounded-md hover:bg-[#4a0825]"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}