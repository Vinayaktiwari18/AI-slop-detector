export default function Button({ children, onClick, disabled, variant = 'primary', full }) {
  return (
    <button
      className={`btn btn-${variant}${full ? ' btn-full' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}