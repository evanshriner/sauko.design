import styled from '@emotion/styled';

type FlexboxProps = {
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  width?: string;
  gap?: string;
  padding?: string;
};

const FlexBox = styled.div((props: FlexboxProps) => ({
  display: 'flex',
  width: props.width || '100%',
  boxSizing: 'border-box',
  flexDirection: props.flexDirection || 'row',
  justifyContent: props.justifyContent || 'flex-start',
  alignItems: props.alignItems || 'stretch',
  flexWrap: props.flexWrap || 'nowrap',
  gap: props.gap || 'none',
  padding: props.padding || 'none',
}));

export default FlexBox;
