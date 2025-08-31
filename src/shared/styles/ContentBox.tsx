import styled from '@emotion/styled';
import FlexBox from '../components/FlexBox';

const ContentBox = styled(FlexBox)(({ theme }) => ({
  boxSizing: 'border-box',
  // border: `0.5rem solid rgba(255, 255, 255, 0.73)`,
  borderRadius: '5px',
  height: '100%',
  boxShadow: 'rgba(255, 255, 255, 0.9) 0px 2px 8px 0px',
  color: theme.colors.primaryText,
  justifyContent: 'center',
  alignItems: 'center',
}));

export default ContentBox;
