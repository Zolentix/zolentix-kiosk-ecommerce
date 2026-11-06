export function Logo({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/zolentix-logo.png"
      alt="Zolentix"
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: size * 0.22, display: 'block' }}
    />
  )
}
