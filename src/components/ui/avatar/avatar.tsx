import React from 'react';

import { Size } from 'context/size-context';
import cls from './avatar.module.scss';

type Props = {
  avatarPath: string | null;
  size?: Size;
};

function avatarSizes(url: string, size: Size) {
  const base = size === Size.DEFAULT ? 24 : 32;
  return {
    single: `${url}_${base}`,
    double: `${url}_${base * 2}`,
    triple: `${url}_${base * 3}`,
  };
}

export const Avatar = ({ avatarPath, size = Size.DEFAULT }: Props) => {
  if (avatarPath === null) {
    return <div className={cls.placeholder} aria-hidden="true" />;
  }

  const avatar = avatarSizes(avatarPath, size);
  return (
    <picture>
      <source
        srcSet={`${avatar.triple}.webp 3x, ${avatar.double}.webp 2x, ${avatar.single}.webp`}
        type="image/webp"
      />
      <img
        className={cls.avatar}
        srcSet={`${avatar.triple}.png 3x, ${avatar.double}.png 2x, ${avatar.single}.png`}
        src={`${avatar.single}.png`}
        alt=""
        aria-hidden="true"
      />
    </picture>
  );
};
