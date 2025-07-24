import React from 'react';
import { IconType } from 'react-icons';
import { SoundButtonContainer } from './styles';

interface SoundButtonProps {
  icon: IconType;
  onClick: (e: React.MouseEvent<HTMLElement>, selection: string) => void;
  label: string;
  selectionKey: string;
}

// TODO: this could just be a generic button with an icon, but for now it is a sound button
export const SoundButton: React.FC<SoundButtonProps> = ({
  icon: Icon,
  onClick,
  label,
  selectionKey,
}) => {
  return (
    <SoundButtonContainer
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e, selectionKey);
      }}
    >
      <Icon />
    </SoundButtonContainer>
  );
};
