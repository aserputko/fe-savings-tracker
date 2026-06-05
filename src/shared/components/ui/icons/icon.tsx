import { ICON_MAP, type IconName } from './icon-map'

interface IconProps {
  name: IconName
  className?: string
  style?: React.CSSProperties
}

export function Icon({ name, className, style }: IconProps) {
  return (
    <img
      src={ICON_MAP[name]}
      alt={name}
      width={20}
      height={20}
      className={className}
      style={style}
    />
  )
}

