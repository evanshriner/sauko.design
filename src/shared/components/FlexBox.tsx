import styled from '@emotion/styled';

export interface FlexboxProps {
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
  maxWidth?: string;
  gap?: string;
  height?: string;
  padding?: string;
  clickable?: boolean; // since we use three.js in multiple areas of the app, we need to explicitly 'enable' pointer events.
}

const FlexBox = styled.div<FlexboxProps>((props) => ({
  display: 'flex',
  height: props.height || 'auto',
  width: props.width || '100%',
  boxSizing: 'border-box',
  maxWidth: props.maxWidth || '100%',
  flexDirection: props.flexDirection || 'row',
  justifyContent: props.justifyContent || 'flex-start',
  alignItems: props.alignItems || 'stretch',
  flexWrap: props.flexWrap || 'nowrap',
  gap: props.gap || 'none',
  padding: props.padding || 'none',
  pointerEvents: props.clickable ? 'auto' : 'none',
}));

export default FlexBox;
