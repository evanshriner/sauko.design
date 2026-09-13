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
  minHeight?: string;
  height?: string;
  padding?: string;
  flexGrow?: number;
  clickable?: boolean; // since we use three.js in multiple areas of the app, we need to explicitly 'enable' pointer events.
}

const FlexBox = styled.div<FlexboxProps>((props) => ({
  display: 'flex',
  height: props.height || 'auto',
  width: props.width || '100%',
  minHeight: props.minHeight || 'auto',
  boxSizing: 'border-box',
  maxWidth: props.maxWidth || '100%',
  flexDirection: props.flexDirection || 'row',
  justifyContent: props.justifyContent || 'flex-start',
  alignItems: props.alignItems || 'stretch',
  flexWrap: props.flexWrap || 'nowrap',
  flexGrow: props.flexGrow || 0,
  gap: props.gap || 'none',
  padding: props.padding || 'none',
  pointerEvents: props.clickable ? 'auto' : 'none',
}));

export default FlexBox;
