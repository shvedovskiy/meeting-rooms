import React from 'react';
import { Size } from 'context/size-context';

type Props = {
  avatarPath?: string;
  className?: string;
  size?: Size;
};

function avatarSizes(url: string, size: Size) {
  const base = size === 'default' ? 24 : 32;
  return {
    single: `${url}${base}`,
    double: `${url}${base * 2}`,
    triple: `${url}${base * 3}`,
  };
}

export const Avatar = ({
  avatarPath = '',
  size = 'default',
  className,
}: Props) => {
  const avatar = avatarSizes(avatarPath, size);
  return (
    <picture>
      <source
        srcSet={`${avatar.triple}.webp 3x, ${avatar.double}.webp 2x, ${avatar.single}.webp`}
        type="image/webp"
      />
      <img
        className={className}
        srcSet={`${avatar.triple}.png 3x, ${avatar.double}.png 2x, ${avatar.single}.png`}
        src={`${avatar.single}.png`}
        alt=""
        aria-hidden="true"
      />
    </picture>
  );
};
