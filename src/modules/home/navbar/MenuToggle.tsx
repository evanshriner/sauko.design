import styled from '@emotion/styled';

const MenuToggle = styled('button')({
  display: 'none',
  '@media (max-width: 768px)': {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    color: 'white',
  },
});

export default MenuToggle;
