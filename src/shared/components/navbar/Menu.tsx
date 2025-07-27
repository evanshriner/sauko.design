import styled from '@emotion/styled';
import FlexBox from '../FlexBox';

const Menu = styled(FlexBox)((props) => ({
  justifyContent: 'flex-end',
  gap: '1.75rem',
  '@media (max-width: 768px)': {
    display: props.show ? 'flex' : 'none',
    position: 'absolute',
    top: '3.75rem',
    right: '0.625rem',
    backgroundColor: 'transparent',
    gap: '0.625rem',
    padding: '0.625rem',
  },
}));

export default Menu;
