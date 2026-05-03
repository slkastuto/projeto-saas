import Image from 'next/image';

type LogoProps = {
  variant?: 'auth' | 'app';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
};

export function Logo({ variant = 'app', size = 'md' }: LogoProps) {
  const src =
    variant === 'auth'
      ? '/logo-auth.png'
      : '/logo-app.png';

  const sizeClass = {
    sm: 'max-w-[160px]',
    md: 'max-w-[220px]',
    lg: 'max-w-[300px]',
    xl: 'max-w-[420px]',
    xxl: 'max-w-[550px]',
  }[size];

  return (
    <div
      className={`w-full flex justify-center ${sizeClass} 
      opacity-0 animate-fadeIn`}
    >
      <Image
        src={src}
        alt="Zekvar"
        width={1200}
        height={500}
        className="w-full h-auto object-contain"
        priority
      />
    </div>
  );
}
