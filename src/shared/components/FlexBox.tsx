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
};

const FlexBox = styled.div((props: FlexboxProps) => ({
  display: 'flex',
  width: props.width || '100%',
  flexDirection: props.flexDirection || 'row',
  justifyContent: props.justifyContent || 'flex-start',
  alignItems: props.alignItems || 'stretch',
  flexWrap: props.flexWrap || 'nowrap',
}));

export default FlexBox;
