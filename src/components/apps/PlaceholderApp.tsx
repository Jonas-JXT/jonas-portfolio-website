interface Props {
  appName: string
  icon: string
}

export default function PlaceholderApp({ appName, icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#f0f0f0] text-black/40 gap-3">
      <span className="text-6xl opacity-30">{icon}</span>
      <p className="text-[14px] font-medium">{appName}</p>
      <p className="text-[11px]">Coming soon</p>
    </div>
  )
}
