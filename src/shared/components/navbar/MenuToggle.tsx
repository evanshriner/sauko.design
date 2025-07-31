import styled from '@emotion/styled';
import FlexBox from '../../../shared/components/FlexBox';
import { LuAudioLines } from 'react-icons/lu';

interface MenuToggleProps {
  onClick: () => void;
}

const MenuToggleContainer = styled(FlexBox)({
  alignItems: 'center',
  justifyContent: 'flex-end',
  '@media (min-width: 769px)': {
    display: 'none',
  },
});

const MenuToggleButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  color: theme.colors.defaultText,
  filter: theme.colors.defaultTextFilter,
  fontSize: '2rem',
  cursor: 'pointer',
  padding: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.5s ease',
  transform: 'scale(1)',

  '@keyframes pulse': {
    '0%': {
      opacity: 0.73,
    },
    '50%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0.73,
    },
  },

  '&:hover': {
    transform: 'scale(1.1)',
    animation: 'pulse 1.5s infinite alternate',
  },
}));

const MenuToggle = ({ onClick }: MenuToggleProps) => (
  <MenuToggleContainer clickable>
    <MenuToggleButton onClick={onClick}>
      <LuAudioLines />
    </MenuToggleButton>
  </MenuToggleContainer>
);

export default MenuToggle;
