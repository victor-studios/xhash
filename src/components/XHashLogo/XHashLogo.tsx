import styles from './XHashLogo.module.css';

interface XHashLogoProps {
  height?: number;
  showText?: boolean;
  className?: string;
}

export default function XHashLogo({
  height = 32,
  showText = true,
  className = '',
}: XHashLogoProps) {
  return (
    <span className={`${styles.logo} ${className}`} style={{ height }}>
      <svg
        viewBox="0 0 60 60"
        height={height}
        width={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="XHash"
      >
        <path
          d="M0,0 L22,0 L30,12 L38,0 L60,0 L38,24 L38,36 L60,60 L38,60 L30,48 L22,60 L0,60 L22,36 L22,24 Z"
          fill="currentColor"
        />
      </svg>
      {showText && (
        <span
          className={styles.text}
          style={{ fontSize: height * 0.55, lineHeight: `${height}px` }}
        >
          HASH
        </span>
      )}
    </span>
  );
}
