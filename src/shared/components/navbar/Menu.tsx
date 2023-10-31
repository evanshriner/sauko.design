import styled from '@emotion/styled';

const Menu = styled('div')(
  {
    display: 'flex',
    gap: '5.25rem',
  },
  (props) => ({
    '@media (max-width: 768px)': {
      display: props.show ? 'flex' : 'none',
      flexDirection: 'column',
      position: 'absolute',
      top: '3.75rem',
      right: '0.625rem',
      backgroundColor: '#333',
      gap: '0.625rem',
      padding: '0.625rem',
    },
  }),
);

export default Menu;
